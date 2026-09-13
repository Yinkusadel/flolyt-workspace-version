import { Link } from "react-router-dom";
import { ChevronRight, MessagesSquare } from "lucide-react";

import type { AttachedRoom } from "@/pages/inbox/data";

/** Compact, bubble-width room reference — attaches under the message/notice that raised it
 * rather than sitting as a full-width block on its own. Shared by thread-view and notice-view
 * so a human reply and an agent notice reference a room the same way. */
export function AttachedRoomCard({ room }: { room: AttachedRoom }) {
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
