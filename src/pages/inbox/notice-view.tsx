import { AtSign, ExternalLink, Sparkles } from "lucide-react";
import { Link } from "react-router-dom";

import { PersonAvatar } from "@/components/person-avatar";
import { Chip } from "@/components/ui/chip";
import { agentInitialsFromName, formatRoomActivity } from "@/pages/rooms/format";
import { AttachedRoomCard } from "@/pages/inbox/attached-room-card";
import { KIND_LABEL, isProposalKind } from "@/pages/inbox/kind";
import type { InboxItemDto } from "@/services/api/inbox/get-inbox";

/**
 * Renders `Assignment / Investigation / Obligation / Finished / Notification / Mention` entirely
 * from the `GET /inbox` list row — there's no dedicated detail endpoint for any of these, unlike
 * threads and proposals (see docs/inbox/build-plan.md).
 */
function NoticeIcon({ item }: { item: InboxItemDto }) {
  if (item.kind === "Mention") {
    return (
      <span className="flex size-8 shrink-0 items-center justify-center rounded-full border-[1.5px] border-dashed border-ultra-border text-ultra">
        <AtSign className="size-3.5" />
      </span>
    );
  }

  if (item.actorLabel) {
    return <PersonAvatar kind="agent" initials={agentInitialsFromName(item.actorLabel)} size="lg" />;
  }

  return (
    <span className="flex size-8 shrink-0 items-center justify-center rounded-full border-[1.5px] border-dashed border-ultra-border text-ultra">
      <Sparkles className="size-3.5" />
    </span>
  );
}

export function NoticeView({ item }: { item: InboxItemDto }) {
  return (
    <div className="flex h-full min-w-0 flex-col overflow-y-auto">
      <div className="flex items-center gap-3 border-b border-line px-5 py-4">
        <NoticeIcon item={item} />
        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-2">
            <p className="truncate text-[14px] font-semibold text-ink">{item.actorLabel}</p>
            <Chip tone={isProposalKind(item.kind) ? "amber" : "neutral"}>{KIND_LABEL[item.kind]}</Chip>
          </div>
          <p className="truncate text-[11.5px] text-ink-3">{formatRoomActivity(item.occurredAtUtc)}</p>
        </div>
        {item.href && (
          <Link
            to={item.href}
            className="flex shrink-0 items-center gap-1 text-[12px] font-medium text-ultra hover:underline"
          >
            Open <ExternalLink className="size-3" />
          </Link>
        )}
      </div>

      <div className="min-h-0 flex-1 space-y-4 px-5 py-4">
        {/* Same bubble treatment as an incoming reply in thread-view, so this reads as one more
            message in the inbox rather than a bespoke system panel. */}
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
              {item.summary}
            </div>
          </div>

          {item.context && <p className="pl-2 text-[11.5px] text-ink-3">{item.context}</p>}

          {item.eventCount > 1 && (
            <p className="pl-2 text-[11px] text-ink-4">{item.eventCount} updates digested into this line.</p>
          )}

          {item.roomId && (
            <AttachedRoomCard room={{ label: "Open the room", subtitle: item.summary, roomId: item.roomId }} />
          )}
        </div>

        <p className="text-[11.5px] text-ink-4">This is a system notice — nothing to reply to here.</p>
      </div>
    </div>
  );
}
