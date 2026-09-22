import { useMemo, useState } from "react";
import { Search, Users, Database, Wallet, MessagesSquare, type LucideIcon } from "lucide-react";

import { cn } from "@/lib/utils";
import { Input } from "@/components/ui/input";
import {
  AUDIT_CATEGORIES,
  MOCK_AUDIT_ENTRIES,
  type AuditCategory,
  type AuditEntry,
} from "@/pages/audit-log/data";

const CATEGORY_ICON: Record<AuditCategory, LucideIcon> = {
  rooms: MessagesSquare,
  members: Users,
  data: Database,
  wallet: Wallet,
};

const CATEGORY_BADGE_CLASS: Record<AuditCategory, string> = {
  rooms: "bg-ultra-bg text-ultra",
  members: "bg-teal-bg text-teal",
  data: "bg-amber-bg text-amber",
  wallet: "bg-rose-bg text-rose",
};

function formatTime(iso: string) {
  return new Date(iso).toLocaleTimeString(undefined, { hour: "numeric", minute: "2-digit" });
}

function formatDateGroup(iso: string) {
  const date = new Date(iso);
  const now = new Date();
  const dayMs = 24 * 60 * 60 * 1000;
  const startOfDay = (d: Date) => new Date(d.getFullYear(), d.getMonth(), d.getDate()).getTime();
  const diffDays = Math.round((startOfDay(now) - startOfDay(date)) / dayMs);

  if (diffDays === 0) return "Today";
  if (diffDays === 1) return "Yesterday";
  return date.toLocaleDateString(undefined, { month: "short", day: "numeric", year: "numeric" });
}

function groupByDate(entries: AuditEntry[]) {
  const groups: { label: string; entries: AuditEntry[] }[] = [];
  for (const entry of entries) {
    const label = formatDateGroup(entry.timestamp);
    const last = groups[groups.length - 1];
    if (last && last.label === label) {
      last.entries.push(entry);
    } else {
      groups.push({ label, entries: [entry] });
    }
  }
  return groups;
}

function EntryRow({ entry }: { entry: AuditEntry }) {
  const Icon = CATEGORY_ICON[entry.category];
  return (
    <div className="flex items-start gap-3 px-4 py-3">
      <span
        className={cn(
          "flex size-8 shrink-0 items-center justify-center rounded-full",
          CATEGORY_BADGE_CLASS[entry.category]
        )}
      >
        <Icon className="size-4" />
      </span>
      <div className="min-w-0 flex-1">
        <p className="text-[12px] text-ink">
          <span className="font-semibold">{entry.actor}</span> {entry.action}
        </p>
        <p
          className={cn(
            "mt-0.5 text-[11px]",
            entry.detailTone === "warn" ? "text-rose" : "text-ink-3"
          )}
        >
          {entry.detail}
        </p>
      </div>
      <p className="shrink-0 text-[10.5px] whitespace-nowrap text-ink-4 tabular-nums">
        {formatTime(entry.timestamp)}
      </p>
    </div>
  );
}

export default function AuditLogRoute() {
  const [activeCategory, setActiveCategory] = useState<AuditCategory | "all">("all");
  const [search, setSearch] = useState("");

  const filtered = useMemo(() => {
    const query = search.trim().toLowerCase();
    return MOCK_AUDIT_ENTRIES.filter((entry) => {
      if (activeCategory !== "all" && entry.category !== activeCategory) return false;
      if (!query) return true;
      return (
        entry.actor.toLowerCase().includes(query) ||
        entry.action.toLowerCase().includes(query) ||
        entry.detail.toLowerCase().includes(query)
      );
    });
  }, [activeCategory, search]);

  const groups = useMemo(() => groupByDate(filtered), [filtered]);

  return (
    <div className="mx-auto max-w-3xl space-y-6">
      <div>
        <h1 className="text-[17px] font-semibold text-ink">Audit log</h1>
        <p className="mt-1 text-[11.5px] text-ink-3">
          A record of who did what across your workspace — room decisions, member and role
          changes, data connections, and wallet activity.
        </p>
      </div>

      <div className="flex flex-wrap items-center gap-3">
        <div className="flex flex-wrap gap-1.5">
          <button
            type="button"
            onClick={() => setActiveCategory("all")}
            className={cn(
              "rounded-control border px-2.5 py-1 text-[11px] font-medium transition-colors",
              activeCategory === "all"
                ? "border-ultra-border bg-ultra-bg text-ultra"
                : "border-line bg-paper text-ink-3 hover:text-ink"
            )}
          >
            All
          </button>
          {AUDIT_CATEGORIES.map((category) => (
            <button
              key={category.key}
              type="button"
              onClick={() => setActiveCategory(category.key)}
              className={cn(
                "rounded-control border px-2.5 py-1 text-[11px] font-medium transition-colors",
                activeCategory === category.key
                  ? "border-ultra-border bg-ultra-bg text-ultra"
                  : "border-line bg-paper text-ink-3 hover:text-ink"
              )}
            >
              {category.label}
            </button>
          ))}
        </div>

        <div className="relative ml-auto w-full max-w-xs">
          <Search className="pointer-events-none absolute top-1/2 left-2.5 size-3.5 -translate-y-1/2 text-ink-4" />
          <Input
            value={search}
            onChange={(e) => setSearch(e.currentTarget.value)}
            placeholder="Search the log..."
            className="h-8 pl-8"
          />
        </div>
      </div>

      {groups.length === 0 ? (
        <div className="rounded-card border border-dashed border-line bg-paper-2 p-8 text-center">
          <p className="text-[12.5px] font-semibold text-ink">Nothing matches</p>
          <p className="mt-1 text-[11px] text-ink-3">
            Try a different category or search term.
          </p>
        </div>
      ) : (
        <div className="space-y-6">
          {groups.map((group) => (
            <section key={group.label} className="space-y-2">
              <p className="font-mono text-[9.5px] font-medium tracking-[1.05px] text-ink-4 uppercase">
                {group.label}
              </p>
              <div className="divide-y divide-line rounded-card border border-line bg-paper-2">
                {group.entries.map((entry) => (
                  <EntryRow key={entry.id} entry={entry} />
                ))}
              </div>
            </section>
          ))}
        </div>
      )}
    </div>
  );
}
