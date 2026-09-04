export function round(value: number, decimals: number): number {
  const factor = 10 ** decimals;
  return Math.round(value * factor) / factor;
}

/** ₦ compact formatting for a currency-valued measured figure (e.g. atStake). */
export function formatCompactCurrency(value: number): string {
  return formatCompactMoney(value, "NGN");
}

/** Same compact scaling as `formatCompactCurrency`, for a figure in a currency other than the workspace's own — money is never blended across currencies, so the code travels with the number. */
export function formatCompactMoney(value: number, currencyCode: string): string {
  const prefix = currencyCode === "NGN" ? "₦" : `${currencyCode} `;
  const abs = Math.abs(value);
  if (abs >= 1_000_000) return `${prefix}${Math.round(value / 1_000_000)}M`;
  if (abs >= 1_000) return `${prefix}${Math.round(value / 1_000)}k`;
  return `${prefix}${value}`;
}

/** Comma-grouped count, for a measured figure meant to read as an exact-looking total (e.g. a 12-month population). */
export function formatCount(value: number): string {
  return value.toLocaleString("en-US");
}

/** Fraction (0-1) to a one-decimal percent string, for share/rate-style measured figures. */
export function formatPercent(value: number): string {
  return `${round(value * 100, 1)}%`;
}

/** An ISO datetime to a short "4 Mar" style date, for a dated registry entry. */
export function formatShortDate(isoDate: string): string {
  return new Date(isoDate).toLocaleDateString("en-US", { day: "numeric", month: "short" });
}

/**
 * GET /lifecycle/map's `headline` — the one always-present per-stage figure (new customers,
 * repeat share, plans in use, etc.). `unit` decides the numeric formatting, never renders as a
 * literal suffix: "percent"/"%" and "share"/"ratio"/"rate" (confirmed live: retain's repeat
 * share, 0.9567) both render as a percentage; anything else (confirmed live: "count", "average")
 * rounds to 1-2dp / compacts past 1000 — adopt's raw 10.0748175182481... needed the rounding.
 * Returns undefined when `headline.value` is null — pair with `headline.label` and an
 * unavailable indicator in that case, same as `atStake`'s own gated state.
 */
export function formatHeadlineValue(headline: { value: number | null; unit: string }): string | undefined {
  if (headline.value === null) return undefined;
  const { value } = headline;
  const normalizedUnit = headline.unit.trim().toLowerCase();
  if (normalizedUnit === "percent" || normalizedUnit === "%") return `${round(value, 1)}%`;
  if (normalizedUnit === "share" || normalizedUnit === "ratio" || normalizedUnit === "rate") return `${round(value * 100, 1)}%`;

  const abs = Math.abs(value);
  if (abs >= 1_000_000) return `${round(value / 1_000_000, 1)}M`;
  if (abs >= 1_000) return `${round(value / 1_000, 1)}k`;
  return `${round(value, 2)}`;
}
