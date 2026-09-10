import { useState } from "react";
import { ChevronRight, Loader2 } from "lucide-react";

import { cn } from "@/lib/utils";
import {
  Dialog,
  DialogBody,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Chip, type ChipTone } from "@/pages/everyday/lifecycle/stage/chip";
import { useDecideAiProposal } from "@/features/ai-proposals/use-decide-ai-proposal";

export interface ProposalCardData {
  id: string;
  toolName: string;
  argumentsJson: string;
  status?: string;
}

function safeParse<T = unknown>(raw: string | null | undefined): T | null {
  if (!raw) return null;
  try {
    return JSON.parse(raw) as T;
  } catch {
    return null;
  }
}

function humanizeKey(key: string): string {
  const spaced = key.replace(/([A-Z])/g, " $1").trim();
  return spaced.charAt(0).toUpperCase() + spaced.slice(1);
}

function humanizeToolName(name: string): string {
  const spaced = name.replace(/_/g, " ").trim();
  return spaced.charAt(0).toUpperCase() + spaced.slice(1);
}

function formatValue(value: unknown): string {
  if (typeof value === "boolean") return value ? "Yes" : "No";
  if (typeof value === "number" || typeof value === "string") return String(value);
  return JSON.stringify(value);
}

const STATUS_TONE: { match: (s: string) => boolean; tone: ChipTone; label: string }[] = [
  { match: (s) => s.includes("pending"), tone: "amber", label: "Pending" },
  { match: (s) => s.includes("accept"), tone: "teal", label: "Accepted" },
  { match: (s) => s.includes("defer"), tone: "neutral", label: "Deferred" },
  { match: (s) => s.includes("reject"), tone: "rose", label: "Rejected" },
];

function statusInfo(status?: string) {
  if (!status) return { tone: "amber" as ChipTone, label: "Pending" };
  const lower = status.toLowerCase();
  const known = STATUS_TONE.find((s) => s.match(lower));
  return { tone: known?.tone ?? ("neutral" as ChipTone), label: known?.label ?? status };
}

function StatusChip({ status }: { status?: string }) {
  const { tone, label } = statusInfo(status);
  return <Chip tone={tone}>{label}</Chip>;
}

// Rendered for `open_room_on_cohort` today; any other toolName still shows every argument via the
// generic key/value fallback below rather than silently dropping fields it doesn't recognize.
type RuleArg = { field: string; operator: string; value: string };
type PersonArg = { userId: string; role: string; maxApprovalReach?: number };
type AgentArg = { key: string; role: string; whatItWillDo: string; reads?: string };

const KNOWN_SPECIAL_KEYS = ["title", "wouldProveUsWrong", "rulesJson", "peopleJson", "agentsJson"];

