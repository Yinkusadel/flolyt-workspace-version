import { cn } from "@/lib/utils";

export type ChipTone = "teal" | "amber" | "rose" | "neutral" | "ultra";

const CHIP_TONE_CLASS: Record<ChipTone, string> = {
  teal: "border-teal-border bg-teal-bg text-teal",
  amber: "border-amber-border bg-amber-bg text-amber",
  rose: "border-rose-border bg-rose-bg text-rose",
  neutral: "border-line bg-paper-2 text-ink-3",
  ultra: "border-ultra-border bg-ultra-bg text-ultra",
};

/** The small verdict/status pills used throughout tables — "best", "marginal", "validated", "no owner". */
export function Chip({ tone = "neutral", children }: { tone?: ChipTone; children: React.ReactNode }) {
  return (
    <span
      className={cn(
        "inline-flex shrink-0 items-center rounded-chip border px-2 py-0.5 text-[9.5px] font-semibold whitespace-nowrap",
        CHIP_TONE_CLASS[tone]
      )}
    >
      {children}
    </span>
  );
}
