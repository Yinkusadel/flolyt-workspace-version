import { RETAIN_STAGE_ROLLUP } from "@/pages/leakage-map/data";

/** "Why the stage cards do not sum to the matrix" (06-stage-rollup.svg) — a standalone card in
 * the design, not part of any one stage's popover, so it lives here rather than nested inside
 * StageDetailCard's Retain branch. */
export function CoverageGapNote() {
  return (
    <div className="rounded-card border border-line bg-paper-2 p-4">
      <h2 className="text-[13px] font-semibold text-ink">{RETAIN_STAGE_ROLLUP.explainerTitle}</h2>
      <p className="mt-1 text-[11.5px] leading-relaxed text-ink-3">{RETAIN_STAGE_ROLLUP.explainerBody}</p>
    </div>
  );
}
