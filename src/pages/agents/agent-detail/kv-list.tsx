import { Link } from "react-router-dom";

import { AN_TONE_CLASS, type AnTone } from "@/pages/agents/agent-detail/data";

/** Label-left / value-right list, same shape as AgentBuilderKvList, keyed to this section's own AnTone. Rows may optionally link out. */
export function AgentDetailKvList({ rows }: { rows: { label: string; value: string; tone?: AnTone; href?: string }[] }) {
  return (
    <div className="divide-y divide-line rounded-card border border-line bg-paper">
      {rows.map((row) => {
        const content = (
          <>
            <span className={row.href ? "text-[11px] font-semibold text-ultra" : "text-[11px] text-ink-3"}>{row.label}</span>
            <span className={`font-mono text-[10.5px] sm:text-right ${row.tone ? AN_TONE_CLASS[row.tone] : "text-ink-2"}`}>{row.value}</span>
          </>
        );
        if (row.href) {
          return (
            <Link
              key={row.label}
              to={row.href}
              className="flex flex-col gap-1 px-3.5 py-2.5 transition-colors hover:bg-paper-2 sm:flex-row sm:items-baseline sm:justify-between sm:gap-4"
            >
              {content}
            </Link>
          );
        }
        return (
          <div key={row.label} className="flex flex-col gap-1 px-3.5 py-2.5 sm:flex-row sm:items-baseline sm:justify-between sm:gap-4">
            {content}
          </div>
        );
      })}
    </div>
  );
}
