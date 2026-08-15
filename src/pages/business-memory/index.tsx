import * as React from "react";
import { Search } from "lucide-react";

import { cn } from "@/lib/utils";
import { Input } from "@/components/ui/input";
import { MEMORY_ENTRIES, MEMORY_STATS, type MemoryCategory, type MemoryEntry } from "@/pages/business-memory/data";

type FilterKey = "all" | MemoryCategory | "account-scoped";

const FILTERS: { key: FilterKey; label: string }[] = [
  { key: "all", label: "All" },
  { key: "validated", label: "Validated" },
  { key: "observed", label: "Observed" },
  { key: "superseded", label: "Superseded" },
  { key: "account-scoped", label: "Account-scoped" },
];

function matchesFilter(entry: MemoryEntry, filter: FilterKey) {
  if (filter === "all") return true;
  if (filter === "account-scoped") return entry.scope === "account";
  return entry.category === filter;
}

function MemoryCard({ entry }: { entry: MemoryEntry }) {
  const muted = entry.category === "superseded";

  return (
    <div
      className={cn(
        "rounded-card border border-dashed p-5",
        muted ? "border-line bg-paper-2" : "border-ultra-border bg-ultra-bg"
      )}
    >
      <h3 className={cn("text-[13px] font-semibold", muted ? "text-ink-3" : "text-ink")}>
        {entry.headline}
      </h3>
      <p className="mt-2 text-[11.5px] leading-relaxed text-ink-3">{entry.body}</p>
      <div className="mt-4 border-t border-dashed border-line pt-3">
        <p className={cn("font-mono text-[9px]", muted ? "text-ink-4" : "text-ultra")}>{entry.meta}</p>
      </div>
    </div>
  );
}

/** Screen 48 (business memory) — see flolyt-kit-122/48-business-memory.svg. */
const BusinessMemory = () => {
  const [query, setQuery] = React.useState("");
  const [filter, setFilter] = React.useState<FilterKey>("all");

  const entries = React.useMemo(() => {
    const q = query.trim().toLowerCase();
    return MEMORY_ENTRIES.filter(
      (entry) =>
        matchesFilter(entry, filter) &&
        (q === "" || entry.headline.toLowerCase().includes(q) || entry.body.toLowerCase().includes(q))
    );
  }, [query, filter]);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-[17px] font-semibold text-ink">Business memory</h1>
        <p className="mt-1 text-[11.5px] text-ink-3">
          {MEMORY_STATS.learningsHeld} learnings · scoped to this workspace and never shared across tenants
        </p>
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-[1fr_320px] lg:items-start">
        <div className="min-w-0 space-y-5">
          <div className="space-y-3">
            <div className="relative">
              <Search className="pointer-events-none absolute top-1/2 left-3 size-3.5 -translate-y-1/2 text-ink-4" />
              <Input
                value={query}
                onChange={(e) => setQuery((e.target as HTMLInputElement).value)}
                placeholder="Search what this business has learned…"
                className="h-9 bg-paper-2 pl-9"
              />
            </div>

            <div className="flex gap-2 overflow-x-auto pb-1">
              {FILTERS.map((f) => (
                <button
                  key={f.key}
                  type="button"
                  onClick={() => setFilter(f.key)}
                  className={cn(
                    "shrink-0 rounded-full border px-3 py-1 text-[10.5px] font-semibold whitespace-nowrap transition-colors",
                    filter === f.key
                      ? "border-ink bg-ink text-white"
                      : "border-line bg-paper text-ink-3 hover:border-ink-4"
                  )}
                >
                  {f.label}
                </button>
              ))}
            </div>
          </div>

          <div className="space-y-4">
            {entries.map((entry) => (
              <MemoryCard key={entry.id} entry={entry} />
            ))}
            {entries.length === 0 && (
              <div className="rounded-card border border-dashed border-line bg-paper p-6 text-center text-[11.5px] text-ink-4">
                No learnings match this search.
              </div>
            )}
          </div>
        </div>

        <aside className="overflow-hidden rounded-card border border-line bg-paper-2 lg:sticky lg:top-0">
          <div className="border-b border-line px-5 py-4">
            <p className="text-[11px] font-semibold tracking-[0.45px] text-ink-2">HOW MEMORY IS USED</p>
          </div>
          <div className="space-y-4 p-5">
            <div>
              <p className="font-mono text-[9px] font-medium tracking-[0.85px] text-ink-4 uppercase">
                Learnings held
              </p>
              <p className="mt-1.5 text-[24px] font-semibold text-ink">{MEMORY_STATS.learningsHeld}</p>
              <p className="mt-0.5 text-[10.5px] text-ink-4">scoped to this workspace</p>
            </div>
            <div className="border-t border-line pt-4">
              <p className="font-mono text-[9px] font-medium tracking-[0.85px] text-ink-4 uppercase">
                Cited in decisions
              </p>
              <p className="mt-1.5 text-[24px] font-semibold text-ink">{MEMORY_STATS.citedInDecisions}</p>
              <p className="mt-0.5 text-[10.5px] text-ink-4">this quarter</p>
            </div>
            <div className="border-t border-line pt-4">
              <p className="font-mono text-[9px] font-medium tracking-[0.85px] text-ink-4 uppercase">
                Superseded
              </p>
              <p className="mt-1.5 text-[24px] font-semibold text-ink">{MEMORY_STATS.superseded}</p>
              <p className="mt-0.5 text-[10.5px] text-ink-4">kept for the record</p>
            </div>
            <div className="border-t border-line pt-4">
              <p className="font-mono text-[9px] font-medium tracking-[0.85px] text-ink-4 uppercase">
                Cross-tenant
              </p>
              <p className="mt-1.5 text-[24px] font-semibold text-teal">{MEMORY_STATS.crossTenant}</p>
              <p className="mt-0.5 text-[10.5px] text-ink-4">and it stays that way</p>
            </div>

            <div className="rounded-panel border border-line bg-paper p-4">
              <h3 className="text-[11.5px] font-semibold text-ink">Memory never wins over evidence</h3>
              <p className="mt-1.5 text-[10.5px] leading-relaxed text-ink-3">
                When a learning and a fresh reading disagree, agents surface both and say which is newer. The
                old belief is never quietly applied.
              </p>
            </div>
          </div>
        </aside>
      </div>
    </div>
  );
};

export default BusinessMemory;
