import * as React from "react";
import { X } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { PersonAvatar } from "@/components/person-avatar";
import { agentInitialsFromName } from "@/lib/initials";
import { useAuth } from "@/utils/auth-context";
import { useGetRoomPeople } from "@/features/rooms/use-get-room-people";
import { useGetRoomThread } from "@/features/rooms/use-get-room-thread";
import useSendRoomMessage from "@/features/rooms/use-send-room-message";
import type { RoomDetailDto } from "@/services/api/rooms/get-room";
import { ThreadComposer } from "@/pages/rooms/room/thread/composer";
import { ThreadMessage } from "@/pages/rooms/room/thread/thread-message";

/** How long the working line may wait for the answer before it gives up (the feed will replace this guess). */
const WORKING_LINE_MAX_MS = 3 * 60 * 1000;

const dayLabel = (iso: string) =>
  new Date(iso).toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric", timeZone: "UTC" });

/**
 * The Room's live thread (one AI conversation per Room, `room.conversationId`). Built to
 * `docs/rooms/design/room-thread-panel-mockup.html`. SLICE 1: history, roster, composer and send. Not here yet and
 * waiting on the backend's reducer + a real feed capture: the Room-wide SSE feed (`GET /rooms/{roomId}/stream`),
 * agent state dots, approval cards, steering receipts, the delivery-gap notice, the Live indicator.
 * Until then new messages arrive by re-reading the conversation (see `useGetRoomThread`).
 *
 * ❌ Backend does NOT provide: names for the people on a Room (`GET /rooms/{roomId}/people` has user ids only), so the
 * roster shows a people count and message authors come from each message's own `authorName`.
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
  const thread = useGetRoomThread(conversationId);
  const people = useGetRoomPeople(room.id);
  const peopleCount = people.data?.data.people.length ?? null;
  const canContribute = room.conversationPermissions.canContribute;

  const messages = React.useMemo(() => thread.data?.data.messages ?? [], [thread.data]);
  const shown = React.useMemo(
    () => messages.filter((m) => m.role === "user" || m.role === "assistant" || m.role === "handoff" || m.role === "steering"),
    [messages]
  );

  // One colour per person: the four team colours are handed out in order of first appearance in this thread, so
  // everyone viewing the same history sees the same colours, and up to four authors never share one.
  const teamByAuthor = React.useMemo(() => {
    const slots = new Map<string, 1 | 2 | 3 | 4>();
    for (const m of messages) {
      const key = m.role === "user" ? (m.authorUserId ?? m.authorName ?? "") : "";
      if (key && !slots.has(key)) slots.set(key, ((slots.size % 4) + 1) as 1 | 2 | 3 | 4);
    }
    return slots;
  }, [messages]);

  // A run started by my own send: the answer is "being worked on" until a reply for that run is in the thread.
  const [working, setWorking] = React.useState<{ runId: string; agentKey: string | null; startedAt: number } | null>(null);
  React.useEffect(() => {
    if (!working) return;
    if (messages.some((m) => m.role === "assistant" && m.runId === working.runId)) {
      setWorking(null);
      return;
    }
    const left = WORKING_LINE_MAX_MS - (Date.now() - working.startedAt);
    const timer = window.setTimeout(() => setWorking(null), Math.max(left, 0));
    return () => window.clearTimeout(timer);
  }, [messages, working]);

  const { sendRoomMessage, isPending } = useSendRoomMessage({
    onSuccess: (receipt) => {
      if (receipt.runId) setWorking({ runId: receipt.runId, agentKey: receipt.agentKey, startedAt: Date.now() });
    },
  });
  const send = (message: string, replyMode: "auto" | "none") => sendRoomMessage({ conversationId, message, replyMode });

  // Keep the newest message in view: on first load and whenever the thread grows.
  const scrollRef = React.useRef<HTMLDivElement>(null);
  React.useEffect(() => {
    const el = scrollRef.current;
    if (el) el.scrollTop = el.scrollHeight;
  }, [shown.length, working]);

  const workingAgent = working?.agentKey ? room.agents.find((agent) => agent.key === working.agentKey) : null;
  const workingName = workingAgent?.displayName ?? "An agent";

  return (
    <section aria-label="Room thread" className="flex h-full min-h-0 flex-col rounded-panel border border-line bg-paper">
      <header className="shrink-0 border-b border-line px-4 py-3">
        <div className="flex items-start justify-between gap-3">
          <div className="min-w-0">
            <h2 className="text-[13.5px] font-semibold text-ink">Room thread</h2>
            <p className="mt-0.5 truncate text-[11.5px] text-ink-3">{room.title}</p>
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close the thread"
            className="flex size-7 shrink-0 items-center justify-center rounded-control text-ink-3 hover:bg-paper-2 hover:text-ink"
          >
            <X className="size-4" />
          </button>
        </div>

        <div className="mt-3 flex flex-wrap items-center gap-x-3 gap-y-1.5">
          {room.agents.length === 0 ? (
            <span className="text-[11.5px] text-ink-3">No agents on this Room yet.</span>
          ) : (
            room.agents.map((agent) => (
              <span key={agent.key} className="inline-flex items-center gap-1.5" title={agent.role}>
                <PersonAvatar kind="agent" size="sm" initials={agentInitialsFromName(agent.displayName)} />
                <span className="text-[11.5px] text-ink-2">{agent.displayName}</span>
              </span>
            ))
          )}
          {peopleCount !== null && (
            <span className="text-[11.5px] text-ink-3">
              {peopleCount} {peopleCount === 1 ? "person" : "people"}
            </span>
          )}
        </div>
      </header>

      <div ref={scrollRef} className="min-h-0 flex-1 space-y-4 overflow-y-auto px-4 py-4">
        {thread.isPending ? (
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
        ) : thread.isError ? (
          <div className="rounded-card border border-dashed border-line bg-paper p-6 text-center">
            <p className="text-[12.5px] font-semibold text-ink">{thread.error.message || "The thread couldn't be loaded"}</p>
            <Button type="button" variant="outline" size="sm" className="mt-3" onClick={() => thread.refetch()}>
              Retry
            </Button>
          </div>
        ) : shown.length === 0 ? (
          <div className="rounded-card border border-dashed border-line bg-paper p-6 text-center">
            <p className="text-[12.5px] font-semibold text-ink">Nothing has been said yet</p>
            <p className="mt-1 text-[11.5px] text-ink-3">
              {canContribute
                ? "Ask an agent or leave a note for the people in this Room."
                : "Messages from this Room's people and agents will show here."}
            </p>
          </div>
        ) : (
          shown.map((message, index) => {
            const day = dayLabel(message.timestamp);
            const showDay = index === 0 || day !== dayLabel(shown[index - 1].timestamp);
            return (
              <React.Fragment key={`${message.timestamp}-${index}`}>
                {showDay && (
                  <p className="text-center font-mono text-[10px] tracking-[0.6px] text-ink-4 uppercase">{day}</p>
                )}
                <ThreadMessage
                  message={message}
                  agents={room.agents}
                  canFollowUp={canContribute && !isPending}
                  currentUserId={user?.id ?? null}
                  team={teamByAuthor.get(message.authorUserId ?? message.authorName ?? "") ?? 1}
                  onFollowUp={(prompt) => send(prompt, "auto")}
                />
              </React.Fragment>
            );
          })
        )}

        {working && (
          <div className="flex items-center gap-2.5">
            <PersonAvatar kind="agent" size="lg" initials={agentInitialsFromName(workingName)} />
            <p className="animate-pulse text-[12px] text-ink-3 italic">{workingName} is working on this</p>
          </div>
        )}
      </div>

      <footer className="shrink-0 border-t border-line p-3">
        {canContribute ? (
          <ThreadComposer conversationId={conversationId} agents={room.agents} isSending={isPending} onSend={send} />
        ) : (
          <p className="px-1 py-2 text-center text-[11.5px] text-ink-3">You can read this thread but not post in it.</p>
        )}
      </footer>
    </section>
  );
}
