import * as React from "react";

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

const STATES: RoomStateFilter[] = ["open", "recovering", "stale", "archived"];

const TILE_CAPTION: Record<RoomStateFilter, (counts: RoomCounts) => string> = {
  open: (counts) => `of ${counts.total} total`,
  recovering: () => "Part of open",
  stale: () => "Part of open · untouched 14 days",
  archived: () => "Closed with an outcome",
};

/** How long the blue block takes to travel. The destination tile waits a beat (see the
 * `delay-200` classes below) before it hands over its paper background and turns its text white,
 * so the block has all but arrived. */
const TRAVEL_MS = 320;
const TRAVEL_EASE = "cubic-bezier(0.4, 0, 0.1, 1)";

type Rect = { left: number; top: number; width: number; height: number };

/**
 * The four state tiles double as the state filter. Counts overlap (recovering and stale rooms are
 * also open), which the note under the tiles says out loud.
 *
 * The selected tile's blue is one block that slides to whichever tile is chosen, passing over the
 * tiles between, instead of each tile switching colour on its own. The block sits between two
 * layers: unselected tiles (z-0) are under it, so it visibly crosses them; the selected tile
 * (z-20) is over it with its paper background fading out once the block has arrived, so the text
 * stays readable (dark on paper while the block travels, white on blue once it lands).
 */
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
  const gridRef = React.useRef<HTMLDivElement>(null);
  const tileRefs = React.useRef<Partial<Record<RoomStateFilter, HTMLButtonElement | null>>>({});
  const [rect, setRect] = React.useState<Rect | null>(null);
  // True for the first placement and while the window resizes, so the block snaps into place
  // there instead of animating from nowhere or lagging behind a reflow.
  const [instant, setInstant] = React.useState(true);

  const measure = React.useCallback(() => {
    const tile = tileRefs.current[active];
    if (!tile) return;
    setRect({ left: tile.offsetLeft, top: tile.offsetTop, width: tile.offsetWidth, height: tile.offsetHeight });
  }, [active]);

  React.useLayoutEffect(() => {
    measure();
  }, [measure, counts.total]);

  React.useEffect(() => {
    // Let the first placement paint without a transition, then switch animation on.
    const frame = requestAnimationFrame(() => requestAnimationFrame(() => setInstant(false)));
    return () => cancelAnimationFrame(frame);
  }, []);

  // Always the latest `measure`, so the resize watcher below can be created once. If it were
  // rebuilt whenever the selected tile changed, the new watcher's immediate first callback would
  // switch the animation off in the same instant the block should start to travel.
  const measureRef = React.useRef(measure);
  measureRef.current = measure;

  React.useEffect(() => {
    const grid = gridRef.current;
    if (!grid || typeof ResizeObserver === "undefined") return;
    let frame = 0;
    let lastWidth = grid.offsetWidth;
    let lastHeight = grid.offsetHeight;
    const observer = new ResizeObserver(() => {
      // The first callback and any no-op notification change nothing: only a real resize snaps.
      if (grid.offsetWidth === lastWidth && grid.offsetHeight === lastHeight) return;
      lastWidth = grid.offsetWidth;
      lastHeight = grid.offsetHeight;
      setInstant(true);
      measureRef.current();
      cancelAnimationFrame(frame);
      frame = requestAnimationFrame(() => requestAnimationFrame(() => setInstant(false)));
    });
    observer.observe(grid);
    return () => {
      observer.disconnect();
      cancelAnimationFrame(frame);
    };
  }, []);

  return (
    <div className="space-y-2">
      <div ref={gridRef} className="relative grid grid-cols-2 gap-3 lg:grid-cols-5">
        {/* The travelling blue block. Never takes a click. */}
        {/* It moves with `transform`, not left/top, so the slide runs on the compositor (no
            layout work per frame) and stays smooth. All four tiles are the same size, so only
            the position ever animates. */}
        <div
          aria-hidden="true"
          className="pointer-events-none absolute top-0 left-0 z-10 rounded-card bg-primary shadow-[0_10px_20px_-10px_rgba(76,95,213,0.55)] will-change-transform"
          style={{
            width: rect?.width ?? 0,
            height: rect?.height ?? 0,
            transform: `translate3d(${rect?.left ?? 0}px, ${rect?.top ?? 0}px, 0)`,
            opacity: rect ? 1 : 0,
            transition: instant ? "none" : `transform ${TRAVEL_MS}ms ${TRAVEL_EASE}`,
          }}
        />

        {STATES.map((state) => {
          const selected = active === state;
          return (
            <button
              key={state}
              ref={(el) => {
                tileRefs.current[state] = el;
              }}
              type="button"
              aria-pressed={selected}
              onClick={() => onSelect(state)}
              className={cn(
                "relative rounded-card border p-4 text-left",
                selected
                  ? // Over the block; paper and border hand over to it once it has arrived.
                    "z-20 border-transparent bg-transparent transition-[background-color,border-color] delay-200 duration-150"
                  : // Under the block. Floats up off the page on hover (no scaling): it rises 4px
                    // while a soft, deeper shadow opens underneath. Only unselected tiles lift,
                    // since the block they would leave behind does not follow.
                    "z-0 border-line bg-paper shadow-[0_0_0_0_transparent] transition-[transform,box-shadow,border-color] duration-300 ease-[cubic-bezier(0.22,1,0.36,1)] will-change-transform hover:border-ink-4 hover:transform-[translateY(-4px)] hover:shadow-[0_14px_24px_-10px_rgba(22,25,32,0.22)] focus-visible:transform-[translateY(-4px)] focus-visible:shadow-[0_14px_24px_-10px_rgba(22,25,32,0.22)]"
              )}
            >
              <p
                className={cn(
                  EYEBROW,
                  selected
                    ? "text-primary-foreground/80 transition-colors delay-200 duration-150"
                    : "text-ink-3 transition-colors duration-150"
                )}
              >
                {ROOM_STATE_LABEL[state]}
              </p>
              <p
                className={cn(
                  "mt-2 text-[26px] leading-none font-semibold",
                  selected
                    ? "text-primary-foreground transition-colors delay-200 duration-150"
                    : cn(
                        "transition-colors duration-150",
                        state === "stale" && counts.stale > 0 ? "text-amber" : "text-ink"
                      )
                )}
              >
                {counts[state]}
              </p>
              <p
                className={cn(
                  "mt-2 text-[11px]",
                  selected
                    ? "text-primary-foreground/80 transition-colors delay-200 duration-150"
                    : "text-ink-3 transition-colors duration-150"
                )}
              >
                {TILE_CAPTION[state](counts)}
              </p>
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
