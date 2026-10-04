import { currencyPrefix } from "@/lib/format-measured-value";

/**
 * Cosmetic helpers for the Leakage Map. Nothing here derives a business value: they only turn raw
 * codes the API already sent into display text.
 */

/** "in_flight" / "IN_FLIGHT" -> "In flight", "account_activity:active" -> "Account activity · Active". */
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

export const UNASSIGNED_MARKET = "UNASSIGNED";

/** The API sends unattributed exposure as the string "UNASSIGNED" (the handoff prose says null; treat both alike). */
export const isUnassignedMarket = (market: string | null | undefined): boolean =>
  market == null || market === UNASSIGNED_MARKET;

const regionNames =
  typeof Intl !== "undefined" && "DisplayNames" in Intl
    ? new Intl.DisplayNames(["en"], { type: "region" })
    : null;

/** "NG" -> "Nigeria". Falls back to the code itself when the runtime can't resolve it. */
export function marketName(code: string): string {
  if (isUnassignedMarket(code)) return "Unassigned market";
  try {
    return regionNames?.of(code) ?? code;
  } catch {
    return code;
  }
}

export { currencySymbol } from "@/lib/format-measured-value";

/**
 * Exact figure for a card's headline: symbol, thousands separators, and cents only while the amount is
 * small enough for them to matter ("US$2,017.72" but "₦2,445,766"). Display rounding only.
 */
export function formatHeadlineMoney(value: number, currency: string): string {
  const whole = Math.abs(value) >= 100_000;
  return `${currencyPrefix(currency)}${value.toLocaleString("en-US", {
    minimumFractionDigits: whole ? 0 : 2,
    maximumFractionDigits: whole ? 0 : 2,
  })}`;
}

/** Heading for the amount a mode selects: GROSS -> "Gross exposure", EXPECTED -> "Expected loss", NET -> "Net expected loss". */
export const MODE_TITLE: Record<string, string> = {
  GROSS: "Gross exposure",
  EXPECTED: "Expected loss",
  NET: "Net expected loss",
};

/**
 * Orders currencies for display: the reporting currency first when there is one, the rest by ISO code.
 * Position only: never by amount, and nothing is totalled.
 */
export function compareCurrencies(reportingCurrency: string | null | undefined) {
  return (a: string, b: string) =>
    Number(b === reportingCurrency) - Number(a === reportingCurrency) || a.localeCompare(b);
}

const MECHANISM_DOT_CLASSES = ["bg-team-1", "bg-team-4", "bg-teal", "bg-amber", "bg-rose", "bg-team-3"];

/** A stable dot colour per mechanism key, so the same leak type looks the same wherever it appears. Purely visual. */
export function mechanismDotClass(mechanism: string): string {
  let hash = 0;
  for (const char of mechanism) hash = (hash * 31 + char.charCodeAt(0)) >>> 0;
  return MECHANISM_DOT_CLASSES[hash % MECHANISM_DOT_CLASSES.length];
}

const AVAILABILITY_PHRASE: Record<string, string> = {
  AVAILABLE: "source available",
  NOT_AVAILABLE: "source not available",
  PARTIALLY_AVAILABLE: "source partly available",
  AVAILABLE_BUT_STALE: "source data is stale",
  AVAILABLE_BUT_UNMAPPED: "source available but not mapped",
  AVAILABLE_BUT_LOW_QUALITY: "source data is low quality",
  PERMISSION_BLOCKED: "access to the source is blocked",
  SOURCE_DEGRADED: "source is degraded",
};

/** The API's `sourceAvailability` enum as a short phrase; unknown values fall back to the humanized enum. */
export function availabilityPhrase(availability: string): string {
  return AVAILABILITY_PHRASE[availability] ?? humanizeEnum(availability).toLowerCase();
}

/** "work_started" -> "Work started" (first word capitalised only, unlike `humanizeEnum`). */
export function sentenceCase(value: string): string {
  const text = value.replace(/[_-]/g, " ").trim().toLowerCase();
  return text.charAt(0).toUpperCase() + text.slice(1);
}

/** Two-letter initials for an avatar: "Chad Sado" -> "CS". */
export function initials(name: string): string {
  const parts = name.trim().split(/\s+/).filter(Boolean);
  return ((parts[0]?.[0] ?? "") + (parts.length > 1 ? parts[parts.length - 1][0] : (parts[0]?.[1] ?? ""))).toUpperCase();
}

/** "2 Oct, 03:33" in the viewer's own timezone. */
export function formatStamp(iso: string): string {
  const date = new Date(iso);
  if (Number.isNaN(date.getTime())) return iso;
  return date.toLocaleString("en-GB", { day: "numeric", month: "short", hour: "2-digit", minute: "2-digit" });
}

/** A grouped number with a fixed number of decimals and no currency: 893643.2 -> "893,643.20". */
export function formatPlainNumber(value: number, digits = 2): string {
  return value.toLocaleString("en-US", { minimumFractionDigits: digits, maximumFractionDigits: digits });
}

/** An exact figure with the currency's symbol: 3001307.335, "NGN", 4 -> "₦3,001,307.3350". */
export function formatExactMoney(value: number, currency: string, digits = 2): string {
  return `${currencyPrefix(currency)}${formatPlainNumber(value, digits)}`;
}

/** "3 Oct 2026, 21:29 WAT". */
export function formatAsOf(iso: string): string {
  const date = new Date(iso);
  if (Number.isNaN(date.getTime())) return iso;
  return date.toLocaleString("en-GB", {
    day: "numeric",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
    timeZoneName: "short",
  });
}
