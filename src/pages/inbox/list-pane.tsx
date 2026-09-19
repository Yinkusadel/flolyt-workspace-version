import * as React from "react";
import { AtSign, Bell, MoreVertical, Plus, ShieldCheck, Sparkles } from "lucide-react";

import { cn } from "@/lib/utils";
import { PersonAvatar } from "@/components/person-avatar";
import { Chip } from "@/components/ui/chip";
import { Skeleton } from "@/components/ui/skeleton";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { agentInitialsFromName, formatRoomActivity, initialsFromName } from "@/pages/rooms/format";
import { formatShortDate } from "@/lib/format-measured-value";
import type { InboxItemDto, InboxItemKind } from "@/services/api/inbox/get-inbox";
import { KIND_LABEL, groupLabel, isProposalKind } from "@/pages/inbox/kind";
import type { InboxFilter } from "@/pages/inbox/data";

const FILTERS: { value: InboxFilter; label: string }[] = [
  { value: "all", label: "All" },
  { value: "mentions", label: "Mentions" },
  { value: "approvals", label: "Approvals" },
];

function MoreFiltersMenu({
  active,
  onChange,
  unreadCount,
}: {
  active: InboxFilter;
  onChange: (filter: InboxFilter) => void;
  unreadCount: number;
}) {
  const isActive = active === "unread" || active === "snoozed";

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <button
          type="button"
          aria-label="More filters"
          className={cn(
            "flex items-center gap-0.5 rounded-control px-1.5 py-1.5 text-ink-3 transition-colors hover:bg-paper-2 hover:text-ink",
            isActive && "bg-paper-2 text-ink"
          )}
        >
          <MoreVertical className="size-4" />
        </button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="start">
        <DropdownMenuItem
          onSelect={() => onChange("unread")}
          className={cn(active === "unread" && "bg-paper-2 font-medium")}
        >
          Unread
          {unreadCount > 0 && <span className="ml-auto text-[11px] text-ink-4">{unreadCount}</span>}
        </DropdownMenuItem>
        <DropdownMenuItem
          onSelect={() => onChange("snoozed")}
          className={cn(active === "snoozed" && "bg-paper-2 font-medium")}
        >
          Snoozed
        </DropdownMenuItem>
        <DropdownMenuItem disabled>
          Drafts
          <span className="ml-auto text-[10.5px] text-ink-4">Soon</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

function FilterTabs({
  active,
  onChange,
  onCompose,
  unreadCount,
  approvalsCount,
}: {
  active: InboxFilter;
  onChange: (filter: InboxFilter) => void;
  onCompose: () => void;
  unreadCount: number;
  approvalsCount: number;
}) {
  const counts: Partial<Record<InboxFilter, number>> = {
    approvals: approvalsCount,
  };

  return (
    <div className="flex items-center justify-between gap-1 px-3 py-2">
      <div className="flex items-center gap-1">
        {FILTERS.map((f) => {
          const count = counts[f.value];
          const isActive = active === f.value;
          return (
            <button
              key={f.value}
              type="button"
              onClick={() => onChange(f.value)}
              className={cn(
                "flex items-center gap-1.5 rounded-control px-2.5 py-1.5 text-[12px] transition-colors",
                isActive ? "bg-paper-2 font-medium text-ink" : "text-ink-3 hover:text-ink"
              )}
            >
              {f.label}
              {typeof count === "number" && count > 0 && (
                <span className="text-[11px] font-medium text-ink-4">{count}</span>
              )}
            </button>
          );
        })}
      </div>

      <div className="flex shrink-0 items-center gap-0.5">
        <MoreFiltersMenu active={active} onChange={onChange} unreadCount={unreadCount} />

        <button
          type="button"
          onClick={onCompose}
          aria-label="New message"
          className="flex size-6.5 shrink-0 items-center justify-center rounded-control text-ink-3 transition-colors hover:bg-paper-2 hover:text-ink"
        >
          <Plus className="size-4" />
        </button>
      </div>
    </div>
  );
}

function KindTile({ kind, actorLabel }: { kind: InboxItemKind; actorLabel: string }) {
  if (kind === "Proposal") {
    return (
      <span className="flex size-8 shrink-0 items-center justify-center rounded-control border border-amber-border bg-amber-bg text-amber">
        <ShieldCheck className="size-4" />
      </span>
    );
  }

  if (kind === "Message") {
    return (
      <PersonAvatar kind="human" initials={initialsFromName(actorLabel)} size="lg" className="mt-0.5" />
    );
  }

  if (kind === "Mention") {
    return (
      <span className="flex size-8 shrink-0 items-center justify-center rounded-full border-[1.5px] border-dashed border-ultra-border text-ultra">
        <AtSign className="size-3.5" />
      </span>
    );
  }

  if (kind === "Notification") {
    // System/pipeline events (e.g. "DatasourcePipeline", "CustomerSync") — a made-up-looking
    // initials avatar would misread as a named workspace agent, so these get a plain glyph tile
    // instead of the dashed agent-identity circle.
    return (
      <span className="flex size-8 shrink-0 items-center justify-center rounded-control border border-line bg-paper-2 text-ink-3">
        <Bell className="size-4" />
      </span>
    );
  }

  // Assignment / Investigation / Obligation / Finished — real agent-authored work (e.g. "Flolyt"),
  // no per-item avatar data on the list row so we derive initials from the actor label itself.
  return actorLabel ? (
    <PersonAvatar kind="agent" initials={agentInitialsFromName(actorLabel)} size="lg" />
  ) : (
    <span className="flex size-8 shrink-0 items-center justify-center rounded-full border-[1.5px] border-dashed border-ultra-border text-ultra">
      <Sparkles className="size-3.5" />
    </span>
  );
}

function Row({ item, active, onSelect }: { item: InboxItemDto; active: boolean; onSelect: () => void }) {
  // `actorLabel` is whoever last acted, which for a `Message`-kind thread you started and last
  // replied in is your own name. `others` (the counterpart(s) minus you) is the correct label to
  // show in a message row when the backend supplies it; fall back to `actorLabel` when it's empty
  // (e.g. a 2-person thread where the last actor already is the other participant).
  const displayLabel = item.kind === "Message" && item.others.length > 0 ? item.others.join(", ") : item.actorLabel;

  return (
    <button
      type="button"
      onClick={onSelect}
      // Belt-and-suspenders: some browsers scroll a focused element fully into view when it's
      // only partially visible at click time. Blocking the mousedown-driven focus keeps the
      // click working without any reveal-scroll; keyboard nav (Tab) is untouched since this only
      // intercepts a pointer-triggered focus.
      onMouseDown={(e) => e.preventDefault()}
      className={cn(
        "w-full rounded-panel px-2.5 py-2.5 text-left transition-colors",
        active ? "bg-ultra-bg" : "hover:bg-paper-2"
      )}
    >
      <div className="flex gap-2.5">
        <div className="flex w-2.5 shrink-0 justify-center pt-2">
          {!item.isRead && <span className="size-1.5 rounded-full bg-ultra" />}
        </div>

        <KindTile kind={item.kind} actorLabel={displayLabel} />

        <div className="min-w-0 flex-1">
          <div className="flex items-baseline justify-between gap-2">
            <span
              className={cn(
                "truncate text-[13px]",
                !item.isRead ? "font-semibold text-ink" : "font-medium text-ink-2"
              )}
            >
              {displayLabel}
            </span>
            <span className="flex shrink-0 items-center gap-1 text-[11px] text-ink-4">
              {item.mentionsYou && <AtSign className="size-3 text-ultra" />}
              {formatRoomActivity(item.occurredAtUtc)}
            </span>
          </div>

          {item.kind !== "Message" && (
            <Chip tone={isProposalKind(item.kind) ? "amber" : "neutral"} className="mt-1">
              {KIND_LABEL[item.kind]}
            </Chip>
          )}

          <p
            className={cn(
              "line-clamp-2 text-[12px] leading-snug text-ink-3",
              item.kind !== "Message" ? "mt-1" : "mt-0.5"
            )}
          >
            {item.summary}
          </p>

          {item.eventCount > 1 && (
            <p className="mt-1 text-right text-[11px] text-ink-4">{item.eventCount} updates</p>
          )}

          {item.snoozedUntilUtc && (
            <p className="mt-1 text-right text-[11px] text-ink-4">Back {formatShortDate(item.snoozedUntilUtc)}</p>
          )}
        </div>
      </div>
    </button>
  );
}

function ListEmptyState({ filter, unreadCount }: { filter: InboxFilter; unreadCount: number }) {
  const copy: Record<InboxFilter, { title: string; body: string }> = {
    all: { title: "Nothing here", body: "Nothing has come in yet." },
    unread: {
      title: "Nothing unread",
      body: unreadCount === 0 ? "Read messages are still in All." : "",
    },
    mentions: { title: "No mentions", body: "No one has mentioned you yet." },
    approvals: { title: "Nothing to approve", body: "No approval requests right now." },
    snoozed: { title: "Nothing snoozed", body: "Lines you put off show up here until they come back." },
  };
  const { title, body } = copy[filter];

  return (
    <div className="flex flex-col items-center px-6 py-10 text-center">
      <span className="flex size-9 items-center justify-center rounded-control bg-paper-2 text-ink-4">
        <ShieldCheck className="size-4" />
      </span>
      <p className="mt-3 text-[13px] font-semibold text-ink">{title}</p>
      {body && <p className="mt-1 text-[11.5px] text-ink-3">{body}</p>}
    </div>
  );
}

function ListSkeleton() {
  return (
    <div className="space-y-2 p-1.5">
      {[0, 1, 2, 3, 4].map((i) => (
        <div key={i} className="flex gap-2.5 px-2.5 py-2.5">
          <Skeleton className="size-8 shrink-0 rounded-full" />
          <div className="min-w-0 flex-1 space-y-1.5 pt-0.5">
            <Skeleton className="h-3 w-2/3" />
            <Skeleton className="h-3 w-full" />
          </div>
        </div>
      ))}
    </div>
  );
}

function ListErrorState({ message }: { message: string }) {
  return (
    <div className="flex flex-col items-center px-6 py-10 text-center">
      <p className="text-[13px] font-semibold text-ink">Couldn't load the inbox</p>
      <p className="mt-1 text-[11.5px] text-ink-3">{message}</p>
    </div>
  );
}

export function ListPane({
  items,
  isLoading,
  isError,
  errorMessage,
  filter,
  onFilterChange,
  selectedId,
  onSelect,
  onCompose,
  unreadCount,
  approvalsCount,
}: {
  items: InboxItemDto[];
  isLoading: boolean;
  isError: boolean;
  errorMessage?: string;
  filter: InboxFilter;
  onFilterChange: (filter: InboxFilter) => void;
  selectedId: string | null;
  onSelect: (item: InboxItemDto) => void;
  onCompose: () => void;
  unreadCount: number;
  approvalsCount: number;
}) {
  // Sections follow the order groups first appear in the (already server-filtered) list, rather
  // than a fixed lookup table — only "NeedsYou" is confirmed from a real example so far, see
  // docs/endpoints/inbox.md.
  const sections = React.useMemo(() => {
    const order: string[] = [];
    const byGroup = new Map<string, InboxItemDto[]>();
    for (const item of items) {
      if (!byGroup.has(item.group)) {
        order.push(item.group);
        byGroup.set(item.group, []);
      }
      byGroup.get(item.group)!.push(item);
    }
    return order.map((group) => ({ group, items: byGroup.get(group)! }));
  }, [items]);

  return (
    <div className="flex h-full min-w-0 flex-col">
      <FilterTabs
        active={filter}
        onChange={onFilterChange}
        onCompose={onCompose}
        unreadCount={unreadCount}
        approvalsCount={approvalsCount}
      />

      <div className="min-h-0 flex-1 overflow-y-auto p-1.5">
        {isLoading ? (
          <ListSkeleton />
        ) : isError ? (
          <ListErrorState message={errorMessage ?? "Something went wrong."} />
        ) : items.length === 0 ? (
          <ListEmptyState filter={filter} unreadCount={unreadCount} />
        ) : (
          <div className="space-y-3">
            {sections.map(({ group, items: groupItems }) => (
              <div key={group}>
                <p className="px-2.5 pb-1 font-mono text-[9px] font-medium tracking-[0.08em] text-ink-4 uppercase">
                  {groupLabel(group)}
                </p>
                <div className="space-y-0.5">
                  {groupItems.map((item) => (
                    <Row
                      key={item.sourceId}
                      item={item}
                      active={item.sourceId === selectedId}
                      onSelect={() => onSelect(item)}
                    />
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
