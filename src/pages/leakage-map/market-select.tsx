import { MapPin } from "lucide-react";

import { cn } from "@/lib/utils";
import { SearchableSelect } from "@/components/ui/searchable-select";
import type { LeakageV2Controls, LeakageV2MarketOptionState } from "@/services/api/leakage/get-leakage";
import { marketName, UNASSIGNED_MARKET } from "@/pages/leakage-map/format";

/** Up to this many real markets, every market is its own button. Above it, a searchable list. */
const SEGMENTED_MAX = 5;
const ALL_VALUE = "__all__";

interface MarketItem {
  code: string;
  /** Whether the market is in the workspace's settings and/or seen in the data; null for a market only listed in `controls.markets`. */
  state: LeakageV2MarketOptionState | null;
}

/** Short wording for a state a person should notice; the two settled states say nothing. */
const STATE_NOTE: Partial<Record<LeakageV2MarketOptionState, string>> = {
  OBSERVED_NOT_CONFIGURED: "not in settings",
  CONFIGURED_NOT_OBSERVED: "no data yet",
};
const STATE_TITLE: Partial<Record<LeakageV2MarketOptionState, string>> = {
  OBSERVED_NOT_CONFIGURED: "Seen in your data, but not in your market settings",
  CONFIGURED_NOT_OBSERVED: "In your market settings, but nothing has been observed for it yet",
};

/**
 * The market control. One selection at a time: the contract takes a single `market`, so there is no
 * multi-select. Options come from `controls.marketOptions` (primary first), which now also lists markets seen
 * in the data but absent from workspace settings, each tagged with its state. The option's currency is only
 * a preference, so it is neither shown nor applied as a filter. "Unassigned market" is a bucket, not a
 * country, so it always comes last and looks different.
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
    .filter((o) => o.market !== UNASSIGNED_MARKET)
    .sort((a, b) => Number(b.isPrimary) - Number(a.isPrimary))
    .map((o) => ({ code: o.market, state: o.state }));
  const extras: MarketItem[] = controls.markets
    .filter((m) => m !== UNASSIGNED_MARKET && !configured.some((c) => c.code === m))
    .map((code) => ({ code, state: null }));
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
          <SegmentButton
            key={m.code}
            active={value === m.code}
            onClick={() => onChange(m.code)}
            title={[marketName(m.code), m.state && STATE_TITLE[m.state]].filter(Boolean).join(": ")}
          >
            <span className="font-mono font-semibold">{m.code}</span>
            {m.state && STATE_NOTE[m.state] && <span className="ml-1.5 size-1.5 rounded-full bg-amber" aria-hidden />}
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
    <div className="w-72 shrink-0">
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
            label: `${marketName(m.code)} (${m.code})${m.state && STATE_NOTE[m.state] ? ` · ${STATE_NOTE[m.state]}` : ""}`,
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
