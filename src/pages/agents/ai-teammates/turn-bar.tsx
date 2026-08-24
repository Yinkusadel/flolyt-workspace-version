import { cn } from "@/lib/utils";
import { TM_TONE_CLASS, type TmTone } from "@/pages/agents/ai-teammates/data";

const SEGMENT_BG_CLASS: Record<TmTone, string> = {
  ok: "bg-teal",
  warn: "bg-amber",
  risk: "bg-rose",
  ai: "bg-ultra",
  muted: "bg-ink-4",
  neutral: "bg-ink-4",
  num: "bg-ink-4",
};

/** Discrete per-turn progress — a run's "turn 4 of 6", not a continuous percent bar. Used on Reading now and Working with one. */
export function TurnBar({ label, sub, done, total, tone }: { label: string; sub: string; done: number; total: number; tone: TmTone }) {
  return (
    <div className="space-y-1.5">
      <div className="flex flex-wrap items-baseline justify-between gap-x-4 gap-y-1">
        <span className="text-[12.5px] font-semibold text-ink">{label}</span>
        <span className={cn("font-mono text-[10.5px]", TM_TONE_CLASS[tone])}>{sub}</span>
      </div>
      <div className="flex gap-1">
        {Array.from({ length: total }, (_, i) => (
          <div
            key={i}
            className={cn("h-1.5 flex-1 rounded-full", i < done ? SEGMENT_BG_CLASS[tone] : "bg-paper-2")}
          />
        ))}
      </div>
    </div>
  );
}