export function ProposalCard({ proposal }: { proposal: ProposalCardData }) {
  const [open, setOpen] = useState(false);
  const [showDeferReason, setShowDeferReason] = useState(false);
  const [reason, setReason] = useState("");
  const { accept, isAccepting, defer, isDeferring, reject, isRejecting } = useDecideAiProposal();

  const args = safeParse<Record<string, unknown>>(proposal.argumentsJson);
  const rules = args ? safeParse<RuleArg[]>(args.rulesJson as string | undefined) : null;
  const people = args ? safeParse<PersonArg[]>(args.peopleJson as string | undefined) : null;
  const agents = args ? safeParse<AgentArg[]>(args.agentsJson as string | undefined) : null;

  const title = (args?.title as string | undefined) ?? humanizeToolName(proposal.toolName);
  const wouldProveUsWrong = args?.wouldProveUsWrong as string | undefined;

  const genericFields = args
    ? Object.entries(args).filter(
        ([key, value]) => !KNOWN_SPECIAL_KEYS.includes(key) && value !== null && value !== undefined
      )
    : [];

  const conditionSummary = rules?.length
    ? `${rules[0].field} ${rules[0].operator} ${rules[0].value}${rules.length > 1 ? ` +${rules.length - 1} more` : ""}`
    : null;

  const isDecided = Boolean(proposal.status) && !proposal.status?.toLowerCase().includes("pending");
  const isPending = isAccepting || isDeferring || isRejecting;

  const closeOnSuccess = () => {
    setShowDeferReason(false);
    setReason("");
    setOpen(false);
  };

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        className="flex w-full min-w-0 items-center gap-3 rounded-card border border-line bg-paper-2 px-4 py-3 text-left transition-colors hover:border-ink-4"
      >
        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-2">
            <span className="font-mono text-[9px] font-medium tracking-[0.6px] text-ink-4 uppercase">
              {humanizeToolName(proposal.toolName)}
            </span>
            <StatusChip status={proposal.status} />
          </div>
          <h3 className="mt-1 truncate text-[13px] font-semibold text-ink">{title}</h3>
          {conditionSummary && (
            <p className="mt-0.5 truncate text-[11px] text-ink-3">{conditionSummary}</p>
          )}
        </div>
        <ChevronRight className="size-4 shrink-0 text-ink-4" />
      </button>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <div className="flex items-center gap-2">
              <span className="font-mono text-[9.5px] font-medium tracking-[0.6px] text-ink-4 uppercase">
                {humanizeToolName(proposal.toolName)}
              </span>
              <StatusChip status={proposal.status} />
            </div>
            <DialogTitle>{title}</DialogTitle>
          </DialogHeader>

          <DialogBody className="space-y-3 px-5 py-5 sm:px-7 sm:py-6">
            {genericFields.length > 0 && (
              <div className="space-y-1">
                {genericFields.map(([key, value]) => (
                  <div key={key} className="flex min-w-0 items-start justify-between gap-3 text-[11.5px]">
                    <span className="shrink-0 text-ink-4">{humanizeKey(key)}</span>
                    <span className="min-w-0 text-right wrap-break-word text-ink-3">{formatValue(value)}</span>
                  </div>
                ))}
              </div>
            )}

            {rules && rules.length > 0 && (
              <div className="space-y-1 border-t border-line pt-3">
                <span className="text-[10px] font-medium text-ink-4 uppercase">Condition</span>
                {rules.map((rule, idx) => (
                  <p key={idx} className="text-[11.5px] text-ink-3">
                    <span className="font-mono text-ink-2">{rule.field}</span> {rule.operator}{" "}
                    <span className="font-medium text-ink">{rule.value}</span>
                  </p>
                ))}
              </div>
            )}

            {people && people.length > 0 && (
              <div className="space-y-1 border-t border-line pt-3">
                <span className="text-[10px] font-medium text-ink-4 uppercase">Owner</span>
                {people.map((person, idx) => (
                  <p key={idx} className="text-[11.5px] text-ink-3">
                    {humanizeKey(person.role)}
                    {typeof person.maxApprovalReach === "number" && ` · reach ${person.maxApprovalReach}`}
                  </p>
                ))}
              </div>
            )}

            {agents && agents.length > 0 && (
              <div className="space-y-2 border-t border-line pt-3">
                <span className="text-[10px] font-medium text-ink-4 uppercase">Agent</span>
                {agents.map((agent, idx) => (
                  <div key={idx} className="text-[11.5px]">
                    <p className="font-medium text-ink">
                      {agent.key} <span className="font-normal text-ink-4">· {humanizeKey(agent.role)}</span>
                    </p>
                    <p className="mt-0.5 text-ink-3">{agent.whatItWillDo}</p>
                  </div>
                ))}
              </div>
            )}

            {wouldProveUsWrong && (
              <div className="border-t border-line pt-3">
                <span className="text-[10px] font-medium text-ink-4 uppercase">Would prove us wrong</span>
                <p className="mt-0.5 text-[11.5px] text-ink-3">{wouldProveUsWrong}</p>
              </div>
            )}

            {!isDecided && showDeferReason && (
              <div className="space-y-2 border-t border-line pt-3">
                <textarea
                  value={reason}
                  onChange={(e) => setReason(e.currentTarget.value)}
                  placeholder="Why hold this? (required)"
                  rows={2}
                  autoFocus
                  className="w-full resize-none rounded-card border border-line bg-paper px-2.5 py-2 text-[11.5px] text-ink outline-none placeholder:text-ink-4"
                />
              </div>
            )}
          </DialogBody>

          {!isDecided && (
            <DialogFooter>
              {showDeferReason ? (
                <div className="flex w-full justify-end gap-2">
                  <button
                    type="button"
                    onClick={() => {
                      setShowDeferReason(false);
                      setReason("");
                    }}
                    className="rounded-md px-3 py-1.5 text-[11.5px] font-medium text-ink-3 hover:bg-paper-2"
                  >
                    Cancel
                  </button>
                  <button
                    type="button"
                    disabled={!reason.trim() || isPending}
                    onClick={() =>
                      defer(
                        { id: proposal.id, because: reason.trim() },
                        { onSuccess: (data) => data.succeeded && closeOnSuccess() }
                      )
                    }
                    className={cn(
                      "flex items-center gap-1.5 rounded-md px-3 py-1.5 text-[11.5px] font-medium",
                      reason.trim() && !isPending ? "bg-amber-bg text-amber" : "bg-paper-2 text-ink-4"
                    )}
                  >
                    {isDeferring && <Loader2 className="size-3 animate-spin" />}
                    Submit hold
                  </button>
                </div>
              ) : (
                <div className="flex w-full justify-end gap-2">
                  <button
                    type="button"
                    disabled={isPending}
                    onClick={() => reject(proposal.id, { onSuccess: (data) => data.succeeded && closeOnSuccess() })}
                    className="flex items-center gap-1.5 rounded-md px-3 py-1.5 text-[11.5px] font-medium text-rose hover:bg-rose-bg disabled:opacity-60"
                  >
                    {isRejecting && <Loader2 className="size-3 animate-spin" />}
                    Reject
                  </button>
                  <button
                    type="button"
                    disabled={isPending}
                    onClick={() => setShowDeferReason(true)}
                    className="flex items-center gap-1.5 rounded-md px-3 py-1.5 text-[11.5px] font-medium text-ink-3 hover:bg-paper-2 disabled:opacity-60"
                  >
                    Hold
                  </button>
                  <button
                    type="button"
                    disabled={isPending}
                    onClick={() => accept({ id: proposal.id }, { onSuccess: (data) => data.succeeded && closeOnSuccess() })}
                    className="flex items-center gap-1.5 rounded-md bg-ultra px-3 py-1.5 text-[11.5px] font-medium text-paper hover:opacity-90 disabled:opacity-60"
                  >
                    {isAccepting && <Loader2 className="size-3 animate-spin" />}
                    Accept
                  </button>
                </div>
              )}
            </DialogFooter>
          )}
        </DialogContent>
      </Dialog>
    </>
  );
}
