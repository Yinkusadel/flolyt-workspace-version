import { useState } from "react";
import { ChevronRight, HelpCircle, MapPin } from "lucide-react";

import { cn } from "@/lib/utils";
import { formatCompactMoney } from "@/lib/format-measured-value";
import type { LeakageV2Controls } from "@/services/api/leakage/get-leakage";
import type {
  LeakageExecutive,
  LeakageExecutiveAmount,
  LeakageExecutiveMarket,
} from "@/services/api/leakage/leakage-executive-types";
import { currencySymbol, humanizeEnum, isUnassignedMarket, marketName } from "@/pages/leakage-map/format";

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

      <div className="mt-3 grid grid-cols-[repeat(auto-fill,minmax(230px,1fr))] gap-3">
        {[...visibleReal, ...unassigned].map((market) => (
          <MarketBox
            key={market.attribution.code}
            market={market}
            controls={controls}
            selected={selectedMarket === market.attribution.code}
            onSelect={() => onSelectMarket(market.attribution.code)}
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
    </section>
  );
}

function MarketBox({
  market,
  controls,
  selected,
  onSelect,
}: {
  market: LeakageExecutiveMarket;
  controls: LeakageV2Controls;
  selected: boolean;
  onSelect: () => void;
}) {
  const code = market.attribution.code;
  const unassigned = isUnassignedMarket(code);
  const option = controls.marketOptions.find((o) => o.market === code);
  const hasAmounts = market.amounts.length > 0;
  const amounts = [...market.amounts].sort(
    (a, b) => a.currency.localeCompare(b.currency) || a.lifecycleClass.localeCompare(b.lifecycleClass)
  );

  return (
    <button
      type="button"
      onClick={onSelect}
      aria-label={`${marketName(code)}${hasAmounts ? "" : ", no attributed exposure yet"}. Open this market`}
      className={cn(
        "group flex flex-col rounded-card border p-4 text-left transition-colors",
        unassigned
          ? "border-dashed border-ultra-border bg-ultra-bg/40 hover:border-ultra"
          : "border-line bg-paper hover:border-ink-4",
        selected && "ring-2 ring-ink/70"
      )}
    >
      <span className="flex items-center gap-2">
        {unassigned ? (
          <MapPin className="size-3.5 text-ultra" />
        ) : (
          <span className="rounded-chip bg-paper-2 px-1.5 py-0.5 font-mono text-[10px] font-semibold text-ink">{code}</span>
        )}
        <span className="text-[12.5px] font-semibold text-ink">{marketName(code)}</span>
        {option?.isPrimary && (
          <span className="rounded-chip bg-paper-2 px-1.5 py-px font-mono text-[8.5px] font-semibold text-ink-3 uppercase">
            Primary
          </span>
        )}
        {option && (
          <span className="font-mono text-[10px] text-ink-4" title={option.currency}>
            {currencySymbol(option.currency)}
          </span>
        )}
        <ChevronRight className="ml-auto size-3.5 text-ink-4 group-hover:text-ink-2" />
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
              {market.affectedEntities.map((e) => `${e.count.toLocaleString("en-US")} ${e.unit}`).join(" · ")} affected
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
            {market.hasMeasurementEvidence
              ? "Measured, but no amount published for this market"
              : market.isConfigured
                ? "Configured, no market-scoped measurement"
                : "No measurement evidence"}
          </span>
        </>
      )}
    </button>
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
