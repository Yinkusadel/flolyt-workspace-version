import * as React from "react";
import { useSearchParams } from "react-router-dom";

import {
  countAgentNotices,
  countUnread,
  INBOX_ITEMS,
  type InboxFilter,
  type InboxItem,
} from "@/pages/inbox/data";
import { ListPane } from "@/pages/inbox/list-pane";
import { ThreadView } from "@/pages/inbox/thread-view";
import { ApprovalView } from "@/pages/inbox/approval-view";
import { NoticeView } from "@/pages/inbox/notice-view";
import { ComposeView } from "@/pages/inbox/compose-view";
import { CaughtUpState, PickAMessageState } from "@/pages/inbox/empty-view";

/**
 * Rebuilt from flolyt-figma-designs/New-pages-pattern/inbox/inbox/svg/01–05 — see
 * src/pages/inbox/data.ts for the source-to-code notes. Inbox is people only: no agent is ever a
 * thread participant, approvals are released in the room (never here), and the selected
 * message/compose flow position lives in the `id` search param rather than component state.
 */
export default function Inbox() {
  const [items, setItems] = React.useState<InboxItem[]>(INBOX_ITEMS);
  const [filter, setFilter] = React.useState<InboxFilter>("all");
  const [searchParams, setSearchParams] = useSearchParams();

  const rawId = searchParams.get("id");
  const isComposing = rawId === "compose";
  const selectedItem = !isComposing ? items.find((item) => item.id === rawId) : undefined;

  const select = (id: string) => {
    setSearchParams({ id }, { replace: true });
    setItems((prev) => prev.map((item) => (item.id === id ? { ...item, unread: false } : item)));
  };

  const openCompose = () => setSearchParams({ id: "compose" }, { replace: true });
  const closeDetail = () => {
    const next = new URLSearchParams(searchParams);
    next.delete("id");
    setSearchParams(next, { replace: true });
  };

  const unreadCount = countUnread(items);

  return (
    <div className="-mt-page flex h-[calc(100%+var(--spacing-page))] flex-col">
      <div className="flex min-h-0 flex-1 overflow-hidden bg-paper">
        <div className="w-[320px] shrink-0">
          <ListPane
            items={items}
            filter={filter}
            onFilterChange={setFilter}
            selectedId={rawId}
            onSelect={select}
            onCompose={openCompose}
          />
        </div>

        <div className="min-w-0 flex-1">
          {isComposing ? (
            <ComposeView onDiscard={closeDetail} onSent={closeDetail} />
          ) : !selectedItem ? (
            filter === "unread" && unreadCount === 0 ? (
              <CaughtUpState movingRoomsCount={countAgentNotices(items)} onSeeAll={() => setFilter("all")} />
            ) : (
              <PickAMessageState onCompose={openCompose} />
            )
          ) : selectedItem.kind === "thread" ? (
            <ThreadView item={selectedItem} />
          ) : selectedItem.noticeType === "approval" && selectedItem.approval ? (
            <ApprovalView item={selectedItem} approval={selectedItem.approval} />
          ) : (
            <NoticeView item={selectedItem} />
          )}
        </div>
      </div>
    </div>
  );
}
