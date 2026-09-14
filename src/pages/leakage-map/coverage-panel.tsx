import { useState } from "react";
import { ChevronDown, ChevronUp } from "lucide-react";

import { COVERAGE_PANEL } from "@/pages/leakage-map/data";

function ListBlock({
  heading,
  items,
}: {
  heading: string;
  items: { label: string; detail: string }[];
}) {
  return (
    <div>
      <p className="font-mono text-[9px] font-medium tracking-[0.6px] text-ink-4 uppercase">{heading}</p>
      <ul className="mt-1.5 space-y-1">
        {items.map((item) => (
          <li key={item.label} className="flex items-baseline justify-between gap-3 text-[11.5px]">
            <span className="text-ink-2">· {item.label}</span>
            {item.detail && <span className="shrink-0 text-ink-4">{item.detail}</span>}
          </li>
        ))}
      </ul>
    </div>
  );
}

/** "COVERAGE & LIMITATIONS" (07-coverage-panel.svg) — what is covered, what is not, and what is
 * excluded from every figure by definition, plus what connecting each missing source would buy. */
export function CoveragePanel() {
  const [expanded, setExpanded] = useState(false);

  return (
    <div className="rounded-card border border-line bg-paper p-5">
      <button
        type="button"
        onClick={() => setExpanded((e) => !e)}
        aria-expanded={expanded}
        className="flex w-full items-center justify-between gap-3 text-left"
      >
        <div>
          <h2 className="text-[14.5px] font-semibold text-ink">Coverage &amp; limitations</h2>
          <p className="mt-0.5 text-[11.5px] text-ink-3">
            {COVERAGE_PANEL.overallPercent}% of detectable leak surface · {COVERAGE_PANEL.missingSourceCount} sources
            missing
          </p>
        </div>
        <span className="flex shrink-0 items-center gap-1 text-[11.5px] font-medium text-ink-2">
          {expanded ? "Collapse" : "Expand"}
          {expanded ? <ChevronUp className="size-3.5" /> : <ChevronDown className="size-3.5" />}
        </span>
      </button>

      {expanded && (
        <div className="mt-4 space-y-4 border-t border-line pt-4">
          <div>
            <p className="font-mono text-[9px] font-medium tracking-[0.6px] text-ink-4 uppercase">Covered</p>
            <ul className="mt-1.5 space-y-1">
              {COVERAGE_PANEL.covered.lines.map((line) => (
                <li key={line} className="text-[11.5px] text-ink-2">
                  · {line}
                </li>
              ))}
            </ul>
            <p className="mt-1 text-[10.5px] text-ink-4">{COVERAGE_PANEL.covered.customerPercent}% of customers</p>
          </div>

          <ListBlock heading="Not covered" items={COVERAGE_PANEL.notCovered} />
          <ListBlock heading="Not included in any figure" items={COVERAGE_PANEL.notIncluded} />

          <div>
            <p className="font-mono text-[9px] font-medium tracking-[0.6px] text-ink-4 uppercase">
              How to improve coverage
            </p>
            <ul className="mt-1.5 space-y-1">
              {COVERAGE_PANEL.howToImprove.map((item) => (
                <li key={item.label} className="flex items-baseline justify-between gap-3 text-[11.5px]">
                  <span className="text-ink-2">{item.label}</span>
                  <span className="font-medium text-teal">{item.boost}</span>
                </li>
              ))}
            </ul>
          </div>

          <p className="text-[10.5px] text-ink-4">Last updated {COVERAGE_PANEL.lastUpdated}</p>
        </div>
      )}
    </div>
  );
}
