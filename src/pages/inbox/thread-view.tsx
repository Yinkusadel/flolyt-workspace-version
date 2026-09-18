import * as React from "react";
import { Paperclip, Link2, ArrowUp } from "lucide-react";

import { cn } from "@/lib/utils";
import { PersonAvatar } from "@/components/person-avatar";
import { Skeleton } from "@/components/ui/skeleton";
import { useAuth } from "@/utils/auth-context";
import { agentInitialsFromName, formatRoomActivity, initialsFromName } from "@/pages/rooms/format";
import { AttachedRoomCard } from "@/pages/inbox/attached-room-card";
import { formatAttachedRoom } from "@/pages/inbox/kind";
import { useGetInboxThread } from "@/features/inbox/use-get-inbox-thread";
import useReplyToInboxThread from "@/features/inbox/use-reply-to-inbox-thread";
import type { InboxItemDto } from "@/services/api/inbox/get-inbox";
import type { InboxThreadMessageDto } from "@/services/api/inbox/get-inbox-thread";

/** The thread endpoint gives no member ref for "who am I" — matched loosely against the signed-in
 * user's own id (plain guid) since `sender` comes back as a `human:{guid}` ref; not confirmed live
 * yet, flagged in docs/inbox/build-plan.md. */
function isMe(sender: string, userId: string | undefined): boolean {
  if (!userId) return false;
  return sender === userId || sender.endsWith(`:${userId}`);
}

/** Mirrors the tail trick from conversations/detail-route.tsx's user bubble, flipped for the left side. */
function MessageBubble({ message, mine }: { message: InboxThreadMessageDto; mine: boolean }) {
  return (
    <div className={cn("flex flex-col gap-1", mine ? "items-end" : "items-start")}>
      <div className="flex items-baseline gap-2 px-1">
        <span className="text-[11.5px] font-semibold text-ink-2">
          {mine ? "You" : message.senderName}
        </span>
        <span className="text-[11px] text-ink-4">{formatRoomActivity(message.sentAtUtc)}</span>
      </div>

      <div className={cn("relative max-w-[75%] min-w-0", mine ? "pr-2" : "pl-2")}>
        <span
          aria-hidden
          className={cn("absolute top-0 size-0", mine ? "right-0" : "left-0")}
          style={
            mine
              ? {
                  borderStyle: "solid",
                  borderWidth: "8px 8px 0 0",
                  borderColor: "var(--color-ultra) transparent transparent transparent",
                }
              : {
                  borderStyle: "solid",
                  borderWidth: "8px 0 0 8px",
                  borderColor: "var(--color-paper-2) transparent transparent transparent",
                }
          }
        />
        <div
          className={cn(
            "rounded-2xl px-4 py-2.5 text-[13px] leading-relaxed wrap-break-word",
            mine ? "rounded-tr-none bg-ultra text-paper shadow-xs" : "rounded-tl-none bg-paper-2 text-ink"
          )}
        >
          {message.body}
        </div>
      </div>

      {message.room && <AttachedRoomCard room={formatAttachedRoom(message.room)} />}
    </div>
  );
}

function ThreadSkeleton() {
  return (
    <div className="flex h-full min-w-0 flex-col">
      <div className="flex items-center gap-3 border-b border-line px-5 py-4">
        <Skeleton className="size-8 rounded-full" />
        <Skeleton className="h-4 w-32" />
      </div>
      <div className="min-h-0 flex-1 space-y-4 px-5 py-4">
        <Skeleton className="h-16 w-2/3 rounded-2xl" />
        <Skeleton className="ml-auto h-12 w-1/2 rounded-2xl" />
        <Skeleton className="h-16 w-2/3 rounded-2xl" />
      </div>
    </div>
  );
}

