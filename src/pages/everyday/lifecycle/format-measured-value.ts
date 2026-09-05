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
  // Billion breakpoint added 2026-09-05 after a live cohort response returned a lifetime-revenue
  // figure north of ₦2B — without it this rendered as "₦2178M" instead of "₦2.18B".
  if (abs >= 1_000_000_000) return `${prefix}${round(value / 1_000_000_000, 2)}B`;
  // 1dp added same day, same fix pass: whole-number rounding here was flattening two real,
  // meaningfully different per-customer cohort figures (₦4.27M and ₦3.48M, ~23% apart) into
  // "₦4M"/"₦3M" — a 33%-looking jump that threw away real precision. Matches formatHeadlineValue's
  // own 1dp convention for the same M/k breakpoints.
  if (abs >= 1_000_000) return `${prefix}${round(value / 1_000_000, 1)}M`;
  if (abs >= 1_000) return `${prefix}${round(value / 1_000, 1)}k`;
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

/** An ISO datetime to a "Aug 2026" style month, for a cohort's arrival period. */
export function formatMonthYear(isoDate: string): string {
  return new Date(isoDate).toLocaleDateString("en-US", { month: "short", year: "numeric" });
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
