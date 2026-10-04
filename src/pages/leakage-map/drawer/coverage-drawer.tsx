import { Link } from "react-router-dom";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Sheet, SheetBody, SheetContent, SheetDescription, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { Skeleton } from "@/components/ui/skeleton";
import { useGetLeakageCoverage } from "@/features/leakage/use-get-leakage-coverage";
import type { LeakageV2CoverageSummary } from "@/services/api/leakage/get-leakage";
import type { CoverageV2, LeakageCoverageSignalEntry } from "@/services/api/leakage/get-leakage-coverage";
import type {
  LeakageCoverageExplanation,
  LeakageCoverageIssue,
  LeakageCoverageIssueCategory,
} from "@/services/api/leakage/leakage-executive-types";
import { availabilityPhrase, sentenceCase } from "@/pages/leakage-map/format";
import { PRIMARY_ACTION_CLASS } from "@/pages/leakage-map/drawer/shared";
import type { CoverageTab } from "@/pages/leakage-map/drawer/use-coverage-param";

const ISSUE_GROUPS: { category: LeakageCoverageIssueCategory; title: string; description: string }[] = [
  { category: "WORKSPACE_ACTION", title: "Workspace action", description: "Mapping, source connection or business-scope work" },
  { category: "WAITING_FOR_DATA", title: "Waiting for data", description: "Refresh or accumulate comparable history" },
  { category: "QUALITY", title: "Quality", description: "Repair incomplete or invalid mapped fields" },
  { category: "PERMISSION", title: "Permission", description: "Restore access to the required data" },
  { category: "PLATFORM_LIMITATION", title: "Platform limitation", description: "Reader or currency-policy support from the platform" },
];

interface CoverageDrawerProps {
  /** `null` = closed. */
  tab: CoverageTab | null;
  onTabChange: (tab: CoverageTab) => void;
  onClose: () => void;
  coverage: LeakageV2CoverageSummary;
  coverageExplanation: LeakageCoverageExplanation | undefined;
}

/**
 * Everything behind the Measurement card, in one sheet with three tabs: what is holding coverage back (the
 * server's issue list), the signals by subject (the `/leakage/coverage` read, fetched only while its tab is
 * open), and the four ratios that make up the effective coverage figure. Coverage is publication-wide, so
 * nothing here changes with the page's filters.
 */
export function CoverageDrawer({ tab, onTabChange, onClose, coverage, coverageExplanation }: CoverageDrawerProps) {
  const issues = coverageExplanation?.issues ?? [];
  const tabs: { key: CoverageTab; label: string }[] = [
    { key: "holding-back", label: `Holding back (${issues.length})` },
    { key: "signals", label: "Signals" },
    { key: "ratios", label: "Ratios" },
  ];

  return (
    <Sheet open={!!tab} onOpenChange={(next) => !next && onClose()}>
      <SheetContent className="sm:max-w-[52rem]">
        <SheetHeader className="gap-2">
          <p className="font-mono text-[10px] tracking-wide text-ink-3 uppercase">Coverage</p>
          <SheetTitle className="text-[18px]">What we can see</SheetTitle>
          <SheetDescription>
            {coverageExplanation?.headline ?? `${coverage.measuredSignals} of ${coverage.applicableSignals} applicable signals measured`}.
            Publication-wide: filters don't change it.
          </SheetDescription>
          <div role="tablist" aria-label="Coverage" className="flex items-center gap-1 pt-1 sm:-mb-4">
            {tabs.map((t) => (
              <button
                key={t.key}
                role="tab"
                type="button"
                aria-selected={tab === t.key}
                onClick={() => onTabChange(t.key)}
                className={cn(
                  "border-b-2 px-3 pt-2 pb-3 text-[11.5px] whitespace-nowrap",
                  tab === t.key ? "border-ultra font-semibold text-ink" : "border-transparent text-ink-3 hover:text-ink-2"
                )}
              >
                {t.label}
              </button>
            ))}
          </div>
        </SheetHeader>

        <SheetBody className="px-5 py-5">
          {tab === "holding-back" && <HoldingBackTab issues={issues} />}
          {tab === "signals" && <SignalsTab />}
          {tab === "ratios" && <RatiosTab coverage={coverage} explanation={coverageExplanation?.explanation} />}
        </SheetBody>
      </SheetContent>
    </Sheet>
  );
}

/** The server's issues, grouped by its five categories. A button shows only for an eligible action. */
function HoldingBackTab({ issues }: { issues: LeakageCoverageIssue[] }) {
  return (
    <div className="space-y-5">
      {issues.length === 0 && <p className="text-[11.5px] text-ink-3">The server reported no coverage issues.</p>}
      {ISSUE_GROUPS.map((group) => {
        const groupIssues = issues.filter((issue) => issue.category === group.category);
        if (groupIssues.length === 0) return null;
        return (
          <div key={group.category}>
            <p className="text-[12.5px] font-semibold text-ink">
              {group.title} <span className="font-mono text-[10.5px] font-normal text-ink-4">{groupIssues.length}</span>
            </p>
            <p className="text-[11px] text-ink-3">{group.description}</p>
            <ul className="mt-2 divide-y divide-line rounded-panel border border-line">
              {groupIssues.map((issue, i) => (
                <IssueRow key={`${issue.code}-${issue.capabilityId ?? i}`} issue={issue} />
              ))}
            </ul>
          </div>
        );
      })}
    </div>
  );
}

