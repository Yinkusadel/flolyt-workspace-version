import { useMemo, useState, type ReactNode } from "react";
import { Plus, Search, X } from "lucide-react";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import { formatShortDateWithYear } from "@/lib/format-measured-value";
import useGetWorkspaceMembers from "@/features/workspace/use-get-workspace-members";
import { useAddLeakageCaseDecision } from "@/features/leakage/use-add-leakage-case-decision";
import { useOpenRoomOnLeakageCase } from "@/features/leakage/use-open-room-on-leakage-case";
import { useTransitionLeakageCase } from "@/features/leakage/use-transition-leakage-case";
import { useUpdateLeakageCaseDueDate } from "@/features/leakage/use-update-leakage-case-due-date";
import { useUpdateLeakageCaseOwner } from "@/features/leakage/use-update-leakage-case-owner";
import { toRoomLifecycleClass, toRoomMode } from "@/services/api/leakage/open-room-on-leakage-case";
import type { LeakageV2Amount, LeakageV2Cell } from "@/services/api/leakage/get-leakage";
import type { RevenueLeakCase } from "@/services/api/leakage/leakage-case-types";
import { formatHeadlineMoney, humanizeEnum, initials, marketName } from "@/pages/leakage-map/format";
import { FieldLabel, PRIMARY_ACTION_CLASS } from "@/pages/leakage-map/drawer/shared";

export type CaseForm = "resolve" | "start-work" | "invalidate" | "assign" | "due-date" | "decision" | "room";

const TEXTAREA_CLASS =
  "w-full resize-none rounded-panel border border-border bg-paper-2 px-2.5 py-2 text-[12px] text-ink outline-none placeholder:text-ink-4 hover:border-ink-4 focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50";

// The server refuses a due date in the past and beyond 365 days ("sets a future date within 365 days").
function isoDateDaysFromNow(days: number): string {
  const d = new Date();
  d.setDate(d.getDate() + days);
  return d.toISOString().slice(0, 10);
}

/** Shared frame: a title, a one-line explanation, the fields, then Cancel and the confirming action. */
function FormFrame({
  title,
  description,
  children,
  onCancel,
  confirmLabel,
  pendingLabel,
  isPending,
  disabled,
  onConfirm,
  tone = "primary",
  note,
}: {
  title: string;
  description: string;
  children: ReactNode;
  onCancel: () => void;
  confirmLabel: string;
  pendingLabel: string;
  isPending: boolean;
  disabled: boolean;
  onConfirm: () => void;
  tone?: "primary" | "danger";
  note?: string;
}) {
  return (
    <div className="space-y-4">
      <div>
        <h2 className="text-[16px] font-semibold text-ink">{title}</h2>
        <p className="mt-1 text-[11.5px] text-ink-3">{description}</p>
      </div>
      <div className="space-y-3.5">{children}</div>
      <div className="flex flex-wrap items-center justify-between gap-3 pt-1">
        <p className="min-w-0 flex-1 text-[11px] text-ink-3">{note}</p>
        <div className="flex items-center gap-2">
          <Button type="button" variant="outline" onClick={onCancel}>
            Cancel
          </Button>
          <Button
            type="button"
            className={tone === "danger" ? "border-rose bg-rose text-paper hover:bg-rose/90" : PRIMARY_ACTION_CLASS}
            disabled={disabled || isPending}
            onClick={onConfirm}
          >
            {isPending ? pendingLabel : confirmLabel}
          </Button>
        </div>
      </div>
    </div>
  );
}

interface FormProps {
  leakCase: RevenueLeakCase;
  onDone: () => void;
  onCancel: () => void;
}

/**
 * Moves the case forward by one step with a reason (Reviewed and Assigned happen through owner assignment, so
 * the buttons here are Start work, Mark resolved and Invalidate). Resolving needs at least one evidence
 * reference: plain text, sent with the move, since the API has no separate attach-evidence call.
 */
