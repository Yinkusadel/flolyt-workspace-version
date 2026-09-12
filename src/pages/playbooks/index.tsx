import * as React from "react";
import { Link } from "react-router-dom";

import { cn } from "@/lib/utils";
import { Chip } from "@/components/ui/chip";
import { KpiCards, type Kpi } from "@/components/ui/kpi-cards";
import { PersonAvatar } from "@/components/person-avatar";
import {
  AUTONOMY_FOOTNOTE,
  AUTONOMY_LABEL,
  AUTONOMY_TONE,
  PLAYBOOKS,
  PLAYBOOK_STATS,
  countByStatus,
  type AutonomyStatus,
  type Playbook,
} from "@/pages/playbooks/data";
import { PlaybooksEmptyState } from "@/pages/playbooks/empty-view";

/**
 * PB01/PB06 — /playbooks. A fixed six-row library (see data.ts's own note on why this isn't the
 * export's flavor count of nine) with a small `PLAYBOOKS_DEMO_STATE` flag for the before-anything
 * state, same precedent as business-memory's `MEMORY_DEMO_STATE`. Filter chip counts are derived
 * from `PLAYBOOKS` itself rather than hand-typed, so a click never claims a count the table can't
 * back up.
 */

const PLAYBOOKS_DEMO_STATE: "populated" | "empty" = "populated";

type IndexFilter = "all" | AutonomyStatus;

const FILTERS: { value: IndexFilter; label: string }[] = [
  { value: "all", label: "All" },
  { value: "automatic", label: "Automatic" },
  { value: "proposed", label: "Proposed" },
  { value: "draft", label: "Draft" },
  { value: "retired", label: "Retired" },
];

function filterCount(value: IndexFilter): number {
  if (value === "all") return PLAYBOOKS.length;
  return countByStatus(value);
}

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
            <span className="text-[11px] text-ink-4">{filterCount(f.value)}</span>
          </button>
        );
      })}
    </div>
  );
}

function AutonomyBadge({ playbook }: { playbook: Playbook }) {
  return (
    <div className="flex flex-col items-end gap-1">
      <Chip tone={AUTONOMY_TONE[playbook.status]} className={cn(playbook.status === "retired" && "border-dashed")}>
        {AUTONOMY_LABEL[playbook.status]}
      </Chip>
      {playbook.status === "retired" && playbook.retiredOn && (
        <span className="text-[10.5px] text-ink-4">retired {playbook.retiredOn}</span>
      )}
    </div>
  );
}

function PlaybookRow({ playbook }: { playbook: Playbook }) {
  const retired = playbook.status === "retired";
  return (
    <div className="grid grid-cols-1 gap-3 border-b border-line px-4 py-4 last:border-0 sm:grid-cols-[1.5fr_1.4fr_auto_1.2fr_auto] sm:items-center sm:gap-4">
      <div className="min-w-0">
        <Link
          to={`/playbooks/${playbook.id}`}
          className={cn("font-semibold hover:underline", retired ? "text-ink-3" : "text-ultra")}
        >
          {playbook.name}
        </Link>
        <div className="mt-0.5 flex items-center gap-1.5 text-[11.5px] text-ink-4">
          <PersonAvatar kind="agent" initials={playbook.owner.initials} size="sm" />
          {playbook.owner.name}
        </div>
      </div>

      <p className={cn("text-[12.5px]", retired ? "text-ink-4" : "text-ink-2")}>{playbook.trigger}</p>

      <p className={cn("text-[13px] sm:text-right", retired ? "text-ink-4" : "text-ink-2")}>{playbook.runs}</p>

      <p
        className={cn(
          "text-[12.5px] font-medium sm:text-right",
          retired ? "text-ink-4" : playbook.effectTone === "teal" ? "text-teal" : "text-ink-3"
        )}
      >
        {playbook.effectLabel}
        {playbook.runsSignificantOf != null && (
          <span className="mt-0.5 block text-[10.5px] font-normal text-ink-4">
            {playbook.runsSignificantOf} of {playbook.runs} significant
          </span>
        )}
      </p>

      <AutonomyBadge playbook={playbook} />
    </div>
  );
}

