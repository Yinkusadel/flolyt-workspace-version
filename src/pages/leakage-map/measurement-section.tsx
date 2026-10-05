import { useState } from "react";
import { ChevronRight } from "lucide-react";

import { cn } from "@/lib/utils";
import { Collapse, ToggleHeader } from "@/pages/leakage-map/collapse";
import type {
  LeakageV2CoverageSummary,
  LeakageV2LimitationSummary,
  LeakageV2Summary,
} from "@/services/api/leakage/get-leakage";
import type { LeakageCoverageExplanation } from "@/services/api/leakage/leakage-executive-types";

interface MeasurementSectionProps {
  summary: LeakageV2Summary;
  coverage: LeakageV2CoverageSummary;
  coverageExplanation: LeakageCoverageExplanation | undefined;
  limitationSummary: LeakageV2LimitationSummary;
  onOpenDiagnostics: () => void;
  onOpenCoverage: () => void;
}

/**
 * How much of the leakage surface is measured. The ring is the publication-wide effective coverage (filters
 * never change it) and its headline is the server's own sentence. The counts are the response's separately
 * named measurement counts, never added together. "Coverage detail" opens the Coverage sheet (issues,
 * signals, ratios).
 */
export function MeasurementSection({
  summary,
  coverage,
  coverageExplanation,
  limitationSummary,
  onOpenDiagnostics,
  onOpenCoverage,
}: MeasurementSectionProps) {
  const [expanded, setExpanded] = useState(true);
  const effective = coverageExplanation?.effectiveCoverage ?? coverage.effective;
  const headline =
    coverageExplanation?.headline ?? `${coverage.measuredSignals} of ${coverage.applicableSignals} applicable signals measured`;
  const { measurement } = summary;
  const issues = coverageExplanation?.issues ?? [];

  const rows: { label: string; value: number; warn?: boolean }[] = [
    { label: "Priced findings", value: measurement.pricedCandidateCount },
    ...(measurement.unpricedCandidateCount > 0
      ? [{ label: "Unpriced candidates", value: measurement.unpricedCandidateCount, warn: true }]
      : []),
    { label: "Observations that can't be priced", value: measurement.unpriceableObservationCount, warn: measurement.unpriceableObservationCount > 0 },
    { label: "Leak types with exposure", value: measurement.populatedCellCount },
    { label: "Measured zero", value: measurement.measuredZeroCellCount },
    { label: "Not measurable yet", value: measurement.unavailableCellCount },
  ];

  return (
    <section aria-label="Measurement" className="rounded-card border border-line bg-paper p-4 sm:p-5">
      <ToggleHeader open={expanded} onToggle={() => setExpanded((prev) => !prev)} bodyId="measurement-body" title="Measurement" />

      <Collapse id="measurement-body" open={expanded}>
      <div className="mt-4 flex items-center gap-4">
        <Ring value={effective} />
        <div className="min-w-0">
          <p className="text-[13px] font-semibold text-ink">{headline}</p>
          <p className="mt-0.5 text-[11px] text-ink-3">Publication-wide: filters don't change it.</p>
          {coverage.residualUnknownUnits > 0 && (
            <p className="mt-0.5 text-[11px] text-ink-3">
              {coverage.residualUnknownUnits.toLocaleString("en-US")} units remain unknown.
            </p>
          )}
        </div>
      </div>

      <dl className="mt-4 divide-y divide-line rounded-panel border border-line">
        {rows.map((row) => (
          <div key={row.label} className="flex items-center justify-between gap-3 px-3 py-2">
            <dt className="text-[11.5px] text-ink-2">{row.label}</dt>
            <dd className={cn("font-mono text-[12px] font-semibold", row.warn ? "text-amber" : "text-ink")}>
              {row.value.toLocaleString("en-US")}
            </dd>
          </div>
        ))}
      </dl>
      <p className="mt-2 text-[10.5px] text-ink-4">These counts are separate. They are never added together.</p>

      <div className="mt-3 flex flex-wrap items-center gap-x-5 gap-y-2">
        <button type="button" onClick={onOpenDiagnostics} className="text-[11.5px] font-medium text-ultra hover:underline">
          All {limitationSummary.detailCount.toLocaleString("en-US")} diagnostics
        </button>
        <button type="button" onClick={onOpenCoverage} className="flex items-center gap-1 text-[11.5px] font-medium text-ultra hover:underline">
          Coverage detail{issues.length > 0 ? ` (${issues.length} ${issues.length === 1 ? "issue" : "issues"})` : ""}
          <ChevronRight className="size-3.5" />
        </button>
      </div>
      </Collapse>
    </section>
  );
}

/** A ring showing `value` (0 to 1) as a percentage, with one decimal. `null` means the server gave no figure. */
function Ring({ value }: { value: number | null }) {
  const radius = 30;
  const circumference = 2 * Math.PI * radius;
  const fraction = value == null ? 0 : Math.min(1, Math.max(0, value));
  return (
    <div className="relative size-[76px] shrink-0" role="img" aria-label={value == null ? "No coverage figure" : `${(fraction * 100).toFixed(1)} percent effective coverage`}>
      <svg viewBox="0 0 76 76" className="size-full -rotate-90">
        <circle cx="38" cy="38" r={radius} fill="none" strokeWidth="6" className="stroke-line" />
        <circle
          cx="38"
          cy="38"
          r={radius}
          fill="none"
          strokeWidth="6"
          strokeLinecap="round"
          className="stroke-ultra"
          strokeDasharray={`${fraction * circumference} ${circumference}`}
        />
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <span className="font-mono text-[14px] leading-none font-semibold text-ink">
          {value == null ? "–" : `${(fraction * 100).toFixed(1)}%`}
        </span>
        <span className="mt-0.5 text-[8.5px] text-ink-4">coverage</span>
      </div>
    </div>
  );
}
