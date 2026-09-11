import { formatShortDate } from "@/lib/format-measured-value";

/**
 * ISO datetime -> "22 min" / "3 hrs" / "Yesterday" / "12 days" / "4 Mar" — the Rooms index's own
 * relative-activity style. Falls back to the short-date form past 30 days, same breakpoint as
 * `isStale` (14 days) plus a wide margin, so a room a month old reads as a date, not a day count.
 */
export function formatRoomActivity(isoDate: string | null): string {
  if (!isoDate) return "—";
  const then = new Date(isoDate).getTime();
  const diffMin = Math.round((Date.now() - then) / 60_000);
  if (diffMin < 1) return "just now";
  if (diffMin < 60) return `${diffMin} min`;
  const diffHr = Math.round(diffMin / 60);
  if (diffHr < 24) return `${diffHr} hr${diffHr === 1 ? "" : "s"}`;
  const diffDays = Math.round(diffHr / 24);
  if (diffDays === 1) return "Yesterday";
  if (diffDays < 30) return `${diffDays} days`;
  return formatShortDate(isoDate);
}

/** "Ravi Mehta" -> "RM" — used wherever a person comes back as a bare name/id (no initials field). */
export function initialsFromName(name: string): string {
  const parts = name.trim().split(/\s+/).filter(Boolean);
  if (parts.length === 0) return "?";
  if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();
  return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
}
