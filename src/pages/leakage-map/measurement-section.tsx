import { useState } from "react";
import { Link } from "react-router-dom";
import { ChevronDown } from "lucide-react";

import { cn } from "@/lib/utils";
import type {
  LeakageV2CoverageSummary,
  LeakageV2LimitationSummary,
  LeakageV2Summary,
} from "@/services/api/leakage/get-leakage";
import type {
  LeakageCoverageExplanation,
  LeakageCoverageIssue,
  LeakageCoverageIssueCategory,
} from "@/services/api/leakage/leakage-executive-types";
import { Collapse } from "@/pages/leakage-map/collapse";
import { sentenceCase } from "@/pages/leakage-map/format";
import { PRIMARY_ACTION_CLASS } from "@/pages/leakage-map/drawer/shared";

const ISSUE_GROUPS: { category: LeakageCoverageIssueCategory; title: string; description: string }[] = [
  { category: "WORKSPACE_ACTION", title: "Workspace action", description: "Mapping, source connection or business-scope work" },
  { category: "WAITING_FOR_DATA", title: "Waiting for data", description: "Refresh or accumulate comparable history" },
  { category: "QUALITY", title: "Quality", description: "Repair incomplete or invalid mapped fields" },
  { category: "PERMISSION", title: "Permission", description: "Restore access to the required data" },
  { category: "PLATFORM_LIMITATION", title: "Platform limitation", description: "Reader or currency-policy support from the platform" },
];

interface MeasurementSectionProps {
  summary: LeakageV2Summary;
  coverage: LeakageV2CoverageSummary;
  coverageExplanation: LeakageCoverageExplanation | undefined;
  limitationSummary: LeakageV2LimitationSummary;
  onOpenDiagnostics: () => void;
}

/**
 * How much of the leakage surface is measured. The ring is the publication-wide effective coverage (filters
 * never change it) and its headline is the server's own sentence. The counts are the response's separately
 * named measurement counts, never added together. "What's holding coverage back" is the server's issue list,
 * grouped by its own categories; an issue's button appears only when its action is eligible.
 */
export function MeasurementSection({
  summary,
  coverage,
  coverageExplanation,
  limitationSummary,
  onOpenDiagnostics,
}: MeasurementSectionProps) {
  const [showIssues, setShowIssues] = useState(false);
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
      <h2 className="text-[13px] font-semibold text-ink">Measurement</h2>

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
        {issues.length > 0 && (
          <button
            type="button"
            aria-expanded={showIssues}
            aria-controls="coverage-issues"
            onClick={() => setShowIssues((prev) => !prev)}
            className="flex items-center gap-1 text-[11.5px] font-medium text-ultra hover:underline"
          >
            What's holding coverage back ({issues.length})
            <ChevronDown className={cn("size-3.5 transition-transform", showIssues && "rotate-180")} />
          </button>
        )}
      </div>

      <Collapse open={showIssues} id="coverage-issues">
        <div className="space-y-4 pt-4">
          {ISSUE_GROUPS.map((group) => {
            const groupIssues = issues.filter((issue) => issue.category === group.category);
            if (groupIssues.length === 0) return null;
            return (
              <div key={group.category}>
                <p className="text-[12px] font-semibold text-ink">
                  {group.title} <span className="font-mono text-[10.5px] font-normal text-ink-4">{groupIssues.length}</span>
                </p>
                <p className="text-[10.5px] text-ink-3">{group.description}</p>
                <ul className="mt-2 divide-y divide-line rounded-panel border border-line">
                  {groupIssues.map((issue, i) => (
                    <IssueRow key={`${issue.code}-${issue.capabilityId ?? i}`} issue={issue} />
                  ))}
                </ul>
              </div>
            );
          })}
        </div>
      </Collapse>
    </section>
  );
}

function IssueRow({ issue }: { issue: LeakageCoverageIssue }) {
  const { action } = issue;
  return (
    <li className="space-y-1.5 p-3">
      <div className="flex flex-wrap items-baseline justify-between gap-x-3">
        <p className="text-[12px] font-medium text-ink">{issue.capabilityId ?? sentenceCase(issue.code)}</p>
        {issue.subjectType && (
          <p className="font-mono text-[10px] text-ink-4">
            {issue.subjectType}
            {issue.grain ? ` · ${issue.grain} grain` : ""}
          </p>
        )}
      </div>
      <p className="text-[11px] leading-relaxed text-ink-3">{issue.message}</p>
      {issue.missingRequirements.length > 0 && (
        <div className="flex flex-wrap gap-1">
          {issue.missingRequirements.map((requirement) => (
            <span key={requirement} className="rounded-chip bg-paper-2 px-1.5 py-0.5 font-mono text-[10px] text-ink-2">
              {requirement}
            </span>
          ))}
        </div>
      )}
      {action &&
        (action.eligible && action.target === "datasources" ? (
          <Link
            to="/data-sources"
            className={cn(
              "inline-flex h-7 items-center rounded-control border px-2.5 text-[11.5px] font-medium transition-colors",
              PRIMARY_ACTION_CLASS
            )}
          >
            {action.label}
          </Link>
        ) : (
          action.unavailableReason && <p className="text-[10.5px] text-ink-4">{action.unavailableReason}</p>
        ))}
    </li>
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
          className="stroke-ink"
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
