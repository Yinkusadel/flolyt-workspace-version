import { useState, type ReactNode } from "react";
import { Link } from "react-router-dom";
import { ArrowLeft, Check, MessageSquare } from "lucide-react";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Chip } from "@/components/ui/chip";
import { SheetBody, SheetDescription, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { Skeleton } from "@/components/ui/skeleton";
import { formatCompactMoney, formatShortDateWithYear } from "@/lib/format-measured-value";
import useGetWorkspaceMembers from "@/features/workspace/use-get-workspace-members";
import { useGetLeakageCase } from "@/features/leakage/use-get-leakage-case";
import type { WorkspaceMemberDto } from "@/services/api/workspace/get-workspace-members";
import type { LeakageV2Cell } from "@/services/api/leakage/get-leakage";
import type { RevenueLeakCase, RevenueLeakCaseStatus } from "@/services/api/leakage/leakage-case-types";
import { formatStamp, humanizeEnum, initials, sentenceCase } from "@/pages/leakage-map/format";
import {
  AssignForm,
  DecisionForm,
  DueDateForm,
  RoomForm,
  TransitionForm,
  type CaseForm,
} from "@/pages/leakage-map/drawer/case-forms";
import { CASE_STATUS_TONE, PRIMARY_ACTION_CLASS, SectionLabel } from "@/pages/leakage-map/drawer/shared";

const STEPS: RevenueLeakCaseStatus[] = ["DETECTED", "REVIEWED", "ASSIGNED", "WORKED", "RESOLVED", "VERIFIED", "CLOSED"];
const STEP_HINT: Partial<Record<RevenueLeakCaseStatus, string>> = {
  RESOLVED: "needs evidence",
  VERIFIED: "set by verification",
};

/** Steps from which the case counts as still open, so Invalidate is offered. An assumption: the API does not publish the allowed moves. */
const INVALIDATABLE: RevenueLeakCaseStatus[] = ["DETECTED", "REVIEWED", "ASSIGNED", "WORKED", "RESOLVED"];
const FINISHED: RevenueLeakCaseStatus[] = ["CLOSED", "INVALIDATED"];

const DAY_MS = 86_400_000;
/** "Due soon" starts at this many days left. */
const DUE_SOON_DAYS = 2;

interface CaseViewProps {
  caseId: string;
  cell: LeakageV2Cell;
  defaultMode: string;
  /** The snapshot the map is showing now, to say when the case was detected on an earlier one. */
  currentSnapshotId: string;
  onBack: () => void;
}

/**
 * The case, inside the drawer. Two tabs: Case (steps, Room, decisions, evidence, verified value, owner, due
 * date, escalations, the finding) and Audit trail. Every action opens as a form that replaces the tab area
 * (not a popup on top of the sheet, so no stacked overlays) and returns here when done or cancelled.
 *
 * What each button calls: Record decision -> POST /decisions; Mark resolved, Start work and Invalidate ->
 * POST /transitions with the target status; Assign / Reassign -> PUT /owner (assigning an owner is also what
 * moves a case through Reviewed and Assigned); Change due date -> PUT /due-date; Open a Room -> POST /room.
 * The API does not publish the allowed status moves, so the buttons offered per status are a best reading
 * of the live audit trail, and the server's refusal is shown if one is wrong.
 */
export function CaseView({ caseId, cell, defaultMode, currentSnapshotId, onBack }: CaseViewProps) {
  const { data, isLoading, isError, refetch } = useGetLeakageCase(caseId);
  const { members } = useGetWorkspaceMembers();
  const [form, setForm] = useState<CaseForm | null>(null);
  const [tab, setTab] = useState<"case" | "audit">("case");
  const leakCase = data?.data;

  const closeForm = () => setForm(null);

  return (
    <>
      <SheetHeader className="gap-2">
        <button
          type="button"
          onClick={onBack}
          className="flex w-fit items-center gap-1 text-[11px] font-medium text-ultra hover:underline"
        >
          <ArrowLeft className="size-3" />
          Back to {cell.coordinate.mechanismLabel}
        </button>
        <div className="flex flex-wrap items-center gap-2.5">
          <SheetTitle className="text-[18px]">{cell.coordinate.mechanismLabel}</SheetTitle>
          {leakCase && <Chip tone={CASE_STATUS_TONE[leakCase.status]}>{humanizeEnum(leakCase.status)}</Chip>}
          {leakCase?.isOverdue && <Chip tone="rose">Overdue</Chip>}
        </div>
        <SheetDescription>
          Revenue leak case · {cell.coordinate.revenueStageLabel} · {cell.coordinate.stateDimensionLabel} →{" "}
          {cell.coordinate.stateValueLabel} · {cell.sectorLabel}
        </SheetDescription>
        {leakCase && !form && (
          // Tabs on the left and the actions on the right share one row, so the tabs cost no extra height.
          // From sm up the tab underline sits on the header's own bottom border.
          <div className="flex flex-wrap items-end justify-between gap-x-4 gap-y-2 pt-1 sm:-mb-4">
            <div role="tablist" aria-label="Case" className="flex items-center gap-1">
              {(
                [
                  { key: "case", label: "Case" },
                  { key: "audit", label: `Audit trail (${leakCase.auditTrail.length})` },
                ] as const
              ).map((t) => (
                <button
                  key={t.key}
                  role="tab"
                  type="button"
                  aria-selected={tab === t.key}
                  onClick={() => setTab(t.key)}
                  className={cn(
                    "border-b-2 px-3 pt-2 pb-3 text-[11.5px] whitespace-nowrap",
                    tab === t.key ? "border-ultra font-semibold text-ink" : "border-transparent text-ink-3 hover:text-ink-2"
                  )}
                >
                  {t.label}
                </button>
              ))}
            </div>
            <ActionBar leakCase={leakCase} onAction={setForm} />
          </div>
        )}
      </SheetHeader>

      <SheetBody className="px-5 py-5">
        {isLoading && (
          <div className="space-y-3">
            <Skeleton className="h-16 w-full" />
            <Skeleton className="h-20 w-full" />
            <Skeleton className="h-32 w-full" />
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

        {leakCase && form && (
          <>
            {(form === "resolve" || form === "start-work" || form === "invalidate") && (
              <TransitionForm kind={form} leakCase={leakCase} onDone={closeForm} onCancel={closeForm} />
            )}
            {form === "assign" && <AssignForm leakCase={leakCase} onDone={closeForm} onCancel={closeForm} />}
            {form === "due-date" && <DueDateForm leakCase={leakCase} onDone={closeForm} onCancel={closeForm} />}
            {form === "decision" && <DecisionForm leakCase={leakCase} onDone={closeForm} onCancel={closeForm} />}
            {form === "room" && (
              <RoomForm leakCase={leakCase} cell={cell} defaultMode={defaultMode} onDone={closeForm} onCancel={closeForm} />
            )}
          </>
        )}

        {leakCase && !form && (
          <div className="space-y-5">
            {tab === "case" ? (
              <CaseTab
                leakCase={leakCase}
                members={members}
                currentSnapshotId={currentSnapshotId}
                onAction={setForm}
                onOpenCell={onBack}
              />
            ) : (
              <AuditTab leakCase={leakCase} members={members} />
            )}
          </div>
        )}
      </SheetBody>
    </>
  );
}

/** Record decision, Invalidate and the one forward step that makes sense for the current status. */
function ActionBar({ leakCase, onAction }: { leakCase: RevenueLeakCase; onAction: (form: CaseForm) => void }) {
  const status = leakCase.status;
  const primary: { label: string; form: CaseForm } | null =
    status === "DETECTED" || status === "REVIEWED"
      ? { label: "Assign owner", form: "assign" }
      : status === "ASSIGNED"
        ? { label: "Start work", form: "start-work" }
        : status === "WORKED"
          ? { label: "Mark resolved", form: "resolve" }
          : null;

  if (FINISHED.includes(status)) return null;

  return (
    <div className="flex flex-wrap items-center gap-2 pb-2.5">
      <Button type="button" variant="outline" onClick={() => onAction("decision")}>
        Record decision
      </Button>
      {INVALIDATABLE.includes(status) && (
        <Button type="button" variant="outline" className="text-rose hover:text-rose" onClick={() => onAction("invalidate")}>
          Invalidate
        </Button>
      )}
      {primary && (
        <Button type="button" className={PRIMARY_ACTION_CLASS} onClick={() => onAction(primary.form)}>
          {primary.label}
        </Button>
      )}
    </div>
  );
}

const Card = ({ children, className }: { children: ReactNode; className?: string }) => (
  <div className={cn("rounded-card border border-line bg-paper p-4", className)}>{children}</div>
);

const memberOf = (members: WorkspaceMemberDto[], id: string | null) => (id ? members.find((m) => m.id === id) : undefined);
const nameOf = (members: WorkspaceMemberDto[], id: string | null) => memberOf(members, id)?.displayName ?? id ?? "System";

function Avatar({ name, size = "md" }: { name: string; size?: "sm" | "md" }) {
  return (
    <span
      aria-hidden
      className={cn(
        "flex shrink-0 items-center justify-center rounded-full bg-ink font-semibold text-paper",
        size === "sm" ? "size-6 text-[9px]" : "size-9 text-[11px]"
      )}
    >
      {initials(name)}
    </span>
  );
}

function CaseTab({
  leakCase,
  members,
  currentSnapshotId,
  onAction,
  onOpenCell,
}: {
  leakCase: RevenueLeakCase;
  members: WorkspaceMemberDto[];
  currentSnapshotId: string;
  onAction: (form: CaseForm) => void;
  onOpenCell: () => void;
}) {
  const owner = memberOf(members, leakCase.ownerUserId);
  const roomLinked = leakCase.auditTrail.find((e) => e.action === "room_linked");
  const finished = FINISHED.includes(leakCase.status);

  return (
    <div className="space-y-4">
      <Stepper leakCase={leakCase} />

      <Card className="flex flex-wrap items-center gap-3">
        <span className="flex size-9 shrink-0 items-center justify-center rounded-control bg-ultra-bg text-ultra">
          <MessageSquare className="size-4" />
        </span>
        <div className="min-w-0 flex-1">
          <p className="text-[12.5px] font-semibold text-ink">Collaboration Room</p>
          <p className="text-[11px] text-ink-3">
            {leakCase.roomId
              ? `${roomLinked ? `Linked ${formatStamp(roomLinked.occurredAtUtc)} · ` : ""}${leakCase.roomId.slice(0, 8)} · closing the Room can resolve or invalidate this case`
              : "No Room yet. A Room is where the work on this case happens."}
          </p>
        </div>
        {leakCase.roomId ? (
          <Button asChild className={PRIMARY_ACTION_CLASS}>
            <Link to={`/rooms/${leakCase.roomId}`}>Open Room</Link>
          </Button>
        ) : (
          !finished && (
            <Button type="button" className={PRIMARY_ACTION_CLASS} onClick={() => onAction("room")}>
              Open a Room
            </Button>
          )
        )}
      </Card>

      <div className="grid gap-4 sm:grid-cols-2">
        <Card>
          <SectionLabel>Owner</SectionLabel>
          {leakCase.ownerUserId ? (
            <div className="mt-3 flex items-center gap-3">
              <Avatar name={nameOf(members, leakCase.ownerUserId)} />
              <div className="min-w-0">
                <p className="truncate text-[13px] font-semibold text-ink">{nameOf(members, leakCase.ownerUserId)}</p>
                <p className="truncate text-[10.5px] text-ink-3">
                  {owner?.email ?? "No email on record"}
                  {owner?.canAdminister ? " · Admin" : ""}
                </p>
              </div>
            </div>
          ) : (
            <p className="mt-3 text-[12px] text-ink-3">No owner yet.</p>
          )}
          {!finished && (
            <Button type="button" variant="outline" className="mt-3 w-full" onClick={() => onAction("assign")}>
              {leakCase.ownerUserId ? "Reassign" : "Assign owner"}
            </Button>
          )}
          <p className="mt-2 text-[10.5px] text-ink-4">Admins can reassign. Members can only take the case themselves.</p>
        </Card>

        <DueDateCard leakCase={leakCase} finished={finished} onChange={() => onAction("due-date")} />
      </div>

      <Card>
        <div className="flex items-center justify-between gap-3">
          <p className="text-[13px] font-semibold text-ink">Decisions</p>
          {!finished && (
            <Button type="button" variant="outline" size="sm" onClick={() => onAction("decision")}>
              Add decision
            </Button>
          )}
        </div>
        {leakCase.decisions.length === 0 ? (
          <p className="mt-3 text-[11.5px] text-ink-3">No decisions recorded yet.</p>
        ) : (
          <ul className="mt-3 space-y-2">
            {leakCase.decisions.map((d) => (
              <li key={d.id} className="flex gap-3 rounded-panel bg-paper-2 p-3">
                <Avatar name={nameOf(members, d.actorUserId)} size="sm" />
                <div className="min-w-0 flex-1">
                  <div className="flex flex-wrap items-baseline justify-between gap-x-3">
                    <p className="text-[12.5px] font-medium text-ink">{d.decision}</p>
                    <p className="font-mono text-[10px] text-ink-4">
                      {nameOf(members, d.actorUserId)} · {formatStamp(d.occurredAtUtc)}
                    </p>
                  </div>
                  <p className="mt-0.5 text-[11px] text-ink-3">Reason: {d.reason}</p>
                </div>
              </li>
            ))}
          </ul>
        )}
        <p className="mt-3 text-[10.5px] text-ink-4">Decisions are append-only.</p>
      </Card>

      <div className="grid gap-4 sm:grid-cols-2">
        <Card>
          <p className="text-[13px] font-semibold text-ink">Evidence</p>
          {leakCase.evidenceReferences.length === 0 ? (
            <div className="mt-3 rounded-panel border border-dashed border-line p-3">
              <p className="text-[12px] font-medium text-ink-2">No evidence attached</p>
              <p className="mt-1 text-[11px] text-ink-3">Resolving this case needs at least one evidence reference.</p>
            </div>
          ) : (
            <ul className="mt-3 space-y-1.5">
              {leakCase.evidenceReferences.map((ref) => (
                <li key={ref} className="rounded-panel border border-line bg-paper-2 px-3 py-2 text-[12px] wrap-break-word text-ink">
                  {ref}
                </li>
              ))}
            </ul>
          )}
        </Card>

        <Card>
          <p className="text-[13px] font-semibold text-ink">Verified value</p>
          {leakCase.valueAttributions.length === 0 ? (
            <div className="mt-3 rounded-panel border border-dashed border-line p-3">
              <p className="text-[12px] font-medium text-ink-2">Nothing verified yet</p>
              <p className="mt-1 text-[11px] text-ink-3">
                Preserved, recovered or captured value appears here after outcome verification, per currency and Room
                opening. It is never edited here.
              </p>
              <div className="mt-2 flex flex-wrap gap-1.5">
                <Chip tone="teal">Preserved</Chip>
                <Chip tone="ultra">Recovered</Chip>
                <Chip>Captured</Chip>
              </div>
            </div>
          ) : (
            <ul className="mt-3 space-y-2">
              {leakCase.valueAttributions.map((v) => (
                <li key={v.sourceVerificationId} className="rounded-panel bg-paper-2 p-3">
                  <div className="flex items-baseline justify-between gap-3">
                    <Chip tone={v.kind === "PRESERVED" ? "teal" : v.kind === "RECOVERED" ? "ultra" : "neutral"}>
                      {humanizeEnum(v.kind)}
                    </Chip>
                    <span className="font-mono text-[13px] font-semibold text-ink">{formatCompactMoney(v.amount, v.currency)}</span>
                  </div>
                  <p className="mt-1.5 text-[10.5px] text-ink-3">
                    Room opening {v.roomOpeningNumber} · verified {formatShortDateWithYear(v.verifiedAtUtc)}
                  </p>
                </li>
              ))}
            </ul>
          )}
        </Card>
      </div>

      <Card>
        <SectionLabel>Escalations</SectionLabel>
        {leakCase.escalations.length === 0 ? (
          <p className="mt-2 text-[11.5px] text-ink-3">None. Escalation starts if the due date passes.</p>
        ) : (
          <ul className="mt-2 divide-y divide-line">
            {leakCase.escalations.map((e) => (
              <li key={`${e.level}-${e.occurredAtUtc}`} className="py-2">
                <p className="text-[12px] font-medium text-ink">
                  Level {e.level}
                  {e.escalatedToUserId ? ` · to ${nameOf(members, e.escalatedToUserId)}` : ""}
                </p>
                <p className="text-[11px] text-ink-3">
                  {e.reason} · {formatStamp(e.occurredAtUtc)}
                </p>
              </li>
            ))}
          </ul>
        )}
      </Card>

      <Card>
        <SectionLabel>Finding</SectionLabel>
        <dl className="mt-2 space-y-2.5 text-[11.5px]">
          <div>
            <dt className="text-ink-4">Cell</dt>
            <dd>
              <button type="button" onClick={onOpenCell} className="font-medium text-ultra hover:underline">
                Back to the cell
              </button>
            </dd>
          </div>
          <div>
            <dt className="text-ink-4">Detected from snapshot</dt>
            <dd className="font-mono text-ink">{leakCase.sourceSnapshotId.slice(0, 8)}</dd>
          </div>
          {currentSnapshotId && currentSnapshotId !== leakCase.sourceSnapshotId && (
            <div className="rounded-panel bg-amber-bg px-3 py-2 text-[11px] text-ink-2">
              The map now shows snapshot {currentSnapshotId.slice(0, 8)}. The cell's figures are current; the case keeps
              its original finding.
            </div>
          )}
          <div>
            <dt className="text-ink-4">Last updated</dt>
            <dd className="font-mono text-ink">{formatStamp(leakCase.updatedAtUtc)}</dd>
          </div>
        </dl>
      </Card>
    </div>
  );
}

/** The seven steps with the time each was reached, read from the audit trail. */
function Stepper({ leakCase }: { leakCase: RevenueLeakCase }) {
  const currentIndex = STEPS.indexOf(leakCase.status);
  const reachedAt = (step: RevenueLeakCaseStatus) =>
    leakCase.auditTrail.find((e) => e.to === step && (e.from !== e.to || step === "DETECTED"))?.occurredAtUtc;
  const invalidated = leakCase.status === "INVALIDATED";

  return (
    <div>
      <ol className="grid grid-cols-7 gap-1.5">
        {STEPS.map((step, i) => {
          const done = !invalidated && i < currentIndex;
          const current = !invalidated && i === currentIndex;
          const at = reachedAt(step);
          return (
            <li key={step} className="min-w-0">
              <span
                className={cn(
                  "block h-1 rounded-full",
                  done ? "bg-ink" : current ? "bg-ultra" : invalidated && at ? "bg-ink-4" : "bg-line"
                )}
              />
              <p
                className={cn(
                  "mt-1.5 flex items-center gap-1 truncate text-[10.5px]",
                  current ? "font-semibold text-ultra" : done ? "font-medium text-ink" : "text-ink-3"
                )}
              >
                {done && <Check className="size-3 shrink-0" />}
                {current && <span className="size-1.5 shrink-0 rounded-full bg-ultra" />}
                <span className="truncate">{humanizeEnum(step)}</span>
              </p>
              <p className="font-mono text-[9px] leading-tight text-ink-4">
                {at && (done || current || invalidated) ? (current ? `since ${formatStamp(at)}` : formatStamp(at)) : (STEP_HINT[step] ?? "")}
              </p>
            </li>
          );
        })}
      </ol>
      <p className="mt-2.5 text-[10.5px] text-ink-4">
        Invalidated is an exit from any open step. Verified is never set by hand: the outcome-verification job moves a
        supported resolution there.
      </p>
      {invalidated && (
        <p className="mt-2 rounded-panel bg-rose-bg px-3 py-2 text-[11.5px] font-medium text-rose">
          This case was invalidated
          {reachedAt("INVALIDATED") ? ` on ${formatStamp(reachedAt("INVALIDATED") as string)}` : ""}.
        </p>
      )}
    </div>
  );
}

/**
 * Due date, with a bar that fills as the date approaches. The server supplies only `isOverdue`; "Due soon"
 * (two days or fewer left) and the days-left count are worked out here from the due date and now, and the bar
 * from how much of the detection-to-due window has passed. Frontend-computed on purpose; see
 * docs/leakage-map/v3-reminders.md.
 */
function DueDateCard({ leakCase, finished, onChange }: { leakCase: RevenueLeakCase; finished: boolean; onChange: () => void }) {
  const now = Date.now();
  const due = Date.parse(leakCase.dueAtUtc);
  const start = Date.parse(leakCase.detectedAtUtc);
  const daysLeft = Math.ceil((due - now) / DAY_MS);
  const dueSoon = !leakCase.isOverdue && daysLeft <= DUE_SOON_DAYS;
  const elapsed = due > start ? Math.min(1, Math.max(0, (now - start) / (due - start))) : 1;

  return (
    <Card>
      <SectionLabel>Due date</SectionLabel>
      <div className="mt-2 flex items-baseline justify-between gap-2">
        <p className="font-mono text-[16px] font-semibold text-ink">{formatShortDateWithYear(leakCase.dueAtUtc)}</p>
        {!finished && (
          <Chip tone={leakCase.isOverdue ? "rose" : dueSoon ? "amber" : "neutral"}>
            {leakCase.isOverdue
              ? "Overdue"
              : dueSoon
                ? `Due soon · ${Math.max(daysLeft, 0)} ${daysLeft === 1 ? "day" : "days"} left`
                : `${daysLeft} days left`}
          </Chip>
        )}
      </div>
      <div className="mt-2.5 h-1.5 overflow-hidden rounded-full bg-line" role="progressbar" aria-valuemin={0} aria-valuemax={100} aria-valuenow={Math.round(elapsed * 100)} aria-label="Share of the time to the due date that has passed">
        <div
          className={cn("h-full rounded-full", leakCase.isOverdue ? "bg-rose" : dueSoon ? "bg-amber" : "bg-teal")}
          style={{ width: `${Math.round(elapsed * 100)}%` }}
        />
      </div>
      <p className="mt-2 font-mono text-[10px] text-ink-4">
        {formatStamp(leakCase.dueAtUtc)} · escalation level {leakCase.escalationLevel}
      </p>
      {!finished && (
        <Button type="button" variant="outline" className="mt-3 w-full" onClick={onChange}>
          Change due date
        </Button>
      )}
    </Card>
  );
}

/** Every recorded step, newest first as in the design, with who did it and why. */
function AuditTab({ leakCase, members }: { leakCase: RevenueLeakCase; members: WorkspaceMemberDto[] }) {
  const entries = [...leakCase.auditTrail].sort((a, b) => b.sequence - a.sequence);
  return (
    <Card>
      <p className="text-[13px] font-semibold text-ink">Audit trail</p>
      <ol className="mt-3 divide-y divide-line">
        {entries.map((e) => (
          <li key={e.sequence} className="flex gap-3 py-3">
            <span className="w-4 shrink-0 pt-0.5 font-mono text-[10px] text-ink-4">{e.sequence}</span>
            <div className="min-w-0 flex-1">
              <div className="flex flex-wrap items-baseline justify-between gap-x-3">
                <p className="text-[12.5px] font-medium text-ink">
                  {sentenceCase(e.action)}
                  {e.from !== e.to && (
                    <span className="ml-2 font-mono text-[9.5px] font-normal text-ink-4 uppercase">
                      {e.from} → {e.to}
                    </span>
                  )}
                </p>
                <p className="font-mono text-[10px] text-ink-4">{formatStamp(e.occurredAtUtc)}</p>
              </div>
              <p className="mt-0.5 text-[11px] text-ink-3">
                {e.reason} · {nameOf(members, e.actorUserId)}
              </p>
            </div>
          </li>
        ))}
      </ol>
    </Card>
  );
}
