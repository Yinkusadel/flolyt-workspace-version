import { MapPin } from "lucide-react";

import { cn } from "@/lib/utils";
import { SearchableSelect } from "@/components/ui/searchable-select";
import type { LeakageV2Controls } from "@/services/api/leakage/get-leakage";
import { currencySymbol, marketName, UNASSIGNED_MARKET } from "@/pages/leakage-map/format";

/** Up to this many real markets, every market is its own button. Above it, a searchable list. */
const SEGMENTED_MAX = 5;
const ALL_VALUE = "__all__";

interface MarketItem {
  code: string;
  /** The market's own currency when the workspace configured one; unconfigured source markets have none. */
  currency: string | null;
}

/**
 * The market control. One selection at a time: the contract takes a single `market`, so there is no
 * multi-select. Options come from `controls.marketOptions` (market and currency pairs, primary first);
 * markets that only appear in `controls.markets` (exposure in an unconfigured source market) are added
 * after them. "Unassigned market" is a bucket, not a country, so it always comes last and looks different.
 */
export function MarketSelect({
  controls,
  value,
  onChange,
}: {
  controls: LeakageV2Controls;
  value: string | null;
  onChange: (market: string | null) => void;
}) {
  const configured: MarketItem[] = [...controls.marketOptions]
    .sort((a, b) => Number(b.isPrimary) - Number(a.isPrimary))
    .map((o) => ({ code: o.market, currency: o.currency }));
  const extras: MarketItem[] = controls.markets
    .filter((m) => m !== UNASSIGNED_MARKET && !configured.some((c) => c.code === m))
    .map((code) => ({ code, currency: null }));
  const markets = [...configured, ...extras];
  const hasUnassigned = controls.markets.includes(UNASSIGNED_MARKET);

  if (markets.length <= SEGMENTED_MAX) {
    return (
      <div
        role="group"
        aria-label="Market"
        className="flex h-9 max-w-full items-center gap-0.5 overflow-x-auto rounded-panel border border-line bg-paper-2 p-0.5"
      >
        <SegmentButton active={value === null} onClick={() => onChange(null)}>
          All
        </SegmentButton>
        {markets.map((m) => (
          <SegmentButton key={m.code} active={value === m.code} onClick={() => onChange(m.code)} title={marketName(m.code)}>
            <span className="font-mono font-semibold">{m.code}</span>
            {m.currency && <span className="ml-1 text-ink-4">{currencySymbol(m.currency)}</span>}
          </SegmentButton>
        ))}
        {hasUnassigned && (
          <SegmentButton
            active={value === UNASSIGNED_MARKET}
            onClick={() => onChange(UNASSIGNED_MARKET)}
            title="Amounts whose market was not proven"
            dashed
          >
            <MapPin className="mr-1 size-3" />
            Unassigned
          </SegmentButton>
        )}
      </div>
    );
  }

  return (
    <div className="w-60 shrink-0">
      <SearchableSelect
        value={value ?? ALL_VALUE}
        onChange={(next) => onChange(next === ALL_VALUE ? null : next)}
        searchPlaceholder="Market or ISO code"
        emptyText="No market found"
        className="h-9 bg-paper"
        options={[
          { value: ALL_VALUE, label: "All markets" },
          ...markets.map((m) => ({
            value: m.code,
            label: `${marketName(m.code)} (${m.code}${m.currency ? ` · ${m.currency}` : ""})`,
          })),
          ...(hasUnassigned ? [{ value: UNASSIGNED_MARKET, label: "Unassigned market" }] : []),
        ]}
      />
    </div>
  );
}

function SegmentButton({
  active,
  onClick,
  children,
  title,
  dashed,
}: {
  active: boolean;
  onClick: () => void;
  children: React.ReactNode;
  title?: string;
  dashed?: boolean;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      title={title}
      aria-pressed={active}
      className={cn(
        "flex h-7 shrink-0 items-center rounded-control px-2.5 text-[12px] whitespace-nowrap transition-colors",
        dashed && "border border-dashed border-ultra-border text-ultra",
        active ? "bg-paper font-medium text-ink shadow-sm" : "text-ink-2 hover:text-ink"
      )}
    >
      {children}
    </button>
  );
}
