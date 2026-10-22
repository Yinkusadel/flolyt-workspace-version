import { useState } from "react";
import { ArrowRightLeft, ChevronDown, ChevronUp } from "lucide-react";

import { cn } from "@/lib/utils";
import type { AiConversationMessage } from "@/features/ai-conversations/ai-conversation-types";

type HandoffData = NonNullable<AiConversationMessage["handoff"]>;

// Wire value for "completed" is `done` — the handoff doc's own render spec uses "completed" as
// the human label, so that mapping happens here rather than showing the raw wire word.
const STATUS_META: Record<HandoffData["status"], { label: string; dot: string; text: string }> = {
  queued: { label: "Queued", dot: "bg-ink-4", text: "text-ink-4" },
  running: { label: "Running", dot: "bg-amber", text: "text-amber" },
  awaiting_approval: { label: "Awaiting approval", dot: "bg-amber", text: "text-amber" },
  done: { label: "Completed", dot: "bg-teal", text: "text-teal" },
  failed: { label: "Failed", dot: "bg-rose", text: "text-rose" },
  cancelled: { label: "Cancelled", dot: "bg-ink-4", text: "text-ink-4" },
};

// Conversation activity, not something either party wrote — a compact lifecycle card, never a
// chat bubble. `reason`/`brief` are plain display text per the handoff doc (backend strips markup
// and internal-only wording), so neither goes through the Markdown renderer.
export function HandoffCard({ handoff }: { handoff: HandoffData }) {
  const [briefOpen, setBriefOpen] = useState(false);
  const statusMeta = STATUS_META[handoff.status] ?? STATUS_META.queued;

  return (
    <div className="flex w-full max-w-[85%] min-w-0 flex-col gap-2 rounded-card border border-line bg-paper-2 px-3.5 py-3">
      <div className="flex items-center justify-between gap-2">
        <span className="flex min-w-0 items-center gap-1.5 text-[12px] font-medium text-ink">
          <ArrowRightLeft className="size-3.5 shrink-0 text-ink-4" />
          <span className="truncate">
            {handoff.fromAgentLabel} handed this to {handoff.toAgentLabel}
          </span>
        </span>
        <span className="flex shrink-0 items-center gap-1.5">
          <span className={cn("size-1.5 shrink-0 rounded-full", statusMeta.dot)} />
          <span className={cn("text-[10.5px] font-medium whitespace-nowrap", statusMeta.text)}>
            {statusMeta.label}
          </span>
        </span>
      </div>

      {handoff.reason && (
        <p className="text-[12px] leading-relaxed text-ink-3">{handoff.reason}</p>
      )}

      {handoff.brief && (
        <div>
          <button
            type="button"
            onClick={() => setBriefOpen((prev) => !prev)}
            className="inline-flex items-center gap-1 text-[11px] font-medium text-ultra hover:underline"
          >
            {briefOpen ? "Hide brief" : "View brief"}
            {briefOpen ? <ChevronUp className="size-3" /> : <ChevronDown className="size-3" />}
          </button>
          {briefOpen && (
            <p className="mt-1.5 wrap-break-word whitespace-pre-wrap text-[11.5px] leading-relaxed text-ink-3">
              {handoff.brief}
            </p>
          )}
        </div>
      )}
    </div>
  );
}
