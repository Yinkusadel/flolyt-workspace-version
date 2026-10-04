import { useEffect, useState } from "react";
import { Loader2 } from "lucide-react";

import { cn } from "@/lib/utils";
import type { LeakageV2Controls } from "@/services/api/leakage/get-leakage";
import { FILTER_CONTROL_CLASS, FilterMenu } from "@/pages/leakage-map/filter-menu";
import { MarketSelect } from "@/pages/leakage-map/market-select";
import { MoreFilters } from "@/pages/leakage-map/more-filters";
import type { LeakageFilters } from "@/pages/leakage-map/filters";

const ALL_CURRENCIES = "__all__";

interface FilterBarProps {
  controls: LeakageV2Controls;
  filters: LeakageFilters;
  /** `executive.recommendedMode`; marks the matching mode with a REC. tag. */
  recommendedMode: string | null;
  isRefreshing: boolean;
  onMarketChange: (market: string | null) => void;
  onCurrencyChange: (currency: string | null) => void;
  onChange: (patch: Partial<Omit<LeakageFilters, "market" | "currency">>) => void;
  onClearMore: () => void;
}

/**
 * Market, currency, mode, horizon and the rest. Every value shown is read back from the server's own
 * `controls` (option lists and labels), not hardcoded. Changing any control keeps the previous figures
 * on screen while the new projection loads; `isRefreshing` only drives the small status text at the end.
 */
export function FilterBar({
  controls,
  filters,
  recommendedMode,
  isRefreshing,
  onMarketChange,
  onCurrencyChange,
  onChange,
  onClearMore,
}: FilterBarProps) {
  const currencyOptions = [
    { value: ALL_CURRENCIES, label: `All ${controls.currencies.length}` },
    ...controls.currencies.map((c) => ({ value: c, label: c })),
  ];
  const horizonLabel = controls.horizons.find((h) => h.value === filters.horizon)?.label ?? filters.horizon;

  return (
    <div className="flex flex-wrap items-center gap-2">
      <MarketSelect controls={controls} value={filters.market} onChange={onMarketChange} />

      {/* One currency means nothing to choose between, so the control only appears from two up. */}
      {controls.currencies.length > 1 && (
        <FilterMenu
          label="Currency"
          valueLabel={filters.currency ?? `All ${controls.currencies.length}`}
          options={currencyOptions}
          value={filters.currency ?? ALL_CURRENCIES}
          onChange={(next) => onCurrencyChange(next === ALL_CURRENCIES ? null : next)}
        />
      )}

      <div role="group" aria-label="Mode" className="flex h-9 items-center gap-0.5 rounded-panel border border-line bg-paper-2 p-0.5">
        {controls.modes.map((mode) => {
          const active = filters.mode === mode.value;
          const recommended = recommendedMode?.toLowerCase() === mode.value;
          return (
            <button
              key={mode.value}
              type="button"
              aria-pressed={active}
              onClick={() => onChange({ mode: mode.value })}
              className={cn(
                "flex h-7 items-center gap-1.5 rounded-control px-2.5 text-[12px] whitespace-nowrap transition-colors",
                active ? "bg-paper font-medium text-ink shadow-sm" : "text-ink-2 hover:text-ink"
              )}
            >
              {mode.label}
              {recommended && (
                <span className="rounded-chip bg-teal-bg px-1 font-mono text-[8.5px] font-semibold text-teal uppercase">
                  Rec.
                </span>
              )}
            </button>
          );
        })}
      </div>

      <FilterMenu
        label="Horizon"
        valueLabel={horizonLabel}
        options={controls.horizons.map((h) => ({ value: h.value, label: h.label }))}
        value={filters.horizon}
        onChange={(next) => onChange({ horizon: next })}
      />
      {filters.horizon === "custom" && (
        <CustomDays days={filters.horizonDays} onCommit={(days) => onChange({ horizonDays: days })} />
      )}

      <MoreFilters controls={controls} filters={filters} onChange={onChange} onClear={onClearMore} />

      <p className="ml-auto flex items-center gap-1.5 text-[11px] text-ink-3" role="status" aria-live="polite">
        {isRefreshing ? (
          <>
            <Loader2 className="size-3 animate-spin" />
            Updating
          </>
        ) : (
          <>
            <span className="size-1.5 rounded-full bg-teal" />
            Up to date
          </>
        )}
      </p>
    </div>
  );
}

/** Whole days 1..365, committed on blur/Enter so every keystroke doesn't trigger a request. */
function CustomDays({ days, onCommit }: { days: number; onCommit: (days: number) => void }) {
  const [draft, setDraft] = useState(String(days));
  useEffect(() => setDraft(String(days)), [days]);

  const commit = () => {
    const parsed = Math.round(Number(draft));
    if (!Number.isFinite(parsed)) return setDraft(String(days));
    const clamped = Math.min(365, Math.max(1, parsed));
    setDraft(String(clamped));
    if (clamped !== days) onCommit(clamped);
  };

  return (
    <label className={cn(FILTER_CONTROL_CLASS, "gap-2")}>
      <input
        type="number"
        min={1}
        max={365}
        value={draft}
        onChange={(e) => setDraft(e.currentTarget.value)}
        onBlur={commit}
        onKeyDown={(e) => e.key === "Enter" && commit()}
        aria-label="Custom horizon in days"
        className="w-12 bg-transparent text-right font-medium outline-none"
      />
      <span className="text-ink-3">days</span>
    </label>
  );
}
