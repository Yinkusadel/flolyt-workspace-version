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

/** "in_flight" -> "In flight" — the option list's own plain values, not a record's uppercase form. */
export function lifecycleClassOptionLabel(value: string): string {
  return value.charAt(0).toUpperCase() + value.slice(1).replace(/_/g, " ");
}
