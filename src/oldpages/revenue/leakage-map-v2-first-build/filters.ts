import type {
  GetLeakageParams,
  LeakageCalculateMode,
  LeakageMarketRailEntryDto,
} from "@/services/api/leakage/get-leakage";

/**
 * Filter state for /leakage-map, replacing data.ts's old mock option lists per
 * [[feedback_retire_mock_options_not_extend]]. Window and Horizon are independent controls (the
 * API always takes both — window looks back, horizon looks forward), each either one of the
 * workspace's own live option values (`GET /leakage`'s `window.options` / `horizon.options`) or a
 * custom day count converted from a single picked date (the API has no from/to range, only a
 * day-count — see docs/leakage-map/build-plan.md mismatch #11).
 */
export type LeakageRangeSelection = { kind: "preset"; value: string } | { kind: "custom"; days: number };

export interface LeakageFilterState {
  window: LeakageRangeSelection;
  horizon: LeakageRangeSelection;
  /** Country code, or null for the blended "All markets" default. */
  market: string | null;
  calculate: LeakageCalculateMode;
  /** "s1"–"s5", or null for no severity filter. */
  minSeverity: string | null;
  /** "low" | "medium" | "high", or null for no confidence filter. */
  minConfidence: string | null;
}

export const DEFAULT_FILTERS: LeakageFilterState = {
  window: { kind: "preset", value: "90" },
  horizon: { kind: "preset", value: "90" },
  market: null,
  calculate: "gross",
  minSeverity: null,
  minConfidence: null,
};

// Shown only until the first response supplies the workspace's real `window.options` /
// `horizon.options` — these are exactly the values the endpoint doc itself names as always valid,
// not invented copy.
export const FALLBACK_WINDOW_OPTIONS = ["30", "90", "180", "365", "qtd"];
export const FALLBACK_HORIZON_OPTIONS = ["30", "60", "90", "quarter", "365"];

export function windowOptionLabel(value: string): string {
  if (value === "qtd") return "Quarter to date";
  const days = Number(value);
  return Number.isFinite(days) ? `Last ${days} days` : value;
}

export function horizonOptionLabel(value: string): string {
  if (value === "quarter") return "Rest of quarter";
  const days = Number(value);
  return Number.isFinite(days) ? `Next ${days} days` : value;
}

export function rangeSelectionLabel(selection: LeakageRangeSelection, direction: "window" | "horizon"): string {
  if (selection.kind === "custom") {
    return direction === "window" ? `Last ${selection.days} days` : `Next ${selection.days} days`;
  }
  return direction === "window" ? windowOptionLabel(selection.value) : horizonOptionLabel(selection.value);
}

export function marketOptionLabel(entry: Pick<LeakageMarketRailEntryDto, "countryCode" | "isPrimary">): string {
  if (!entry.countryCode) return entry.isPrimary ? "Primary market" : "Unlabeled market";
  return entry.isPrimary ? `${entry.countryCode} · primary` : entry.countryCode;
}

export const CALCULATE_OPTIONS: { value: LeakageCalculateMode; label: string }[] = [
  { value: "gross", label: "Gross exposure" },
  { value: "expected", label: "Expected loss" },
  { value: "net", label: "Net expected loss" },
];

export function calculateLabel(value: LeakageCalculateMode): string {
  return CALCULATE_OPTIONS.find((option) => option.value === value)?.label ?? value;
}

// s1–s5 is the API's own fixed severity scale (see docs/endpoints/leakage.md) — no per-level
// editorial label has ever been observed live for a filter threshold, so these stay plain.
export const SEVERITY_OPTIONS: { value: string; label: string }[] = [
  { value: "s1", label: "≥ S1" },
  { value: "s2", label: "≥ S2" },
  { value: "s3", label: "≥ S3" },
  { value: "s4", label: "≥ S4" },
  { value: "s5", label: "≥ S5" },
];

export function severityLabel(value: string | null): string {
  if (!value) return "All severities";
  return SEVERITY_OPTIONS.find((option) => option.value === value)?.label ?? value;
}

export const CONFIDENCE_OPTIONS: { value: "low" | "medium" | "high"; label: string }[] = [
  { value: "low", label: "≥ Low" },
  { value: "medium", label: "≥ Medium" },
  { value: "high", label: "≥ High" },
];

export function confidenceLabel(value: string | null): string {
  if (!value) return "All confidence levels";
  return CONFIDENCE_OPTIONS.find((option) => option.value === value)?.label ?? value;
}

export function toGetLeakageParams(filters: LeakageFilterState): GetLeakageParams {
  return {
    window: filters.window.kind === "preset" ? filters.window.value : filters.window.days,
    horizon: filters.horizon.kind === "preset" ? filters.horizon.value : filters.horizon.days,
    market: filters.market ?? undefined,
    calculate: filters.calculate,
    minSeverity: filters.minSeverity ?? undefined,
    minConfidence: filters.minConfidence ?? undefined,
  };
}

export function startOfDay(date: Date): Date {
  return new Date(date.getFullYear(), date.getMonth(), date.getDate());
}

export function daysBetween(from: Date, to: Date): number {
  return Math.round((startOfDay(to).getTime() - startOfDay(from).getTime()) / 86_400_000);
}
