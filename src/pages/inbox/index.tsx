import * as React from "react";
import { useSearchParams } from "react-router-dom";

import type { InboxFilter } from "@/pages/inbox/data";
import {
  draftItemToInboxItem,
  isProposalKind,
  isThreadKind,
  parseDraftMessageId,
  sentItemToInboxItem,
  toApiFilter,
} from "@/pages/inbox/kind";
import { ListPane } from "@/pages/inbox/list-pane";
import { ThreadView } from "@/pages/inbox/thread-view";
import { ApprovalView } from "@/pages/inbox/approval-view";
import { NoticeView } from "@/pages/inbox/notice-view";
import { ComposeView } from "@/pages/inbox/compose-view";
import { DraftView } from "@/pages/inbox/draft-view";
import { CaughtUpState, PickAMessageState } from "@/pages/inbox/empty-view";
import { useGetInbox } from "@/features/inbox/use-get-inbox";
import { useGetInboxSent } from "@/features/inbox/use-get-inbox-sent";
import { useGetInboxDrafts } from "@/features/inbox/use-get-inbox-drafts";
import type { InboxItemDto } from "@/services/api/inbox/get-inbox";
import useMarkInboxRead from "@/features/inbox/use-mark-inbox-read";

/**
 * Rebuilt against the real `/api/v3/inbox/*` endpoints 2026-09-18 — see
 * docs/inbox/build-plan.md. Inbox is people only: no agent is ever a thread participant, and the
 * selected message/compose flow position lives in the `id` search param rather than component
 * state.
 *
 * Two `GET /inbox` calls, not one: `filter: "All"` is always fetched as the source of truth for
 * the tab badges and for resolving the selected item by id (so a read/filter change can't make
 * the open detail pane vanish out from under you), while the active tab's own filter is fetched
 * separately to drive what the list pane actually shows. React Query dedupes these to a single
 * request whenever the active tab already is "All".
 */
export default function Inbox() {
  const [filter, setFilter] = React.useState<InboxFilter>("all");
  const [searchParams, setSearchParams] = useSearchParams();

  const rawId = searchParams.get("id");
  const isComposing = rawId === "compose";
  const draftMessageId = parseDraftMessageId(rawId);

  const isSentFilter = filter === "sent";
  const isDraftsFilter = filter === "drafts";

  const { data: allData } = useGetInbox({ filter: "All" });
  const {
    data: filteredData,
    isLoading,
    isError,
    error,
  } = useGetInbox({ filter: toApiFilter(filter) });
  const {
    data: sentData,
    isLoading: isSentLoading,
    isError: isSentError,
    error: sentError,
  } = useGetInboxSent({ enabled: isSentFilter });
  const {
    data: draftsData,
    isLoading: isDraftsLoading,
    isError: isDraftsError,
    error: draftsError,
  } = useGetInboxDrafts({ enabled: isDraftsFilter || draftMessageId !== null });

  const allItems = allData?.data.items ?? [];
  const sentItems = (sentData?.data ?? []).map(sentItemToInboxItem);
  const draftItems = (draftsData?.data ?? []).map(draftItemToInboxItem);
  const displayItems = isSentFilter ? sentItems : isDraftsFilter ? draftItems : filteredData?.data.items ?? [];
  const unreadCount = allData?.data.unread ?? 0;
  const approvalsCount = allItems.filter((item) => isProposalKind(item.kind)).length;
  const movingCount = allItems.filter(
    (item) => !isProposalKind(item.kind) && !isThreadKind(item.kind)
  ).length;

  const selectedDraft = draftMessageId
    ? draftsData?.data.find((d) => d.messageId === draftMessageId)
    : undefined;

  // Sent-derived first: a thread you started can also turn up in the recipient-filtered `All`
  // list once someone else acts on it (e.g. it gets flagged back to you), but that entry only
  // carries whoever triggered *that* notification, not the full recipient list — `to` on the
  // sent version is the complete, authoritative roster since it's the thread's actual addressee
  // list, not a per-notification actor.
  const selectedItem = !isComposing && !draftMessageId
    ? sentItems.find((item) => item.sourceId === rawId) ?? allItems.find((item) => item.sourceId === rawId)
    : undefined;

  const { markInboxRead } = useMarkInboxRead();

  const select = (item: InboxItemDto) => {
    setSearchParams({ id: item.sourceId }, { replace: true });
    if (!item.isRead) {
      markInboxRead({ kind: item.kind, sourceId: item.sourceId });
    }
  };

  const openCompose = () => setSearchParams({ id: "compose" }, { replace: true });
  const closeDetail = () => {
    const next = new URLSearchParams(searchParams);
    next.delete("id");
    setSearchParams(next, { replace: true });
  };

  return (
    <div className="-my-page flex h-[calc(100%+var(--spacing-page)*2)] flex-col">
      <div className="flex min-h-0 flex-1 overflow-hidden bg-paper">
        <div className="w-[320px] shrink-0">
          <ListPane
            items={displayItems}
            isLoading={isSentFilter ? isSentLoading : isDraftsFilter ? isDraftsLoading : isLoading}
            isError={isSentFilter ? isSentError : isDraftsFilter ? isDraftsError : isError}
            errorMessage={isSentFilter ? sentError?.message : isDraftsFilter ? draftsError?.message : error?.message}
            filter={filter}
            onFilterChange={setFilter}
            selectedId={rawId}
            onSelect={select}
            onCompose={openCompose}
            unreadCount={unreadCount}
            approvalsCount={approvalsCount}
          />
        </div>

        <div className="min-w-0 flex-1">
          {isComposing ? (
            <ComposeView onDiscard={closeDetail} onSent={closeDetail} />
          ) : draftMessageId ? (
            selectedDraft ? (
              <DraftView draft={selectedDraft} onClosed={closeDetail} />
            ) : !isDraftsLoading ? (
              <PickAMessageState onCompose={openCompose} />
            ) : null
          ) : !selectedItem ? (
            filter === "unread" && unreadCount === 0 ? (
              <CaughtUpState movingRoomsCount={movingCount} onSeeAll={() => setFilter("all")} />
            ) : (
              <PickAMessageState onCompose={openCompose} />
            )
          ) : isThreadKind(selectedItem.kind) ? (
            <ThreadView item={selectedItem} />
          ) : isProposalKind(selectedItem.kind) ? (
            <ApprovalView item={selectedItem} />
          ) : (
            <NoticeView item={selectedItem} />
          )}
        </div>
      </div>
    </div>
  );
}
