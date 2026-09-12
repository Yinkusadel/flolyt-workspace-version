import * as React from "react";
import { Link } from "react-router-dom";
import { ChevronRight, MessagesSquare, Paperclip, Link2, ArrowUp } from "lucide-react";

import { cn } from "@/lib/utils";
import { PersonAvatar } from "@/components/person-avatar";
import { Chip } from "@/components/ui/chip";
import { ME, type AttachedRoom, type InboxMessage, type ThreadItem } from "@/pages/inbox/data";

/** Compact, bubble-width attachment for the message that actually referenced the room — not a
 * full-width block detached from who brought it up. */
function AttachedRoomCard({ room }: { room: AttachedRoom }) {
  return (
    <Link
      to="/rooms"
      className="flex max-w-[75%] min-w-0 items-center gap-2.5 rounded-card border border-line bg-paper px-3 py-2 transition-colors hover:border-ink-4"
    >
      <MessagesSquare className="size-3.5 shrink-0 text-ink-3" />
      <div className="min-w-0 flex-1">
        <p className="truncate text-[11.5px] font-semibold text-ink">{room.label}</p>
        <p className="truncate text-[10.5px] text-ink-3">{room.subtitle}</p>
      </div>
      <ChevronRight className="size-3.5 shrink-0 text-ink-4" />
    </Link>
  );
}

/** Mirrors the tail trick from conversations/detail-route.tsx's user bubble, flipped for the left side. */
function MessageBubble({ message }: { message: InboxMessage }) {
  const isMe = message.person.name === ME.name;

  return (
    <div className={cn("flex flex-col gap-1", isMe ? "items-end" : "items-start")}>
      <div className="flex items-baseline gap-2 px-1">
        <span className="text-[11.5px] font-semibold text-ink-2">{isMe ? "You" : message.person.name}</span>
        <span className="text-[11px] text-ink-4">{message.timestamp}</span>
      </div>

      <div className={cn("relative max-w-[75%] min-w-0", isMe ? "pr-2" : "pl-2")}>
        <span
          aria-hidden
          className={cn("absolute top-0 size-0", isMe ? "right-0" : "left-0")}
          style={
            isMe
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
            isMe ? "rounded-tr-none bg-ultra text-paper shadow-xs" : "rounded-tl-none bg-paper-2 text-ink"
          )}
        >
          {message.text}
        </div>
      </div>

      {message.attachedRoom && <AttachedRoomCard room={message.attachedRoom} />}
    </div>
  );
}

export function ThreadView({ item }: { item: ThreadItem }) {
  const [messages, setMessages] = React.useState<InboxMessage[]>(
    item.thread ?? [{ person: item.person, timestamp: item.timestamp, text: item.preview.join(" ") }]
  );
  const [draft, setDraft] = React.useState("");
  const bottomRef = React.useRef<HTMLDivElement>(null);

  React.useEffect(() => {
    setMessages(item.thread ?? [{ person: item.person, timestamp: item.timestamp, text: item.preview.join(" ") }]);
    setDraft("");
  }, [item]);

  React.useEffect(() => {
    bottomRef.current?.scrollIntoView({ block: "end" });
  }, [messages]);

  const handleSend = () => {
    const text = draft.trim();
    if (!text) return;
    setMessages((prev) => [...prev, { person: ME, timestamp: "now", text }]);
    setDraft("");
  };

  return (
    <div className="flex h-full min-w-0 flex-col">
      <div className="flex items-center justify-between gap-3 border-b border-line px-5 py-4">
        <div className="flex min-w-0 items-center gap-3">
          <PersonAvatar kind="human" initials={item.person.initials} team={item.person.team} size="lg" />
          <div className="min-w-0">
            <p className="truncate text-[14px] font-semibold text-ink">{item.person.name}</p>
            {item.personSubtitle && <p className="truncate text-[11.5px] text-ink-3">{item.personSubtitle}</p>}
          </div>
        </div>
        {item.roomLabel && <Chip tone="neutral">{item.roomLabel}</Chip>}
      </div>

      <div className="min-h-0 flex-1 space-y-4 overflow-y-auto px-5 py-4">
        {messages.map((message, i) => (
          <MessageBubble key={i} message={message} />
        ))}

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
            placeholder={`Reply to ${item.person.name.split(" ")[0]}…`}
            className="min-w-0 flex-1 bg-transparent text-[13px] text-ink outline-none placeholder:text-ink-4"
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
            disabled={!draft.trim()}
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
