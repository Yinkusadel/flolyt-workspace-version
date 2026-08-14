import * as React from "react";
import { ChevronDown, ChevronRight } from "lucide-react";
import { toast } from "sonner";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import type { PlaysQueueGroup, PlaysQueueRow, RoomDetail } from "@/pages/rooms/types";

type Filter = "needs-you" | "mine" | "blocked" | "all";

const GROUP_META: Record<PlaysQueueGroup, string> = {
  "needs-approval": "Needs your approval",
  blocked: "Blocked on a person",
  "in-progress": "In progress",
  drafts: "Drafts · nothing has left Flolyt",
  decided: "Decided this week",
};

const GROUP_ORDER: PlaysQueueGroup[] = ["needs-approval", "blocked", "in-progress", "drafts", "decided"];

/**
 * Screen 35 (plays at scale) — see flolyt-kit-122/35-plays-at-scale.svg. The
 * kit files it as a standalone frame, but every row in it belongs to one
 * room, so it's built here as the room's own Plays tab rather than a
 * separate cross-room surface.
 */
export function PlaysTab({ room }: { room: RoomDetail }) {
  const rows = room.playsQueue ?? [];
  const [filter, setFilter] = React.useState<Filter>("needs-you");
  const [expanded, setExpanded] = React.useState<Set<PlaysQueueGroup>>(new Set(["needs-approval"]));
  const [checked, setChecked] = React.useState<Set<string>>(new Set());

  const counts = React.useMemo(() => {
    const byGroup: Record<PlaysQueueGroup, PlaysQueueRow[]> = {
      "needs-approval": [],
      blocked: [],
      "in-progress": [],
      drafts: [],
      decided: [],
    };
    rows.forEach((row) => byGroup[row.group].push(row));
    return byGroup;
  }, [rows]);

  const visibleGroups: PlaysQueueGroup[] =
    filter === "needs-you"
      ? ["needs-approval"]
      : filter === "blocked"
        ? ["blocked"]
        : filter === "mine"
          ? ["in-progress", "drafts", "decided"]
          : GROUP_ORDER;

  const toggleGroup = (group: PlaysQueueGroup) => {
    setExpanded((prev) => {
      const next = new Set(prev);
      if (next.has(group)) next.delete(group);
      else next.add(group);
      return next;
    });
  };

  const toggleRow = (id: string) => {
    setChecked((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  const bulkApprove = () => {
    toast.success(`Approved ${checked.size} play${checked.size === 1 ? "" : "s"}`);
    setChecked(new Set());
  };
  const bulkReject = () => {
    toast.info(`Rejected ${checked.size} play${checked.size === 1 ? "" : "s"}`);
    setChecked(new Set());
  };

  return (
    <div className="flex h-full min-h-0 flex-col">
      <div className="flex shrink-0 items-center justify-between border-b border-line px-4 py-2.5">
        <p className="text-[11px] font-semibold tracking-[0.45px] text-ink-2">PLAYS</p>
        <p className="font-mono text-[10px] text-ink-4">
          {rows.length} · {room.playsNeedYou ?? counts["needs-approval"].length} need you
        </p>
      </div>

      <div className="flex shrink-0 flex-wrap gap-1.5 border-b border-line px-4 py-2.5">
        {(
          [
            { key: "needs-you", label: "Needs you", count: counts["needs-approval"].length },
            { key: "mine", label: "Mine", count: counts["in-progress"].length + counts.drafts.length + counts.decided.length },
            { key: "blocked", label: "Blocked", count: counts.blocked.length },
            { key: "all", label: "All", count: rows.length },
          ] as const
        ).map((f) => (
          <button
            key={f.key}
            type="button"
            onClick={() => setFilter(f.key)}
            className={cn(
              "inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-[10.5px] font-semibold",
              filter === f.key
                ? "border-ink bg-ink text-white"
                : "border-line bg-paper text-ink-3 hover:text-ink-2"
            )}
          >
            {f.label}
            <span className={cn("font-mono text-[9px]", filter === f.key ? "text-white/70" : "text-ink-4")}>
              {f.count}
            </span>
          </button>
        ))}
      </div>

      <div className="min-h-0 flex-1 overflow-y-auto">
        {visibleGroups.map((group) => {
          const groupRows = counts[group];
          const isOpen = expanded.has(group);
          return (
            <div key={group}>
              <button
                type="button"
                onClick={() => toggleGroup(group)}
                className="flex w-full items-center gap-2 border-b border-line bg-paper-2 px-4 py-2 text-left"
              >
                {isOpen ? (
                  <ChevronDown className="size-3 shrink-0 text-ink-4" />
                ) : (
                  <ChevronRight className="size-3 shrink-0 text-ink-4" />
                )}
                <span
                  className={cn(
                    "text-[11px] font-semibold",
                    group === "needs-approval" ? "text-amber" : "text-ink-2"
                  )}
                >
                  {GROUP_META[group]}
                </span>
                <span className="ml-auto font-mono text-[9.5px] text-ink-4">{groupRows.length}</span>
              </button>
              {isOpen && (
                <div className="space-y-2 px-4 py-3">
                  {groupRows.map((row) => (
                    <div
                      key={row.id}
                      className="relative flex items-start gap-3 overflow-hidden rounded-card border border-line bg-paper py-3 pr-3.5 pl-3.5"
                    >
                      <span
                        className={cn(
                          "absolute inset-y-0 left-0 w-[3px]",
                          group === "needs-approval" ? "bg-amber" : "bg-line"
                        )}
                        aria-hidden
                      />
                      {group === "needs-approval" ? (
                        <button
                          type="button"
                          onClick={() => toggleRow(row.id)}
                          className={cn(
                            "mt-0.5 flex size-3.5 shrink-0 items-center justify-center rounded-[3px] border-[1.5px]",
                            checked.has(row.id) ? "border-ink bg-ink text-white" : "border-line bg-paper"
                          )}
                        >
                          {checked.has(row.id) && <span className="text-[8px] leading-none">✓</span>}
                        </button>
                      ) : (
                        <span className="mt-0.5 size-3.5 shrink-0" />
                      )}
                      <div className="min-w-0 flex-1">
                        <p className="text-[12px] font-semibold text-ink">{row.title}</p>
                        <p className="mt-0.5 truncate text-[10.5px] text-ink-3">{row.subtitle}</p>
                      </div>
                      <span className="shrink-0 font-mono text-[9px] text-ink-4">{row.time}</span>
                    </div>
                  ))}
                  {groupRows.length === 0 && (
                    <p className="px-1 py-2 text-[11px] text-ink-4">Nothing here.</p>
                  )}
                </div>
              )}
            </div>
          );
        })}
      </div>

      {checked.size > 0 && (
        <div className="flex shrink-0 items-center gap-3 border-t border-line bg-ink px-4 py-3">
          <span className="text-[11.5px] font-semibold text-white">{checked.size} selected</span>
          <Button type="button" size="sm" variant="secondary" onClick={bulkApprove}>
            Approve {checked.size === 1 ? "" : "all"}
          </Button>
          <Button
            type="button"
            size="sm"
            variant="outline"
            onClick={bulkReject}
            className="border-white/30 bg-transparent text-white hover:bg-white/10"
          >
            Reject
          </Button>
          <span className="ml-auto hidden font-mono text-[9.5px] text-white/50 sm:block">
            runs under your identity
          </span>
        </div>
      )}
    </div>
  );
}
