import { cn } from "@/lib/utils";
import { Callout } from "@/pages/everyday/lifecycle/stage/rail";
import { TONE_TEXT_CLASS } from "@/pages/everyday/rooms/tone";
import { REVIEW_ROWS } from "@/pages/everyday/goals/new/data";

/** G06 — New goal · review. */
export function StepReview() {
  return (
    <div className="space-y-5">
      <div>
        <p className="font-mono text-[9.5px] font-medium tracking-[1.05px] text-ink-4 uppercase">
          Everything before it is set
        </p>
        <dl className="mt-2 divide-y divide-line rounded-card border border-line bg-paper">
          {REVIEW_ROWS.map((row) => (
            <div
              key={row.label}
              className="flex flex-col gap-1 px-4 py-3 sm:flex-row sm:items-baseline sm:justify-between sm:gap-4"
            >
              <dt className="shrink-0 text-[11px] text-ink-4">{row.label}</dt>
              <dd className={cn("text-[11.5px] font-medium sm:text-right", row.tone ? TONE_TEXT_CLASS[row.tone] : "text-ink-2")}>
                {row.value}
              </dd>
            </div>
          ))}
        </dl>
      </div>

      <Callout tone="teal" title="What changes the moment you save this">
        Anything blocking this goal is lifted above anything that is not on four people's daily lists. Repeat &
        Decay switches from watching for any movement to watching for movement against a target. And the goal
        appears on the cascade under net revenue, where Ada can see it.
      </Callout>

      <Callout tone="amber" title="The baseline is locked and the target is not">
        You can change the target later — it is audited, it keeps the old value, and it asks why. You cannot change
        the baseline, because a goal whose starting point moves is a goal that can always be reported as met.
      </Callout>
    </div>
  );
}