export function TransitionForm({
  kind,
  leakCase,
  onDone,
  onCancel,
}: FormProps & { kind: "resolve" | "start-work" | "invalidate" }) {
  const { mutate, isPending } = useTransitionLeakageCase();
  const [reason, setReason] = useState("");
  const [refs, setRefs] = useState<string[]>([]);
  const [draft, setDraft] = useState("");

  const copy = {
    resolve: {
      title: "Mark resolved",
      description: `${humanizeEnum(leakCase.status)} → Resolved. Verification follows automatically.`,
      label: "What fixed it",
      placeholder: "e.g. Reactivation campaign sent to the affected accounts",
      confirm: "Mark resolved",
      pending: "Resolving…",
      target: "RESOLVED" as const,
    },
    "start-work": {
      title: "Start work",
      description: `${humanizeEnum(leakCase.status)} → Worked. Say what is being done.`,
      label: "What is being done",
      placeholder: "e.g. Preparing a win-back offer",
      confirm: "Start work",
      pending: "Starting…",
      target: "WORKED" as const,
    },
    invalidate: {
      title: "Invalidate this case",
      description: "The finding was not real or no longer applies. This ends the case.",
      label: "Why it is invalid",
      placeholder: "e.g. These accounts were closed on purpose",
      confirm: "Invalidate",
      pending: "Invalidating…",
      target: "INVALIDATED" as const,
    },
  }[kind];

  const addRef = () => {
    const value = draft.trim();
    if (!value || refs.includes(value)) return;
    setRefs((prev) => [...prev, value]);
    setDraft("");
  };

  return (
    <FormFrame
      title={copy.title}
      description={copy.description}
      onCancel={onCancel}
      confirmLabel={copy.confirm}
      pendingLabel={copy.pending}
      isPending={isPending}
      tone={kind === "invalidate" ? "danger" : "primary"}
      disabled={!reason.trim() || (kind === "resolve" && refs.length === 0)}
      onConfirm={() =>
        mutate(
          { caseId: leakCase.id, target: copy.target, reason: reason.trim(), evidenceReferences: kind === "resolve" ? refs : [] },
          { onSuccess: (res) => res.succeeded && onDone() }
        )
      }
    >
      <div>
        <FieldLabel>{copy.label}</FieldLabel>
        <textarea
          rows={3}
          value={reason}
          onChange={(e) => setReason(e.currentTarget.value)}
          placeholder={copy.placeholder}
          className={TEXTAREA_CLASS}
        />
      </div>

      {kind === "resolve" && (
        <div>
          <FieldLabel>
            Evidence <span className="text-rose">· required</span>
          </FieldLabel>
          {refs.length > 0 && (
            <ul className="mb-2 space-y-1.5">
              {refs.map((ref) => (
                <li key={ref} className="flex items-center justify-between gap-3 rounded-panel border border-line bg-paper-2 px-3 py-2">
                  <span className="min-w-0 truncate text-[12px] text-ink">{ref}</span>
                  <button
                    type="button"
                    onClick={() => setRefs((prev) => prev.filter((r) => r !== ref))}
                    className="flex shrink-0 items-center gap-1 text-[11px] text-ink-3 hover:text-ink"
                  >
                    <X className="size-3" />
                    Remove
                  </button>
                </li>
              ))}
            </ul>
          )}
          <div className="flex gap-2">
            <Input
              value={draft}
              onChange={(e) => setDraft(e.currentTarget.value)}
              onKeyDown={(e) => e.key === "Enter" && (e.preventDefault(), addRef())}
              placeholder="A report name, link or note"
            />
            <Button type="button" variant="outline" onClick={addRef} disabled={!draft.trim()}>
              <Plus data-icon="inline-start" />
              Add
            </Button>
          </div>
          <p className="mt-1.5 text-[10.5px] text-ink-4">References are plain text. Files cannot be uploaded here.</p>
        </div>
      )}
    </FormFrame>
  );
}

