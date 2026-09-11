import { cn } from "@/lib/utils";

const TONE_CLASSES = {
  teal: "bg-teal",
  amber: "bg-amber",
  rose: "bg-rose",
  ink: "bg-ink-4",
  ultra: "bg-ultra",
} as const;

const TONE_TEXT_CLASSES = {
  teal: "text-teal",
  amber: "text-amber",
  rose: "text-rose",
  ink: "text-ink-3",
  ultra: "text-ultra",
} as const;

export type BarTone = keyof typeof TONE_CLASSES;

/** A bare progress track, for callers that already render their own label/trailing text. */
export function BarTrack({ percent, tone }: { percent: number; tone: BarTone }) {
  return (
    <div className="h-1.5 rounded-full bg-paper">
      <div
        className={cn("h-1.5 rounded-full", TONE_CLASSES[tone])}
        style={{ width: `${Math.min(100, Math.max(0, percent))}%` }}
      />
    </div>
  );
}

/** A labelled horizontal bar row — channel quality, LTV, time-to-value, elasticity, etc. */
export function BarRow({
  label,
  percent,
  tone,
  trailing,
  trailingTone = "ink",
}: {
  label: string;
  percent: number;
  tone: BarTone;
  trailing: string;
  trailingTone?: BarTone;
}) {
  return (
    <div className="grid grid-cols-[minmax(0,150px)_1fr_auto] items-center gap-3">
      <span className="truncate text-[11.5px] text-ink-2">{label}</span>
      <div className="h-1.5 rounded-full bg-paper" role="img" aria-label={`${label}: ${trailing}`}>
        <div
          className={cn("h-1.5 rounded-full", TONE_CLASSES[tone])}
          style={{ width: `${Math.min(100, Math.max(0, percent))}%` }}
        />
      </div>
      <span className={cn("shrink-0 text-[10.5px]", TONE_TEXT_CLASSES[trailingTone])}>
        {trailing}
      </span>
    </div>
  );
}

/**
 * The "label + value line, full-width bar below" pattern used across the
 * new lifecycle screens — Overview's acquired/second-order comparison,
 * Channels' spend breakdown, Cohorts' before/after break. Distinct from
 * BarRow above, which keeps the label and bar on one line at a fixed
 * label width.
 */
export function WideBarRow({ label, value, percent, tone }: { label: string; value: string; percent: number; tone: BarTone }) {
  return (
    <div className="space-y-1.5">
      <div className="flex flex-wrap items-baseline justify-between gap-x-4 gap-y-1">
        <span className="text-[12px] font-semibold text-ink">{label}</span>
        <span className="font-mono text-[10.5px] text-ink-3">{value}</span>
      </div>
      <BarTrack percent={percent} tone={tone} />
    </div>
  );
}
