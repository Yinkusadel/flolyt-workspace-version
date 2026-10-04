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