/** Pick a person from the active human members; the reason is required. The server enforces who may reassign. */
export function AssignForm({ leakCase, onDone, onCancel }: FormProps) {
  const { members, isPending: isLoading, isError } = useGetWorkspaceMembers();
  const { mutate, isPending } = useUpdateLeakageCaseOwner();
  const [query, setQuery] = useState("");
  const [picked, setPicked] = useState<string | null>(null);
  const [reason, setReason] = useState("");

  // Agents and deactivated members are not valid case owners.
  const people = useMemo(() => {
    const q = query.trim().toLowerCase();
    return members
      .filter((m) => m.kind === "Human" && m.isActive)
      .filter((m) => !q || m.displayName.toLowerCase().includes(q) || (m.email ?? "").toLowerCase().includes(q));
  }, [members, query]);

  return (
    <FormFrame
      title={leakCase.ownerUserId ? "Reassign owner" : "Assign an owner"}
      description="Active workspace members only."
      onCancel={onCancel}
      confirmLabel={leakCase.ownerUserId ? "Reassign" : "Assign"}
      pendingLabel="Assigning…"
      isPending={isPending}
      disabled={!picked || picked === leakCase.ownerUserId || !reason.trim()}
      note="Admins can reassign. Members can only take the case themselves; the server decides."
      onConfirm={() =>
        picked &&
        mutate(
          { caseId: leakCase.id, ownerUserId: picked, reason: reason.trim() },
          { onSuccess: (res) => res.succeeded && onDone() }
        )
      }
    >
      <div className="flex items-center gap-2 rounded-panel border border-border bg-paper-2 px-3">
        <Search className="size-3.5 text-ink-4" />
        <input
          value={query}
          onChange={(e) => setQuery(e.currentTarget.value)}
          placeholder="Search people"
          className="h-9 w-full bg-transparent text-[12.5px] text-ink outline-none placeholder:text-ink-4"
        />
      </div>

      {isLoading && <Skeleton className="h-28 w-full" />}
      {!isLoading && isError && <p className="text-[11.5px] text-rose">Couldn't load workspace members.</p>}
      {!isLoading && !isError && (
        <ul role="radiogroup" aria-label="New owner" className="max-h-64 divide-y divide-line overflow-y-auto rounded-panel border border-line">
          {people.length === 0 && <li className="px-3 py-3 text-[11.5px] text-ink-3">No one matches that search.</li>}
          {people.map((m) => {
            const current = m.id === leakCase.ownerUserId;
            const selected = picked === m.id;
            return (
              <li key={m.id}>
                <button
                  type="button"
                  role="radio"
                  aria-checked={selected}
                  onClick={() => setPicked(m.id)}
                  className={cn("flex w-full items-center gap-3 px-3 py-2.5 text-left", selected ? "bg-paper-2" : "hover:bg-paper-2/60")}
                >
                  <span
                    aria-hidden
                    className={cn(
                      "flex size-4 shrink-0 items-center justify-center rounded-full border",
                      selected ? "border-ink" : "border-ink-4"
                    )}
                  >
                    {selected && <span className="size-2 rounded-full bg-ink" />}
                  </span>
                  <span className="flex size-8 shrink-0 items-center justify-center rounded-full bg-ink text-[11px] font-semibold text-paper">
                    {initials(m.displayName)}
                  </span>
                  <span className="min-w-0">
                    <span className="block truncate text-[12.5px] font-medium text-ink">{m.displayName}</span>
                    <span className="block truncate text-[10.5px] text-ink-3">
                      {current ? "Owner · current" : m.canAdminister ? "Admin" : "Member"}
                      {m.email ? ` · ${m.email}` : ""}
                    </span>
                  </span>
                </button>
              </li>
            );
          })}
        </ul>
      )}

      <div>
        <FieldLabel>Reason</FieldLabel>
        <Input value={reason} onChange={(e) => setReason(e.currentTarget.value)} placeholder="Why the handover" />
      </div>
    </FormFrame>
  );
}

const DUE_DATE_CHIPS: { label: string; days: number }[] = [
  { label: "+3 days", days: 3 },
  { label: "+1 week", days: 7 },
  { label: "+2 weeks", days: 14 },
  { label: "+30 days", days: 30 },
];

export function DueDateForm({ leakCase, onDone, onCancel }: FormProps) {
  const { mutate, isPending } = useUpdateLeakageCaseDueDate();
  const min = isoDateDaysFromNow(1);
  const max = isoDateDaysFromNow(365);
  const [date, setDate] = useState("");
  const [reason, setReason] = useState("");
  const valid = date >= min && date <= max;

  return (
    <FormFrame
      title="Change due date"
      description={`Currently ${formatShortDateWithYear(leakCase.dueAtUtc)}.`}
      onCancel={onCancel}
      confirmLabel="Save date"
      pendingLabel="Saving…"
      isPending={isPending}
      disabled={!valid || !reason.trim()}
      note="Must be in the future and within 365 days. Saving resets escalation to level 0."
      onConfirm={() =>
        mutate(
          { caseId: leakCase.id, dueAtUtc: new Date(date).toISOString(), reason: reason.trim() },
          { onSuccess: (res) => res.succeeded && onDone() }
        )
      }
    >
      <div>
        <FieldLabel>New due date</FieldLabel>
        <Input type="date" value={date} min={min} max={max} onChange={(e) => setDate(e.currentTarget.value)} className="w-full" />
        <div className="mt-2 flex flex-wrap gap-1.5">
          {DUE_DATE_CHIPS.map((chip) => {
            const value = isoDateDaysFromNow(chip.days);
            return (
              <button
                key={chip.label}
                type="button"
                aria-pressed={date === value}
                onClick={() => setDate(value)}
                className={cn(
                  "rounded-full border px-3 py-1 text-[11.5px] transition-colors",
                  date === value ? "border-ink bg-ink text-paper" : "border-line bg-paper text-ink-2 hover:border-ink-4"
                )}
              >
                {chip.label}
              </button>
            );
          })}
        </div>
      </div>
      <div>
        <FieldLabel>Reason</FieldLabel>
        <Input value={reason} onChange={(e) => setReason(e.currentTarget.value)} placeholder="Why it moves" />
      </div>
    </FormFrame>
  );
}

export function DecisionForm({ leakCase, onDone, onCancel }: FormProps) {
  const { mutate, isPending } = useAddLeakageCaseDecision();
  const [decision, setDecision] = useState("");
  const [reason, setReason] = useState("");

  return (
    <FormFrame
      title="Record decision"
      description="Added to the case log. It can't be edited later."
      onCancel={onCancel}
      confirmLabel="Record"
      pendingLabel="Recording…"
      isPending={isPending}
      disabled={!decision.trim() || !reason.trim()}
      onConfirm={() =>
        mutate(
          { caseId: leakCase.id, decision: decision.trim(), reason: reason.trim() },
          { onSuccess: (res) => res.succeeded && onDone() }
        )
      }
    >
      <div>
        <FieldLabel>Decision</FieldLabel>
        <Input value={decision} onChange={(e) => setDecision(e.currentTarget.value)} placeholder="e.g. Target the largest accounts first" />
      </div>
      <div>
        <FieldLabel>Reason</FieldLabel>
        <textarea rows={3} value={reason} onChange={(e) => setReason(e.currentTarget.value)} placeholder="What led to it" className={TEXTAREA_CLASS} />
      </div>
    </FormFrame>
  );
}

const amountKey = (a: LeakageV2Amount) => `${a.currency}|${a.market ?? ""}|${a.lifecycleClass}`;
const MODES: { value: string; label: string }[] = [
  { value: "gross", label: "Gross" },
  { value: "expected", label: "Expected" },
  { value: "net", label: "Net" },
];

/**
 * Opens a Room on exactly one amount. The amount you pick fixes the currency, market and lifecycle (shown
 * read-only: letting them be edited could name a combination that has no amount); the mode (gross, expected
 * or net) and the title are free. The title defaults to the leak type and currency and can be changed.
 */
export function RoomForm({
  leakCase,
  cell,
  defaultMode,
  onDone,
  onCancel,
}: FormProps & { cell: LeakageV2Cell; defaultMode: string }) {
  const { mutate, isPending } = useOpenRoomOnLeakageCase();
  const amounts = cell.amounts;
  const [pickedKey, setPickedKey] = useState<string | null>(null);
  const picked = amounts.find((a) => amountKey(a) === pickedKey) ?? amounts[0];
  const [mode, setMode] = useState(MODES.some((m) => m.value === defaultMode.toLowerCase()) ? defaultMode.toLowerCase() : "expected");
  const [titleEdit, setTitleEdit] = useState<string | null>(null);
  const defaultTitle = picked ? `${cell.coordinate.mechanismLabel} — ${picked.currency}` : cell.coordinate.mechanismLabel;
  const title = titleEdit ?? defaultTitle;

  if (!picked) {
    return (
      <FormFrame
        title="Open a Room for this case"
        description="There is no priced amount to open a Room on."
        onCancel={onCancel}
        confirmLabel="Open Room"
        pendingLabel="Opening…"
        isPending={false}
        disabled
        onConfirm={() => undefined}
      >
        <p className="text-[11.5px] text-ink-3">A Room works on exactly one amount, and this cell has none.</p>
      </FormFrame>
    );
  }

  const figure = (a: LeakageV2Amount) => (mode === "gross" ? a.gross : mode === "net" ? a.net : a.expected);

  return (
    <FormFrame
      title="Open a Room for this case"
      description="A Room works on exactly one amount. Pick it. Currencies are never combined."
      onCancel={onCancel}
      confirmLabel="Open Room"
      pendingLabel="Opening…"
      isPending={isPending}
      disabled={!title.trim()}
      note="The Room keeps this exact selection when it closes or reopens."
      onConfirm={() =>
        mutate(
          {
            caseId: leakCase.id,
            currency: picked.currency,
            market: picked.market,
            lifecycleClass: toRoomLifecycleClass(picked.lifecycleClass),
            mode: toRoomMode(mode),
            title: title.trim(),
          },
          { onSuccess: (res) => res.succeeded && onDone() }
        )
      }
    >
      <div role="radiogroup" aria-label="Amount" className="grid grid-cols-[repeat(auto-fill,minmax(150px,1fr))] gap-2">
        {amounts.map((a) => {
          const selected = amountKey(a) === amountKey(picked);
          return (
            <button
              key={amountKey(a)}
              type="button"
              role="radio"
              aria-checked={selected}
              onClick={() => setPickedKey(amountKey(a))}
              className={cn(
                "rounded-card border p-3 text-left transition-colors",
                selected ? "border-ink ring-1 ring-ink" : "border-line hover:border-ink-4"
              )}
            >
              <span className="flex items-center justify-between">
                <span className="font-mono text-[10.5px] font-semibold text-ink">{a.currency}</span>
                <span
                  aria-hidden
                  className={cn("flex size-3.5 items-center justify-center rounded-full border", selected ? "border-ink" : "border-ink-4")}
                >
                  {selected && <span className="size-1.5 rounded-full bg-ink" />}
                </span>
              </span>
              <span className="mt-1 block font-mono text-[14px] font-semibold text-ink">{formatHeadlineMoney(figure(a), a.currency)}</span>
              <span className="mt-0.5 block text-[10px] text-ink-4">
                {a.candidateCount} {a.candidateCount === 1 ? "candidate" : "candidates"}
              </span>
            </button>
          );
        })}
      </div>

      <div className="grid grid-cols-2 gap-3">
        <div>
          <FieldLabel>Market</FieldLabel>
          <p className="rounded-panel border border-line bg-paper-2 px-3 py-2 text-[12px] text-ink-2">
            {marketName(picked.market ?? "UNASSIGNED")}
          </p>
        </div>
        <div>
          <FieldLabel>Lifecycle</FieldLabel>
          <p className="rounded-panel border border-line bg-paper-2 px-3 py-2 text-[12px] text-ink-2">{humanizeEnum(picked.lifecycleClass)}</p>
        </div>
      </div>

      <div>
        <FieldLabel>Mode</FieldLabel>
        <div role="group" aria-label="Mode" className="flex gap-1.5">
          {MODES.map((m) => (
            <button
              key={m.value}
              type="button"
              aria-pressed={mode === m.value}
              onClick={() => setMode(m.value)}
              className={cn(
                "rounded-control border px-3 py-1.5 text-[12px] transition-colors",
                mode === m.value ? "border-ink bg-ink text-paper" : "border-line bg-paper text-ink-2 hover:border-ink-4"
              )}
            >
              {m.label}
            </button>
          ))}
        </div>
      </div>

      <div>
        <FieldLabel>Room title</FieldLabel>
        <Input value={title} onChange={(e) => setTitleEdit(e.currentTarget.value)} />
      </div>
    </FormFrame>
  );
}
