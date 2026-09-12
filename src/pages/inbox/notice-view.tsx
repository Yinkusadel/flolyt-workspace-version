import { Link } from "react-router-dom";
import { Sparkles } from "lucide-react";

import { PersonAvatar } from "@/components/person-avatar";
import { Button } from "@/components/ui/button";
import type { NoticeItem } from "@/pages/inbox/data";
import { agentInitialsFromName } from "@/pages/rooms/format";

export function NoticeView({ item }: { item: NoticeItem }) {
  return (
    <div className="flex h-full min-w-0 flex-col overflow-y-auto">
      <div className="flex items-start gap-3 border-b border-line px-5 py-4">
        {item.agentName ? (
          <PersonAvatar kind="agent" initials={agentInitialsFromName(item.agentName)} size="lg" />
        ) : (
          <span className="flex size-8 shrink-0 items-center justify-center rounded-full border-[1.5px] border-dashed border-ultra-border text-ultra">
            <Sparkles className="size-3.5" />
          </span>
        )}
        <div className="min-w-0">
          <p className="text-[15px] font-semibold text-ink">{item.title}</p>
          <p className="mt-0.5 text-[11.5px] text-ink-3">{item.timestamp} ago</p>
        </div>
      </div>

      <div className="space-y-5 px-5 py-5">
        <p className="text-[13.5px] leading-relaxed text-ink-2">{item.preview}</p>

        <Button asChild variant="outline">
          <Link to="/rooms">Open the room</Link>
        </Button>

        <p className="text-[11.5px] text-ink-4">This is a system notice from a room — nothing to reply to here.</p>
      </div>
    </div>
  );
}
