import { cn } from "@/lib/utils";

const ACCENT_CLASS = {
  teal: "border-teal-border bg-teal-bg",
  amber: "border-amber-border bg-amber-bg",
  rose: "border-rose-border bg-rose-bg",
} as const;

const TEXT_CLASS = {
  teal: "text-teal",
  amber: "text-amber",
  rose: "text-rose",
} as const;

/**
 * The accent box that opens DS04, DS10 and DS15 — a kicker + a big value + a
 * description on the left, a small labelled stat on the right. Not shared
 * with other sections (each built its own bespoke accent box), but reused
 * here because the same three-part shape recurs three times in this one.
 */
export function DataSourcesHero({
  tone,
  kicker,
  value,
  desc,
  statLabel,
  statValue,
  statSub,
}: {
  tone: keyof typeof ACCENT_CLASS;
  kicker: string;
  value: string;
  desc: string;
  statLabel: string;
  statValue: string;
  statSub: string;
}) {
  return (
    <div className={cn("rounded-card border p-5 sm:p-6", ACCENT_CLASS[tone])}>
      <div className="flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">
        <div className="min-w-0">
          <p className={cn("font-mono text-[9px] font-medium tracking-[0.85px] uppercase", TEXT_CLASS[tone])}>{kicker}</p>
          <p className="mt-2 text-[26px] font-semibold text-ink">{value}</p>
          <p className="mt-2 max-w-xl text-[11px] leading-relaxed text-ink-2">{desc}</p>
        </div>
        <div className="shrink-0 border-t border-dashed border-line pt-3 sm:border-t-0 sm:border-l sm:pt-0 sm:pl-6">
          <p className="font-mono text-[8.5px] text-ink-4 uppercase">{statLabel}</p>
          <p className={cn("mt-0.5 text-[15px] font-semibold", TEXT_CLASS[tone])}>{statValue}</p>
          <p className="mt-0.5 max-w-[160px] text-[10px] text-ink-4">{statSub}</p>
        </div>
      </div>
    </div>
  );
}
