import { Link } from "react-router-dom";

import { cn } from "@/lib/utils";
import { Sheet, SheetBody, SheetContent, SheetDescription, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import type {
  LeakageCoverageExplanation,
  LeakageCoverageIssue,
  LeakageCoverageIssueCategory,
} from "@/services/api/leakage/leakage-executive-types";
import { sentenceCase } from "@/pages/leakage-map/format";
import { PRIMARY_ACTION_CLASS } from "@/pages/leakage-map/drawer/shared";

const ISSUE_GROUPS: { category: LeakageCoverageIssueCategory; title: string; description: string }[] = [
  { category: "WORKSPACE_ACTION", title: "Workspace action", description: "Mapping, source connection or business-scope work" },
  { category: "WAITING_FOR_DATA", title: "Waiting for data", description: "Refresh or accumulate comparable history" },
  { category: "QUALITY", title: "Quality", description: "Repair incomplete or invalid mapped fields" },
  { category: "PERMISSION", title: "Permission", description: "Restore access to the required data" },
  { category: "PLATFORM_LIMITATION", title: "Platform limitation", description: "Reader or currency-policy support from the platform" },
];

interface CoverageIssuesDrawerProps {
  open: boolean;
  coverageExplanation: LeakageCoverageExplanation | undefined;
  onClose: () => void;
}

/**
 * What is holding coverage back: the server's `coverageExplanation.issues[]`, grouped by its own five
 * categories (the group names and one-line descriptions come from the handoff). An issue's button appears only
 * when its action is eligible, and goes to Data sources; otherwise the server's reason shows as plain text.
 */
export function CoverageIssuesDrawer({ open, coverageExplanation, onClose }: CoverageIssuesDrawerProps) {
  const issues = coverageExplanation?.issues ?? [];

  return (
    <Sheet open={open} onOpenChange={(next) => !next && onClose()}>
      <SheetContent className="sm:max-w-[46rem]">
        <SheetHeader className="gap-2">
          <p className="font-mono text-[10px] tracking-wide text-ink-3 uppercase">Coverage</p>
          <SheetTitle className="text-[18px]">What's holding coverage back</SheetTitle>
          <SheetDescription>
            {issues.length} {issues.length === 1 ? "issue" : "issues"}
            {coverageExplanation ? ` · ${coverageExplanation.headline}` : ""}
          </SheetDescription>
        </SheetHeader>

        <SheetBody className="space-y-5 px-5 py-5">
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
        </SheetBody>
      </SheetContent>
    </Sheet>
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
