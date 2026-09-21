import * as React from "react";
import { ArrowUp, Ban, ChevronDown, Plus, Users } from "lucide-react";

import { cn } from "@/lib/utils";
import { PersonAvatar } from "@/components/person-avatar";
import { Chip } from "@/components/ui/chip";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { EmojiPickerButton } from "@/components/ui/emoji-picker";
import { Skeleton } from "@/components/ui/skeleton";
import { TextTooltip } from "@/components/ui/text-tooltip";
import { useAuth } from "@/utils/auth-context";
import { agentInitialsFromName, formatRoomActivity, initialsFromName } from "@/pages/rooms/format";
import { AttachedRoomCard } from "@/pages/inbox/attached-room-card";
import { EditMessageModal } from "@/pages/inbox/edit-message-modal";
import { formatAttachedRoom } from "@/pages/inbox/kind";
import { ConfirmModal } from "@/pages/onboarding/team/confirm-modal";
import { useGetInboxThread } from "@/features/inbox/use-get-inbox-thread";
import useReplyToInboxThread from "@/features/inbox/use-reply-to-inbox-thread";
import useUpdateInboxMessage from "@/features/inbox/use-update-inbox-message";
import useDeleteInboxMessage from "@/features/inbox/use-delete-inbox-message";
import type { InboxItemDto } from "@/services/api/inbox/get-inbox";
import type { InboxThreadMessageDto } from "@/services/api/inbox/get-inbox-thread";

/** The thread endpoint gives no member ref for "who am I" — matched loosely against the signed-in
 * user's own id (plain guid) since `sender` comes back as a `human:{guid}` ref; not confirmed live
 * yet, flagged in docs/inbox/build-plan.md. */
function isMe(sender: string, userId: string | undefined): boolean {
  if (!userId) return false;
  return sender === userId || sender.endsWith(`:${userId}`);
}

/** Mirrors the tail trick from conversations/detail-route.tsx's user bubble, flipped for the left
 * side. No "You" label on own messages and the timestamp sits inline at the end of the bubble's
 * text (float, WhatsApp-style) rather than on its own row above — the side + color already say
 * whose message it is. The other side keeps a name above the bubble, useful once a thread has
 * more than two participants. */
function MessageBubble({
  message,
  mine,
  threadId,
}: {
  message: InboxThreadMessageDto;
  mine: boolean;
  threadId: string;
}) {
  const [isEditing, setIsEditing] = React.useState(false);
  const [confirmDelete, setConfirmDelete] = React.useState(false);
  const { updateInboxMessage, isPending: isSaving } = useUpdateInboxMessage({ threadId });
  const { deleteInboxMessage, isPending: isDeleting } = useDeleteInboxMessage({ threadId });

  return (
    <div className={cn("group flex flex-col gap-1", mine ? "items-end" : "items-start")}>
      {!mine && (
        <span className="px-3 text-[11.5px] font-semibold text-ink-2">{message.senderName}</span>
      )}

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
        {message.isDeleted ? (
          <div
            className={cn(
              "flex items-center gap-1.5 rounded-2xl py-2.5 pr-4 pl-3.5 text-[13px] italic",
              mine ? "rounded-tr-none bg-ultra/55 text-paper/85" : "rounded-tl-none bg-paper-2/70 text-ink-3"
            )}
          >
            <Ban className="size-3.5 shrink-0" />
            <span>{mine ? "You deleted this message" : "This message was deleted"}</span>
            <span
              className={cn(
                "ml-auto shrink-0 text-[10px] whitespace-nowrap not-italic",
                mine ? "text-paper/60" : "text-ink-4"
              )}
            >
              {formatRoomActivity(message.sentAtUtc)}
            </span>
          </div>
        ) : (
          <div
            className={cn(
              "relative rounded-2xl py-2.5 pl-4 text-[13px] leading-relaxed wrap-break-word",
              mine
                ? "rounded-tr-none bg-ultra pr-6 text-paper shadow-xs"
                : "rounded-tl-none bg-paper-2 pr-4 text-ink"
            )}
          >
            {mine && (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <button
                    type="button"
                    aria-label="Message options"
                    className="absolute top-1.5 right-1.5 flex size-5 items-center justify-center rounded-full bg-black/10 text-paper/90 opacity-0 transition-opacity group-hover:opacity-100 hover:bg-black/20 focus-visible:opacity-100"
                  >
                    <ChevronDown className="size-3" />
                  </button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem onSelect={() => setIsEditing(true)}>Edit</DropdownMenuItem>
                  <DropdownMenuItem
                    variant="destructive"
                    onSelect={() => setConfirmDelete(true)}
                  >
                    Delete
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            )}

            {message.body}
            <span
              className={cn(
                "float-right mt-1 ml-2 translate-y-1 text-[10px] whitespace-nowrap",
                mine ? "text-paper/70" : "text-ink-4"
              )}
            >
              {message.editedAtUtc && "Edited "}
              {formatRoomActivity(message.editedAtUtc ?? message.sentAtUtc)}
            </span>
          </div>
        )}
      </div>

      {message.room && <AttachedRoomCard room={formatAttachedRoom(message.room)} />}

      {mine && !message.isDeleted && (
        <>
          <EditMessageModal
            open={isEditing}
            onOpenChange={setIsEditing}
            message={message}
            isPending={isSaving}
            onSave={(body) =>
              updateInboxMessage(
                { messageId: message.id, body, roomId: message.roomId },
                { onSuccess: (res) => res.succeeded && setIsEditing(false) }
              )
            }
          />
          <ConfirmModal
            open={confirmDelete}
            onOpenChange={setConfirmDelete}
            title="Delete this message?"
            description="This can't be undone. It stays in the conversation, marked deleted."
            confirmLabel="Delete"
            pendingLabel="Deleting…"
            isPending={isDeleting}
            onConfirm={() =>
              deleteInboxMessage(message.id, {
                onSuccess: (res) => res.succeeded && setConfirmDelete(false),
              })
            }
          />
        </>
      )}
    </div>
  );
}

