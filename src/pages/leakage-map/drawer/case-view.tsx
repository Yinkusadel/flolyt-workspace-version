import { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { ArrowLeft } from "lucide-react";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Chip } from "@/components/ui/chip";
import { Input } from "@/components/ui/input";
import { SearchableSelect, SearchableSelectSkeleton } from "@/components/ui/searchable-select";
import { SheetBody, SheetDescription, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { Skeleton } from "@/components/ui/skeleton";
import { formatShortDateWithYear } from "@/lib/format-measured-value";
import useGetCurrentUser from "@/features/auth/use-get-current-user";
import useGetWorkspaceMembers from "@/features/workspace/use-get-workspace-members";
import { useAddLeakageCaseDecision } from "@/features/leakage/use-add-leakage-case-decision";
import { useGetLeakageCase } from "@/features/leakage/use-get-leakage-case";
import { useOpenRoomOnLeakageCase } from "@/features/leakage/use-open-room-on-leakage-case";
import { useTransitionLeakageCase } from "@/features/leakage/use-transition-leakage-case";
import { useUpdateLeakageCaseDueDate } from "@/features/leakage/use-update-leakage-case-due-date";
import { useUpdateLeakageCaseOwner } from "@/features/leakage/use-update-leakage-case-owner";
import { toRoomLifecycleClass, toRoomMode } from "@/services/api/leakage/open-room-on-leakage-case";
import type { RevenueLeakCaseStatus } from "@/services/api/leakage/leakage-case-types";
import type { LeakageV2Amount, LeakageV2Cell } from "@/services/api/leakage/get-leakage";
import { humanizeEnum, marketName } from "@/pages/leakage-map/format";
import { CASE_STATUS_TONE, FieldLabel, PRIMARY_ACTION_CLASS, resolveOwnerName, SectionLabel } from "@/pages/leakage-map/drawer/shared";

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
// The client must never submit VERIFIED: the outcome-verification job is the only thing that sets it.
const TRANSITIONABLE_STATUSES = ALL_STATUSES.filter((s): s is Exclude<RevenueLeakCaseStatus, "VERIFIED"> => s !== "VERIFIED");

// The server refuses a due date in the past ("A revised due date must be in the future"), so the native
// date input is bounded to the handoff's own rule: a future date within 365 days.
function isoDateDaysFromNow(days: number): string {
  const d = new Date();
  d.setDate(d.getDate() + days);
  return d.toISOString().slice(0, 10);
}
const MIN_DUE_DATE = isoDateDaysFromNow(1);
const MAX_DUE_DATE = isoDateDaysFromNow(365);

const TEXTAREA_CLASS =
  "w-full resize-none rounded-panel border border-border bg-paper-2 px-2.5 py-2 text-[11.5px] text-ink outline-none placeholder:text-ink-4 hover:border-ink-4 focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50";

function ActionCard({ children }: { children: React.ReactNode }) {
  return <div className="rounded-panel border border-line bg-paper-2 p-3.5">{children}</div>;
}

const amountKey = (a: LeakageV2Amount) => `${a.currency}|${a.market ?? ""}|${a.lifecycleClass}`;

/**
 * The case's lifecycle surface inside the drawer: status, owner, due date, Room, owner reassignment,
 * due-date change, status moves and the decision log. The behaviour (which calls, which fields, which
 * rules) is carried over from the first build, where it was exercised against the live case flow; this
 * is a restyle plus two changes: the Room is opened against an amount the person picks (a cell can carry
 * one amount per currency and a Room is scoped to exactly one), and the status picker is plain buttons
 * instead of a Radix Select, to stay clear of the Select + Popover aria-hidden bug on this page.
 * No transition graph is enforced client-side: every non-VERIFIED status is offered and the server's
 * message is shown if a move is not allowed.
 */
export function CaseView({ caseId, cell, onBack }: { caseId: string; cell: LeakageV2Cell; onBack: () => void }) {
  const { data, isLoading, isError, refetch } = useGetLeakageCase(caseId);
  const { user } = useGetCurrentUser(true);
  const { members, isPending: isLoadingMembers, isError: isMembersError } = useGetWorkspaceMembers();
  const leakCase = data?.data;

  const { mutate: updateOwner, isPending: isUpdatingOwner } = useUpdateLeakageCaseOwner();
  const { mutate: transition, isPending: isTransitioning } = useTransitionLeakageCase();
  const { mutate: updateDueDate, isPending: isUpdatingDueDate } = useUpdateLeakageCaseDueDate();
  const { mutate: addDecision, isPending: isAddingDecision } = useAddLeakageCaseDecision();
  const { mutate: openRoom, isPending: isOpeningRoom } = useOpenRoomOnLeakageCase();

  const [roomAmountKey, setRoomAmountKey] = useState<string | null>(null);
  const [dueDate, setDueDate] = useState("");
  const [dueDateReason, setDueDateReason] = useState("");
  const [ownerMemberId, setOwnerMemberId] = useState<string | null>(null);
  const [ownerReason, setOwnerReason] = useState("");
  const [decisionText, setDecisionText] = useState("");
  const [decisionReason, setDecisionReason] = useState("");
  const [transitionTarget, setTransitionTarget] = useState<Exclude<RevenueLeakCaseStatus, "VERIFIED"> | "">("");
  const [transitionReason, setTransitionReason] = useState("");
  const [evidenceRefsText, setEvidenceRefsText] = useState("");

  const isDueDateValid = dueDate >= MIN_DUE_DATE && dueDate <= MAX_DUE_DATE;
  const roomAmount = cell.amounts.find((a) => amountKey(a) === roomAmountKey) ?? cell.amounts[0];

  // Agents and deactivated members are not valid case owners.
  const humanOptions = useMemo(
    () => members.filter((m) => m.kind === "Human" && m.isActive).map((m) => ({ value: m.id, label: m.displayName })),
    [members]
  );

  return (
    <>
      <SheetHeader>
        <button
          type="button"
          onClick={onBack}
          className="mb-1 flex w-fit items-center gap-1 text-[11px] font-medium text-ultra hover:underline"
        >
          <ArrowLeft className="size-3" />
          Back to {cell.coordinate.mechanismLabel}
        </button>
        <SheetTitle>Case · {cell.coordinate.mechanismLabel}</SheetTitle>
        <SheetDescription>{cell.coordinate.revenueStageLabel}</SheetDescription>
      </SheetHeader>

      <SheetBody className="px-5 py-5">
        {isLoading && (
          <div className="space-y-2.5">
            <Skeleton className="h-5 w-24" />
            <Skeleton className="h-3 w-full" />
            <Skeleton className="h-3 w-3/4" />
          </div>
        )}

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
                  <p className="text-[12px] font-medium text-ink-2">{resolveOwnerName(members, leakCase.ownerUserId)}</p>
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
              <SectionLabel>Room</SectionLabel>
              {leakCase.roomId ? (
                <Button asChild type="button" size="sm" variant="outline" className="mt-2.5 w-full">
                  <Link to={`/rooms/${leakCase.roomId}`}>Go to room</Link>
                </Button>
              ) : roomAmount ? (
                <div className="mt-2.5 space-y-2.5">
                  {cell.amounts.length > 1 && (
                    <div>
                      <FieldLabel>A Room covers one amount. Open it for</FieldLabel>
                      <div className="flex flex-wrap gap-1.5">
                        {cell.amounts.map((a) => {
                          const active = amountKey(a) === amountKey(roomAmount);
                          return (
                            <button
                              key={amountKey(a)}
                              type="button"
                              aria-pressed={active}
                              onClick={() => setRoomAmountKey(amountKey(a))}
                              className={cn(
                                "rounded-control border px-2 py-1 font-mono text-[11px] transition-colors",
                                active ? "border-ink bg-ink text-paper" : "border-line bg-paper text-ink-2 hover:border-ink-4"
                              )}
                            >
                              {a.currency}
                              <span className="ml-1 font-sans text-[10px] opacity-70">
                                {marketName(a.market ?? "UNASSIGNED")} · {humanizeEnum(a.lifecycleClass)}
                              </span>
                            </button>
                          );
                        })}
                      </div>
                    </div>
                  )}
                  <Button
                    type="button"
                    size="sm"
                    className={cn("w-full", PRIMARY_ACTION_CLASS)}
                    disabled={isOpeningRoom}
                    onClick={() =>
                      openRoom({
                        caseId,
                        currency: roomAmount.currency,
                        market: roomAmount.market,
                        lifecycleClass: toRoomLifecycleClass(roomAmount.lifecycleClass),
                        mode: toRoomMode(roomAmount.mode),
                        title: cell.coordinate.mechanismLabel,
                      })
                    }
                  >
                    {isOpeningRoom ? "Starting…" : "Start a room"}
                  </Button>
                </div>
              ) : (
                <p className="mt-2.5 text-[11px] text-ink-4">No priced amount to scope a Room to.</p>
              )}
            </ActionCard>

            <ActionCard>
              <SectionLabel>Reassign owner</SectionLabel>
              <div className="mt-2.5 space-y-2.5">
                <div>
                  <div className="mb-1 flex items-center justify-between gap-2">
                    <FieldLabel className="mb-0">New owner</FieldLabel>
                    {user && ownerMemberId !== user.id && (
                      <button
                        type="button"
                        onClick={() => setOwnerMemberId(user.id)}
                        className="text-[10.5px] font-medium text-ultra hover:underline"
                      >
                        Assign to me
                      </button>
                    )}
                  </div>
                  {isLoadingMembers && <SearchableSelectSkeleton />}
                  {!isLoadingMembers && isMembersError && <p className="text-[11px] text-rose">Couldn't load workspace members.</p>}
                  {!isLoadingMembers && !isMembersError && (
                    <SearchableSelect
                      options={humanOptions}
                      value={ownerMemberId}
                      onChange={setOwnerMemberId}
                      placeholder="Select a person…"
                      searchPlaceholder="Search members…"
                    />
                  )}
                </div>
                <div>
                  <FieldLabel>Reason</FieldLabel>
                  <Input placeholder="Why this owner" value={ownerReason} onChange={(e) => setOwnerReason(e.currentTarget.value)} />
                </div>
              </div>
              <Button
                type="button"
                size="sm"
                className={cn("mt-3 w-full", PRIMARY_ACTION_CLASS)}
                disabled={!ownerMemberId || ownerMemberId === leakCase.ownerUserId || !ownerReason.trim() || isUpdatingOwner}
                onClick={() =>
                  ownerMemberId &&
                  updateOwner(
                    { caseId, ownerUserId: ownerMemberId, reason: ownerReason },
                    {
                      onSuccess: () => {
                        setOwnerMemberId(null);
                        setOwnerReason("");
                      },
                    }
                  )
                }
              >
                {isUpdatingOwner ? "Assigning…" : "Update owner"}
              </Button>
            </ActionCard>

            <ActionCard>
              <SectionLabel>Change due date</SectionLabel>
              <div className="mt-2.5 grid grid-cols-1 gap-2.5 sm:grid-cols-2">
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
                className={cn("mt-3 w-full", PRIMARY_ACTION_CLASS)}
                disabled={!dueDate || !isDueDateValid || !dueDateReason.trim() || isUpdatingDueDate}
                onClick={() =>
                  updateDueDate(
                    { caseId, dueAtUtc: new Date(dueDate).toISOString(), reason: dueDateReason },
                    {
                      onSuccess: () => {
                        setDueDate("");
                        setDueDateReason("");
                      },
                    }
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
                  <div className="flex flex-wrap gap-1.5">
                    {TRANSITIONABLE_STATUSES.filter((s) => s !== leakCase.status).map((s) => (
                      <button
                        key={s}
                        type="button"
                        aria-pressed={transitionTarget === s}
                        onClick={() => setTransitionTarget(s)}
                        className={cn(
                          "rounded-control border px-2 py-1 text-[11.5px] transition-colors",
                          transitionTarget === s
                            ? "border-ink bg-ink text-paper"
                            : "border-line bg-paper text-ink-2 hover:border-ink-4"
                        )}
                      >
                        {humanizeEnum(s)}
                      </button>
                    ))}
                  </div>
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
                      placeholder="Comma separated, resolving requires evidence"
                      value={evidenceRefsText}
                      onChange={(e) => setEvidenceRefsText(e.currentTarget.value)}
                    />
                  </div>
                )}
              </div>
              <Button
                type="button"
                size="sm"
                className={cn("mt-3 w-full", PRIMARY_ACTION_CLASS)}
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
                    {
                      onSuccess: () => {
                        setTransitionTarget("");
                        setTransitionReason("");
                        setEvidenceRefsText("");
                      },
                    }
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
                className={cn("mt-3 w-full", PRIMARY_ACTION_CLASS)}
                disabled={!decisionText.trim() || !decisionReason.trim() || isAddingDecision}
                onClick={() =>
                  addDecision(
                    { caseId, decision: decisionText, reason: decisionReason },
                    {
                      onSuccess: () => {
                        setDecisionText("");
                        setDecisionReason("");
                      },
                    }
                  )
                }
              >
                {isAddingDecision ? "Recording…" : "Add decision"}
              </Button>
            </ActionCard>
          </div>
        )}
      </SheetBody>
    </>
  );
}