function PlaybookTable({ playbooks }: { playbooks: Playbook[] }) {
  if (playbooks.length === 0) {
    return (
      <div className="rounded-card border border-dashed border-line bg-paper p-10 text-center">
        <p className="text-[13px] font-semibold text-ink">Nothing matches this filter</p>
        <p className="mt-1 text-[11.5px] text-ink-3">Try a different filter, or clear it to see every playbook.</p>
      </div>
    );
  }

  return (
    <div className="overflow-hidden rounded-card border border-line bg-paper">
      <div className="hidden border-b border-line bg-paper-2 px-4 py-2.5 sm:grid sm:grid-cols-[1.5fr_1.4fr_auto_1.2fr_auto] sm:gap-4">
        <span className="font-mono text-[8.5px] font-medium tracking-[0.8px] text-ink-4 uppercase">Playbook</span>
        <span className="font-mono text-[8.5px] font-medium tracking-[0.8px] text-ink-4 uppercase">Triggers on</span>
        <span className="text-right font-mono text-[8.5px] font-medium tracking-[0.8px] text-ink-4 uppercase">Runs</span>
        <span className="text-right font-mono text-[8.5px] font-medium tracking-[0.8px] text-ink-4 uppercase">
          Measured effect
        </span>
        <span className="text-right font-mono text-[8.5px] font-medium tracking-[0.8px] text-ink-4 uppercase">
          Autonomy
        </span>
      </div>
      {playbooks.map((playbook) => (
        <PlaybookRow key={playbook.id} playbook={playbook} />
      ))}
    </div>
  );
}

function PopulatedIndex() {
  const [filter, setFilter] = React.useState<IndexFilter>("all");
  const filtered = filter === "all" ? PLAYBOOKS : PLAYBOOKS.filter((p) => p.status === filter);

  const stats: Kpi[] = [
    { eyebrow: "In the library", value: PLAYBOOK_STATS.inLibrary.value, tone: "ink", note: PLAYBOOK_STATS.inLibrary.note },
    {
      eyebrow: "Runs this quarter",
      value: PLAYBOOK_STATS.runsThisQuarter.value,
      tone: "ink",
      note: PLAYBOOK_STATS.runsThisQuarter.note,
    },
    {
      eyebrow: "Preserved",
      value: PLAYBOOK_STATS.preserved.value,
      tone: PLAYBOOK_STATS.preserved.tone,
      note: PLAYBOOK_STATS.preserved.note,
    },
    { eyebrow: "Retired", value: PLAYBOOK_STATS.retired.value, tone: PLAYBOOK_STATS.retired.tone, note: PLAYBOOK_STATS.retired.note },
  ];

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <h1 className="text-[17px] font-semibold text-ink">Playbooks</h1>
          <p className="mt-1 text-[11.5px] text-ink-3">A playbook is memory that has earned the right to run again</p>
        </div>
        <Link to="/playbooks/propose" className="shrink-0 text-[12.5px] font-medium text-ultra hover:underline">
          Flolyt has 1 playbook to propose →
        </Link>
      </div>

      <KpiCards items={stats} />

      <FilterChips active={filter} onChange={setFilter} />

      <PlaybookTable playbooks={filtered} />

      <div>
        <p className="text-[13px] text-ink">{AUTONOMY_FOOTNOTE.headline}</p>
        <p className="mt-1 text-[11.5px] text-ink-3">{AUTONOMY_FOOTNOTE.body}</p>
      </div>
    </div>
  );
}

export default function Playbooks() {
  if (PLAYBOOKS_DEMO_STATE === "empty") return <PlaybooksEmptyState />;
  return <PopulatedIndex />;
}