export function ThreadView({ item }: { item: InboxItemDto }) {
  const { user } = useAuth();
  const { data, isLoading, isError, error } = useGetInboxThread(item.sourceId);
  const { replyToInboxThread, isPending } = useReplyToInboxThread();
  const [draft, setDraft] = React.useState("");
  const bottomRef = React.useRef<HTMLDivElement>(null);

  const thread = data?.data;
  const messages = thread?.messages ?? [];

  React.useEffect(() => {
    bottomRef.current?.scrollIntoView({ block: "end" });
  }, [messages.length]);

  React.useEffect(() => {
    setDraft("");
  }, [item.sourceId]);

  const handleSend = () => {
    const body = draft.trim();
    if (!body) return;
    replyToInboxThread(
      { threadId: item.sourceId, body },
      { onSuccess: () => setDraft("") }
    );
  };

  if (isLoading) return <ThreadSkeleton />;

  if (isError || !thread) {
    return (
      <div className="flex h-full flex-col items-center justify-center px-6 text-center">
        <p className="text-[13px] font-semibold text-ink">Couldn't load this conversation</p>
        <p className="mt-1 text-[11.5px] text-ink-3">{error?.message ?? "Something went wrong."}</p>
      </div>
    );
  }

  // No member-name/avatar data on `participants` itself — the header title comes from the
  // distinct non-me senders already in the loaded messages, falling back to the list row's own
  // actorLabel while there's nothing to derive it from yet.
  const otherSenders = Array.from(
    new Map(
      messages.filter((m) => !isMe(m.sender, user?.id)).map((m) => [m.sender, m])
    ).values()
  );
  const headerTitle = otherSenders.length > 0
    ? otherSenders.map((m) => m.senderName).join(", ")
    : item.actorLabel;
  const headerAvatar = otherSenders[0];

  return (
    <div className="flex h-full min-w-0 flex-col">
      <div className="flex items-center justify-between gap-3 border-b border-line px-5 py-4">
        <div className="flex min-w-0 items-center gap-3">
          {headerAvatar?.isAgent ? (
            <PersonAvatar kind="agent" initials={agentInitialsFromName(headerAvatar.senderName)} size="lg" />
          ) : (
            <PersonAvatar
              kind="human"
              initials={initialsFromName(headerAvatar?.senderName ?? item.actorLabel)}
              size="lg"
            />
          )}
          <div className="min-w-0">
            <p className="truncate text-[14px] font-semibold text-ink">{headerTitle}</p>
            {thread.participants.length > 2 && (
              <p className="truncate text-[11.5px] text-ink-3">{thread.participants.length} people</p>
            )}
          </div>
        </div>
      </div>

      <div className="min-h-0 flex-1 space-y-4 overflow-y-auto px-5 py-4">
        {messages.length === 0 ? (
          <p className="text-[12px] text-ink-4">No messages yet.</p>
        ) : (
          messages.map((message) => (
            <MessageBubble key={message.id} message={message} mine={isMe(message.sender, user?.id)} />
          ))
        )}

        <div ref={bottomRef} />
      </div>

      <div className="border-t border-line p-4">
        <div className="flex items-end gap-2 rounded-card border border-line bg-paper px-3.5 py-2.5">
          <input
            value={draft}
            onChange={(e) => setDraft(e.currentTarget.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                e.preventDefault();
                handleSend();
              }
            }}
            placeholder={`Reply to ${headerTitle.split(" ")[0]}…`}
            disabled={isPending}
            className="min-w-0 flex-1 bg-transparent text-[13px] text-ink outline-none placeholder:text-ink-4 disabled:opacity-60"
          />
          <button type="button" className="shrink-0 text-ink-4 hover:text-ink-2" aria-label="Attach a file">
            <Paperclip className="size-4" />
          </button>
          <button type="button" className="shrink-0 text-ink-4 hover:text-ink-2" aria-label="Attach a link">
            <Link2 className="size-4" />
          </button>
          <button
            type="button"
            onClick={handleSend}
            disabled={!draft.trim() || isPending}
            className="flex shrink-0 items-center gap-1 rounded-control bg-ultra px-3 py-1.5 text-[12.5px] font-medium text-white transition-opacity disabled:opacity-40"
          >
            Send
            <ArrowUp className="size-3.5" />
          </button>
        </div>
      </div>
    </div>
  );
}
