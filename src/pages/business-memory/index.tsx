import * as React from "react";
import { Link, useSearchParams } from "react-router-dom";
import { Sparkles } from "lucide-react";

import { cn } from "@/lib/utils";
import { Input } from "@/components/ui/input";
import { Chip, type ChipTone } from "@/components/ui/chip";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { KpiCards, type Kpi } from "@/components/ui/kpi-cards";
import {
  CONTROL_CHIP_TONE,
  MEMORY_DEMO_STATE,
  MEMORY_ENTRIES,
  MEMORY_STATS,
  RETAINED_NOTE,
  countByControlStatus,
  countCitedThisQuarter,
  filterEntries,
  type IndexFilter,
  type MemoryEntry,
} from "@/pages/business-memory/data";
import { RecallView } from "@/pages/business-memory/recall-view";
import { MemoryEmptyState } from "@/pages/business-memory/empty-view";

/**
 * ME01/02/05 — /business-memory. Branches on `?q=` (recall-view.tsx, ME02) first, since memory is
 * a search surface before it is a list (see data.ts's own note), then on the small
 * `MEMORY_DEMO_STATE` flag (empty-view.tsx, ME05) for the nothing-closed-yet state, falling
 * through to the populated table below (ME01). Filter chips and the sort control are real —
 * their counts are scaled to this file's five authored rows rather than the export's "31", so a
 * click never shows a number the list can't back up (see data.ts's IndexFilter helpers).
 */

const FILTERS: { value: IndexFilter; label: string; count: number }[] = [
  { value: "all", label: "All", count: MEMORY_ENTRIES.length },
  { value: "healthy", label: "Healthy controls", count: countByControlStatus("healthy") },
  { value: "decaying", label: "Decaying", count: countByControlStatus("decaying") },
  { value: "no-control", label: "No control", count: countByControlStatus("no-control") },
  { value: "cited", label: "Cited this quarter", count: countCitedThisQuarter() },
];

type SortBy = "cited" | "recent";

function FilterChips({ active, onChange }: { active: IndexFilter; onChange: (f: IndexFilter) => void }) {
  return (
    <div className="flex flex-wrap items-center gap-2">
      {FILTERS.map((f) => {
        const isActive = active === f.value;
        return (
          <button
            key={f.value}
            type="button"
            onClick={() => onChange(f.value)}
            className={cn(
              "flex items-center gap-2 rounded-panel border px-2.5 py-1.5 text-[12.5px] transition-colors",
              isActive
                ? "border-border bg-paper-2 font-medium text-ink"
                : "border-line bg-paper text-ink-3 hover:text-ink"
            )}
          >
            {f.label}
            <span className="text-[11px] text-ink-4">{f.count}</span>
          </button>
        );
      })}
    </div>
  );
}

function ControlBadge({ status, label, cited }: { status: MemoryEntry["control"]["status"]; label: string; cited: number }) {
  const dashed = status === "no-control";
  return (
    <div className="flex flex-col items-end gap-1">
      <Chip tone={CONTROL_CHIP_TONE[status] as ChipTone} className={cn(dashed && "border-dashed")}>
        {label}
      </Chip>
      <span className="text-[10.5px] text-ink-4">cited {cited}×</span>
    </div>
  );
}

function EntryRow({ entry }: { entry: MemoryEntry }) {
  return (
    <div className="grid grid-cols-1 gap-3 border-b border-line px-4 py-4 last:border-0 sm:grid-cols-[1.3fr_1.1fr_auto_auto] sm:items-center sm:gap-4">
      <div className="min-w-0">
        <Link to={`/business-memory/${entry.id}`} className="font-semibold text-ultra hover:underline">
          {entry.title}
        </Link>
        <p className="mt-0.5 text-[11.5px] text-ink-4">
          {entry.room} · closed {entry.closedShort} · open {entry.openDays} days
        </p>
      </div>

      <p className="text-[12.5px] text-ink-2">{entry.whatWorkedShort}</p>

      <div className="text-right sm:text-right">
        {entry.preserved ? (
          <>
            <p className="font-mono text-[14px] font-semibold text-teal">{entry.preserved}</p>
            <p className="text-[10.5px] text-ink-4">vs {entry.measuredAgainst}</p>
          </>
        ) : (
          <>
            <Chip tone="neutral">Unavailable</Chip>
            <p className="mt-1 text-[10.5px] text-ink-4">{entry.measuredAgainst}</p>
          </>
        )}
      </div>

      <ControlBadge status={entry.control.status} label={entry.control.badgeLabel} cited={entry.citedCount} />
    </div>
  );
}

