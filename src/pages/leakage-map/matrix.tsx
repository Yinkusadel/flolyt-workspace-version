import { Fragment, useState } from "react";

import { cn } from "@/lib/utils";
import { Skeleton } from "@/components/ui/skeleton";
import { InfoTooltip } from "@/components/ui/info-tooltip";
import { FloatingCard } from "@/pages/leakage-map/floating-card";
import { CellDetailCard } from "@/pages/leakage-map/detail-panel";
import { formatCompactMoney } from "@/lib/format-measured-value";
import { HEAT_SCALE, HEAT_TEXT_CLASS } from "@/pages/leakage-map/data";
import type { LeakageGridDto } from "@/services/api/leakage/get-leakage";
import type { GetLeakageCellParams } from "@/services/api/leakage/get-leakage-cell";

/** Buckets a raw `intensity` into the existing 4-step heat scale — confirmed live 2026-09-24 to be
 * bounded like a 0–1 score (a real measured cell was `1`, several real-zero cells were `0`).
 * Clamped defensively anyway, since only those two endpoints have been observed so far. */
function heatBucket(intensity: number | null): 0 | 1 | 2 | 3 {
  if (intensity === null) return 0;
  const clamped = Math.max(0, Math.min(1, intensity));
  if (clamped >= 0.66) return 3;
  if (clamped >= 0.33) return 2;
  if (clamped > 0) return 1;
  return 0;
}

function MatrixSkeleton() {
  return (
    <div className="rounded-card border border-line bg-paper p-4">
      <div className="flex gap-2">
        {Array.from({ length: 5 }).map((_, i) => (
          <Skeleton key={i} className="h-3 w-20" />
        ))}
      </div>
      <div className="mt-3 space-y-2">
        {Array.from({ length: 4 }).map((_, i) => (
          <Skeleton key={i} className="h-14 w-full" />
        ))}
      </div>
    </div>
  );
}

/**
 * The customer-state/segment × condition grid(s) — rewritten from the mock's hardcoded 5×5 table
 * with 5 authored cell states into a fully dynamic render of `GET /leakage`'s own `grids[]` (see
 * docs/leakage-map/build-plan.md Step 4). Real distinctions the mock's five states (value/compound/
 * zero/gap/filtered) don't map onto:
 * - "filtered" doesn't exist here at all — `minSeverity`/`minConfidence` are sent to the server,
 *   which excludes hidden cells from `cells[]` entirely rather than returning them dashed-out
 *   (confirmed by `filter.cellsHidden` being a bare count, not per-cell data) — so there is no
 *   client-side severity/confidence gating left to do in this component.
 * - "compound" (a horizon-projection cell) and "zero" (measured-and-empty) have no equivalent
 *   field on `LeakageCellDto` — every cell collapses to one of two real states: measured (`amount`
 *   present) or gap (absent from `cells[]`, or present with `amount: null`). A real zero is
 *   genuinely measured (`state: "available"`, `amount: 0`), not a gap — confirmed live.
 * A gap cell's own `missingSource`/`wouldUnlock` are real fields on the grid response itself
 * (confirmed live 2026-09-24 — an earlier pass guessed this needed the click-through detail fetch;
 * it doesn't), so a gap cell shows an `InfoTooltip` inline with no request at all. Clicking any
 * cell still lazy-fetches the full `GET /leakage/cells/{...}` detail (movement/expected/room/
 * draft/signals/guidance) for the richer floating card.
 */
