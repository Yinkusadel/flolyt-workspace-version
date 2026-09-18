import * as React from "react";
import { toast } from "sonner";
import { useQueryClient } from "@tanstack/react-query";
import { AlertTriangle, Flag, Loader2, ShieldCheck } from "lucide-react";

import { Chip, type ChipTone } from "@/components/ui/chip";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Skeleton } from "@/components/ui/skeleton";
import { formatCompactMoney, formatCount } from "@/lib/format-measured-value";
import { formatRoomActivity } from "@/pages/rooms/format";
import { useGetInboxApproval } from "@/features/inbox/use-get-inbox-approval";
import { useDecideAiProposal } from "@/features/ai-proposals/use-decide-ai-proposal";
import useSnoozeInboxItem from "@/features/inbox/use-snooze-inbox-item";
import type { InboxItemDto } from "@/services/api/inbox/get-inbox";

const TIER_TONE: Record<string, ChipTone> = {
  Measured: "teal",
  Corroborated: "neutral",
  Indicative: "amber",
};

const STATE_TONE: { match: (s: string) => boolean; tone: ChipTone }[] = [
  { match: (s) => s.includes("pending"), tone: "amber" },
  { match: (s) => s.includes("accept"), tone: "teal" },
  { match: (s) => s.includes("defer"), tone: "neutral" },
  { match: (s) => s.includes("reject"), tone: "rose" },
];

function stateTone(state: string): ChipTone {
  return STATE_TONE.find((s) => s.match(state.toLowerCase()))?.tone ?? "neutral";
}

function humanizeToolName(name: string): string {
  const spaced = name.replace(/_/g, " ").trim();
  return spaced.charAt(0).toUpperCase() + spaced.slice(1);
}

const SNOOZE_OPTIONS: { label: string; hours: number }[] = [
  { label: "1 hour", hours: 1 },
  { label: "Tomorrow morning", hours: 18 },
  { label: "Next week", hours: 24 * 7 },
];

function ApprovalSkeleton() {
  return (
    <div className="space-y-6 px-5 py-5">
      <Skeleton className="h-6 w-2/3" />
      <Skeleton className="h-20 w-full rounded-card" />
      <div className="grid grid-cols-3 gap-4">
        <Skeleton className="h-14" />
        <Skeleton className="h-14" />
        <Skeleton className="h-14" />
      </div>
      <Skeleton className="h-24 w-full rounded-card" />
    </div>
  );
}

