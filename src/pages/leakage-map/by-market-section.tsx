import { useState } from "react";
import { ChevronRight, HelpCircle, MapPin } from "lucide-react";

import { cn } from "@/lib/utils";
import { CHIP_INTERACTIVE_CLASS } from "@/components/ui/chip";
import { AddMarketDialog, useAddMarketDialog } from "@/pages/leakage-map/add-market-dialog";
import { formatCompactMoney } from "@/lib/format-measured-value";
import type { LeakageV2Controls } from "@/services/api/leakage/get-leakage";
import type {
  LeakageExecutiveMarketReconciliation,
  LeakageExecutive,
  LeakageExecutiveAmount,
  LeakageExecutiveMarket,
} from "@/services/api/leakage/leakage-executive-types";
import { humanizeEnum, isUnassignedMarket, marketName } from "@/pages/leakage-map/format";

/** Real markets shown before the rest collapse behind "Show more"; the Unassigned bucket is always shown. */
const VISIBLE_MARKETS = 4;

interface ByMarketSectionProps {
  executive: LeakageExecutive | undefined;
  controls: LeakageV2Controls;
  selectedMarket: string | null;
  onSelectMarket: (market: string) => void;
}

/**
 * One box per row of `executive.markets` (configured or evidenced markets, plus the Unassigned bucket),
 * in the order the API sends them with Unassigned moved last. A market only holds an amount when a source
 * proved its market; a market with none says so instead of showing a zero. Nothing is assigned from
 * currency or workspace settings, and every amount stays in its own currency. Clicking a box opens that
 * market's view, the same as choosing it in the filter bar.
 */
export function ByMarketSection({ executive, controls, selectedMarket, onSelectMarket }: ByMarketSectionProps) {
  const [showAll, setShowAll] = useState(false);
  const addMarket = useAddMarketDialog();
  if (!executive || executive.markets.length === 0) return null;

  const { marketInventory: inventory } = executive;
  // The primary market leads, the rest keep the API's order. Position only, never ranked by amount.
  const isPrimary = (m: LeakageExecutiveMarket) =>
    controls.marketOptions.some((o) => o.market === m.attribution.code && o.isPrimary);
  const real = executive.markets
    .filter((m) => !isUnassignedMarket(m.attribution.code))
    .sort((a, b) => Number(isPrimary(b)) - Number(isPrimary(a)));
  const unassigned = executive.markets.filter((m) => isUnassignedMarket(m.attribution.code));

  const visibleReal = showAll ? real : real.slice(0, VISIBLE_MARKETS);
  const hiddenCount = real.length - visibleReal.length;

  const summary = [
    `${inventory.configuredMarketCount} configured`,
    `${inventory.measurableMarketCount} with measurement evidence`,
    `${inventory.marketsWithExposureCount} with attributed exposure`,
    ...(inventory.hasUnassignedExposure ? ["Unassigned exposure present"] : []),
  ];

  return (
    <section aria-label="By market" className="rounded-card border border-line bg-paper p-4 sm:p-5">
      <h2 className="text-[13px] font-semibold text-ink">By market</h2>
      <p className="mt-0.5 text-[11.5px] text-ink-3">
        Amounts sit under a market only when a source proves it. Nothing is assigned from currency or settings.
      </p>
      <p className="mt-3 rounded-control bg-paper-2 px-3 py-2 font-mono text-[10.5px] text-ink-2">
        {summary.map((part, i) => (
          <span key={part}>
            {i > 0 && <span className="text-ink-4"> · </span>}
            <span className={part.startsWith("Unassigned") ? "text-ultra" : undefined}>{part}</span>
          </span>
        ))}
      </p>

      {executive.marketReconciliation?.requiresReview && (
        <p className="mt-2 text-[11px] text-ink-3">{reconciliationNote(executive.marketReconciliation)}</p>
      )}

      <div className="mt-3 grid grid-cols-[repeat(auto-fill,minmax(230px,1fr))] gap-3">
        {[...visibleReal, ...unassigned].map((market) => (
          <MarketBox
            key={market.attribution.code}
            market={market}
            controls={controls}
            selected={selectedMarket === market.attribution.code}
            onSelect={() => onSelectMarket(market.attribution.code)}
            onFoundInData={() =>
              addMarket.openFor(
                market.attribution.code,
                controls.marketOptions.find((o) => o.market === market.attribution.code)?.preferredCurrency ?? null
              )
            }
          />
        ))}
      </div>

      {real.length > VISIBLE_MARKETS && (
        <button
          type="button"
          onClick={() => setShowAll((prev) => !prev)}
          className="mt-3 text-[11.5px] font-medium text-ultra hover:underline"
        >
          {showAll ? "Show fewer markets" : `Show ${hiddenCount} more ${hiddenCount === 1 ? "market" : "markets"}`}
        </button>
      )}
      <AddMarketDialog state={addMarket.state} onOpenChange={addMarket.setOpen} />
    </section>
  );
}

