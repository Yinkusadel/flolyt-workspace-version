import { X } from "lucide-react";

import { v2OptionLabel, type LeakageV2FilterState } from "@/pages/leakage-map/v2-filters";
import type { LeakageV2Controls } from "@/services/api/leakage/get-leakage";

interface ActiveChip {
  key: string;
  prefix: string;
  value: string;
  /** The patch that puts just this filter back to its default. */
  reset: Partial<LeakageV2FilterState>;
}

/**
 * Chips for every filter that differs from the page's default selection, shown beside the Filters
 * menu, each with an X that puts only that filter back to its default. "Default" is whatever the
 * server's own `controls` selected on first load (see `index.tsx`), not a hardcoded value, so mode
 * and horizon only show up once the user has actually changed them. Renders nothing when the page
 * is on its defaults, so an untouched page looks exactly as it did before.
 */
export function V2ActiveFilters({
  controls,
  filters,
  defaults,
  onFiltersChange,
}: {
  controls: LeakageV2Controls;
  filters: LeakageV2FilterState;
  defaults: LeakageV2FilterState | null;
  onFiltersChange: (patch: Partial<LeakageV2FilterState>) => void;
}) {
  if (!defaults) return null;

  const chips: ActiveChip[] = [];

  if (filters.mode !== defaults.mode) {
    chips.push({
      key: "mode",
      prefix: "Mode",
      value: v2OptionLabel(filters.mode, controls.modes),
      reset: { mode: defaults.mode },
    });
  }
  if (filters.horizon !== defaults.horizon || (filters.horizon === "custom" && filters.horizonDays !== defaults.horizonDays)) {
    chips.push({
      key: "horizon",
      prefix: "Horizon",
      value: filters.horizon === "custom" ? `${filters.horizonDays} days` : v2OptionLabel(filters.horizon, controls.horizons),
      reset: { horizon: defaults.horizon, horizonDays: defaults.horizonDays },
    });
  }
  if (filters.market !== defaults.market) {
    chips.push({ key: "market", prefix: "Market", value: filters.market ?? "All markets", reset: { market: defaults.market } });
  }
  if (filters.sector !== defaults.sector) {
    chips.push({
      key: "sector",
      prefix: "Sector",
      value: filters.sector ? v2OptionLabel(filters.sector) : "All sectors",
      reset: { sector: defaults.sector },
    });
  }
  if (filters.severity !== defaults.severity) {
    chips.push({
      key: "severity",
      prefix: "Severity",
      value: filters.severity ? v2OptionLabel(filters.severity) : "All severities",
      reset: { severity: defaults.severity },
    });
  }
  if (filters.confidence !== defaults.confidence) {
    chips.push({
      key: "confidence",
      prefix: "Confidence",
      value: filters.confidence ? v2OptionLabel(filters.confidence) : "All levels",
      reset: { confidence: defaults.confidence },
    });
  }
  if (filters.lifecycleClass !== defaults.lifecycleClass) {
    chips.push({
      key: "lifecycleClass",
      prefix: "Lifecycle",
      value: filters.lifecycleClass ? v2OptionLabel(filters.lifecycleClass) : "All classes",
      reset: { lifecycleClass: defaults.lifecycleClass },
    });
  }

  // Always mounted so the row can ease open/closed instead of snapping the page down a line: the
  // grid-rows trick animates between 0 and the row's natural height. It is one line tall no matter
  // how many chips there are (they scroll sideways, never wrap), so the layout below it moves once
  // when the first chip appears and never again as more are added.
  return (
    <div
      className={`grid transition-[grid-template-rows] duration-200 ease-out ${chips.length > 0 ? "grid-rows-[1fr]" : "grid-rows-[0fr]"}`}
    >
      <div className="overflow-hidden">
        <div className="flex items-center gap-2 pt-3" aria-label="Active filters">
          <div className="min-w-0 flex-1 overflow-x-auto scrollbar-none mask-[linear-gradient(to_right,black_calc(100%-24px),transparent)]">
            <div className="flex w-max items-center gap-1.5 pr-6">
              {chips.map((chip) => (
                <span
                  key={chip.key}
                  className="inline-flex items-center gap-1.5 rounded-full border border-line bg-paper-2 py-1 pr-1 pl-2.5 text-[11.5px] whitespace-nowrap text-ink"
                >
                  <span className="text-ink-3">{chip.prefix}</span>
                  <span className="font-medium">{chip.value}</span>
                  <button
                    type="button"
                    onClick={() => onFiltersChange(chip.reset)}
                    aria-label={`Remove ${chip.prefix} filter`}
                    className="flex size-4 items-center justify-center rounded-full text-ink-3 transition-colors hover:bg-line hover:text-ink focus-visible:ring-2 focus-visible:ring-ring/50 focus-visible:outline-none"
                  >
                    <X className="size-3" aria-hidden />
                  </button>
                </span>
              ))}
            </div>
          </div>
          {chips.length > 1 && (
            <button
              type="button"
              onClick={() => onFiltersChange(Object.assign({}, ...chips.map((c) => c.reset)))}
              className="shrink-0 rounded-control px-1.5 py-1 text-[11.5px] whitespace-nowrap text-ink-3 transition-colors hover:text-ink hover:underline"
            >
              Clear all
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