function IssueRow({ issue }: { issue: LeakageCoverageIssue }) {
  const { action } = issue;
  return (
    <li className="space-y-1.5 p-3.5">
      <div className="flex flex-wrap items-baseline justify-between gap-x-3">
        <p className="text-[12.5px] font-medium text-ink">{issue.capabilityId ?? sentenceCase(issue.code)}</p>
        {issue.subjectType && (
          <p className="font-mono text-[10px] text-ink-4">
            {issue.subjectType}
            {issue.grain ? ` · ${issue.grain} grain` : ""}
          </p>
        )}
      </div>
      <p className="text-[11.5px] leading-relaxed text-ink-3">{issue.message}</p>
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

const RATIO_ROWS: { key: "capability" | "scope" | "freshness" | "quality"; label: string }[] = [
  { key: "capability", label: "Capability" },
  { key: "scope", label: "Scope" },
  { key: "freshness", label: "Freshness" },
  { key: "quality", label: "Quality" },
];

/** The four normalized ratios the page already carries (`coverage`), shown as bars. A ratio the server left null shows a dash. */
function RatiosTab({ coverage, explanation }: { coverage: LeakageV2CoverageSummary; explanation: string | undefined }) {
  return (
    <div className="space-y-5">
      <div>
        <p className="font-mono text-[10px] tracking-wide text-ink-4 uppercase">Effective coverage</p>
        <p className="mt-1 font-mono text-[26px] font-semibold text-ink">{percent(coverage.effective)}</p>
        {explanation && <p className="mt-2 text-[11.5px] leading-relaxed text-ink-3">{explanation}</p>}
      </div>

      <ul className="space-y-3.5">
        {RATIO_ROWS.map((row) => {
          const value = coverage[row.key];
          return (
            <li key={row.key}>
              <div className="flex items-baseline justify-between">
                <p className="text-[12.5px] font-medium text-ink">{row.label}</p>
                <p className="font-mono text-[12px] font-semibold text-ink">{percent(value)}</p>
              </div>
              <div
                role="meter"
                aria-label={`${row.label} ratio`}
                aria-valuemin={0}
                aria-valuemax={100}
                aria-valuenow={value == null ? undefined : Math.round(value * 100)}
                className="mt-1.5 h-1.5 overflow-hidden rounded-full bg-line"
              >
                <div className="h-full rounded-full bg-ultra" style={{ width: `${Math.round((value ?? 0) * 100)}%` }} />
              </div>
            </li>
          );
        })}
      </ul>

      <dl className="grid grid-cols-3 gap-3 rounded-panel border border-line bg-paper-2 p-3.5">
        <Stat label="Applicable signals" value={coverage.applicableSignals} />
        <Stat label="Measured" value={coverage.measuredSignals} />
        <Stat label="Declared only" value={coverage.declaredOnlySignals} />
      </dl>
      <p className="text-[10.5px] text-ink-4">
        {coverage.residualUnknownUnits.toLocaleString("en-US")} units remain unknown. Units are counted per subject and never added across subjects.
      </p>
    </div>
  );
}

function Stat({ label, value }: { label: string; value: number }) {
  return (
    <div>
      <dt className="text-[10.5px] text-ink-4">{label}</dt>
      <dd className="mt-0.5 font-mono text-[15px] font-semibold text-ink">{value}</dd>
    </div>
  );
}

const percent = (ratio: number | null) => (ratio == null ? "–" : `${(ratio * 100).toFixed(1)}%`);

/** Signals grouped by the thing they count, with the server's own unit counts. Counts are never added across subjects. */
function SignalsTab() {
  const { data, isLoading, isError, refetch } = useGetLeakageCoverage(true);
  const coverage = data?.data;

  if (isLoading) {
    return (
      <div className="space-y-2">
        {Array.from({ length: 6 }, (_, i) => (
          <Skeleton key={i} className="h-10 w-full" />
        ))}
      </div>
    );
  }
  if (isError || !coverage) {
    return (
      <div>
        <p className="text-[11.5px] text-rose">Couldn't load the signals.</p>
        <Button type="button" variant="outline" size="sm" className="mt-2" onClick={() => refetch()}>
          Retry
        </Button>
      </div>
    );
  }
  return <SignalsContent coverage={coverage} />;
}

function SignalsContent({ coverage }: { coverage: CoverageV2 }) {
  // Signals are grouped by what they count (`subject.unit`), in the order the server lists them.
  const groups: { unit: string; grain: string; signals: LeakageCoverageSignalEntry[] }[] = [];
  for (const signal of coverage.signals) {
    let group = groups.find((g) => g.unit === signal.subject.unit);
    if (!group) {
      group = { unit: signal.subject.unit, grain: signal.subject.grain, signals: [] };
      groups.push(group);
    }
    group.signals.push(signal);
  }

  return (
    <div className="space-y-3">
      <div className="overflow-x-auto rounded-card border border-line">
        <table className="w-full text-left text-[11.5px]">
          <thead>
            <tr className="border-b border-line bg-paper-2 text-[10px] text-ink-4">
              <th className="px-2 py-2 font-medium sm:px-3">Signal</th>
              <th className="hidden px-3 py-2 font-medium sm:table-cell">Status</th>
              {["Eligible", "Usable", "Unknown", "No join", "No value"].map((h) => (
                <th key={h} className="px-1.5 py-2 text-right font-medium sm:px-3">
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {groups.map((group) => {
              const subject = coverage.subjects.find((s) => s.subject.unit === group.unit);
              return <GroupRows key={group.unit} group={group} measurable={subject} />;
            })}
          </tbody>
        </table>
      </div>
      <p className="text-[10.5px] text-ink-4">
        Counts are per subject and never added across subjects. Policy {coverage.policyVersion}.
      </p>
    </div>
  );
}

/**
 * A group band (what the signals below count, its grain, and how many are measurable) followed by one row
 * per signal. Source and run outcome share one Status cell, and maturity moves under the name, so five
 * count columns fit without sideways scrolling.
 */
function GroupRows({
  group,
  measurable,
}: {
  group: { unit: string; grain: string; signals: LeakageCoverageSignalEntry[] };
  measurable: CoverageV2["subjects"][number] | undefined;
}) {
  return (
    <>
      {/* A small gap above each group, so the first group does not sit flush against the column headings. */}
      <tr aria-hidden>
        <td colSpan={7} className="h-3 border-t border-line p-0" />
      </tr>
      <tr className="border-y border-line bg-paper-2">
        <th colSpan={7} scope="colgroup" className="px-3 py-2.5 text-left">
          <span className="flex flex-wrap items-baseline justify-between gap-x-4 gap-y-0.5">
            <span className="flex items-baseline gap-2">
              <span className="flex items-center gap-2 text-[12.5px] font-semibold text-ink capitalize">
                <span className="size-1.5 rounded-full bg-ultra" aria-hidden />
                {group.unit}
              </span>
              <span className="font-mono text-[10px] font-normal text-ink-4">{group.grain} grain</span>
            </span>
            {measurable && (
              <span className="text-[10.5px] font-normal text-ink-3">
                <span className="font-mono font-semibold text-ink">{measurable.measurableSignalPopulationPairs}</span> of{" "}
                <span className="font-mono">{measurable.signalPopulationPairs}</span> measurable
              </span>
            )}
          </span>
        </th>
      </tr>
      {group.signals.map((s) => {
        const ran = s.runOutcome !== "NOT_RUN";
        const cell = (n: number) => (ran ? n.toLocaleString("en-US") : "–");
        return (
          <tr
            key={s.signalId}
            className={cn("border-t border-line", !ran && "bg-[repeating-linear-gradient(135deg,var(--color-paper-2)_0_6px,transparent_6px_12px)]")}
          >
            <td className="px-2 py-2.5 sm:px-3">
              <p className="font-medium text-ink">{sentenceCase(s.signalId)}</p>
              <p className="font-mono text-[9.5px] text-ink-4">{s.maturity}</p>
              <p className={cn("mt-0.5 text-[10.5px] sm:hidden", ran ? "text-teal" : "text-ink-3")}>
                {sentenceCase(s.runOutcome)} · {availabilityPhrase(s.sourceAvailability)}
              </p>
            </td>
            <td className="hidden px-3 py-2.5 sm:table-cell">
              <p className={cn("font-medium", ran ? "text-teal" : "text-ink-3")}>{sentenceCase(s.runOutcome)}</p>
              <p className="text-[10.5px] text-ink-3">{availabilityPhrase(s.sourceAvailability)}</p>
            </td>
            <td className="px-1.5 py-2.5 text-right font-mono text-ink sm:px-3">{cell(s.eligibleUnits)}</td>
            <td className="px-1.5 py-2.5 text-right font-mono text-ink sm:px-3">{cell(s.usableUnits)}</td>
            <td className={cn("px-1.5 py-2.5 text-right font-mono sm:px-3", ran && s.residualUnknownUnits > 0 ? "text-amber" : "text-ink")}>
              {cell(s.residualUnknownUnits)}
            </td>
            <td className="px-1.5 py-2.5 text-right font-mono text-ink sm:px-3">{cell(s.missingJoinUnits)}</td>
            <td className="px-1.5 py-2.5 text-right font-mono text-ink sm:px-3">{cell(s.missingValueUnits)}</td>
          </tr>
        );
      })}
    </>
  );
}
