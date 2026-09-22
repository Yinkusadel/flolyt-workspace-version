import { calculateLabel, confidenceLabel, severityLabel } from "@/pages/leakage-map/filters";
import { COVERAGE_PANEL } from "@/pages/leakage-map/data";
import type { LeakageCalculateMode } from "@/services/api/leakage/get-leakage";

/**
 * The live status line under the H1 (01-leakage-map.svg) — always says what mode, window, horizon
 * and coverage the figures below reflect. When Severity/Confidence are filtering cells out, a
 * second amber line takes over that job (11-filtered.svg) — the way back to the unfiltered view
 * lives on the matrix's own banner and on each hidden cell's card, not here.
 *
 * Coverage/customer-count text is still `data.ts`'s mock figure — real wiring for those lands in
 * Step 2 (page shell), which also drives this page's loading/error/empty states from
 * `useGetLeakage`'s own query state instead of a hardcoded flag.
 */
export function StatusLine({
  calcMode,
  windowLabel,
  horizonLabel,
  hiddenPercent,
  minSeverity,
  minConfidence,
}: {
  calcMode: LeakageCalculateMode;
  windowLabel: string;
  horizonLabel: string;
  hiddenPercent: number;
  minSeverity: string | null;
  minConfidence: string | null;
}) {
  const calcLabel = calculateLabel(calcMode);
  const isFiltered = hiddenPercent > 0;

  return (
    <div className="mt-1 space-y-1">
      <p className="text-[11.5px] text-ink-3">
        4.2M customers · Refreshed 6 min ago · Showing: <span className="font-medium text-ink-2">{calcLabel}</span> ·{" "}
        <span className="font-medium text-ink-2">Window {windowLabel}</span> ·{" "}
        <span className="font-medium text-ink-2">Horizon {horizonLabel}</span> · Coverage{" "}
        <span className="font-medium text-ink-2">{COVERAGE_PANEL.overallPercent}%</span>
      </p>
      {isFiltered && (
        <p className="text-[11.5px] text-amber">
          Severity {severityLabel(minSeverity)} · Confidence {confidenceLabel(minConfidence)} — {hiddenPercent}% of
          cells are outside this view
        </p>
      )}
    </div>
  );
}