/** Merging `others` and message-sender names can produce the same person twice under slightly
 * different strings (confirmed live: a recipient named with a double space, `"testing  invitation"`,
 * next to a sender name for the same person without it) — dedupes on a normalized key while
 * keeping each name's original (first-seen) display spelling. */
function dedupeNames(names: string[]): string[] {
  const seen = new Set<string>();
  const result: string[] = [];
  for (const raw of names) {
    const name = raw.trim();
    const key = name.replace(/\s+/g, " ").toLowerCase();
    if (!name || seen.has(key)) continue;
    seen.add(key);
    result.push(name);
  }
  return result;
}

/** Same tile as the sidebar's group rows (`list-pane.tsx`'s `KindTile`) — kept in sync
 * deliberately rather than shared, since the two call sites differ enough (row height, kind
 * switch) that a shared component would need its own prop surface for no real reuse benefit. */
function GroupAvatar() {
  return (
    <span className="flex size-8 shrink-0 items-center justify-center rounded-full border border-line bg-paper-2 text-ink-3">
      <Users className="size-3.5" />
    </span>
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
  const textareaRef = React.useRef<HTMLTextAreaElement>(null);

  const thread = data?.data;
  const messages = thread?.messages ?? [];

  React.useEffect(() => {
    bottomRef.current?.scrollIntoView({ block: "end" });
  }, [messages.length]);

  React.useEffect(() => {
    setDraft("");
  }, [item.sourceId]);

  // Grows with the draft, capped so a long paste doesn't take over the screen — matches the
  // reference input's expanding-pill behaviour.
  React.useEffect(() => {
    const el = textareaRef.current;
    if (!el) return;
    el.style.height = "auto";
    el.style.height = `${Math.min(el.scrollHeight, 128)}px`;
  }, [draft]);

  const handleSend = () => {
    const body = draft.trim();
    if (!body) return;
    replyToInboxThread(
      { threadId: item.sourceId, body },
      { onSuccess: () => setDraft("") }
    );
  };

  const handleInsertEmoji = (emoji: string) => {
    const textarea = textareaRef.current;
    if (!textarea) {
      setDraft((prev) => prev + emoji);
      return;
    }
    const start = textarea.selectionStart ?? draft.length;
    const end = textarea.selectionEnd ?? draft.length;
    setDraft(draft.slice(0, start) + emoji + draft.slice(end));
    // No textarea.focus() here — the picker stays open across multiple picks, and stealing
    // focus back to the textarea would read as a focus-outside event and close the popover.
    requestAnimationFrame(() => {
      const cursor = start + emoji.length;
      textarea.setSelectionRange(cursor, cursor);
    });
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

  // No member-name/avatar data on `participants` itself — `item.others` (recipients minus you,
  // already real display names) is the reliable source since it's populated even before anyone
  // but you has sent a message; the distinct non-me senders already in the loaded messages fill
  // in anyone `others` missed, and the list row's own actorLabel is the last resort.
  const otherSenders = Array.from(
    new Map(
      messages.filter((m) => !isMe(m.sender, user?.id)).map((m) => [m.sender, m])
    ).values()
  );
  const participantNames = dedupeNames([...item.others, ...otherSenders.map((m) => m.senderName)]);
  if (participantNames.length === 0) participantNames.push(item.actorLabel);
  // `thread.participants.length` (a real per-participant ref count from the backend) is the
  // source of truth for how many others are actually in this thread — `participantNames` can
  // undercount when someone hasn't spoken yet and wasn't in `others` either, so the "+N" badge is
  // sized off the trustworthy count, not just however many names we managed to resolve.
  const otherCount = Math.max(thread.participants.length, participantNames.length);
  const isGroup = otherCount > 1;
  const shownNames = participantNames.slice(0, 2);
  const extraCount = Math.max(otherCount - shownNames.length, 0);
  const headerAvatarName = participantNames[0] ?? item.actorLabel;
  const headerAvatarIsAgent = otherSenders.find((m) => m.senderName === headerAvatarName)?.isAgent ?? false;

  return (
    <div className="flex h-full min-w-0 flex-col">
      <div className="flex items-center justify-between gap-3 border-b border-line px-5 py-4">
        <div className="flex min-w-0 items-center gap-3">
          {isGroup ? (
            <GroupAvatar />
          ) : headerAvatarIsAgent ? (
            <PersonAvatar kind="agent" initials={agentInitialsFromName(headerAvatarName)} size="lg" />
          ) : (
            <PersonAvatar kind="human" initials={initialsFromName(headerAvatarName)} size="lg" />
          )}
          <div className="min-w-0">
            <div className="flex min-w-0 items-center gap-1.5">
              <TextTooltip
                content={participantNames.join(", ")}
                className="min-w-0 truncate text-[14px] font-semibold text-ink"
              >
                {shownNames.join(", ")}
              </TextTooltip>
              {extraCount > 0 && (
                <Chip tone="neutral" className="shrink-0">
                  +{extraCount} other{extraCount === 1 ? "" : "s"}
                </Chip>
              )}
            </div>
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
            <MessageBubble
              key={message.id}
              message={message}
              mine={isMe(message.sender, user?.id)}
              threadId={item.sourceId}
            />
          ))
        )}

        <div ref={bottomRef} />
      </div>

      <div className="p-4">
        <div className="flex items-end gap-2">
          <button
            type="button"
            className="flex size-9 shrink-0 items-center justify-center rounded-full bg-ultra-bg text-ultra transition-colors hover:bg-ultra-bg/70"
            aria-label="Add"
          >
            <Plus className="size-4" />
          </button>

          <div className="flex min-w-0 flex-1 items-end gap-2 rounded-3xl bg-ultra-bg px-4 py-2.5">
            <textarea
              ref={textareaRef}
              value={draft}
              onChange={(e) => setDraft(e.currentTarget.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter" && !e.shiftKey) {
                  e.preventDefault();
                  handleSend();
                }
              }}
              placeholder={`Reply to ${headerAvatarName.split(" ")[0]}…`}
              disabled={isPending}
              rows={1}
              className="max-h-32 min-w-0 flex-1 resize-none overflow-y-auto bg-transparent text-[13px] text-ink outline-none placeholder:text-ink-4 disabled:opacity-60"
            />
            <EmojiPickerButton onSelect={handleInsertEmoji} className="mb-0.5" />
          </div>

          <button
            type="button"
            onClick={handleSend}
            disabled={!draft.trim() || isPending}
            className="flex size-9 shrink-0 items-center justify-center rounded-full bg-ultra text-white transition-opacity disabled:opacity-40"
            aria-label="Send"
          >
            <ArrowUp className="size-4" />
          </button>
        </div>
      </div>
    </div>
  );
}
