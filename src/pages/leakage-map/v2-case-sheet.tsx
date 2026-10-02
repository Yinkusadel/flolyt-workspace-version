import { useState } from "react";
import { Link } from "react-router-dom";

import { Button } from "@/components/ui/button";
import { Chip, type ChipTone } from "@/components/ui/chip";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { SheetBody, SheetDescription, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";
import { formatShortDateWithYear } from "@/lib/format-measured-value";
import { humanizeEnum } from "@/pages/leakage-map/v2-filters";
import useGetCurrentUser from "@/features/auth/use-get-current-user";
import { useAddLeakageCaseDecision } from "@/features/leakage/use-add-leakage-case-decision";
import { useGetLeakageCase } from "@/features/leakage/use-get-leakage-case";
import { useOpenRoomOnLeakageCase } from "@/features/leakage/use-open-room-on-leakage-case";
import { useTransitionLeakageCase } from "@/features/leakage/use-transition-leakage-case";
import { useUpdateLeakageCaseDueDate } from "@/features/leakage/use-update-leakage-case-due-date";
import { useUpdateLeakageCaseOwner } from "@/features/leakage/use-update-leakage-case-owner";
import { toRoomLifecycleClass, toRoomMode } from "@/services/api/leakage/open-room-on-leakage-case";
import type { RevenueLeakCaseStatus } from "@/services/api/leakage/leakage-case-types";
import type { LeakageV2Cell } from "@/services/api/leakage/get-leakage";

const ALL_STATUSES: RevenueLeakCaseStatus[] = [
  "DETECTED",
  "REVIEWED",
  "ASSIGNED",
  "WORKED",
  "RESOLVED",
  "VERIFIED",
  "CLOSED",
  "INVALIDATED",
];
// "The client must never submit VERIFIED" — the existing outcome-verification job is the only
// thing that ever sets it (same rule `transition-leakage-case.ts`'s own type enforces).
const TRANSITIONABLE_STATUSES = ALL_STATUSES.filter((s): s is Exclude<RevenueLeakCaseStatus, "VERIFIED"> => s !== "VERIFIED");

/** Workflow-position tones for `RevenueLeakCaseStatus`, shared with `CaseInfo` in the cell-detail
 * dialog so the same status always reads the same color wherever it's shown: untouched/no-commitment
 * states read neutral, active ownership reads ultra, a positive outcome reads teal, a dead-end reads
 * rose. Previously every status rendered as a flat neutral Chip regardless of value. */
export const CASE_STATUS_TONE: Record<RevenueLeakCaseStatus, ChipTone> = {
  DETECTED: "amber",
  REVIEWED: "neutral",
  ASSIGNED: "ultra",
  WORKED: "ultra",
  RESOLVED: "teal",
  VERIFIED: "teal",
  CLOSED: "neutral",
  INVALIDATED: "rose",
};

// Confirmed live 2026-10-02: the server refused `dueAtUtc` set to a date already in the past
// ("A revised due date must be in the future") — the native date input let that get picked and
// submitted with no warning first. `min`/`max` mirror the doc's own "sets a future date within
// 365 days" rule, computed once at module load (good enough at day precision for how long a Sheet
// stays open). A styled Calendar+Popover replacement was tried and reverted 2026-10-02 — it broke
// (Radix `Select`, used for the month/year jump, is modal by default and closed the parent Popover
// before a selection could be made) — back to the plain native date input until that's solved properly.
function isoDateDaysFromNow(days: number): string {
  const d = new Date();
  d.setDate(d.getDate() + days);
  return d.toISOString().slice(0, 10);
}
const MIN_DUE_DATE = isoDateDaysFromNow(1);
const MAX_DUE_DATE = isoDateDaysFromNow(365);

const TEXTAREA_CLASS =
  "mt-1 w-full resize-none rounded-panel border border-border bg-paper-2 px-2.5 py-2 text-[11.5px] text-ink outline-none placeholder:text-ink-4 hover:border-ink-4 focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50";

function SectionLabel({ children }: { children: React.ReactNode }) {
  return <p className="font-mono text-[9.5px] font-medium tracking-[0.6px] text-ink-4 uppercase">{children}</p>;
}

/** Small sentence-case label over a single field or stat — lighter-weight than `SectionLabel`,
 * which marks a whole card. */
function FieldLabel({ children, className }: { children: React.ReactNode; className?: string }) {
  return <p className={cn("mb-1 text-[10.5px] font-medium text-ink-4", className)}>{children}</p>;
}

/** The consistent contained-card treatment for every actionable section below the status summary —
 * replaces the plain `border-t` dividers the individual sections used to sit under, so the forms
 * read as distinct units in a sheet that's otherwise all stacked text. */
function ActionCard({ children }: { children: React.ReactNode }) {
  return <div className="rounded-panel border border-line bg-paper-2 p-3.5">{children}</div>;
}

function CaseSheetSkeleton() {
  return (
    <div className="space-y-2.5">
      <Skeleton className="h-5 w-24" />
      <Skeleton className="h-3 w-full" />
      <Skeleton className="h-3 w-3/4" />
    </div>
  );
}

/**
 * The case's full lifecycle surface — pulled out of the quick cell-detail Dialog into its own
 * Sheet (2026-10-02, same reasoning as Evidence: 5 separate mutations plus a decision log and
 * forms don't fit a centered modal). No member picker for owner assignment — the doc says "a
 * non-admin can assign only themselves," so this only offers "Assign to me," not a full picker;
 * an admin's broader reassignment would need a workspace-members endpoint this page doesn't have.
 * No status-transition graph is enforced client-side either — every non-VERIFIED status is offered
 * and the server is the source of truth for which transitions are actually legal from the current
 * one, same "let the real response surface the rule" discipline as everywhere else in this build.
 * Room-opening reuses the cell's own primary amount to supply currency/lifecycleClass/mode, per
 * the doc's "supply enough dimensions to select exactly one amount." None of this has been
 * live-verified yet.
 *
 * Redesigned 2026-10-02: status Chip now carries a real tone per `CASE_STATUS_TONE` instead of a
 * flat neutral; the summary card and each action section got a consistent contained-card treatment
 * and real field labels. Same sections, same order, same mutations as before — restyle only.
 */
export function V2CaseSheetContent({ caseId, cell }: { caseId: string; cell: LeakageV2Cell }) {
  const { data, isLoading, isError, refetch } = useGetLeakageCase(caseId);
  const { user } = useGetCurrentUser(true);
  const leakCase = data?.data;
  const primaryAmount = cell.amounts[0];

  const { mutate: updateOwner, isPending: isUpdatingOwner } = useUpdateLeakageCaseOwner();
  const { mutate: transition, isPending: isTransitioning } = useTransitionLeakageCase();
  const { mutate: updateDueDate, isPending: isUpdatingDueDate } = useUpdateLeakageCaseDueDate();
  const { mutate: addDecision, isPending: isAddingDecision } = useAddLeakageCaseDecision();
  const { mutate: openRoom, isPending: isOpeningRoom } = useOpenRoomOnLeakageCase();

  const [dueDate, setDueDate] = useState("");
  const [dueDateReason, setDueDateReason] = useState("");
  const [decisionText, setDecisionText] = useState("");
  const [decisionReason, setDecisionReason] = useState("");
  const [transitionTarget, setTransitionTarget] = useState<Exclude<RevenueLeakCaseStatus, "VERIFIED"> | "">("");
  const [transitionReason, setTransitionReason] = useState("");
  const [evidenceRefsText, setEvidenceRefsText] = useState("");

  const isDueDateValid = dueDate >= MIN_DUE_DATE && dueDate <= MAX_DUE_DATE;

  return (
    <>
      <SheetHeader>
        <SheetTitle>{cell.coordinate.mechanismLabel}</SheetTitle>
        <SheetDescription>
          {cell.coordinate.revenueStageLabel} · Case
        </SheetDescription>
      </SheetHeader>

      <SheetBody className="px-5 py-5">
        {isLoading && <CaseSheetSkeleton />}

        {!isLoading && (isError || !leakCase) && (
          <div>
            <p className="text-[11.5px] text-rose">Couldn't load this case.</p>
            <Button type="button" variant="outline" size="sm" className="mt-2" onClick={() => refetch()}>
              Retry
            </Button>
          </div>
        )}

        {leakCase && (
          <div className="space-y-4">
            <div
              className={cn(
                "rounded-panel border p-4",
                leakCase.isOverdue ? "border-rose-border bg-rose-bg/40" : "border-line bg-paper-2"
              )}
            >
              <div className="flex items-center gap-2">
                <Chip tone={CASE_STATUS_TONE[leakCase.status]}>{humanizeEnum(leakCase.status)}</Chip>
                {leakCase.isOverdue && <Chip tone="rose">Overdue</Chip>}
              </div>
              <div className="mt-3.5 grid grid-cols-2 gap-3 border-t border-line/70 pt-3.5">
                <div>
                  <FieldLabel>Owner</FieldLabel>
                  <p className="text-[12px] font-medium text-ink-2">{leakCase.ownerUserId ?? "Unassigned"}</p>
                  {leakCase.ownerUserId !== user?.id && (
                    <button
                      type="button"
                      disabled={isUpdatingOwner || !user}
                      onClick={() => user && updateOwner({ caseId, ownerUserId: user.id, reason: "Self-assigned" })}
                      className="mt-1 text-[11px] font-medium text-ultra hover:underline disabled:opacity-60"
                    >
                      {isUpdatingOwner ? "Assigning…" : "Assign to me"}
                    </button>
                  )}
                </div>
                <div>
                  <FieldLabel>Due</FieldLabel>
                  <p className={cn("text-[12px] font-medium", leakCase.isOverdue ? "text-rose" : "text-ink-2")}>
                    {formatShortDateWithYear(leakCase.dueAtUtc)}
                  </p>
                </div>
              </div>
            </div>

            <ActionCard>
              <SectionLabel>Change due date</SectionLabel>
              <div className="mt-2.5 grid grid-cols-2 gap-2.5">
                <div>
                  <FieldLabel>New date</FieldLabel>
                  <Input
                    type="date"
                    value={dueDate}
                    min={MIN_DUE_DATE}
                    max={MAX_DUE_DATE}
                    onChange={(e) => setDueDate(e.currentTarget.value)}
                    className="w-full"
                  />
                </div>
                <div>
                  <FieldLabel>Reason</FieldLabel>
                  <Input placeholder="Why it's moving" value={dueDateReason} onChange={(e) => setDueDateReason(e.currentTarget.value)} />
                </div>
              </div>
              <Button
                type="button"
                size="sm"
                variant="default"
                className="mt-3 w-full"
                disabled={!dueDate || !isDueDateValid || !dueDateReason.trim() || isUpdatingDueDate}
                onClick={() =>
                  updateDueDate(
                    { caseId, dueAtUtc: new Date(dueDate).toISOString(), reason: dueDateReason },
                    { onSuccess: () => { setDueDate(""); setDueDateReason(""); } }
                  )
                }
              >
                {isUpdatingDueDate ? "Updating…" : "Update due date"}
              </Button>
            </ActionCard>

            <ActionCard>
              <SectionLabel>Move status</SectionLabel>
              <div className="mt-2.5 space-y-2.5">
                <div>
                  <FieldLabel>New status</FieldLabel>
                  <Select value={transitionTarget} onValueChange={(v) => setTransitionTarget(v as Exclude<RevenueLeakCaseStatus, "VERIFIED">)}>
                    <SelectTrigger>
                      <SelectValue placeholder="Choose a status" />
                    </SelectTrigger>
                    <SelectContent>
                      {TRANSITIONABLE_STATUSES.filter((s) => s !== leakCase.status).map((s) => (
                        <SelectItem key={s} value={s}>
                          {humanizeEnum(s)}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <FieldLabel>Reason</FieldLabel>
                  <textarea
                    rows={2}
                    placeholder="Reason for this move"
                    value={transitionReason}
                    onChange={(e) => setTransitionReason(e.currentTarget.value)}
                    className={TEXTAREA_CLASS}
                  />
                </div>
                {transitionTarget === "RESOLVED" && (
                  <div>
                    <FieldLabel>Evidence references</FieldLabel>
                    <Input
                      placeholder="Comma separated — resolving requires evidence"
                      value={evidenceRefsText}
                      onChange={(e) => setEvidenceRefsText(e.currentTarget.value)}
                    />
                  </div>
                )}
              </div>
              <Button
                type="button"
                size="sm"
                variant="default"
                className="mt-3 w-full"
                disabled={!transitionTarget || !transitionReason.trim() || isTransitioning}
                onClick={() => {
                  if (!transitionTarget) return;
                  transition(
                    {
                      caseId,
                      target: transitionTarget,
                      reason: transitionReason,
                      evidenceReferences: evidenceRefsText
                        .split(",")
                        .map((s) => s.trim())
                        .filter(Boolean),
                    },
                    { onSuccess: () => { setTransitionTarget(""); setTransitionReason(""); setEvidenceRefsText(""); } }
                  );
                }}
              >
                {isTransitioning ? "Moving…" : "Move case"}
              </Button>
            </ActionCard>

            <ActionCard>
              <SectionLabel>Decisions ({leakCase.decisions.length})</SectionLabel>
              {leakCase.decisions.length > 0 && (
                <div className="mt-2.5 space-y-2">
                  {leakCase.decisions.map((d) => (
                    <div key={d.id} className="rounded-control border border-line bg-paper p-2.5">
                      <p className="text-[11.5px] text-ink-2">{d.decision}</p>
                      <p className="mt-1 text-[10px] text-ink-4">
                        {d.reason} · {formatShortDateWithYear(d.occurredAtUtc)}
                      </p>
                    </div>
                  ))}
                </div>
              )}
              <div className={cn("space-y-2.5", leakCase.decisions.length > 0 && "mt-3 border-t border-line/70 pt-3")}>
                <div>
                  <FieldLabel>Decision</FieldLabel>
                  <Input placeholder="What was decided" value={decisionText} onChange={(e) => setDecisionText(e.currentTarget.value)} />
                </div>
                <div>
                  <FieldLabel>Reason</FieldLabel>
                  <textarea
                    rows={2}
                    placeholder="Why"
                    value={decisionReason}
                    onChange={(e) => setDecisionReason(e.currentTarget.value)}
                    className={TEXTAREA_CLASS}
                  />
                </div>
              </div>
              <Button
                type="button"
                size="sm"
                variant="default"
                className="mt-3 w-full"
                disabled={!decisionText.trim() || !decisionReason.trim() || isAddingDecision}
                onClick={() =>
                  addDecision(
                    { caseId, decision: decisionText, reason: decisionReason },
                    { onSuccess: () => { setDecisionText(""); setDecisionReason(""); } }
                  )
                }
              >
                {isAddingDecision ? "Recording…" : "Add decision"}
              </Button>
            </ActionCard>

            <ActionCard>
              <SectionLabel>Room</SectionLabel>
              {leakCase.roomId ? (
                <Button asChild type="button" size="sm" variant="outline" className="mt-2.5 w-full">
                  <Link to={`/rooms/${leakCase.roomId}`}>Go to room</Link>
                </Button>
              ) : primaryAmount ? (
                <Button
                  type="button"
                  size="sm"
                  variant="default"
                  className="mt-2.5 w-full"
                  disabled={isOpeningRoom}
                  onClick={() =>
                    openRoom({
                      caseId,
                      currency: primaryAmount.currency,
                      market: primaryAmount.market,
                      lifecycleClass: toRoomLifecycleClass(primaryAmount.lifecycleClass),
                      mode: toRoomMode(primaryAmount.mode),
                      title: cell.coordinate.mechanismLabel,
                    })
                  }
                >
                  {isOpeningRoom ? "Starting…" : "Start a room"}
                </Button>
              ) : (
                <p className="mt-2.5 text-[11px] text-ink-4">No priced amount to scope a Room to.</p>
              )}
            </ActionCard>
          </div>
        )}
      </SheetBody>
    </>
  );
}
