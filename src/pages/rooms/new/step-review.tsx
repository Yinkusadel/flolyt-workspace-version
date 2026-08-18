import { cn } from "@/lib/utils";
import { TONE_TEXT_CLASS } from "@/pages/rooms/tone";
import { buildReviewRows } from "@/pages/rooms/new/new-room-data";

/** R11 — New room · review and open. */
export function StepReview({ linked }: { linked: boolean }) {
  const rows = buildReviewRows(linked);

  return (
    <div className="space-y-5">
      <div>
        <p className="font-mono text-[9.5px] font-medium tracking-[1.05px] text-ink-4 uppercase">
          Everything before it opens
        </p>
        <div className="mt-2 divide-y divide-line rounded-card border border-line bg-paper">
          {rows.map((row) => (
            <div key={row.label} className="flex flex-wrap items-start justify-between gap-x-4 gap-y-1 px-4 py-3 text-[12px]">
              <span className="w-40 shrink-0 text-ink-2">{row.label}</span>
              <span className={cn("text-right font-mono", row.tone ? TONE_TEXT_CLASS[row.tone] : "text-ink font-semibold")}>
                {row.value}
              </span>
            </div>
          ))}
        </div>
      </div>

      <div className="rounded-card border border-teal-border bg-teal-bg p-4">
        <div>
          <p className="text-[12px] font-semibold text-ink">What happens the moment you open it</p>
          <p className="mt-1 text-[10.5px] leading-relaxed text-ink-2">
            Repeat & Decay starts reading within seconds and usually posts a first finding inside four minutes.
            Nothing reaches a customer until you approve a specific play. The room appears in everyone's digest
            tomorrow at 06:00 and in the sidebar badge only when it needs a decision from someone.
          </p>
        </div>
      </div>
    </div>
  );
}
