import { useNavigate } from "react-router-dom";
import { Calendar, ClipboardList, HelpCircle, User } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Chip, type ChipTone } from "@/components/ui/chip";
import { DialogBody, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";
import { formatCompactMoney, formatCount, formatPercent, formatRelativeTime, formatShortDateWithYear } from "@/lib/format-measured-value";
import { humanizeEnum } from "@/pages/leakage-map/v2-filters";
import { CASE_STATUS_TONE, FieldLabel, resolveOwnerName } from "@/pages/leakage-map/v2-case-sheet";
import { useCreateLeakageCase } from "@/features/leakage/use-create-leakage-case";
import useGetWorkspaceMembers from "@/features/workspace/use-get-workspace-members";
import { useGetLeakageCase } from "@/features/leakage/use-get-leakage-case";
import { useGetLeakageCellV2 } from "@/features/leakage/use-get-leakage-cell-v2";
import { useLearnWhyLeakageCellV2 } from "@/features/leakage/use-learn-why-leakage-cell-v2";
import type { GetLeakageCellV2Params, LeakageV2WorkState } from "@/services/api/leakage/get-leakage-cell-v2";
import type { RevenueLeakCase } from "@/services/api/leakage/leakage-case-types";
import type { LeakageV2Amount, LeakageV2Cell } from "@/services/api/leakage/get-leakage";

function DetailSkeleton() {
  return (
    <div className="space-y-2.5">
      <Skeleton className="h-3 w-32" />
      <Skeleton className="h-6 w-40" />
      <Skeleton className="h-3 w-full" />
      <Skeleton className="h-3 w-3/4" />
    </div>
  );
}

function SectionLabel({ children }: { children: React.ReactNode }) {
  return <p className="font-mono text-[9.5px] font-medium tracking-[0.6px] text-ink-4 uppercase">{children}</p>;
}

/** How many rows this quick-glance dialog shows per list before collapsing the rest behind
 * "View full evidence" — a real response can carry 900+ detector signals, which this narrow
 * centered Dialog was never meant to hold in full (that's what the Evidence Sheet is for). No
 * sort applied beyond whatever order the API already returns — inventing a ranking (e.g. by
 * confidence) for signals wasn't backed by anything the doc actually promises. */
const LIST_PREVIEW_LIMIT = 5;

/** Points at the exact same data in full, never a dead end — `onViewEvidence` opens
 * `V2CellEvidenceSheetContent`, which renders every one of these same components/signals
 * unbounded. */
function MoreInEvidenceLink({ count, onViewEvidence }: { count: number; onViewEvidence: () => void }) {
  return (
    <button type="button" onClick={onViewEvidence} className="text-[11px] font-medium text-ultra hover:underline">
      +{count} more — View full evidence
    </button>
  );
}

/** S1-S2 reads neutral, S3 amber, S4-S5 rose — same coarse three-step read as the grid tile's own
 * `HEAT_SCALE` bucketing (`heatBucketForSeverity` in `v2-cell-grid.tsx`), reimplemented locally
 * rather than imported from there to avoid a circular import (that file already imports this one). */
function severityTone(severity: string): ChipTone {
  const level = Number(severity.replace(/\D/g, ""));
  if (!level || level <= 2) return "neutral";
  if (level === 3) return "amber";
  return "rose";
}

function hasPricedRange(amount: LeakageV2Amount): boolean {
  return amount.range.status !== "UNAVAILABLE" && amount.range.lower !== null && amount.range.upper !== null;
}

/**
 * The dialog's own headline figure(s) — previously this quick-glance view never showed the actual
 * dollar amount at all, jumping straight from the title into "As of…" and the Case card, even
 * though the figure is the entire point of a revenue-leak finding. Added 2026-10-02 as part of a
 * visual pass on this dialog; reuses `cell.amounts` (already in scope for `hasLeakToExplain`/
 * `canOpenCase` below, just never rendered), one row per amount since a cell can carry more than
 * one (e.g. multiple currencies) — never collapses to just `amounts[0]` the way the gating logic
 * does, since that's a convenience shortcut for "is there anything to act on," not a reason to hide
 * the rest from view here.
 */
function HeroAmounts({ amounts, asOfUtc }: { amounts: LeakageV2Amount[]; asOfUtc: string }) {
  return (
    <div className="space-y-3">
      {amounts.length > 0 ? (
        amounts.map((amount, i) => (
          <div key={i} className="flex items-start justify-between gap-4">
            <div className="min-w-0">
              <p className="text-[22px] font-semibold tabular-nums text-ink">
                {formatCompactMoney(amount.value, amount.currency)}
              </p>
              <p className="mt-0.5 text-[11px] text-ink-4">
                {humanizeEnum(amount.lifecycleClass)}
                {hasPricedRange(amount) && (
                  <>
                    {" · "}
                    {formatCompactMoney(amount.range.lower!, amount.currency)}–
                    {formatCompactMoney(amount.range.upper!, amount.currency)}
                  </>
                )}
              </p>
            </div>
            <div className="flex shrink-0 items-center gap-1.5">
              <Chip tone={severityTone(amount.severity)}>Severity {amount.severity}</Chip>
              <Chip tone="neutral">{formatPercent(amount.confidence)} confidence</Chip>
            </div>
          </div>
        ))
      ) : (
        <p className="text-[13px] font-medium text-ink-3">No exposure</p>
      )}
      <p className="text-[10.5px] text-ink-4">As of {formatRelativeTime(asOfUtc)}</p>
    </div>
  );
}

/**
 * The case's own info, no lifecycle actions — moved up near the top on request (2026-10-02) so it
 * reads alongside the figure itself rather than buried under components/signals/lineage, and given
 * a real nested-card treatment (same `bg-paper-2` pattern V1's own `CoveragePanel` and the Rollups
 * grid already use) instead of plain stacked text. "Open a case" still lives in the dialog's
 * footer (see `V2CellDetailDialogContent`). Once a case exists, "View case" opens the full
 * `V2CaseSheetContent` — owner/due-date/transitions/decisions/room all live there, not here.
 *
 * Redesigned 2026-10-02: now a compact version of the full Case Sheet's own hero card (same
 * `FieldLabel` stat treatment for owner/due, overdue state tints the card) instead of plain stacked
 * grey text, and "View case" is a real outline Button instead of a bare text link — it opens the
 * exact same lifecycle surface (`V2CaseSheetContent`) so it should read as a real affordance, not a
 * footnote. Same fields, same data, restyle only.
 *
 * Owner updated 2026-10-02: resolves the raw `ownerUserId` to a real display name via
 * `resolveOwnerName` (`GET /workspace/members`), same lookup the full Case Sheet uses, so this
 * preview and the Sheet never show a different owner value.
 *
 * Exported 2026-10-02 so `V2CellEvidenceSheetContent` can reuse the exact same card — that Sheet
 * previously had its own bottom-of-page "Case status" section that was just plain text
 * (`workState.explanation`), inconsistent with this dialog's richer treatment of the same data for
 * the same cell. One component, two call sites, never two implementations of "what a case preview
 * looks like."
 */
export function CaseInfo({
  workState,
  leakCase,
  isLoadingCase,
  onViewCase,
}: {
  workState: LeakageV2WorkState;
  leakCase?: RevenueLeakCase;
  isLoadingCase: boolean;
  onViewCase: (caseId: string) => void;
}) {
  const { members } = useGetWorkspaceMembers();

  return (
    <div className="border-t border-line pt-4">
      <SectionLabel>Case</SectionLabel>
      <div
        className={cn(
          "mt-2 rounded-control border p-3",
          leakCase?.isOverdue ? "border-rose-border bg-rose-bg/40" : "border-line bg-paper-2"
        )}
      >
        {workState.revenueLeakCaseId && isLoadingCase && <Skeleton className="h-4 w-24" />}
        {workState.revenueLeakCaseId && leakCase ? (
          <div>
            <div className="flex items-center gap-2">
              <Chip tone={CASE_STATUS_TONE[leakCase.status]}>{humanizeEnum(leakCase.status)}</Chip>
              {leakCase.isOverdue && <Chip tone="rose">Overdue</Chip>}
            </div>
            <div className="mt-3 grid grid-cols-2 gap-3 border-t border-line/70 pt-3">
              <div>
                <div className="flex items-center gap-1 text-ink-4">
                  <User className="size-3" />
                  <FieldLabel className="mb-0">Owner</FieldLabel>
                </div>
                <p className="mt-1 text-[11.5px] font-medium text-ink-2">{resolveOwnerName(members, leakCase.ownerUserId)}</p>
              </div>
              <div>
                <div className={cn("flex items-center gap-1", leakCase.isOverdue ? "text-rose" : "text-ink-4")}>
                  <Calendar className="size-3" />
                  <FieldLabel className={cn("mb-0", leakCase.isOverdue && "text-rose")}>Due</FieldLabel>
                </div>
                <p className={cn("mt-1 text-[11.5px] font-medium", leakCase.isOverdue ? "text-rose" : "text-ink-2")}>
                  {formatShortDateWithYear(leakCase.dueAtUtc)}
                </p>
              </div>
            </div>
            {leakCase.decisions.length > 0 && (
              <div className="mt-2.5 flex items-center gap-1.5 border-t border-line/70 pt-2.5 text-[10.5px] text-ink-4">
                <ClipboardList className="size-3 shrink-0" />
                <span>
                  {leakCase.decisions.length} decision{leakCase.decisions.length === 1 ? "" : "s"} logged
                </span>
              </div>
            )}
            <Button type="button" size="sm" variant="outline" className="mt-3 w-full" onClick={() => onViewCase(leakCase.id)}>
              View case
            </Button>
          </div>
        ) : (
          !workState.revenueLeakCaseId && <p className="text-[11.5px] text-ink-3">{workState.explanation}</p>
        )}
      </div>
    </div>
  );
}

/**
 * The cell-detail dialog's content — a quick-glance view, restored 2026-10-02 alongside the fuller
 * `V2CellEvidenceSheetContent` (which briefly replaced it outright, since Evidence is a strict
 * superset). Kept separate on request: this one's a fast, narrow modal for `components`/`signals`/
 * `lineage`/`workState`; "View full evidence" switches to the Sheet for the wider stuff (coverage,
 * calculation, suggested actions). "Learn why" starts `POST /cells/{cellId}/learn-why`, same
 * fire-and-navigate pattern V1's own `CellDetailCard` already uses — the mutation's result is just
 * a `conversationId`/`runId` pointer; the actual SSE streaming, reconnect, and answer rendering all
 * happen on the existing `/conversations/{id}` route, not rebuilt here. Case handling off
 * `workState`: `revenueLeakCaseId` present means an existing case's live status is fetched and
 * shown (`CaseInfo`, near the top); otherwise `state === "READY"` offers "Open a case" in the
 * footer, `"UNREADY"` shows only the gate's own explanation. `cell`/`evidence` requests use the
 * same lazy-fetch-on-open convention as V1's `CellDetailCard` too. Not yet live-verified against a
 * real response, unlike the main page — this is the furthest-scaffolded, least-tested part of V2
 * so far.
 */
export function V2CellDetailDialogContent({
  cell,
  params,
  onViewEvidence,
  onViewCase,
}: {
  cell: LeakageV2Cell;
  params: Omit<GetLeakageCellV2Params, "cellId">;
  onViewEvidence: () => void;
  onViewCase: (caseId: string) => void;
}) {
  const navigate = useNavigate();
  const { data, isLoading, isError, refetch } = useGetLeakageCellV2({ cellId: cell.id, ...params });
  const { mutate: learnWhy, isPending: isAskingWhy } = useLearnWhyLeakageCellV2();
  const detail = data?.data;

  const caseId = detail?.workState.revenueLeakCaseId ?? undefined;
  const { data: caseData, isLoading: isLoadingCase } = useGetLeakageCase(caseId, !!caseId);
  const { mutate: createCase, isPending: isCreatingCase } = useCreateLeakageCase();

  // Mirrors V1's own two-refusal gate (docs/endpoints/leakage.md's learn-why section): "a gap is
  // not a question" (nothing measured) and "a real zero is a result, not a gap" (measured but
  // nothing to explain). V2's handoff doc doesn't restate this rule for the V2 route explicitly,
  // but the same logic applies to the same kind of figure — inferred by analogy, not copied from
  // doc text, so revisit if a real response disagrees.
  const primaryAmount = cell.amounts[0];
  const hasLeakToExplain = cell.state.display === "POPULATED" && !!primaryAmount && primaryAmount.value > 0;
  // `workState.state === "READY"` alone isn't sufficient — confirmed live 2026-10-02, the server
  // refused a READY-but-not-populated cell with "A case can only be opened for a populated finding
  // with measured exposure." Gated on the same `hasLeakToExplain` check Learn Why already uses,
  // since it's the same underlying requirement (a real, measured figure to act on).
  const canOpenCase = hasLeakToExplain && !!detail && !detail.workState.revenueLeakCaseId && detail.workState.state === "READY";

  return (
    <>
      <DialogHeader>
        <DialogTitle>{cell.coordinate.mechanismLabel}</DialogTitle>
        <DialogDescription>
          {cell.coordinate.revenueStageLabel} · {cell.coordinate.stateDimensionLabel}: {cell.coordinate.stateValueLabel}
        </DialogDescription>
      </DialogHeader>
      <DialogBody className="px-5 py-5 sm:px-7 sm:py-6">
        {isLoading && <DetailSkeleton />}

        {!isLoading && (isError || !detail) && (
          <div>
            <p className="text-[11.5px] text-rose">Couldn't load this cell's detail.</p>
            <Button type="button" variant="outline" size="sm" className="mt-2" onClick={() => refetch()}>
              Retry
            </Button>
          </div>
        )}

        {detail && (
          <div className="space-y-5">
            <HeroAmounts amounts={cell.amounts} asOfUtc={detail.publication.asOfUtc} />

            <CaseInfo workState={detail.workState} leakCase={caseData?.data} isLoadingCase={isLoadingCase} onViewCase={onViewCase} />

            {detail.components.length > 0 && (
              <div className="border-t border-line pt-4">
                <SectionLabel>
                  Contributing candidates ({detail.components.length})
                </SectionLabel>
                <div className="mt-2 divide-y divide-line/70">
                  {detail.components.slice(0, LIST_PREVIEW_LIMIT).map((component) => (
                    <div key={component.candidateId} className="flex items-baseline justify-between gap-3 py-2 first:pt-0">
                      <span className="text-[11.5px] text-ink-2">
                        {humanizeEnum(component.mechanism)} · {humanizeEnum(component.revenueStage)}
                      </span>
                      <span className="text-right">
                        <p className="text-[12px] font-semibold text-ink tabular-nums">
                          {formatCompactMoney(component.amount.value, component.amount.currency)}
                        </p>
                        <p className="text-[10px] text-ink-4">{humanizeEnum(component.lifecycleClass)}</p>
                      </span>
                    </div>
                  ))}
                  {detail.components.length > LIST_PREVIEW_LIMIT && (
                    <div className="pt-2">
                      <MoreInEvidenceLink count={detail.components.length - LIST_PREVIEW_LIMIT} onViewEvidence={onViewEvidence} />
                    </div>
                  )}
                </div>
              </div>
            )}

            {detail.signals.length > 0 && (
              <div className="border-t border-line pt-4">
                <SectionLabel>Detector signals ({detail.signals.length})</SectionLabel>
                <div className="mt-2 divide-y divide-line/70">
                  {detail.signals.slice(0, LIST_PREVIEW_LIMIT).map((signal) => (
                    <div key={signal.id} className="py-2.5 first:pt-0">
                      <div className="flex items-baseline justify-between gap-3">
                        <span className="text-[11.5px] text-ink-2">{signal.signalId}</span>
                        <span className="text-[11.5px] font-medium text-ink tabular-nums">{formatCount(signal.signalValue)}</span>
                      </div>
                      <p className="mt-0.5 text-[10px] text-ink-4">
                        {formatShortDateWithYear(signal.observationFromUtc)} – {formatShortDateWithYear(signal.observationToUtc)} ·{" "}
                        {formatPercent(signal.confidence)} confidence · {signal.detectorVersion}
                      </p>
                    </div>
                  ))}
                  {detail.signals.length > LIST_PREVIEW_LIMIT && (
                    <div className="pt-2.5">
                      <MoreInEvidenceLink count={detail.signals.length - LIST_PREVIEW_LIMIT} onViewEvidence={onViewEvidence} />
                    </div>
                  )}
                </div>
              </div>
            )}

            {detail.lineage.length > 0 && (
              <div className="border-t border-line pt-4">
                <SectionLabel>Source lineage ({detail.lineage.length})</SectionLabel>
                <div className="mt-2 divide-y divide-line/70">
                  {detail.lineage.map((entry, i) => (
                    <div key={`${entry.signalId}-${i}`} className="py-2.5 first:pt-0">
                      <div className="flex items-baseline justify-between gap-3">
                        <span className="text-[11.5px] text-ink-2">{entry.signalId}</span>
                        <span className="text-[11px] text-ink-4">{humanizeEnum(entry.sourceAvailability)}</span>
                      </div>
                      {entry.actions.length > 0 && (
                        <p className="mt-0.5 text-[10.5px] text-ink-4">{entry.actions.map((a) => a.label).join(" · ")}</p>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}
      </DialogBody>
      <DialogFooter>
        <div className="flex w-full flex-wrap items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            {hasLeakToExplain && (
              <Button
                type="button"
                size="sm"
                variant="outline"
                disabled={isAskingWhy}
                onClick={() =>
                  learnWhy({ cellId: cell.id, ...params }, { onSuccess: (res) => navigate(`/conversations/${res.data.conversationId}`) })
                }
              >
                <HelpCircle data-icon="inline-start" />
                {isAskingWhy ? "Asking…" : "Learn why"}
              </Button>
            )}
            {canOpenCase && (
              <Button
                type="button"
                size="sm"
                variant="outline"
                disabled={isCreatingCase}
                onClick={() => createCase({ cellId: cell.id, dueAtUtc: null })}
              >
                {isCreatingCase ? "Opening…" : "Open a case"}
              </Button>
            )}
          </div>
          <Button type="button" variant="outline" size="sm" onClick={onViewEvidence} disabled={!detail}>
            View full evidence
          </Button>
        </div>
      </DialogFooter>
    </>
  );
}
