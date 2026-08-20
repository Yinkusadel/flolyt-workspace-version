import { EYEBROW_CLASS } from "@/pages/everyday/lifecycle/data";
import { Callout } from "@/pages/everyday/lifecycle/stage/rail";
import { RangeBars } from "@/pages/revenue/scenario/range-bars";
import { ScenarioKvList } from "@/pages/revenue/scenario/kv-list";
import { SC07_BARS, SC07_KV_ROWS } from "@/pages/revenue/scenario/data";

/** SC07 — step 4 of "Model a change": the range, never a mid-point. */
export function StepResult() {
  return (
    <div className="space-y-8">
      <div className="rounded-card border border-ultra-border bg-ultra-bg p-5 sm:p-6">
        <div className="flex flex-wrap items-start justify-between gap-6">
          <div>
            <p className="font-mono text-[8.5px] font-medium tracking-[0.9px] text-ultra uppercase">
              Revenue over 90 days · Nigeria and Kenya
            </p>
            <p className="mt-2 flex flex-wrap items-baseline gap-2 text-[26px] font-semibold text-ink sm:text-[30px]">
              ₦188M <span className="text-[13px] font-normal text-ink-4">to</span> ₦512M
            </p>
            <p className="mt-2 max-w-md text-[11px] leading-relaxed text-ink-2">
              A range, not a mid-point. There is no single number on this screen and the export carries the range
              too.
            </p>
          </div>
          <div className="text-right">
            <p className="font-mono text-[8.5px] font-medium tracking-[0.9px] text-ink-4 uppercase">Profit</p>
            <p className="mt-2 text-[16px] font-semibold text-ink-4">Unavailable</p>
            <p className="mt-1 max-w-[160px] font-mono text-[9.5px] text-ink-4">no COGS since 12 January</p>
          </div>
        </div>
      </div>

      <section className="space-y-3">
        <p className={EYEBROW_CLASS}>What moves the range, in order</p>
        <RangeBars rows={SC07_BARS} />
        <p className="text-[10.5px] text-ink-4">
          Engineering time to reverse · Unavailable · nobody has been asked, so it is not in the range at all
        </p>
      </section>

      <section className="space-y-3">
        <p className={EYEBROW_CLASS}>What this scenario is not</p>
        <ScenarioKvList rows={SC07_KV_ROWS} />
      </section>

      <Callout tone="ultra" title="Two thirds of a ₦324M range comes from one assumption nobody can defend">
        The model is not wrong. It is honest about being mostly one guess wearing a range. Anyone taking this into a
        meeting should take the second row of the assumptions table with it, and the export refuses to separate
        them.
      </Callout>
    </div>
  );
}
