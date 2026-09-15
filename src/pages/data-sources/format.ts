import type { ChipTone } from "@/components/ui/chip";

export function formatDateTime(value: string) {
  return new Date(value).toLocaleString(undefined, {
    month: "short",
    day: "numeric",
    year: "numeric",
    hour: "numeric",
    minute: "2-digit",
  });
}

/**
 * `connectionStatus` has no documented enum (docs/endpoints/datasources.md leaves it a bare
 * `string`) — "SyncError" is the only value seen live so far. Classified by keyword rather than
 * an exact match list until more values show up.
 */
export function statusTone(status: string): ChipTone {
  const s = status.toLowerCase();
  if (s.includes("error") || s.includes("fail")) return "rose";
  if (s.includes("disconnect")) return "neutral";
  if (s.includes("sync") || s.includes("pending")) return "amber";
  return "teal";
}
