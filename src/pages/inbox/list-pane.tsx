import { ShieldCheck, Sparkles } from "lucide-react";

import { cn } from "@/lib/utils";
import { PersonAvatar } from "@/components/person-avatar";
import { Chip } from "@/components/ui/chip";
import {
  countApprovals,
  countUnread,
  filterInboxItems,
  type InboxFilter,
  type InboxItem,
} from "@/pages/inbox/data";

const FILTERS: { value: InboxFilter; label: string }[] = [
  { value: "all", label: "All" },
  { value: "unread", label: "Unread" },
  { value: "mentions", label: "Mentions" },
  { value: "approvals", label: "Approvals" },
];

function FilterTabs({
  items,
  active,
  onChange,
}: {
  items: InboxItem[];
  active: InboxFilter;
  onChange: (filter: InboxFilter) => void;
}) {
  const counts: Partial<Record<InboxFilter, number>> = {
    unread: countUnread(items),
    approvals: countApprovals(items),
  };

  return (
    <div className="flex items-center gap-1 border-b border-line px-3 py-2">
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
  );
}

function NoticeTile({ noticeType }: { noticeType: "approval" | "agent" }) {
  const isApproval = noticeType === "approval";
  return (
    <span
      className={cn(
        "flex size-8 shrink-0 items-center justify-center rounded-control border",
        isApproval ? "border-amber-border bg-amber-bg text-amber" : "border-line bg-paper-2 text-ink-3"
      )}
    >
      {isApproval ? <ShieldCheck className="size-4" /> : <Sparkles className="size-4" />}
    </span>
  );
}

function Row({ item, active, onSelect }: { item: InboxItem; active: boolean; onSelect: () => void }) {
  const title = item.kind === "thread" ? item.person.name : item.title;
  const preview = item.kind === "thread" ? item.preview.join(" ") : item.preview;
  const roomLabel = item.kind === "thread" ? item.roomLabel : undefined;

  return (
    <button
      type="button"
      onClick={onSelect}
      className={cn(
        "w-full rounded-panel px-2.5 py-2.5 text-left transition-colors",
        active ? "bg-ultra-bg" : "hover:bg-paper-2"
      )}
    >
      <div className="flex gap-2.5">
        <div className="flex w-2.5 shrink-0 justify-center pt-2">
          {item.unread && <span className="size-1.5 rounded-full bg-ultra" />}
        </div>

        {item.kind === "thread" ? (
          <PersonAvatar
            kind="human"
            initials={item.person.initials}
            team={item.person.team}
            size="lg"
            className="mt-0.5"
          />
        ) : (
          <NoticeTile noticeType={item.noticeType} />
        )}

        <div className="min-w-0 flex-1">
          <div className="flex items-baseline justify-between gap-2">
            <span
              className={cn(
                "truncate text-[13px]",
                item.unread ? "font-semibold text-ink" : "font-medium text-ink-2"
              )}
            >
              {title}
            </span>
            <span className="shrink-0 text-[11px] text-ink-4">{item.timestamp}</span>
          </div>

          {item.kind === "notice" && (
            <Chip tone={item.noticeType === "approval" ? "amber" : "neutral"} className="mt-1">
              {item.noticeType === "approval" ? "Approval" : "Agent"}
            </Chip>
          )}

          <p className={cn("line-clamp-2 text-[12px] leading-snug text-ink-3", item.kind === "notice" ? "mt-1" : "mt-0.5")}>
            {preview}
          </p>

          {roomLabel && <p className="mt-1 text-right text-[11px] text-ink-4">{roomLabel}</p>}
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

export function ListPane({
  items,
  filter,
  onFilterChange,
  selectedId,
  onSelect,
}: {
  items: InboxItem[];
  filter: InboxFilter;
  onFilterChange: (filter: InboxFilter) => void;
  selectedId: string | null;
  onSelect: (id: string) => void;
}) {
  const filtered = filterInboxItems(items, filter);

  return (
    <div className="flex h-full min-w-0 flex-col">
      <FilterTabs items={items} active={filter} onChange={onFilterChange} />

      <div className="min-h-0 flex-1 space-y-0.5 overflow-y-auto p-1.5">
        {filtered.length === 0 ? (
          <ListEmptyState filter={filter} unreadCount={countUnread(items)} />
        ) : (
          filtered.map((item) => (
            <Row key={item.id} item={item} active={item.id === selectedId} onSelect={() => onSelect(item.id)} />
          ))
        )}
      </div>
    </div>
  );
}