export function ApprovalView({ item }: { item: InboxItemDto }) {
  const queryClient = useQueryClient();
  const { data, isLoading, isError, error } = useGetInboxApproval(item.sourceId);
  const { accept, isAccepting, defer, isDeferring, reject, isRejecting } = useDecideAiProposal();
  const { snoozeInboxItem, isPending: isSnoozing } = useSnoozeInboxItem();
  const [showDeferReason, setShowDeferReason] = React.useState(false);
  const [reason, setReason] = React.useState("");

  const approval = data?.data;
  const isDeciding = isAccepting || isDeferring || isRejecting;

  const invalidateInbox = () => queryClient.invalidateQueries({ queryKey: ["inbox"] });

  if (isLoading) return <ApprovalSkeleton />;

  if (isError || !approval) {
    return (
      <div className="flex h-full flex-col items-center justify-center px-6 text-center">
        <p className="text-[13px] font-semibold text-ink">Couldn't load this approval</p>
        <p className="mt-1 text-[11.5px] text-ink-3">{error?.message ?? "Something went wrong."}</p>
      </div>
    );
  }

  const { room, framing, evidence, dissent } = approval;

  return (
    <div className="flex h-full min-w-0 flex-col overflow-y-auto">
      <div className="flex items-start justify-between gap-3 border-b border-line px-5 py-4">
        <div className="flex min-w-0 items-start gap-3">
          <span className="flex size-8 shrink-0 items-center justify-center rounded-control border border-amber-border bg-amber-bg text-amber">
            <ShieldCheck className="size-4" />
          </span>
          <div className="min-w-0">
            <p className="text-[15px] font-semibold text-ink">{humanizeToolName(approval.toolName)}</p>
            <p className="mt-0.5 text-[11.5px] text-ink-3">
              {approval.proposedBy ?? "Proposed"} · {formatRoomActivity(approval.createdAtUtc)}
            </p>
          </div>
        </div>
        <Chip tone={stateTone(approval.state)}>{approval.state}</Chip>
      </div>

      <div className="space-y-6 px-5 py-5">
        <div>
          <p className="text-[10px] font-medium tracking-[0.07em] text-ink-4 uppercase">What will happen</p>
          <p className="mt-2 text-[13.5px] leading-relaxed text-ink">{framing.summary}</p>
        </div>

        {approval.figuresAreStated && (
          <div className="flex items-start gap-3 rounded-card border border-amber-border bg-amber-bg px-4 py-3.5">
            <AlertTriangle className="mt-0.5 size-4 shrink-0 text-amber" />
            <p className="text-[12px] leading-relaxed text-amber">
              Reach and effect were stated by whoever proposed this, not verified — treat{" "}
              {formatCount(framing.reach)}
              {framing.effect != null ? ` and ${framing.effect}` : ""} as claimed, not measured.
            </p>
          </div>
        )}

        <div className="grid grid-cols-3 gap-4 border-t border-line pt-5">
          <div>
            <p className="text-[11.5px] text-ink-3">At risk</p>
            <p className="mt-1 text-[18px] font-semibold text-rose">
              {room ? formatCompactMoney(room.amountAtRisk, room.currency) : "—"}
            </p>
          </div>
          <div>
            <p className="text-[11.5px] text-ink-3">Customers</p>
            <p className="mt-1 text-[18px] font-semibold text-ink">
              {room ? formatCount(room.population) : formatCount(framing.reach)}
            </p>
          </div>
          <div>
            <p className="text-[11.5px] text-ink-3">Evidence</p>
            <p className="mt-1 text-[18px] font-semibold text-ink">
              {approval.evidenceCount} finding{approval.evidenceCount === 1 ? "" : "s"}
            </p>
          </div>
        </div>

        {!room && (
          <p className="text-[11.5px] text-ink-4">
            Raised outside any room — no room, evidence, or dissent to show beyond what's above.
          </p>
        )}

        {evidence.length > 0 && (
          <div className="border-t border-line pt-5">
            <p className="text-[10px] font-medium tracking-[0.07em] text-ink-4 uppercase">Evidence behind it</p>
            <div className="mt-3 space-y-3">
              {evidence.map((row) => (
                <div key={row.claimId} className="flex items-start gap-3 border-b border-line pb-3 last:border-0 last:pb-0">
                  <Chip tone={TIER_TONE[row.badge] ?? "neutral"} className="mt-0.5 shrink-0">
                    {row.badge}
                  </Chip>
                  <div className="min-w-0">
                    <p className="text-[13px] text-ink-2">{row.statement}</p>
                    <p className="mt-0.5 text-[11px] text-ink-4">
                      {row.source} · {row.window}
                      {row.n != null && ` · n=${row.n}`}
                    </p>
                    {row.gaps.length > 0 && (
                      <p className="mt-0.5 text-[11px] text-amber">Gaps: {row.gaps.join(", ")}</p>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {dissent.length > 0 && (
          <div className="space-y-2">
            {dissent.map((row, i) => (
              <div key={i} className="flex items-start gap-3 rounded-card border border-amber-border bg-amber-bg px-4 py-3.5">
                <Flag className="mt-0.5 size-4 shrink-0 text-amber" />
                <div>
                  <p className="text-[13px] font-semibold text-amber">
                    {row.by} has an open objection on this decision
                  </p>
                  <p className="mt-0.5 text-[11.5px] text-amber">{row.wording}</p>
                  {row.borneOut != null && (
                    <p className="mt-1 text-[11px] text-amber">
                      {row.borneOut ? "Borne out." : "Not borne out."}
                    </p>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}

        {approval.isPending && (
          <div className="space-y-3 border-t border-line pt-5">
            {showDeferReason ? (
              <div className="space-y-2">
                <textarea
                  value={reason}
                  onChange={(e) => setReason(e.currentTarget.value)}
                  placeholder="Why hold this? (required)"
                  rows={2}
                  autoFocus
                  className="w-full resize-none rounded-card border border-line bg-paper px-3 py-2.5 text-[12.5px] text-ink outline-none placeholder:text-ink-4"
                />
                <div className="flex items-center gap-3">
                  <button
                    type="button"
                    disabled={!reason.trim() || isDeciding}
                    onClick={() =>
                      defer(
                        { id: approval.proposalId, because: reason.trim() },
                        {
                          onSuccess: (res) => {
                            if (!res.succeeded) return;
                            toast.success("Proposal deferred");
                            invalidateInbox();
                            setShowDeferReason(false);
                            setReason("");
                          },
                        }
                      )
                    }
                    className="flex items-center gap-1.5 rounded-control bg-amber-bg px-3.5 py-2 text-[12.5px] font-medium text-amber disabled:opacity-50"
                  >
                    {isDeferring && <Loader2 className="size-3.5 animate-spin" />}
                    Submit hold
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setShowDeferReason(false);
                      setReason("");
                    }}
                    className="text-[12.5px] font-medium text-ink-3 hover:text-ink"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            ) : (
              <div className="flex items-center gap-3">
                <button
                  type="button"
                  disabled={isDeciding}
                  onClick={() =>
                    accept(
                      { id: approval.proposalId },
                      {
                        onSuccess: (res) => {
                          if (!res.succeeded) return;
                          toast.success("Proposal accepted");
                          invalidateInbox();
                        },
                      }
                    )
                  }
                  className="flex items-center gap-1.5 rounded-control bg-ultra px-4 py-2 text-[13px] font-medium text-white disabled:opacity-50"
                >
                  {isAccepting && <Loader2 className="size-3.5 animate-spin" />}
                  Accept
                </button>
                <button
                  type="button"
                  disabled={isDeciding}
                  onClick={() => setShowDeferReason(true)}
                  className="rounded-control border border-line px-3.5 py-2 text-[12.5px] font-medium text-ink-2 hover:border-ink-4 disabled:opacity-50"
                >
                  Hold
                </button>
                <button
                  type="button"
                  disabled={isDeciding}
                  onClick={() =>
                    reject(approval.proposalId, {
                      onSuccess: (res) => {
                        if (!res.succeeded) return;
                        toast.success("Proposal rejected");
                        invalidateInbox();
                      },
                    })
                  }
                  className="flex items-center gap-1.5 rounded-control px-3.5 py-2 text-[12.5px] font-medium text-rose hover:bg-rose-bg disabled:opacity-50"
                >
                  {isRejecting && <Loader2 className="size-3.5 animate-spin" />}
                  Reject
                </button>

                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <button
                      type="button"
                      disabled={isSnoozing}
                      className="ml-auto text-[13px] font-medium text-ink-3 hover:text-ink disabled:opacity-50"
                    >
                      Snooze
                    </button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    {SNOOZE_OPTIONS.map((option) => (
                      <DropdownMenuItem
                        key={option.label}
                        onSelect={() =>
                          snoozeInboxItem(
                            {
                              kind: item.kind,
                              sourceId: item.sourceId,
                              untilUtc: new Date(Date.now() + option.hours * 3_600_000).toISOString(),
                            },
                            { onSuccess: (res) => res.succeeded && toast.success("Snoozed") }
                          )
                        }
                      >
                        {option.label}
                      </DropdownMenuItem>
                    ))}
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
