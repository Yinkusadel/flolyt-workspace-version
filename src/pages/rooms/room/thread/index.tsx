import * as React from "react";
import { UserPlus, X } from "lucide-react";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { TextTooltip } from "@/components/ui/text-tooltip";
import { useAuth } from "@/utils/auth-context";
import { useGetRoomPeople } from "@/features/rooms/use-get-room-people";
import { roomLog } from "@/features/rooms/live/room-thread-log";
import { useRoomLiveThread, type RoomLiveConnection } from "@/features/rooms/use-room-live-thread";
import useSendRoomMessage from "@/features/rooms/use-send-room-message";
import type { RoomDetailDto } from "@/services/api/rooms/get-room";
import type { AiConversationMessage } from "@/features/ai-conversations/ai-conversation-types";
import { AddToRoomDialog } from "@/pages/rooms/room/thread/add-to-room-dialog";
import { ThreadComposer } from "@/pages/rooms/room/thread/composer";
import { LiveRunRow } from "@/pages/rooms/room/thread/live-run";
import type { Mentionable } from "@/pages/rooms/room/thread/mentions";
import { MembersDialog } from "@/pages/rooms/room/thread/members-dialog";
import { ThreadRoster, type RosterAgent, type RosterPerson } from "@/pages/rooms/room/thread/roster";
import { ThreadMessage } from "@/pages/rooms/room/thread/thread-message";

const dayLabel = (iso: string) =>
  new Date(iso).toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric", timeZone: "UTC" });

/** The thread header's connection badge: "Live" while the Room feed is connected, else what it is doing about it. */
function ConnectionBadge({ connection, onReconnect }: { connection: RoomLiveConnection; onReconnect: () => void }) {
  if (connection === "connected") {
    return (
      <span className="inline-flex items-center gap-1.5 text-[10.5px] font-medium text-teal">
        <span className="size-1.5 animate-pulse rounded-full bg-teal" />
        Live
      </span>
    );
  }
  if (connection === "connecting" || connection === "reconnecting") {
    return (
      <span className="inline-flex items-center gap-1.5 text-[10.5px] font-medium text-amber" role="status">
        <span className="size-1.5 animate-pulse rounded-full bg-amber" />
        {connection === "connecting" ? "Connecting" : "Reconnecting"}
      </span>
    );
  }
  if (connection === "revoked" || connection === "unavailable") return null; // the body says it
  return (
    <button type="button" onClick={onReconnect} className="inline-flex items-center gap-1.5 text-[10.5px] font-medium text-rose hover:underline">
      <span className="size-1.5 rounded-full bg-rose" />
      Not live. Reconnect
    </button>
  );
}

/**
 * The Room's live thread (one AI conversation per Room, `room.conversationId`), built to `docs/rooms/design/room-thread-panel-mockup.html`.
 * History is read once, then the Room-wide feed (`GET /rooms/{roomId}/stream`) keeps it current through `useRoomLiveThread`: new messages,
 * agents working, streamed answers, handoff cards, steering receipts, delivery-gap notices and agent state dots all come from it.
 * Not built: approval controls (they follow the existing approval contracts, the feed carries none), the unread count, and anchoring a
 * streamed draft under its source message (a draft sits at the end until its committed answer replaces it).
 *
 * People and agents come from `GET /rooms/{roomId}/people` (one call): the roster and the `@` picker both read it. A person whose
 * `displayName` is null stays out of both (never an id or an email as a name).
 */
