import { LK_TONE_CLASS, type LkTone } from "@/pages/revenue/leaks/data";

/**
 * Label-left / value-right list, same shape as digest's KvList but keyed to
 * this section's own 6-value `LkTone` (adds a de-emphasised `muted`/ink-4 on
 * top of the app-wide 5-value `Tone`, needed for the export's own "—" /
 * "Unavailable" / "always" rows).
 */
export function LeaksKvList({ rows }: { rows: { label: string; value: string; tone?: LkTone }[] }) {
  return (
    <div className="divide-y divide-line rounded-card border border-line bg-paper">
      {rows.map((row) => (
        <div key={row.label} className="flex flex-col gap-1 px-3.5 py-2.5 sm:flex-row sm:items-baseline sm:justify-between sm:gap-4">
          <span className="text-[11px] text-ink-3">{row.label}</span>
          <span className={`font-mono text-[10.5px] sm:text-right ${row.tone ? LK_TONE_CLASS[row.tone] : "text-ink-2"}`}>{row.value}</span>
        </div>
      ))}
    </div>
  );
}
