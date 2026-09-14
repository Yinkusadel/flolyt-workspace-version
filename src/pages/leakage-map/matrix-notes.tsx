import { Flag } from "lucide-react";

import { ordinal } from "@/pages/leakage-map/detail-panel";
import { MATRIX_COLUMNS, MATRIX_ROWS } from "@/pages/leakage-map/data";

const EMPTY_KINDS = [
  { label: "No exposure", detail: "measured, nothing there" },
  { label: "Unknown", detail: "exists, not measurable — connect a source" },
  { label: "Hidden by filter", detail: "measured, outside your current view" },
];

/** Standalone card (04-cell-zero.svg) — sits below the matrix, not inside any one cell's card;
 * the export draws it full-width at the page's own left margin, separate from the small popover. */
export function ThreeWaysEmptyNote() {
  return (
    <div className="rounded-card border border-line bg-paper-2 p-4">
      <h2 className="text-[13px] font-semibold text-ink">
        Three ways a cell can be empty, and they are not the same
      </h2>
      <div className="mt-2.5 flex flex-wrap gap-x-6 gap-y-1.5">
        {EMPTY_KINDS.map((kind) => (
          <p key={kind.label} className="text-[11.5px]">
            <span className="font-semibold text-ink">{kind.label}</span>{" "}
            <span className="text-ink-3">· {kind.detail}</span>
          </p>
        ))}
      </div>
    </div>
  );
}

const compoundCell = MATRIX_ROWS.flatMap((row) => MATRIX_COLUMNS.map((col) => row.cells[col.key])).find(
  (cell) => cell.kind === "compound"
);

/** Standalone card (05-cell-compound.svg) — same "separate from the popover" pattern as
 * ThreeWaysEmptyNote; explains why shading (amount) and ranking (threat score) can disagree. */
export function CompoundRiskNote() {
  if (!compoundCell || compoundCell.kind !== "compound") return null;

  return (
    <div className="rounded-card border border-amber-border bg-amber-bg p-4">
      <div className="flex gap-2.5">
        <Flag className="mt-0.5 size-4 shrink-0 text-amber" aria-hidden />
        <div>
          <h2 className="text-[13px] font-semibold text-amber">
            A cell ranked {ordinal(compoundCell.rankByAmount)} by amount can be the{" "}
            {ordinal(compoundCell.rankByThreat)} most urgent thing on this page
          </h2>
          <p className="mt-1.5 text-[11.5px] leading-relaxed text-amber">
            Shading is amount. Ranking is threat score. This is the cell where the two disagree most, which is
            exactly why the page says so twice.
          </p>
        </div>
      </div>
    </div>
  );
}
