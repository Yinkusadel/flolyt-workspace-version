import { Button } from "@/components/ui/button";
import {
  CALC_MODE_OPTIONS,
  SEVERITY_FILTER_OPTIONS,
  CONFIDENCE_FILTER_OPTIONS,
  COVERAGE_PANEL,
  type CalcMode,
  type SeverityLevel,
  type ConfidenceLevel,
} from "@/pages/leakage-map/data";

/**
 * The live status line under the H1 (01-leakage-map.svg) — always says what mode, horizon and
 * coverage the figures below reflect. When Severity/Confidence are filtering cells out, a second
 * amber line takes over that job (11-filtered.svg) with a way back to the unfiltered view.
 */
export function StatusLine({
  calcMode,
  horizonLabel,
  hiddenPercent,
  severityFilter,
  confidenceFilter,
  onClearFilters,
}: {
  calcMode: CalcMode;
  horizonLabel: string;
  hiddenPercent: number;
  severityFilter: SeverityLevel;
  confidenceFilter: ConfidenceLevel;
  onClearFilters: () => void;
}) {
  const calcLabel = CALC_MODE_OPTIONS.find((o) => o.value === calcMode)?.label ?? "Expected loss";
  const severityLabel = SEVERITY_FILTER_OPTIONS.find((o) => o.value === severityFilter)?.label ?? "≥ S2";
  const confidenceLabel = CONFIDENCE_FILTER_OPTIONS.find((o) => o.value === confidenceFilter)?.label ?? "≥ Medium";
  const isFiltered = hiddenPercent > 0;

  return (
    <div className="mt-1 space-y-1">
      <p className="text-[11.5px] text-ink-3">
        4.2M customers · Refreshed 6 min ago · Showing: <span className="font-medium text-ink-2">{calcLabel}</span> ·{" "}
        <span className="font-medium text-ink-2">{horizonLabel}</span> · Coverage{" "}
        <span className="font-medium text-ink-2">{COVERAGE_PANEL.overallPercent}%</span>
      </p>
      {isFiltered && (
        <p className="flex flex-wrap items-center gap-x-2 gap-y-1 text-[11.5px] text-amber">
          Severity {severityLabel} · Confidence {confidenceLabel} — {hiddenPercent}% of cells are outside this view
          <Button type="button" variant="outline" size="xs" onClick={onClearFilters}>
            Clear filter
          </Button>
        </p>
      )}
    </div>
  );
}
