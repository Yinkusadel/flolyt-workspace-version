import { formatWholeMoney } from "@/lib/format-measured-value";

/**
 * Any API token ("no-stage-owner", "churn_trajectory", "High") as plain words ("No stage owner",
 * "Churn trajectory", "High"). Generic on purpose: a new value from the backend reads fine
 * without a lookup table that would go stale.
 */
export const humanize = (token: string) => {
  const words = token.replace(/[-_]+/g, " ").trim().toLowerCase();
  return words ? words.charAt(0).toUpperCase() + words.slice(1) : "";
};

/** The schema types money and counts as number | string | null; display-only conversion. */
export const toNumber = (value: number | string | null): number | null => {
  if (value === null || value === "") return null;
  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : null;
};

export const formatMoney = (value: number | string | null, currency: string) => {
  const amount = toNumber(value);
  return amount === null ? null : formatWholeMoney(amount, currency);
};

const MONTHS = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

/** "2026-10-10T07:30:00Z" -> "10 Oct". */
export const formatDay = (iso: string) => {
  const date = new Date(iso);
  return `${date.getUTCDate()} ${MONTHS[date.getUTCMonth()]}`;
};

/** "2026-10-10T07:30:00Z" -> "10 Oct, 07:30 UTC". */
export const formatDayTime = (iso: string) => `${formatDay(iso)}, ${new Date(iso).toISOString().slice(11, 16)} UTC`;

/** Whole days since the proposal was raised, or null while it is under a day old. */
export const daysWaiting = (iso: string) => {
  const days = Math.floor((Date.now() - new Date(iso).getTime()) / 86_400_000);
  return days >= 1 ? days : null;
};
