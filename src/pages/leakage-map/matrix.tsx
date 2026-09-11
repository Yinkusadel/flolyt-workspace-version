import { Fragment } from "react";
import { HelpCircle } from "lucide-react";

import { cn } from "@/lib/utils";
import { FloatingCard } from "@/pages/leakage-map/floating-card";
import { GapCellCard, ValueCellCard } from "@/pages/leakage-map/detail-panel";
import { HEAT_SCALE, HEAT_TEXT_CLASS, HOW_ITS_CALCULATED, MATRIX_COLUMNS, MATRIX_ROWS } from "@/pages/leakage-map/data";

/**
 * Each cell opens its own FloatingCard — a click opens a small card right against that cell,
 * matching svg/02-leakage-cell-selected.svg and 03-leakage-unavailable.svg (a floating card near
 * the click, not a full-screen dialog).
 */
export function LeakageMatrix() {
  return (
    <div className="rounded-card border border-line bg-paper py-4">
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
                      panelClassName="w-80 max-w-[calc(100vw-2rem)]"
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
                          <span className="text-[11px] text-ink-3">unavailable</span>
                          <span className="text-[9.5px] text-ink-4">{cell.missingSource}</span>
                        </button>
                      )}
                    >
                      <GapCellCard
                        rowLabel={row.label}
                        columnLabel={col.label}
                        missingSource={cell.missingSource}
                        explanation={cell.explanation}
                        wouldUnlock={cell.wouldUnlock}
                      />
                    </FloatingCard>
                  );
                }

                return (
                  <FloatingCard
                    key={col.key}
                    align="center"
                    panelClassName="w-80 max-w-[calc(100vw-2rem)]"
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
        <span className="text-ink-3">Dashed cells are gaps in the data, not zeros.</span>

        <FloatingCard
          align="end"
          panelClassName="w-72 max-w-[calc(100vw-2rem)] p-4 text-[11.5px] leading-relaxed text-ink-2"
          renderTrigger={({ toggle, ref }) => (
            <button
              ref={ref}
              type="button"
              onClick={toggle}
              className="ml-auto inline-flex items-center gap-1 font-medium text-ultra hover:underline"
            >
              How this is calculated
              <HelpCircle className="size-3.5" />
            </button>
          )}
        >
          {HOW_ITS_CALCULATED}
        </FloatingCard>
      </div>
    </div>
  );
}
