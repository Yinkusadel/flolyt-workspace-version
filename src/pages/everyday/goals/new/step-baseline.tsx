import { cn } from "@/lib/utils";
import { Callout } from "@/pages/everyday/lifecycle/stage/rail";
import { TONE_TEXT_CLASS } from "@/pages/everyday/rooms/tone";
import { BASELINE } from "@/pages/everyday/goals/new/data";

/** G03 — New goal · the baseline. */
export function StepBaseline() {
  return (
    <div className="space-y-5">
      <div className="rounded-card border border-teal-border bg-teal-bg p-5">
        <h2 className="text-[19px] font-semibold text-ink">
          {BASELINE.value} <span className="text-[13px] font-normal text-ink-2">· measured, not estimated</span>
        </h2>
        <p className="mt-1.5 text-[11.5px] leading-relaxed text-ink-2">
          Trailing 90 days from the orders feed, computed over {BASELINE.population} acquired customers. Locked when
          you save — changing a baseline later rewrites history.
        </p>
        <p className="mt-2.5 font-mono text-[10px] text-teal">Last refreshed {BASELINE.refreshedAgo}.</p>
      </div>

      <div>
        <p className="font-mono text-[9.5px] font-medium tracking-[1.05px] text-ink-4 uppercase">
          What the baseline is built from, so you can disagree with it
        </p>
        <dl className="mt-2 divide-y divide-line rounded-card border border-line bg-paper">
          {BASELINE.fields.map((field) => (
            <div key={field.label} className="flex flex-col gap-1 px-4 py-3 sm:flex-row sm:items-baseline sm:justify-between sm:gap-4">
              <dt className="shrink-0 text-[11px] text-ink-4">{field.label}</dt>
              <dd className={cn("text-[11.5px] font-medium sm:text-right", field.tone ? TONE_TEXT_CLASS[field.tone] : "text-ink-2")}>
                {field.value}
              </dd>
            </div>
          ))}
        </dl>
      </div>

      <Callout tone="amber" title="Your baseline includes a known problem, and that is a choice you should make deliberately">
        27.2% is what is happening now. 37.4% is what was happening before the delivery fee. Setting a target against
        the lower number bakes the damage into the plan; setting it against the higher one assumes a fix that has not
        shipped yet. Flolyt shows both and will not pick.
      </Callout>

      <div>
        <p className="font-mono text-[9.5px] font-medium tracking-[1.05px] text-ink-4 uppercase">
          The one that cannot be set
        </p>
        <div className="mt-2">
          <Callout tone="rose" title="Contribution margin has no baseline and no target is offered">
            Nothing connected provides cost of goods. Flolyt knows the category average for prepared-food delivery
            and will not apply it — a margin goal built on a benchmark would be missed or hit for reasons nobody
            could trace. Connect a COGS source and this becomes settable the same day.
          </Callout>
        </div>
      </div>
    </div>
  );
}
