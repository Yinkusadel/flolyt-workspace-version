import { calculateLabel, confidenceLabel, severityLabel } from "@/pages/leakage-map/filters";
import { formatCompactCount, formatRelativeTime } from "@/lib/format-measured-value";
import type { LeakageCalculateMode } from "@/services/api/leakage/get-leakage";

/**
 * The live status line under the H1 (01-leakage-map.svg) — always says what mode, window, horizon
 * and coverage the figures below reflect. `customerCount`/`refreshedAtUtc`/`coveragePercent` are
 * `undefined` until the first response lands (rendered as "—" rather than a stale mock number, per
 * [[feedback_no_hardcoded_fallback]]). When Severity/Confidence are filtering cells out, a second
 * amber line takes over that job (11-filtered.svg) — the way back to the unfiltered view lives on
 * the matrix's own banner and on each hidden cell's card, not here.
 */
export function StatusLine({
  calcMode,
  windowLabel,
  horizonLabel,
  customerCount,
  refreshedAtUtc,
  coveragePercent,
  hiddenPercent,
  minSeverity,
  minConfidence,
}: {
  calcMode: LeakageCalculateMode;
  windowLabel: string;
  horizonLabel: string;
  customerCount?: number;
  refreshedAtUtc?: string | null;
  coveragePercent?: number;
  hiddenPercent: number;
  minSeverity: string | null;
  minConfidence: string | null;
}) {
  const calcLabel = calculateLabel(calcMode);
  const isFiltered = hiddenPercent > 0;
  const customersLabel = customerCount === undefined ? "—" : `${formatCompactCount(customerCount)} customers`;
  const refreshedLabel = !refreshedAtUtc ? "not yet refreshed" : `Refreshed ${formatRelativeTime(refreshedAtUtc)}`;
  const coverageLabel = coveragePercent === undefined ? "—" : `${Math.round(coveragePercent)}%`;

  return (
    <div className="mt-1 space-y-1">
      <p className="text-[11.5px] text-ink-3">
        {customersLabel} · {refreshedLabel} · Showing: <span className="font-medium text-ink-2">{calcLabel}</span> ·{" "}
        <span className="font-medium text-ink-2">Window {windowLabel}</span> ·{" "}
        <span className="font-medium text-ink-2">Horizon {horizonLabel}</span> · Coverage{" "}
        <span className="font-medium text-ink-2">{coverageLabel}</span>
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
