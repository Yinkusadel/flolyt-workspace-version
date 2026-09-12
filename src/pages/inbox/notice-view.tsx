import { Sparkles } from "lucide-react";

import { PersonAvatar } from "@/components/person-avatar";
import type { NoticeItem } from "@/pages/inbox/data";
import { agentInitialsFromName } from "@/pages/rooms/format";
import { AttachedRoomCard } from "@/pages/inbox/attached-room-card";

function roomLabelFromTitle(title: string): string {
  return title.match(/Room \d+/)?.[0] ?? "Open the room";
}

export function NoticeView({ item }: { item: NoticeItem }) {
  return (
    <div className="flex h-full min-w-0 flex-col overflow-y-auto">
      <div className="flex items-center gap-3 border-b border-line px-5 py-4">
        {item.agentName ? (
          <PersonAvatar kind="agent" initials={agentInitialsFromName(item.agentName)} size="lg" />
        ) : (
          <span className="flex size-8 shrink-0 items-center justify-center rounded-full border-[1.5px] border-dashed border-ultra-border text-ultra">
            <Sparkles className="size-3.5" />
          </span>
        )}
        <div className="min-w-0">
          <p className="truncate text-[14px] font-semibold text-ink">{item.title}</p>
          <p className="truncate text-[11.5px] text-ink-3">{item.timestamp} ago</p>
        </div>
      </div>

      <div className="min-h-0 flex-1 space-y-4 px-5 py-4">
        {/* Same bubble treatment as an incoming human reply in thread-view, so an agent's
            update reads as one more message in the inbox rather than a bespoke system panel. */}
        <div className="flex flex-col items-start gap-1.5">
          <div className="relative max-w-[75%] min-w-0 pl-2">
            <span
              aria-hidden
              className="absolute top-0 left-0 size-0"
              style={{
                borderStyle: "solid",
                borderWidth: "8px 0 0 8px",
                borderColor: "var(--color-paper-2) transparent transparent transparent",
              }}
            />
            <div className="rounded-2xl rounded-tl-none bg-paper-2 px-4 py-2.5 text-[13px] leading-relaxed wrap-break-word text-ink">
              {item.preview}
            </div>
          </div>

          <AttachedRoomCard
            room={{ label: roomLabelFromTitle(item.title), subtitle: "Open the full room" }}
          />
        </div>

        <p className="text-[11.5px] text-ink-4">This is a system notice from a room — nothing to reply to here.</p>
      </div>
    </div>
  );
}
