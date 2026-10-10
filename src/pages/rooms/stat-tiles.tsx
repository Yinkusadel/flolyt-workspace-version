import { cn } from "@/lib/utils";
import { formatWholeMoney } from "@/lib/format-measured-value";
import type { RoomListAmountBehindStaleDto } from "@/services/api/rooms/get-rooms";
import { ROOM_STATE_LABEL, type RoomStateFilter } from "@/pages/rooms/labels";

export interface RoomCounts {
  total: number;
  open: number;
  recovering: number;
  stale: number;
  archived: number;
}

const EYEBROW = "font-mono text-[9.5px] font-medium tracking-[1.05px] uppercase";

const TILE_CAPTION: Record<RoomStateFilter, (counts: RoomCounts) => string> = {
  open: (counts) => `of ${counts.total} total`,
  recovering: () => "Part of open",
  stale: () => "Part of open · untouched 14 days",
  archived: () => "Closed with an outcome",
};

/** The four state tiles double as the state filter. Counts overlap (recovering and stale rooms are
 * also open), which the note under the tiles says out loud. */
export function StatTiles({
  counts,
  amountBehindStale,
  active,
  onSelect,
}: {
  counts: RoomCounts;
  amountBehindStale: RoomListAmountBehindStaleDto[];
  active: RoomStateFilter;
  onSelect: (state: RoomStateFilter) => void;
}) {
  const states: RoomStateFilter[] = ["open", "recovering", "stale", "archived"];

  return (
    <div className="space-y-2">
      <div className="grid grid-cols-2 gap-3 lg:grid-cols-5">
        {states.map((state) => {
          const selected = active === state;
          return (
            <button
              key={state}
              type="button"
              aria-pressed={selected}
              onClick={() => onSelect(state)}
              className={cn(
                "rounded-card border bg-paper p-4 text-left transition-colors",
                selected ? "border-2 border-ultra" : "border-line hover:border-ink-4"
              )}
            >
              <p className={cn(EYEBROW, "text-ink-3")}>{ROOM_STATE_LABEL[state]}</p>
              <p
                className={cn(
                  "mt-2 text-[26px] leading-none font-semibold",
                  state === "stale" && counts.stale > 0 ? "text-amber" : "text-ink"
                )}
              >
                {counts[state]}
              </p>
              <p className="mt-2 text-[11px] text-ink-3">{TILE_CAPTION[state](counts)}</p>
            </button>
          );
        })}

        <div className="col-span-2 rounded-card border border-amber-border bg-amber-bg p-4 lg:col-span-1">
          <p className={cn(EYEBROW, "text-amber")}>Behind stale rooms</p>
          {amountBehindStale.length === 0 ? (
            <p className="mt-2 text-[13px] font-semibold text-ink">Nothing</p>
          ) : (
            <div className="mt-2 space-y-0.5">
              {amountBehindStale.map((entry) => (
                <p key={entry.currency} className="font-mono text-[15px] font-semibold text-ink">
                  {formatWholeMoney(entry.amount, entry.currency)}
                </p>
              ))}
            </div>
          )}
          <p className="mt-2 text-[11px] text-ink-3">Per currency, never combined</p>
        </div>
      </div>
      <p className="text-[11px] text-ink-3">
        Counts overlap: recovering and stale rooms are also open, so the tiles don&apos;t add up to the total.
      </p>
    </div>
  );
}
