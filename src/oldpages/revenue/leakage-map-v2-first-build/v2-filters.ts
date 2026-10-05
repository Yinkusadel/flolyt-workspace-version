import type { GetLeakageV2Params, LeakageV2Controls } from "@/services/api/leakage/get-leakage";

/**
 * V2's own filter state — separate from `filters.ts`'s `LeakageFilterState` (V1), since the shape
 * genuinely differs (no `window`; `mode` instead of `calculate`; `sector`/`lifecycleClass` don't
 * exist on V1 at all). See docs/leakage-map/v2-build-plan.md Step 3.
 */
export interface LeakageV2FilterState {
  mode: string;
  horizon: string;
  /** Only meaningful when `horizon === "custom"`. */
  horizonDays: number;
  market: string | null;
  sector: string | null;
  severity: string | null;
  confidence: string | null;
  lifecycleClass: string | null;
}

/**
 * Seeds the filter UI from the server's own currently-active selection (`leakage.controls`) rather
 * than a hardcoded default — the first request on a page load is always sent with V1-shaped params
 * (the page doesn't know yet whether it's talking to a legacy or V2 workspace), so by the time this
 * runs the server has already applied its own defaults. `controls.mode` comes back uppercase
 * ("GROSS") while `controls.modes[].value` (the option list) is lowercase ("gross") — confirmed
 * live 2026-10-01, see Step 0 — lowercased here so the seeded value matches one of its own options.
 */
export function v2FilterStateFromControls(controls: LeakageV2Controls): LeakageV2FilterState {
  return {
    mode: controls.mode.toLowerCase(),
    horizon: controls.horizon,
    horizonDays: controls.horizonDays,
    market: controls.market,
    sector: controls.sector,
    severity: controls.severity,
    confidence: controls.confidence,
    lifecycleClass: controls.lifecycleClass,
  };
}

export function toGetLeakageV2Params(filters: LeakageV2FilterState): GetLeakageV2Params {
  return {
    mode: filters.mode,
    horizon: filters.horizon,
    horizonDays: filters.horizon === "custom" ? filters.horizonDays : undefined,
    market: filters.market ?? undefined,
    sector: filters.sector ?? undefined,
    severity: filters.severity ?? undefined,
    confidence: filters.confidence ?? undefined,
    lifecycleClass: filters.lifecycleClass ?? undefined,
  };
}

/**
 * Shared cosmetic formatter for every raw internal key/enum this V2 surface renders — cells'
 * `lifecycleClass`, rollup `value`s, opportunity `opportunityType`/`subjectType`, filter option
 * labels that have no server-given `label` field. "in_flight" -> "In flight",
 * "IN_FLIGHT" -> "In flight" (record-level fields come back uppercase per Step 0's casing
 * finding, filter option values come back lowercase — this normalizes both the same way, not just
 * the lowercase case), "account_activity:active" -> "Account activity · Active". Purely cosmetic,
 * never invents a fact the response didn't already state — the same helper used to live
 * separately in `v2-cell-grid.tsx`/`v2-rollups.tsx`/`opportunities-panel.tsx`, consolidated here
 * 2026-10-01 so casing stays consistent across the whole V2 surface instead of three
 * near-duplicate functions.
 */
export function humanizeEnum(value: string): string {
  return value
    .split(":")
    .map((segment) =>
      segment
        .replace(/[_-]/g, " ")
        .toLowerCase()
        .split(" ")
        .map((word) => (word ? word.charAt(0).toUpperCase() + word.slice(1) : word))
        .join(" ")
    )
    .join(" · ");
}

/** Prefers the server's own `label` for mode/horizon (it already gives one per option); falls
 * back to `humanizeEnum` for filters that are just bare string arrays (market/sector/severity/
 * confidence/lifecycleClass) with no label field at all. */
export function v2OptionLabel(value: string, options?: { value: string; label: string }[]): string {
  return options?.find((o) => o.value === value)?.label ?? humanizeEnum(value);
}
