import { EX_TONE_CLASS, type ExTone } from "@/pages/customers/experiments/data";

/** Label-left / value-right list, same shape as every other section's own KvList component. */
export function ExperimentsKvList({ rows }: { rows: { label: string; value: string; tone?: ExTone }[] }) {
  return (
    <div className="divide-y divide-line rounded-card border border-line bg-paper">
      {rows.map((row) => (
        <div key={row.label} className="flex flex-col gap-1 px-3.5 py-2.5 sm:flex-row sm:items-baseline sm:justify-between sm:gap-4">
          <span className="text-[11px] text-ink-3">{row.label}</span>
          <span className={`font-mono text-[10.5px] sm:text-right ${row.tone ? EX_TONE_CLASS[row.tone] : "text-ink-2"}`}>{row.value}</span>
        </div>
      ))}
    </div>
  );
}
