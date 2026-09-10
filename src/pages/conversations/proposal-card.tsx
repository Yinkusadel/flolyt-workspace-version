import { useState } from "react";
import { Loader2 } from "lucide-react";

import { cn } from "@/lib/utils";
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

function StatusChip({ status }: { status?: string }) {
  if (!status) return null;
  const lower = status.toLowerCase();
  const known = STATUS_TONE.find((s) => s.match(lower));
  return <Chip tone={known?.tone ?? "neutral"}>{known?.label ?? status}</Chip>;
}

// Rendered for `open_room_on_cohort` today; any other toolName still shows every argument via the
// generic key/value fallback below rather than silently dropping fields it doesn't recognize.
type RuleArg = { field: string; operator: string; value: string };
type PersonArg = { userId: string; role: string; maxApprovalReach?: number };
type AgentArg = { key: string; role: string; whatItWillDo: string; reads?: string };

const KNOWN_SPECIAL_KEYS = ["title", "wouldProveUsWrong", "rulesJson", "peopleJson", "agentsJson"];

export function ProposalCard({
  proposal,
  conversationId,
}: {
  proposal: ProposalCardData;
  conversationId?: string;
}) {
  const [showDeferReason, setShowDeferReason] = useState(false);
  const [reason, setReason] = useState("");
  const { accept, isAccepting, defer, isDeferring, reject, isRejecting } = useDecideAiProposal({
    conversationId,
  });

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

  const isDecided = Boolean(proposal.status) && !proposal.status?.toLowerCase().includes("pending");
  const isPending = isAccepting || isDeferring || isRejecting;

  return (
    <div className="max-w-[85%] min-w-0 rounded-card border border-line bg-paper-2 px-4 py-3.5">
      <div className="flex items-center justify-between gap-2">
        <span className="font-mono text-[9.5px] font-medium tracking-[0.6px] text-ink-4 uppercase">
          {humanizeToolName(proposal.toolName)}
        </span>
        <StatusChip status={proposal.status} />
      </div>

      <h3 className="mt-1.5 text-[13px] font-semibold text-ink">{title}</h3>

      {genericFields.length > 0 && (
        <div className="mt-2.5 space-y-1">
          {genericFields.map(([key, value]) => (
            <div key={key} className="flex min-w-0 items-start justify-between gap-3 text-[11.5px]">
              <span className="shrink-0 text-ink-4">{humanizeKey(key)}</span>
              <span className="min-w-0 text-right wrap-break-word text-ink-3">{formatValue(value)}</span>
            </div>
          ))}
        </div>
      )}

      {rules && rules.length > 0 && (
        <div className="mt-2.5 space-y-1 border-t border-line pt-2.5">
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
        <div className="mt-2.5 space-y-1 border-t border-line pt-2.5">
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
        <div className="mt-2.5 space-y-2 border-t border-line pt-2.5">
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
        <div className="mt-2.5 border-t border-line pt-2.5">
          <span className="text-[10px] font-medium text-ink-4 uppercase">Would prove us wrong</span>
          <p className="mt-0.5 text-[11.5px] text-ink-3">{wouldProveUsWrong}</p>
        </div>
      )}

      {!isDecided && (
        <div className="mt-3 border-t border-line pt-3">
          {showDeferReason ? (
            <div className="space-y-2">
              <textarea
                value={reason}
                onChange={(e) => setReason(e.currentTarget.value)}
                placeholder="Why hold this? (required)"
                rows={2}
                className="w-full resize-none rounded-card border border-line bg-paper px-2.5 py-2 text-[11.5px] text-ink outline-none placeholder:text-ink-4"
              />
              <div className="flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => {
                    setShowDeferReason(false);
                    setReason("");
                  }}
                  className="rounded-md px-2.5 py-1 text-[11px] font-medium text-ink-3 hover:bg-paper"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  disabled={!reason.trim() || isPending}
                  onClick={() => defer({ id: proposal.id, because: reason.trim() })}
                  className={cn(
                    "flex items-center gap-1.5 rounded-md px-2.5 py-1 text-[11px] font-medium",
                    reason.trim() && !isPending ? "bg-amber-bg text-amber" : "bg-paper text-ink-4"
                  )}
                >
                  {isDeferring && <Loader2 className="size-3 animate-spin" />}
                  Submit hold
                </button>
              </div>
            </div>
          ) : (
            <div className="flex justify-end gap-2">
              <button
                type="button"
                disabled={isPending}
                onClick={() => reject(proposal.id)}
                className="flex items-center gap-1.5 rounded-md px-2.5 py-1 text-[11px] font-medium text-rose hover:bg-rose-bg disabled:opacity-60"
              >
                {isRejecting && <Loader2 className="size-3 animate-spin" />}
                Reject
              </button>
              <button
                type="button"
                disabled={isPending}
                onClick={() => setShowDeferReason(true)}
                className="flex items-center gap-1.5 rounded-md px-2.5 py-1 text-[11px] font-medium text-ink-3 hover:bg-paper disabled:opacity-60"
              >
                Hold
              </button>
              <button
                type="button"
                disabled={isPending}
                onClick={() => accept({ id: proposal.id })}
                className="flex items-center gap-1.5 rounded-md bg-ultra px-2.5 py-1 text-[11px] font-medium text-paper hover:opacity-90 disabled:opacity-60"
              >
                {isAccepting && <Loader2 className="size-3 animate-spin" />}
                Accept
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
