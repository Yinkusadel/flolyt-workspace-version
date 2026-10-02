import { useState } from "react";
import { Link } from "react-router-dom";

import { Button } from "@/components/ui/button";
import { Chip } from "@/components/ui/chip";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { SheetBody, SheetDescription, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { Skeleton } from "@/components/ui/skeleton";
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
  "mt-1.5 w-full resize-none rounded-panel border border-line bg-paper px-3.5 py-2.5 text-[11.5px] text-ink outline-none focus:border-ultra-border";

function SectionLabel({ children }: { children: React.ReactNode }) {
  return <p className="font-mono text-[9.5px] font-medium tracking-[0.6px] text-ink-4 uppercase">{children}</p>;
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
          <div className="space-y-5">
            <div className="space-y-2 rounded-control border border-line bg-paper-2 p-3">
              <div className="flex items-center justify-between gap-2">
                <div className="flex items-center gap-2">
                  <Chip tone="neutral">{humanizeEnum(leakCase.status)}</Chip>
                  {leakCase.isOverdue && <Chip tone="rose">Overdue</Chip>}
                </div>
              </div>
              <div className="flex items-center justify-between gap-2 text-[11.5px]">
                <span className="text-ink-4">Owner</span>
                <div className="flex items-center gap-2">
                  <span className="text-ink-2">{leakCase.ownerUserId ?? "Unassigned"}</span>
                  {leakCase.ownerUserId !== user?.id && (
                    <button
                      type="button"
                      disabled={isUpdatingOwner || !user}
                      onClick={() => user && updateOwner({ caseId, ownerUserId: user.id, reason: "Self-assigned" })}
                      className="font-medium text-ultra hover:underline disabled:opacity-60"
                    >
                      {isUpdatingOwner ? "Assigning…" : "Assign to me"}
                    </button>
                  )}
                </div>
              </div>
              <div className="flex items-center justify-between gap-2 text-[11.5px]">
                <span className="text-ink-4">Due</span>
                <span className="text-ink-2">{formatShortDateWithYear(leakCase.dueAtUtc)}</span>
              </div>
            </div>

            <div className="border-t border-line pt-4">
              <SectionLabel>Change due date</SectionLabel>
              <div className="mt-2 flex flex-col gap-2">
                <div className="flex gap-2">
                  <Input
                    type="date"
                    value={dueDate}
                    min={MIN_DUE_DATE}
                    max={MAX_DUE_DATE}
                    onChange={(e) => setDueDate(e.currentTarget.value)}
                    className="w-40"
                  />
                  <Input placeholder="Reason" value={dueDateReason} onChange={(e) => setDueDateReason(e.currentTarget.value)} />
                </div>
                <Button
                  type="button"
                  size="sm"
                  variant="default"
                  className="w-full"
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
              </div>
            </div>

            <div className="border-t border-line pt-4">
              <SectionLabel>Move status</SectionLabel>
              <div className="mt-2 space-y-2">
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
                <textarea
                  rows={2}
                  placeholder="Reason for this move"
                  value={transitionReason}
                  onChange={(e) => setTransitionReason(e.currentTarget.value)}
                  className={TEXTAREA_CLASS}
                />
                {transitionTarget === "RESOLVED" && (
                  <Input
                    placeholder="Evidence references, comma separated (resolving requires evidence)"
                    value={evidenceRefsText}
                    onChange={(e) => setEvidenceRefsText(e.currentTarget.value)}
                  />
                )}
                <Button
                  type="button"
                  size="sm"
                  variant="default"
                  className="w-full"
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
              </div>
            </div>

            <div className="border-t border-line pt-4">
              <SectionLabel>Decisions ({leakCase.decisions.length})</SectionLabel>
              {leakCase.decisions.length > 0 && (
                <div className="mt-2 space-y-2">
                  {leakCase.decisions.map((d) => (
                    <div key={d.id}>
                      <p className="text-[11.5px] text-ink-2">{d.decision}</p>
                      <p className="text-[10px] text-ink-4">
                        {d.reason} · {formatShortDateWithYear(d.occurredAtUtc)}
                      </p>
                    </div>
                  ))}
                </div>
              )}
              <div className="mt-3 space-y-2">
                <Input placeholder="Decision" value={decisionText} onChange={(e) => setDecisionText(e.currentTarget.value)} />
                <textarea
                  rows={2}
                  placeholder="Reason"
                  value={decisionReason}
                  onChange={(e) => setDecisionReason(e.currentTarget.value)}
                  className={TEXTAREA_CLASS}
                />
                <Button
                  type="button"
                  size="sm"
                  variant="default"
                  className="w-full"
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
              </div>
            </div>

            <div className="border-t border-line pt-4">
              <SectionLabel>Room</SectionLabel>
              {leakCase.roomId ? (
                <Button asChild type="button" size="sm" variant="default" className="mt-2 w-full">
                  <Link to={`/rooms/${leakCase.roomId}`}>Open room</Link>
                </Button>
              ) : primaryAmount ? (
                <Button
                  type="button"
                  size="sm"
                  variant="default"
                  className="mt-2 w-full"
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
                  {isOpeningRoom ? "Opening…" : "Open a room"}
                </Button>
              ) : (
                <p className="mt-2 text-[11px] text-ink-4">No priced amount to scope a Room to.</p>
              )}
            </div>
          </div>
        )}
      </SheetBody>
    </>
  );
}
