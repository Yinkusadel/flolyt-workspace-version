import { Link } from "react-router-dom";
import { Sparkles } from "lucide-react";

import { cn } from "@/lib/utils";
import { Input } from "@/components/ui/input";
import { Chip, type ChipTone } from "@/components/ui/chip";
import {
  MEMORY_ENTRIES,
  NEAREST_MATCHES,
  RECALL_BANNER,
  getMemoryEntry,
  type NearestMatch,
} from "@/pages/business-memory/data";

/** ME02 — /business-memory?q=. Memory being checked, not browsed: a fixed illustrative recall for
 * any query, matching the export's own single authored scenario (see index.html's "02 · Recall"
 * caption) rather than a real search index behind the five mock rows. */

const STRENGTH_LABEL: Record<NearestMatch["strength"], string> = {
  strong: "Strong match",
  partial: "Partial match",
  weak: "Weak match",
};

const STRENGTH_TONE: Record<NearestMatch["strength"], ChipTone> = {
  strong: "teal",
  partial: "amber",
  weak: "neutral",
};

function MatchCard({ match }: { match: NearestMatch }) {
  const entry = getMemoryEntry(match.entryId);
  if (!entry) return null;

  return (
    <div className="rounded-card border border-line bg-paper p-5">
      <div className="flex flex-wrap items-start justify-between gap-2">
        <div className="flex items-baseline gap-2">
          <Link to={`/business-memory/${entry.id}`} className="font-semibold text-ultra hover:underline">
            {entry.title}
          </Link>
          <span className="text-[11.5px] text-ink-4">
            {entry.room} · {entry.closedShort}
          </span>
        </div>
        <Chip tone={STRENGTH_TONE[match.strength]}>{STRENGTH_LABEL[match.strength]}</Chip>
      </div>

      <p className="mt-2.5 text-[12.5px] text-ink-2">{match.reason}</p>

      <p
        className={cn(
          "mt-3 text-[12px] font-medium",
          match.suggestion === "Not applicable" ? "text-ink-4" : "text-ultra"
        )}
      >
        Suggests: {match.suggestion}
      </p>
    </div>
  );
}

export function RecallView({ query, onQueryChange }: { query: string; onQueryChange: (next: string) => void }) {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-[17px] font-semibold text-ink">Business memory</h1>
        <p className="mt-1 text-[11.5px] text-ink-3">Checked before any room opens · {MEMORY_ENTRIES.length} retained outcomes</p>
      </div>

      <div className="relative">
        <Sparkles className="pointer-events-none absolute top-1/2 left-3 size-3.5 -translate-y-1/2 text-ink-3" />
        <Input
          value={query}
          onChange={(e) => onQueryChange(e.currentTarget.value)}
          placeholder="Has this happened before? Search patterns, rooms, controls…"
          className="h-10 border-ultra bg-paper pl-9 text-[13px]"
        />
      </div>

      <div className="rounded-card border border-ultra-border bg-ultra-bg p-4">
        <div className="flex items-start gap-2.5">
          <Sparkles className="mt-0.5 size-4 shrink-0 text-ultra" />
          <div>
            <p className="text-[13px] font-semibold text-ink">{RECALL_BANNER.headline}</p>
            <p className="mt-1 text-[12px] text-ink-2">{RECALL_BANNER.body}</p>
          </div>
        </div>
      </div>

      <div className="space-y-3">
        <p className="font-mono text-[9.5px] font-medium tracking-[1.05px] text-ink-4 uppercase">Nearest matches</p>
        {NEAREST_MATCHES.map((match) => (
          <MatchCard key={match.entryId} match={match} />
        ))}
      </div>

      <p className="text-[11.5px] text-ink-3">
        Memory is checked on every detection. A pattern with no match opens a room; a pattern with a healthy control
        reopens the old one.
      </p>
    </div>
  );
}
