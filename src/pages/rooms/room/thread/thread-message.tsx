import * as React from "react";

import { cn } from "@/lib/utils";
import { PersonAvatar } from "@/components/person-avatar";
import { agentInitialsFromName, initialsFromName } from "@/lib/initials";
import { AiMarkdownText } from "@/pages/conversations/ai-response/markdown-text";
import { HandoffCard } from "@/pages/conversations/handoff-card";
import type { AiConversationMessage } from "@/features/ai-conversations/ai-conversation-types";
import type { RoomListAgentDto } from "@/services/api/rooms/get-rooms";

const MENTION = /@\[agent:([^\]]+)\]/g;

/** A stored `@[agent:key]` mention reads as the agent's name in a chip; any other text stays as typed. */
function MessageText({ text, agents }: { text: string; agents: RoomListAgentDto[] }) {
  const parts: React.ReactNode[] = [];
  let last = 0;
  for (const match of text.matchAll(MENTION)) {
    const at = match.index ?? 0;
    if (at > last) parts.push(text.slice(last, at));
    const name = agents.find((agent) => agent.key === match[1])?.displayName ?? match[1];
    parts.push(
      <span key={at} className="rounded-control bg-ultra-bg px-1 font-medium text-ultra">
        @{name}
      </span>
    );
    last = at + match[0].length;
  }
  if (last < text.length) parts.push(text.slice(last));
  return <p className="text-[13px] leading-relaxed wrap-break-word whitespace-pre-wrap text-ink">{parts}</p>;
}

const formatTime = (iso: string) => new Date(iso).toISOString().slice(11, 16);

/**
 * One row of the Room thread, from the conversation history. Not in the history, so not drawn:
 * ❌ Backend does NOT provide: which messages were posted people-only (`replyMode: "none"`), so no
 * "people only" tag on a saved message; a person's colour or presence; per-run state for the working line.
 * "context" and "error" roles never belong in a conversation view.
 */
export function ThreadMessage({
  message,
  agents,
  onFollowUp,
  canFollowUp,
  currentUserId,
  team,
}: {
  message: AiConversationMessage;
  agents: RoomListAgentDto[];
  onFollowUp: (prompt: string) => void;
  canFollowUp: boolean;
  currentUserId: string | null;
  /** The author's colour slot, handed out by the thread in order of first appearance. */
  team: 1 | 2 | 3 | 4;
}) {
  if (message.role === "handoff" && message.handoff) {
    return (
      <div className="flex justify-start pl-9">
        <HandoffCard handoff={message.handoff} />
      </div>
    );
  }

  if (message.role === "steering") {
    return (
      <div className="flex justify-end">
        <p className="max-w-[85%] rounded-card border border-dashed border-line px-3 py-2 text-[12px] leading-relaxed text-ink-3 italic">
          {message.content}
        </p>
      </div>
    );
  }

  if (message.role === "assistant") {
    const label = message.agentLabel ?? "Flolyt";
    const markdown = message.structuredResponse?.markdown || message.content;
    const followUps = message.structuredResponse?.suggestedFollowUpPrompts ?? [];
    return (
      <div className="flex gap-2.5">
        <PersonAvatar kind="agent" size="lg" initials={agentInitialsFromName(label)} />
        <div className="min-w-0 flex-1">
          <p className="flex items-center gap-2 text-[12px]">
            <span className="font-semibold text-ink">{label}</span>
            <span className="font-mono text-[10px] text-ink-4">{formatTime(message.timestamp)}</span>
          </p>
          <div className="mt-1 rounded-card border border-ultra-border bg-paper px-3.5 py-3">
            <AiMarkdownText content={markdown} />
          </div>
          {canFollowUp && followUps.length > 0 && (
            <div className="mt-2 flex flex-wrap gap-1.5">
              {followUps.map((followUp) => (
                <button
                  key={followUp.id}
                  type="button"
                  onClick={() => onFollowUp(followUp.prompt)}
                  className="rounded-full border border-ultra-border bg-ultra-bg px-2.5 py-1 text-left text-[11.5px] text-ultra hover:underline"
                >
                  {followUp.prompt}
                </button>
              ))}
            </div>
          )}
        </div>
      </div>
    );
  }

  if (message.role === "user") {
    const name = message.authorName?.trim() || "A teammate";
    const mine = !!currentUserId && message.authorUserId === currentUserId;
    return (
      <div className={cn("flex gap-2.5", mine && "flex-row-reverse")}>
        <PersonAvatar
          kind="human"
          size="lg"
          team={team}
          initials={initialsFromName(name)}
        />
        <div className={cn("min-w-0 max-w-[85%]", mine ? "text-right" : "flex-1")}>
          <p className={cn("flex items-center gap-2 text-[12px]", mine && "justify-end")}>
            <span className="font-semibold text-ink">{name}</span>
            {mine && <span className="rounded-full bg-ultra-bg px-1.5 py-0.5 text-[10px] font-medium text-ultra">You</span>}
            <span className="font-mono text-[10px] text-ink-4">{formatTime(message.timestamp)}</span>
          </p>
          <div className={cn("mt-1 rounded-card px-3.5 py-2.5 text-left", mine ? "bg-ultra-bg" : "bg-paper-2")}>
            <MessageText text={message.content} agents={agents} />
          </div>
        </div>
      </div>
    );
  }

  return null;
}