export function LeakageMatrix({
  grids,
  currency,
  cellParams,
  shadingCaptionLabel,
  cellsHidden,
}: {
  grids: LeakageGridDto[] | undefined;
  /** The active market's currency, scoping which of a grid's (possibly multi-currency) cells
   * render — unconfirmed live, since every market rail pulled so far was empty. */
  currency: string | undefined;
  cellParams: Pick<GetLeakageCellParams, "window" | "horizon">;
  shadingCaptionLabel: string;
  /** Cells the server already excluded via `minSeverity`/`minConfidence` — a bare count, not a
   * derivable percentage across (possibly two, differently-sized) grids. */
  cellsHidden: number;
}) {
  const [activeGridKey, setActiveGridKey] = useState<string | null>(null);

  if (!grids) return <MatrixSkeleton />;

  if (grids.length === 0) {
    return (
      <div className="rounded-card border border-dashed border-line bg-paper p-6 text-center text-[12px] text-ink-3">
        No grid to show for this business's revenue model yet.
      </div>
    );
  }

  const activeGrid = grids.find((g) => g.grid === activeGridKey) ?? grids[0];
  const columns = activeGrid.conditions.filter((c) => c.applicability !== "NotApplicable");
  const cellsByKey = new Map(
    activeGrid.cells.filter((cell) => !currency || cell.currency === currency).map((cell) => [`${cell.row}:${cell.condition}`, cell])
  );

  return (
    <div className="rounded-card border border-line bg-paper py-4">
      {grids.length > 1 && (
        <div className="mb-3 flex items-center gap-1 border-b border-line px-4">
          {grids.map((grid) => (
            <button
              key={grid.grid}
              type="button"
              onClick={() => setActiveGridKey(grid.grid)}
              className={cn(
                "shrink-0 rounded-t-panel border-b-2 px-3 py-2 text-[11.5px] whitespace-nowrap",
                grid.grid === activeGrid.grid
                  ? "border-ink font-semibold text-ink"
                  : "border-transparent font-normal text-ink-3 hover:text-ink-2"
              )}
            >
              {grid.grid}
            </button>
          ))}
        </div>
      )}

      {cellsHidden > 0 && (
        <div className="mx-4 mb-3 rounded-control border border-amber-border bg-amber-bg px-3 py-2 text-[11.5px] text-amber">
          Your Severity/Confidence filter is hiding {cellsHidden} cell{cellsHidden === 1 ? "" : "s"} — change it in
          Filters to see them.
        </div>
      )}

      {activeGrid.rows.length === 0 && (
        <p className="px-4 pb-3 text-[12px] text-ink-3">No rows defined for this grid yet.</p>
      )}

      <div className="overflow-x-auto px-4 py-1.5">
        <div
          className="grid gap-2"
          style={{ gridTemplateColumns: `110px repeat(${columns.length}, 1fr)`, minWidth: `${110 + columns.length * 110}px` }}
        >
          <div />
          {activeGrid.rows.length > 0 &&
            columns.map((col) => (
              <p
                key={col.key}
                className="self-end px-1 pb-2 text-center font-mono text-[8.5px] font-medium tracking-[0.7px] text-ink-4 uppercase"
              >
                {col.label}
              </p>
            ))}

          {activeGrid.rows.map((row) => (
            <Fragment key={row.key}>
              <p className="flex items-center text-[12.5px] font-medium text-ink">{row.label}</p>
              {columns.map((col) => {
                const cell = cellsByKey.get(`${row.key}:${col.key}`);
                const measured = cell?.amount != null;
                const heat = measured ? heatBucket(cell!.intensity) : 0;
                // A gap cell with no market currency known yet (this workspace's `markets`/
                // `bySeverity`/`ladders` were all empty) has no valid currency path segment to
                // fetch with — shown but inert rather than firing a request with a made-up value.
                const resolvedCurrency = currency ?? cell?.currency;
                const cellClassName = (open: boolean) =>
                  cn(
                    "flex h-14 w-full items-center justify-center gap-1.5 rounded-control text-[14px] font-semibold",
                    measured
                      ? HEAT_TEXT_CLASS[heat]
                      : "border border-dashed border-ink-4/40 bg-paper-2/60 text-[10.5px] text-ink-4 disabled:cursor-not-allowed",
                    open && "ring-2 ring-ultra ring-offset-1 ring-offset-paper"
                  );
                const cellContent = measured ? (
                  formatCompactMoney(cell!.amount!, cell!.currency)
                ) : (
                  <>
                    Unknown
                    {cell && (
                      <InfoTooltip missingSource={cell.missingSource ?? undefined} wouldUnlock={cell.wouldUnlock ?? undefined} />
                    )}
                  </>
                );
                const cellStyle = measured ? { backgroundColor: HEAT_SCALE[heat] } : undefined;

                if (!resolvedCurrency) {
                  return (
                    <button key={col.key} type="button" disabled style={cellStyle} className={cellClassName(false)}>
                      {cellContent}
                    </button>
                  );
                }

                return (
                  <FloatingCard
                    key={col.key}
                    align="center"
                    panelClassName="w-[26rem] max-w-[calc(100vw-2rem)]"
                    renderTrigger={({ open, toggle, ref }) => (
                      <button ref={ref} type="button" onClick={toggle} style={cellStyle} className={cellClassName(open)}>
                        {cellContent}
                      </button>
                    )}
                  >
                    <CellDetailCard
                      grid={activeGrid.grid}
                      row={row.key}
                      condition={col.key}
                      currency={resolvedCurrency}
                      rowLabel={row.label}
                      conditionLabel={col.label}
                      params={cellParams}
                    />
                  </FloatingCard>
                );
              })}
            </Fragment>
          ))}
        </div>
      </div>

      <div className="mt-4 flex flex-wrap items-center gap-3 border-t border-line px-4 pt-3.5 text-[10.5px]">
        <span className="font-mono text-[9.5px] font-medium tracking-[0.6px] text-ink-4 uppercase">Low</span>
        <div className="flex gap-1">
          {HEAT_SCALE.map((color) => (
            <span key={color} className="size-4 rounded-xs border border-line" style={{ backgroundColor: color }} />
          ))}
        </div>
        <span className="font-mono text-[9.5px] font-medium tracking-[0.6px] text-ink-4 uppercase">High</span>
        <span className="text-ink-3">Shading is {shadingCaptionLabel}.</span>
      </div>
    </div>
  );
}