export function ThreadPanel({
  room,
  conversationId,
  onClose,
}: {
  room: RoomDetailDto;
  conversationId: string;
  onClose: () => void;
}) {
  const { user } = useAuth();
  const [addOpen, setAddOpen] = React.useState(false);
  const [membersOpen, setMembersOpen] = React.useState(false);
  const people = useGetRoomPeople(room.id);
  const roomPeople = people.data?.data.people;
  const roomAgents = people.data?.data.agents ?? room.agents;
  const canContribute = room.conversationPermissions.canContribute;

  // A live message names its author by id only; the name comes from the Room people (null stays null, never an id).
  const nameById = React.useMemo(() => new Map((roomPeople ?? []).map((person) => [person.userId, person.displayName] as const)), [roomPeople]);
  const resolveAuthorName = React.useCallback((userId: string) => nameById.get(userId) ?? null, [nameById]);

  const live = useRoomLiveThread(room.id, conversationId, resolveAuthorName, user ? { id: user.id, name: user.name } : null);
  const timeline = live.timeline;

  // Who can be addressed: the Room's agents, then its named people other than me (a self-mention is skipped by the server).
  const mentionables = React.useMemo<Mentionable[]>(
    () => [
      ...roomAgents.map((agent) => ({ kind: "agent" as const, id: agent.key, label: agent.displayName, role: agent.role })),
      ...(roomPeople ?? [])
        .filter((person) => person.displayName && person.userId !== user?.id)
        .map((person) => ({ kind: "human" as const, id: person.userId, label: person.displayName as string, role: person.role })),
    ],
    [roomAgents, roomPeople, user?.id]
  );
  const namedPeople = React.useMemo<RosterPerson[]>(
    () =>
      (roomPeople ?? [])
        .filter((person) => person.displayName)
        .map((person) => ({ userId: person.userId, displayName: person.displayName as string, role: person.role })),
    [roomPeople]
  );
  const rosterAgents = React.useMemo<RosterAgent[]>(
    () =>
      roomAgents.map((agent) => ({
        key: agent.key,
        displayName: agent.displayName,
        role: agent.role,
        whatItWillDo: "whatItWillDo" in agent ? (agent as { whatItWillDo: string }).whatItWillDo : undefined,
      })),
    [roomAgents]
  );

  // One colour per person: the four team colours are handed out in order of first appearance in this thread, so
  // everyone viewing the same history sees the same colours, and up to four authors never share one.
  const teamByAuthor = React.useMemo(() => {
    const slots = new Map<string, 1 | 2 | 3 | 4>();
    for (const item of timeline) {
      if (item.kind !== "message" || item.row.role !== "user") continue;
      const key: string = item.row.authorUserId ?? item.row.authorName ?? "";
      if (key && !slots.has(key)) slots.set(key, ((slots.size % 4) + 1) as 1 | 2 | 3 | 4);
    }
    // People who haven't spoken yet take the next slots, so the roster matches the colours they get later.
    for (const person of roomPeople ?? []) {
      if (!slots.has(person.userId)) slots.set(person.userId, ((slots.size % 4) + 1) as 1 | 2 | 3 | 4);
    }
    return slots;
  }, [timeline, roomPeople]);

  const { sendRoomMessage, isPending } = useSendRoomMessage();
  const send = (message: string, replyMode: "auto" | "none") => {
    // Shown at once; a failed send takes it back out (the hook already says why).
    roomLog("Send clicked", { replyMode, message });
    const pendingId = live.addPending(message);
    sendRoomMessage({ conversationId, message, replyMode }, { onError: () => live.removePending(pendingId) });
  };

  // Keep the newest thing in view: on first load, when the thread grows and while a streamed answer lengthens, but only if the
  // reader is already near the bottom (never yank someone who scrolled up to read).
  const scrollRef = React.useRef<HTMLDivElement>(null);
  const stickToBottom = React.useRef(true);
  const lastTail = timeline.at(-1);
  const tailSize = lastTail?.kind === "live-run" ? (lastTail.run.markdown?.length ?? 0) : 0;
  React.useEffect(() => {
    const el = scrollRef.current;
    if (el && stickToBottom.current) el.scrollTop = el.scrollHeight;
  }, [timeline.length, tailSize]);

  // Only the latest agent reply keeps its suggestions.
  const lastAssistantKey = [...timeline].reverse().find((item) => item.kind === "message" && item.row.role === "assistant")?.key ?? null;

  const unavailable = live.connection === "revoked" || live.connection === "unavailable";

  return (
    <section aria-label="Room thread" className="flex h-full min-h-0 flex-col rounded-panel border border-line bg-paper">
      <header className="shrink-0 border-b border-line px-4 py-3">
        <div className="flex items-start justify-between gap-3">
          <div className="min-w-0">
            <h2 className="flex items-center gap-2.5 text-[13.5px] font-semibold text-ink">
              Room thread
              <ConnectionBadge connection={live.connection} onReconnect={live.reconnect} />
            </h2>
            <p className="mt-0.5 truncate text-[11.5px] text-ink-3">{room.title}</p>
          </div>
          <div className="flex shrink-0 items-center gap-1">
            {canContribute && (
              <TextTooltip content="Add people or agents">
                <button
                  type="button"
                  onClick={() => setAddOpen(true)}
                  aria-label="Add people or agents"
                  className="flex size-7 items-center justify-center rounded-control text-ink-3 hover:bg-paper-2 hover:text-ink"
                >
                  <UserPlus className="size-4" />
                </button>
              </TextTooltip>
            )}
            <button
              type="button"
              onClick={onClose}
              aria-label="Close the thread"
              className="flex size-7 items-center justify-center rounded-control text-ink-3 hover:bg-paper-2 hover:text-ink"
            >
              <X className="size-4" />
            </button>
          </div>
        </div>

        <ThreadRoster
          people={namedPeople}
          agents={rosterAgents}
          teamFor={(userId) => teamByAuthor.get(userId) ?? 1}
          activity={live.activity}
          onOpen={() => setMembersOpen(true)}
        />
      </header>

      <div
        ref={scrollRef}
        onScroll={(event) => {
          const el = event.currentTarget;
          stickToBottom.current = el.scrollHeight - el.scrollTop - el.clientHeight < 80;
        }}
        className="min-h-0 flex-1 space-y-4 overflow-y-auto px-4 py-4"
      >
        {unavailable ? (
          <div className="rounded-card border border-dashed border-line bg-paper p-6 text-center">
            <p className="text-[12.5px] font-semibold text-ink">
              {live.connection === "revoked" ? "You no longer have access to this thread" : "This thread is no longer available"}
            </p>
            <p className="mt-1 text-[11.5px] text-ink-3">It may have been archived or restricted. Reload the page if you think this is a mistake.</p>
          </div>
        ) : live.isPending ? (
          <div className="space-y-4" aria-busy="true" aria-label="Loading the thread">
            {[0, 1, 2].map((i) => (
              <div key={i} className="flex gap-2.5">
                <Skeleton className="size-8 shrink-0 rounded-full" />
                <div className="flex-1 space-y-2">
                  <Skeleton className="h-3 w-28" />
                  <Skeleton className="h-14 w-full rounded-card" />
                </div>
              </div>
            ))}
          </div>
        ) : live.isError ? (
          <div className="rounded-card border border-dashed border-line bg-paper p-6 text-center">
            <p className="text-[12.5px] font-semibold text-ink">{live.error?.message || "The thread couldn't be loaded"}</p>
            <Button type="button" variant="outline" size="sm" className="mt-3" onClick={() => live.refetchHistory()}>
              Retry
            </Button>
          </div>
        ) : timeline.length === 0 ? (
          <div className="rounded-card border border-dashed border-line bg-paper p-6 text-center">
            <p className="text-[12.5px] font-semibold text-ink">Nothing has been said yet</p>
            <p className="mt-1 text-[11.5px] text-ink-3">
              {canContribute
                ? "Ask an agent or leave a note for the people in this Room."
                : "Messages from this Room's people and agents will show here."}
            </p>
          </div>
        ) : (
          timeline.map((item, index) => {
            const stamp: string | undefined = item.kind === "live-run" ? undefined : item.row.timestamp;
            const previous = timeline[index - 1];
            const previousStamp: string | undefined = previous && previous.kind !== "live-run" ? previous.row.timestamp : undefined;
            const showDay = !!stamp && (!previousStamp || dayLabel(stamp) !== dayLabel(previousStamp));
            return (
              <React.Fragment key={item.key}>
                {showDay && stamp && (
                  <p className="text-center font-mono text-[10px] tracking-[0.6px] text-ink-4 uppercase">{dayLabel(stamp)}</p>
                )}
                {item.kind === "live-run" ? (
                  <LiveRunRow run={item.run} />
                ) : (
                  <ThreadMessage
                    message={item.row as AiConversationMessage}
                    mentionables={mentionables}
                    canFollowUp={canContribute && !isPending}
                    showFollowUps={item.key === lastAssistantKey}
                    currentUserId={user?.id ?? null}
                    team={teamByAuthor.get(item.row.authorUserId ?? item.row.authorName ?? "") ?? 1}
                    onFollowUp={(prompt) => send(prompt, "auto")}
                  />
                )}
              </React.Fragment>
            );
          })
        )}
      </div>

      <footer className={cn("shrink-0 border-t border-line p-3", unavailable && "pointer-events-none opacity-50")}>
        {canContribute ? (
          <ThreadComposer conversationId={conversationId} mentionables={mentionables} isSending={isPending} onSend={send} />
        ) : (
          <p className="px-1 py-2 text-center text-[11.5px] text-ink-3">You can read this thread but not post in it.</p>
        )}
      </footer>
      <MembersDialog
        open={membersOpen}
        onOpenChange={setMembersOpen}
        people={namedPeople}
        agents={rosterAgents}
        teamFor={(userId) => teamByAuthor.get(userId) ?? 1}
        onAdd={
          canContribute
            ? () => {
                // One dialog at a time: close this one before opening the add form.
                setMembersOpen(false);
                setAddOpen(true);
              }
            : undefined
        }
      />
      <AddToRoomDialog roomId={room.id} open={addOpen} onOpenChange={setAddOpen} />
    </section>
  );
}
