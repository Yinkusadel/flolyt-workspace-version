import { Check, X } from "lucide-react";

import { cn } from "@/lib/utils";
import { TONE_TEXT_CLASS } from "@/pages/rooms/tone";
import { MEASURE_ROWS, SETTLE_OPTIONS } from "@/pages/rooms/new/new-room-data";

/** R09 — New room · what would settle it. */
export function StepSettle() {
  return (
    <div className="space-y-5">
      <div className="rounded-card border border-ultra-border bg-ultra-bg p-4">
        <div>
          <p className="text-[12px] font-semibold text-ink">
            Say now what would change your mind, before you know the answer
          </p>
          <p className="mt-1 text-[10.5px] leading-relaxed text-ink-2">
            A room without this becomes a room that can only be agreed with. Written at the start, it is a
            commitment; written at the end, it is a rationalisation. This is the field that most often gets skipped
            and it is the one that makes a closed room worth citing later.
          </p>
        </div>
      </div>

      <div>
        <p className="font-mono text-[9.5px] font-medium tracking-[1.05px] text-ink-4 uppercase">
          This room is settled when
        </p>
        <div className="mt-2 space-y-2">
          {SETTLE_OPTIONS.map((opt) => (
            <div
              key={opt.label}
              className={cn(
                "flex items-center gap-3 rounded-card border p-3.5",
                opt.offered ? "border-teal-border bg-teal-bg" : "border-line bg-paper-2"
              )}
            >
              <span
                className={cn(
                  "flex size-5 shrink-0 items-center justify-center rounded-full",
                  opt.offered ? "bg-teal text-white" : "bg-paper text-rose"
                )}
              >
                {opt.offered ? <Check className="size-3" /> : <X className="size-3" />}
              </span>
              <div>
                <p className={cn("text-[12px] font-semibold", opt.offered ? "text-ink" : "text-ink-4")}>{opt.label}</p>
                <p className="text-[10.5px] text-ink-3">{opt.sub}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div>
        <p className="font-mono text-[9.5px] font-medium tracking-[1.05px] text-ink-4 uppercase">
          What would prove us wrong
        </p>
        <div className="mt-2 rounded-card border border-line bg-paper p-4 text-[12px] text-ink-2">
          Wave one reactivates below 12%. That would mean price was the barrier all along and the fee is a symptom
          rather than the cause.
        </div>
      </div>

      <div>
        <p className="font-mono text-[9.5px] font-medium tracking-[1.05px] text-ink-4 uppercase">
          How the outcome will be measured
        </p>
        <div className="mt-2 divide-y divide-line rounded-card border border-line bg-paper">
          {MEASURE_ROWS.map((row) => (
            <div key={row.label} className="flex flex-wrap items-center gap-x-3 gap-y-1 px-4 py-3 text-[12px]">
              <span className="w-44 shrink-0 text-ink-2">{row.label}</span>
              <span className="font-mono font-semibold text-ink">{row.setting}</span>
              <span className={cn("ml-auto text-right font-mono text-[10.5px]", TONE_TEXT_CLASS[row.whyTone])}>
                {row.why}
              </span>
            </div>
          ))}
        </div>
      </div>

      <div className="rounded-card border border-teal-border bg-teal-bg p-4">
        <div>
          <p className="text-[12px] font-semibold text-ink">The last row is why this step exists at all</p>
          <p className="mt-1 text-[10.5px] leading-relaxed text-ink-2">
            Some closed rooms recover money that cannot be attributed to them, because no holdout was possible. That
            is excluded from the value ledger and stated as unavailable. Deciding that at the start is honest;
            deciding it at the end is negotiating with your own result.
          </p>
        </div>
      </div>
    </div>
  );
}
