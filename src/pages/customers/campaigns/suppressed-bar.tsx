import { CP_TONE_CLASS, type CpTone } from "@/pages/customers/campaigns/data";

const BAR_TONE_CLASS: Record<CpTone, string> = {
  ok: "bg-teal",
  warn: "bg-amber",
  risk: "bg-rose",
  ai: "bg-ultra",
  muted: "bg-ink-4",
  neutral: "bg-ink-3",
  num: "bg-ink-3",
};

/** CP07's stacked population bar — who received something this week and who was suppressed, and by what, drawn as one line so the gap is unavoidable. */
export function SuppressedBar({ rows }: { rows: { label: string; count: number; tone: CpTone }[] }) {
  const total = rows.reduce((sum, row) => sum + row.count, 0);

  return (
    <div className="space-y-3">
      <div className="flex h-page w-full overflow-hidden rounded-panel bg-paper-2">
        {rows.map((row) => (
          <div
            key={row.label}
            className={BAR_TONE_CLASS[row.tone]}
            style={{ width: `${(row.count / total) * 100}%` }}
            title={row.label}
          />
        ))}
      </div>
      <div className="space-y-1.5">
        {rows.map((row) => (
          <div key={row.label} className="flex items-center justify-between gap-3">
            <span className="flex items-center gap-2 text-[11px] text-ink-2">
              <span className={`size-2 shrink-0 rounded-full ${BAR_TONE_CLASS[row.tone]}`} aria-hidden />
              {row.label}
            </span>
            <span className={`font-mono text-[10.5px] ${CP_TONE_CLASS[row.tone]}`}>{row.count.toLocaleString()}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
