import { cn } from "@/lib/utils";
import { FN_BAR_TONE, FN_TONE_CLASS, type FunnelStepRow } from "@/pages/revenue/funnel/data";

const BAR_BG_CLASS = {
  teal: "bg-teal",
  amber: "bg-amber",
  rose: "bg-rose",
  ink: "bg-ink-4",
  ultra: "bg-ultra",
} as const;

/** The horizontal funnel bars with drop-off called out on the right — shared by the default and degraded states. */
export function FunnelStepBars({ rows }: { rows: FunnelStepRow[] }) {
  return (
    <div className="space-y-4">
      {rows.map((row) => (
        <div key={row.label} className="space-y-1.5">
          <div className="flex flex-wrap items-baseline justify-between gap-x-4 gap-y-1">
            <span className="text-[12.5px] font-semibold text-ink">{row.label}</span>
            <span className={cn("font-mono text-[11.5px]", row.count === "Unavailable" ? "text-ink-4" : "text-ink-3")}>{row.count}</span>
          </div>
          <div className="h-2 rounded-full bg-paper-2">
            {row.percent > 0 && (
              <div
                className={cn("h-2 rounded-full", BAR_BG_CLASS[FN_BAR_TONE[row.tone]])}
                style={{ width: `${Math.min(100, Math.max(0, row.percent))}%` }}
              />
            )}
          </div>
          {row.drop && (
            <p className={cn("text-right font-mono text-[10px] font-semibold", FN_TONE_CLASS[row.tone])}>{row.drop}</p>
          )}
        </div>
      ))}
    </div>
  );
}
