import { SG_TONE_CLASS, type SgTone } from "@/pages/customers/segments/data";

/** Label-left / value-right list, same shape as the Revenue sections' own KvList components. */
export function SegmentsKvList({ rows }: { rows: { label: string; value: string; tone?: SgTone }[] }) {
  return (
    <div className="divide-y divide-line rounded-card border border-line bg-paper">
      {rows.map((row) => (
        <div key={row.label} className="flex flex-col gap-1 px-3.5 py-2.5 sm:flex-row sm:items-baseline sm:justify-between sm:gap-4">
          <span className="text-[11px] text-ink-3">{row.label}</span>
          <span className={`font-mono text-[10.5px] sm:text-right ${row.tone ? SG_TONE_CLASS[row.tone] : "text-ink-2"}`}>{row.value}</span>
        </div>
      ))}
    </div>
  );
}
