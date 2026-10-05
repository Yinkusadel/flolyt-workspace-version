import { useState } from "react";
import { ChevronDown, ChevronUp } from "lucide-react";

import { Chip } from "@/components/ui/chip";
import type { LeakageCoverageDto } from "@/services/api/leakage/get-leakage";

function ConditionList({ heading, items }: { heading: string; items: string[] }) {
  return (
    <div className="rounded-control border border-line bg-paper-2 p-3">
      <p className="font-mono text-[9px] font-medium tracking-[0.6px] text-ink-4 uppercase">
        {heading} ({items.length})
      </p>
      {items.length > 0 ? (
        <div className="mt-2 space-y-1">
          {items.map((item) => (
            <p key={item} className="text-[11px] text-ink-2">
              · {item}
            </p>
          ))}
        </div>
      ) : (
        <p className="mt-2 text-[11px] text-ink-4">None</p>
      )}
    </div>
  );
}

/**
 * "COVERAGE & LIMITATIONS" (07-coverage-panel.svg) — thinned to the real `LeakageCoverageDto`
 * fields. The export's own three-list layout (Covered / Not covered / Not included) and its
 * dollar/percent detail per line, "How to improve" boosts, and "Last updated" stamp all had no API
 * equivalent (docs/leakage-map/build-plan.md mismatch #7) — dropped rather than invented. What's
 * real: `percent`, `sentence` (the server's own explanation, not client-authored copy), and the
 * two condition-name lists — confirmed live 2026-09-23 to already be display-ready labels
 * ("Repeat decay", "Involuntary churn", …), not keys needing a lookup.
 */
export function CoveragePanel({ coverage }: { coverage?: LeakageCoverageDto }) {
  const [expanded, setExpanded] = useState(false);

  if (!coverage) return null;

  return (
    <div className="rounded-card border border-line bg-paper p-5">
      <button
        type="button"
        onClick={() => setExpanded((e) => !e)}
        aria-expanded={expanded}
        className="flex w-full items-center justify-between gap-3 text-left"
      >
        <div>
          <div className="flex flex-wrap items-center gap-2">
            <h2 className="text-[14.5px] font-semibold text-ink">Coverage &amp; limitations</h2>
            <Chip tone="neutral">{coverage.percent}%</Chip>
          </div>
          <p className="mt-0.5 text-[11.5px] text-ink-3">{coverage.sentence}</p>
        </div>
        <span className="flex shrink-0 items-center gap-1 text-[11.5px] font-medium text-ink-2">
          {expanded ? "Collapse" : "Expand"}
          {expanded ? <ChevronUp className="size-3.5" /> : <ChevronDown className="size-3.5" />}
        </span>
      </button>

      {expanded && (
        <div className="mt-4 grid grid-cols-1 gap-3 border-t border-line pt-4 sm:grid-cols-2">
          <ConditionList heading="Measured" items={coverage.measuredConditions} />
          <ConditionList heading="Not yet measured" items={coverage.unmeasuredConditions} />
        </div>
      )}
    </div>
  );
}
