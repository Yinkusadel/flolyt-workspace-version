import { cn } from "@/lib/utils";
import { AT_TONE_CLASS, type AtTone } from "@/pages/revenue/attribution/data";

const BAR_BG_CLASS: Record<AtTone, string> = {
  ok: "bg-teal",
  warn: "bg-amber",
  risk: "bg-rose",
  ai: "bg-ultra",
  muted: "bg-ink-4",
  neutral: "bg-ink-4",
  num: "bg-ink-4",
};

/** "Treated against held" recovery-rate bars — AT04's one-intervention detail. */
export function AttributionBars({ rows }: { rows: { label: string; sub: string; percent: number; tone: AtTone }[] }) {
  return (
    <div className="space-y-4">
      {rows.map((row) => (
        <div key={row.label} className="space-y-1.5">
          <div className="flex flex-wrap items-baseline justify-between gap-x-4 gap-y-1">
            <span className="text-[12.5px] font-semibold text-ink">{row.label}</span>
            <span className={cn("font-mono text-[11px] font-semibold", AT_TONE_CLASS[row.tone])}>{row.sub}</span>
          </div>
          <div className="h-2 rounded-full bg-paper-2">
            <div className={cn("h-2 rounded-full", BAR_BG_CLASS[row.tone])} style={{ width: `${Math.min(100, Math.max(0, row.percent))}%` }} />
          </div>
        </div>
      ))}
    </div>
  );
}