function EntryTable({ entries }: { entries: MemoryEntry[] }) {
  if (entries.length === 0) {
    return (
      <div className="rounded-card border border-dashed border-line bg-paper p-10 text-center">
        <p className="text-[13px] font-semibold text-ink">Nothing matches this filter</p>
        <p className="mt-1 text-[11.5px] text-ink-3">Try a different filter, or clear it to see every closed room.</p>
      </div>
    );
  }

  return (
    <div className="overflow-hidden rounded-card border border-line bg-paper">
      <div className="hidden border-b border-line bg-paper-2 px-4 py-2.5 sm:grid sm:grid-cols-[1.3fr_1.1fr_auto_auto] sm:gap-4">
        <span className="font-mono text-[8.5px] font-medium tracking-[0.8px] text-ink-4 uppercase">Pattern</span>
        <span className="font-mono text-[8.5px] font-medium tracking-[0.8px] text-ink-4 uppercase">What worked</span>
        <span className="text-right font-mono text-[8.5px] font-medium tracking-[0.8px] text-ink-4 uppercase">Preserved</span>
        <span className="text-right font-mono text-[8.5px] font-medium tracking-[0.8px] text-ink-4 uppercase">Control</span>
      </div>
      {entries.map((entry) => (
        <EntryRow key={entry.id} entry={entry} />
      ))}
    </div>
  );
}

function PopulatedIndex({ onQueryChange }: { onQueryChange: (next: string) => void }) {
  const [filter, setFilter] = React.useState<IndexFilter>("all");
  const [sortBy, setSortBy] = React.useState<SortBy>("cited");

  const filtered = filterEntries(MEMORY_ENTRIES, filter);
  const sorted = sortBy === "cited" ? [...filtered].sort((a, b) => b.citedCount - a.citedCount) : filtered;

  const stats: Kpi[] = [
    { eyebrow: "Control coverage", value: MEMORY_STATS.controlCoverage.value, tone: MEMORY_STATS.controlCoverage.tone, note: MEMORY_STATS.controlCoverage.note },
    { eyebrow: "Control effectiveness", value: MEMORY_STATS.controlEffectiveness.value, tone: MEMORY_STATS.controlEffectiveness.tone, note: MEMORY_STATS.controlEffectiveness.note },
    { eyebrow: "Fix effectiveness", value: MEMORY_STATS.fixEffectiveness.value, tone: MEMORY_STATS.fixEffectiveness.tone, note: MEMORY_STATS.fixEffectiveness.note },
    { eyebrow: "Cited this quarter", value: MEMORY_STATS.citedThisQuarter.value, tone: MEMORY_STATS.citedThisQuarter.tone, note: MEMORY_STATS.citedThisQuarter.note },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-[17px] font-semibold text-ink">Business memory</h1>
        <p className="mt-1 text-[11.5px] text-ink-3">Every closed room, what worked, and whether it still holds</p>
      </div>

      <div className="flex flex-col gap-2.5 sm:flex-row sm:items-center">
        <div className="relative min-w-0 flex-1">
          <Sparkles className="pointer-events-none absolute top-1/2 left-3 size-3.5 -translate-y-1/2 text-ink-3" />
          <Input
            value=""
            onChange={(e) => onQueryChange(e.currentTarget.value)}
            placeholder="Has this happened before? Search patterns, rooms, controls…"
            className="h-10 bg-paper pl-9 text-[13px]"
          />
        </div>

        <Select value={sortBy} onValueChange={(v) => setSortBy(v as SortBy)}>
          <SelectTrigger className="w-auto shrink-0 py-2 text-[13px] whitespace-nowrap">
            <span>
              <span className="text-ink-3">Sort by </span>
              <SelectValue>{sortBy === "cited" ? "Most cited" : "As listed"}</SelectValue>
            </span>
          </SelectTrigger>
          <SelectContent align="end">
            <SelectItem value="cited">Most cited</SelectItem>
            <SelectItem value="recent">As listed</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <FilterChips active={filter} onChange={setFilter} />

      <KpiCards items={stats} />

      <EntryTable entries={sorted} />

      <p className="text-[11.5px] text-ink-3">{RETAINED_NOTE}</p>
    </div>
  );
}

export default function BusinessMemory() {
  const [searchParams, setSearchParams] = useSearchParams();
  const q = searchParams.get("q") ?? "";

  const setQuery = (next: string) => {
    setSearchParams(next ? { q: next } : {}, { replace: true });
  };

  if (q) return <RecallView query={q} onQueryChange={setQuery} />;
  if (MEMORY_DEMO_STATE === "empty") return <MemoryEmptyState />;
  return <PopulatedIndex onQueryChange={setQuery} />;
}
