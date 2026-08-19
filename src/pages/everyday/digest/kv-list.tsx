import { cn } from "@/lib/utils";
import { TONE_TEXT_CLASS } from "@/pages/everyday/rooms/tone";
import type { KvRow } from "@/pages/everyday/digest/types";

/** Label-left / mono-value-right list with hairline dividers — "How this arrives", "What gets in", "Still running", etc. */
export function KvList({ label, rows }: { label?: string; rows: KvRow[] }) {
  return (
    <div>
      {label && <p className="mb-2 font-mono text-[9px] font-medium tracking-[0.85px] text-ink-4 uppercase">{label}</p>}
      <div className="divide-y divide-line rounded-card border border-line bg-paper">
        {rows.map((row) => (
          <div key={row.label} className="flex flex-col gap-1 px-3.5 py-2.5 sm:flex-row sm:items-baseline sm:justify-between sm:gap-4">
            <span className="text-[11px] text-ink-3">{row.label}</span>
            <span className={cn("font-mono text-[10.5px] sm:text-right", row.tone ? TONE_TEXT_CLASS[row.tone] : "text-ink-2")}>
              {row.value}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
