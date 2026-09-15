import { Fragment } from "react";

import { cn } from "@/lib/utils";
import { FloatingCard } from "@/pages/leakage-map/floating-card";
import { Button } from "@/components/ui/button";
import {
  CompoundCellCard,
  FilteredCellCard,
  GapCellCard,
  ValueCellCard,
  ZeroCellCard,
} from "@/pages/leakage-map/detail-panel";
import {
  HEAT_SCALE,
  HEAT_TEXT_CLASS,
  MATRIX_COLUMNS,
  MATRIX_ROWS,
  filteredOutPercent,
  isCellHiddenByFilter,
  type ConfidenceLevel,
  type SeverityLevel,
} from "@/pages/leakage-map/data";

/**
 * Each cell opens its own FloatingCard — a click opens a small card right against that cell,
 * matching the export's own floating-card screens (02–05, 11) rather than a full-screen dialog.
 * Five kinds now render here: value, compound (a value cell whose amount and threat rank
 * disagree), zero ("no exposure"), gap ("unknown — data gap"), and — computed from the current
 * Severity/Confidence controls, not authored data — hidden-by-filter.
 */
export function LeakageMatrix({
  shadingCaptionLabel,
  severityFilter,
  confidenceFilter,
  onClearFilter,
  onSetSeverityFilter,
}: {
  shadingCaptionLabel: string;
  severityFilter: SeverityLevel;
  confidenceFilter: ConfidenceLevel;
  onClearFilter: () => void;
  onSetSeverityFilter: (value: SeverityLevel) => void;
}) {
  const hiddenPercent = filteredOutPercent(severityFilter, confidenceFilter);

  return (
    <div className="rounded-card border border-line bg-paper py-4">
      {hiddenPercent > 0 && (
        <div className="mx-4 mb-3 flex flex-wrap items-start justify-between gap-2 rounded-control border border-amber-border bg-amber-bg px-3 py-2 text-[11.5px] text-amber">
          <div>
            <p>Filter is hiding {hiddenPercent}% of cells. Totals below reflect visible cells only.</p>
            <p className="mt-1 text-[10.5px]">
              Every figure on this page now describes {100 - hiddenPercent}% of the cells — a filtered total is not a
              total.
            </p>
          </div>
          <Button type="button" variant="outline" size="xs" onClick={onClearFilter}>
            Clear filter
          </Button>
        </div>
      )}

      {/* Padding lives on the scrolling element itself, not the card around it — a card-level
          `p-4` still looks flush at max scroll because the scroller's own content (not the
          static card padding) is what defines how far right you can actually scroll to.
          `py-1.5` matters too, not just `px-4`: setting only `overflow-x` to `auto` makes the
          browser compute `overflow-y` as `auto` as well (a CSS spec rule, not a Tailwind quirk),
          so the selection ring on the bottom-row cells — which paints outside their own box,
          same as the right-column ones — was getting clipped by that now-non-visible y-axis too. */}
      <div className="overflow-x-auto px-4 py-1.5">
        <div className="grid min-w-180 grid-cols-[110px_repeat(5,1fr)] gap-2">
          <div />
          {MATRIX_COLUMNS.map((col) => (
            <p
              key={col.key}
              className="self-end px-1 pb-2 text-center font-mono text-[8.5px] font-medium tracking-[0.7px] text-ink-4 uppercase"
            >
              {col.label}
            </p>
          ))}

          {MATRIX_ROWS.map((row) => (
            <Fragment key={row.key}>
              <p className="flex items-center text-[12.5px] font-medium text-ink">{row.label}</p>
              {MATRIX_COLUMNS.map((col) => {
                const cell = row.cells[col.key];

                if (cell.kind === "gap") {
                  return (
                    <FloatingCard
                      key={col.key}
                      align="center"
                      panelClassName="w-[26rem] max-w-[calc(100vw-2rem)]"
                      renderTrigger={({ open, toggle, ref }) => (
                        <button
                          ref={ref}
                          type="button"
                          onClick={toggle}
                          className={cn(
                            "flex h-14 w-full flex-col items-center justify-center rounded-control border border-dashed border-line bg-paper text-center",
                            open && "border-ultra ring-2 ring-ultra/30"
                          )}
                        >
                          <span className="text-[11px] text-ink-3">Unknown</span>
                          <span className="text-[9.5px] text-ink-4">data gap · {cell.missingSource}</span>
                        </button>
                      )}
                    >
                      <GapCellCard
                        rowLabel={row.label}
                        columnLabel={col.label}
                        explanation={cell.explanation}
                        recoveryLow={cell.recoveryLow}
                        recoveryHigh={cell.recoveryHigh}
                      />
                    </FloatingCard>
                  );
                }

                if (cell.kind === "zero") {
                  return (
                    <FloatingCard
                      key={col.key}
                      align="center"
                      panelClassName="w-[26rem] max-w-[calc(100vw-2rem)]"
                      renderTrigger={({ open, toggle, ref }) => (
                        <button
                          ref={ref}
                          type="button"
                          onClick={toggle}
                          className={cn(
                            "flex h-14 w-full flex-col items-center justify-center rounded-control border border-line bg-paper-2 text-center",
                            open && "border-ultra ring-2 ring-ultra/30"
                          )}
                        >
                          <span className="text-[11px] text-ink-3">No exposure</span>
                          <span className="text-[9.5px] text-ink-4">none detected</span>
                        </button>
                      )}
                    >
                      <ZeroCellCard
                        rowLabel={row.label}
                        columnLabel={col.label}
                        note={cell.note}
                        lastChecked={cell.lastChecked}
                      />
                    </FloatingCard>
                  );
                }

                const hidden = isCellHiddenByFilter(cell, severityFilter, confidenceFilter);

                if (hidden) {
                  return (
                    <FloatingCard
                      key={col.key}
                      align="center"
                      panelClassName="w-[26rem] max-w-[calc(100vw-2rem)]"
                      renderTrigger={({ open, toggle, ref }) => (
                        <button
                          ref={ref}
                          type="button"
                          onClick={toggle}
                          className={cn(
                            "flex h-14 w-full flex-col items-center justify-center rounded-control border border-dashed border-ink-4/40 bg-paper-2/60 text-center",
                            open && "border-ultra ring-2 ring-ultra/30"
                          )}
                        >
                          <span className="text-[10.5px] text-ink-4">hidden by filter</span>
                        </button>
                      )}
                    >
                      <FilteredCellCard
                        rowLabel={row.label}
                        columnLabel={col.label}
                        severity={cell.severity}
                        confidence={cell.confidence}
                        amount={cell.value}
                        onClearFilter={onClearFilter}
                        onLowerSeverityTo={onSetSeverityFilter}
                      />
                    </FloatingCard>
                  );
                }

                if (cell.kind === "compound") {
                  return (
                    <FloatingCard
                      key={col.key}
                      align="center"
                      panelClassName="w-[26rem] max-w-[calc(100vw-2rem)]"
                      renderTrigger={({ open, toggle, ref }) => (
                        <button
                          ref={ref}
                          type="button"
                          onClick={toggle}
                          style={{ backgroundColor: HEAT_SCALE[cell.heat] }}
                          className={cn(
                            "flex h-14 w-full flex-col items-center justify-center gap-0.5 rounded-control",
                            HEAT_TEXT_CLASS[cell.heat],
                            open && "ring-2 ring-ultra ring-offset-1 ring-offset-paper"
                          )}
                        >
                          <span className="text-[14px] font-semibold">{cell.value}</span>
                          <span className="flex items-center gap-1 text-[8.5px] font-medium text-amber">
                            ⚠ compound risk
                          </span>
                        </button>
                      )}
                    >
                      <CompoundCellCard
                        rowLabel={row.label}
                        columnLabel={col.label}
                        value={cell.value}
                        projection={cell.projection}
                        severityNow={cell.severityNow}
                        severityAt12m={cell.severityAt12m}
                        rankByAmount={cell.rankByAmount}
                        rankByThreat={cell.rankByThreat}
                      />
                    </FloatingCard>
                  );
                }

                return (
                  <FloatingCard
                    key={col.key}
                    align="center"
                    panelClassName="w-[26rem] max-w-[calc(100vw-2rem)]"
                    renderTrigger={({ open, toggle, ref }) => (
                      <button
                        ref={ref}
                        type="button"
                        onClick={toggle}
                        style={{ backgroundColor: HEAT_SCALE[cell.heat] }}
                        className={cn(
                          "flex h-14 w-full items-center justify-center rounded-control text-[14px] font-semibold",
                          HEAT_TEXT_CLASS[cell.heat],
                          open && "ring-2 ring-ultra ring-offset-1 ring-offset-paper"
                        )}
                      >
                        {cell.value}
                      </button>
                    )}
                  >
                    <ValueCellCard
                      rowKey={row.key}
                      columnKey={col.key}
                      rowLabel={row.label}
                      columnLabel={col.label}
                      value={cell.value}
                      severity={cell.severity}
                      confidence={cell.confidence}
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
        <span className="text-ink-3">
          Shading is {shadingCaptionLabel}. Cell ranking uses threat score, not amount.
        </span>
      </div>
    </div>
  );
}