function MarketBox({
  market,
  controls,
  selected,
  onSelect,
  onFoundInData,
}: {
  market: LeakageExecutiveMarket;
  controls: LeakageV2Controls;
  selected: boolean;
  onSelect: () => void;
  onFoundInData: () => void;
}) {
  const code = market.attribution.code;
  const unassigned = isUnassignedMarket(code);
  const option = controls.marketOptions.find((o) => o.market === code);
  const hasAmounts = market.amounts.length > 0;
  const amounts = [...market.amounts].sort(
    (a, b) => a.currency.localeCompare(b.currency) || a.lifecycleClass.localeCompare(b.lifecycleClass)
  );

  const foundInData = !unassigned && !market.isConfigured;

  return (
    <div className="relative flex">
    <button
      type="button"
      onClick={onSelect}
      aria-label={`${marketName(code)}${hasAmounts ? "" : ", no attributed exposure yet"}. Open this market`}
      className={cn(
        "group flex w-full flex-col rounded-card border p-4 text-left transition-colors",
        unassigned
          ? "border-dashed border-ultra-border bg-ultra-bg/40 hover:border-ultra"
          : "border-line bg-paper hover:border-ink-4",
        selected && "ring-2 ring-ink/70"
      )}
    >
      {/* Badges get their own row at the top, reserved on every box, so a long name never wraps beside them and
          the figures underneath line up from one box to the next. */}
      <span className="flex min-h-4 items-center gap-1.5">
        {option?.isPrimary && (
          <span className="rounded-chip bg-paper-2 px-1.5 py-px font-mono text-[8.5px] font-semibold whitespace-nowrap text-ink-3 uppercase">
            Primary
          </span>
        )}
      </span>
      <span className="mt-1.5 flex items-center gap-2">
        {unassigned ? (
          <MapPin className="size-3.5 shrink-0 text-ultra" />
        ) : (
          <span className="shrink-0 rounded-chip bg-paper-2 px-1.5 py-0.5 font-mono text-[10px] font-semibold text-ink">{code}</span>
        )}
        <span className="min-w-0 truncate text-[12.5px] font-semibold text-ink" title={marketName(code)}>
          {marketName(code)}
        </span>
        <ChevronRight className="ml-auto size-3.5 shrink-0 text-ink-4 group-hover:text-ink-2" />
      </span>

      {hasAmounts ? (
        <>
          <span className="mt-3 flex flex-wrap gap-x-3 gap-y-1">
            {amounts.map((amount) => (
              <AmountChip key={`${amount.currency}:${amount.lifecycleClass}`} amount={amount} />
            ))}
          </span>
          {market.affectedEntities.length > 0 && (
            <span className="mt-2 text-[10.5px] text-ink-3">
              {market.affectedEntities
                .map((e) => (e.count == null ? `${e.unit} not available` : `${e.count.toLocaleString("en-US")} ${e.unit} affected`))
                .join(" · ")}
            </span>
          )}
          {unassigned && (
            <span className="mt-2 text-[10.5px] text-ultra">
              Currency proven, market not. Nothing is assigned from currency or settings.
            </span>
          )}
        </>
      ) : (
        <>
          <span className="mt-3 text-[12px] font-medium text-ink-2">No attributed exposure yet</span>
          <span className="mt-1 flex items-start gap-1 text-[10.5px] text-ink-3">
            <HelpCircle className="mt-px size-3 shrink-0" />
            {market.evidenceExplanation ??
              (market.hasMeasurementEvidence
                ? "Measured, but no amount published for this market"
                : market.isConfigured
                  ? "Configured, no market-scoped measurement"
                  : "No measurement evidence")}
          </span>
        </>
      )}
    </button>
    {/* A button cannot sit inside the card's button, so the chip is its own control laid over the badge row. */}
    {foundInData && (
      <button
        type="button"
        onClick={onFoundInData}
        aria-label={`${marketName(code)} is found in your data but not in your market list. Learn more`}
        className={cn(
          "absolute top-4 left-4 rounded-chip border border-amber-border bg-amber-bg px-1.5 py-px font-mono text-[8.5px] font-semibold whitespace-nowrap text-amber uppercase",
          CHIP_INTERACTIVE_CLASS
        )}
      >
        Found in data
      </button>
    )}
    </div>
  );
}

function AmountChip({ amount }: { amount: LeakageExecutiveAmount }) {
  return (
    <span
      className="font-mono text-[12.5px] font-semibold text-ink"
      title={`${amount.currency} · ${humanizeEnum(amount.lifecycleClass)}`}
    >
      {formatCompactMoney(amount.selectedAmount, amount.currency)}
    </span>
  );
}

/** Only the two lists the server flags for review; the market list is never changed from here. */
function reconciliationNote(r: LeakageExecutiveMarketReconciliation): string {
  const names = (codes: string[]) => {
    const list = codes.map((c) => marketName(c));
    return list.length <= 1 ? list.join("") : `${list.slice(0, -1).join(", ")} and ${list[list.length - 1]}`;
  };
  const parts: string[] = [];
  if (r.observedNotConfigured.length > 0)
    parts.push(`${names(r.observedNotConfigured)} ${r.observedNotConfigured.length === 1 ? "appears" : "appear"} in your data but not in your market list`);
  if (r.configuredNotObserved.length > 0)
    parts.push(`${names(r.configuredNotObserved)} ${r.configuredNotObserved.length === 1 ? "is" : "are"} in your market list but not seen in the data yet`);
  return `${parts.join(". ")}. Your market list is not changed automatically.`;
}
