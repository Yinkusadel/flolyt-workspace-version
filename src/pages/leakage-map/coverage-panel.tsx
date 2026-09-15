import { useState, type ReactNode } from "react";
import { ChevronDown, ChevronUp } from "lucide-react";

import { COVERAGE_PANEL } from "@/pages/leakage-map/data";

function SubCard({
  heading,
  stat,
  children,
}: {
  heading: string;
  stat?: string;
  children: ReactNode;
}) {
  return (
    <div className="rounded-control border border-line bg-paper-2 p-3">
      <div className="flex items-center justify-between gap-2">
        <p className="font-mono text-[9px] font-medium tracking-[0.6px] text-ink-4 uppercase">{heading}</p>
        {stat && <span className="text-[13px] font-semibold text-teal">{stat}</span>}
      </div>
      <div className="mt-2 space-y-1.5">{children}</div>
    </div>
  );
}

function ListItem({ label, detail }: { label: string; detail?: string }) {
  return (
    <div className="text-[11px] leading-snug">
      <span className="text-ink-2">· {label}</span>
      {detail && <span className="block pl-2.5 text-[10px] text-ink-4">{detail}</span>}
    </div>
  );
}

/** "COVERAGE & LIMITATIONS" (07-coverage-panel.svg) — what is covered, what is not, and what is
 * excluded from every figure by definition, plus what connecting each missing source would buy.
 * The export's own three lists (Covered / Not covered / Not included) sit side by side as one
 * row — a stacked full-width list wastes height and strands each detail far from its label, so
 * this renders them as three compact cards in a grid instead. */
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
        <div className="mt-4 border-t border-line pt-4">
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
            <SubCard heading="Covered" stat={`${COVERAGE_PANEL.covered.customerPercent}%`}>
              {COVERAGE_PANEL.covered.lines.map((line) => (
                <ListItem key={line} label={line} />
              ))}
            </SubCard>

            <SubCard heading="Not covered">
              {COVERAGE_PANEL.notCovered.map((item) => (
                <ListItem key={item.label} label={item.label} detail={item.detail} />
              ))}
            </SubCard>

            <SubCard heading="Not included in any figure">
              {COVERAGE_PANEL.notIncluded.map((item) => (
                <ListItem key={item.label} label={item.label} detail={item.detail || undefined} />
              ))}
            </SubCard>
          </div>

          <div className="mt-3 rounded-control border border-line bg-paper-2 p-3">
            <p className="font-mono text-[9px] font-medium tracking-[0.6px] text-ink-4 uppercase">
              How to improve coverage
            </p>
            <div className="mt-2 grid grid-cols-1 gap-2 sm:grid-cols-3">
              {COVERAGE_PANEL.howToImprove.map((item) => (
                <div
                  key={item.label}
                  className="flex items-center justify-between gap-2 rounded-control border border-line bg-paper px-2.5 py-1.5"
                >
                  <span className="text-[11px] text-ink-2">{item.label}</span>
                  <span className="shrink-0 text-[11px] font-semibold text-teal">{item.boost}</span>
                </div>
              ))}
            </div>
          </div>

          <p className="mt-3 text-right text-[10.5px] text-ink-4">Last updated {COVERAGE_PANEL.lastUpdated}</p>
        </div>
      )}
    </div>
  );
}
