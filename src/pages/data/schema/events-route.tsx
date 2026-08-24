import { Callout } from "@/pages/everyday/lifecycle/stage/rail";
import { EYEBROW_CLASS } from "@/pages/everyday/lifecycle/data";
import { Chip } from "@/pages/everyday/lifecycle/stage/chip";
import { SchemaTabs } from "@/pages/data/schema/tabs";
import { SM05_EVENT_ROWS, SM_CHIP_TONE, SM_TONE_CLASS } from "@/pages/data/schema/data";

const HEAD_CLASS = "px-4 py-2.5 font-mono text-[8.5px] font-medium tracking-[0.8px] text-ink-4 uppercase";
const HEAD_RIGHT_CLASS = "px-4 py-2.5 text-right font-mono text-[8.5px] font-medium tracking-[0.8px] text-ink-4 uppercase";

/** SM05 — /schema/events. */
const EventsRoute = () => {
  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-[17px] font-semibold text-ink">Schema</h1>
        <p className="mt-1 text-[11.5px] text-ink-3">Eight events · three never built, one built and silent for a year</p>
      </div>

      <SchemaTabs active="Events" />

      <section className="space-y-3">
        <p className={EYEBROW_CLASS}>Product events · what fires, what does not, and what nobody has built</p>
        <div className="overflow-x-auto rounded-card border border-line bg-paper">
          <table className="w-full min-w-[920px] text-left text-[11.5px]">
            <thead>
              <tr className="border-b border-line bg-paper-2">
                <th className={HEAD_CLASS}>Event</th>
                <th className={HEAD_CLASS}>What it marks</th>
                <th className={HEAD_RIGHT_CLASS}>Volume · 30 days</th>
                <th className={HEAD_RIGHT_CLASS}>Markets</th>
                <th className={HEAD_CLASS}>Used by</th>
                <th className={HEAD_CLASS}>State</th>
              </tr>
            </thead>
            <tbody>
              {SM05_EVENT_ROWS.map((row) => (
                <tr key={row.event} className="border-b border-line last:border-0">
                  <td className="px-4 py-3 font-mono font-semibold text-ink">{row.event}</td>
                  <td className="px-4 py-3 text-ink-2">{row.marks}</td>
                  <td className={`px-4 py-3 text-right font-mono ${SM_TONE_CLASS[row.volumeTone]}`}>{row.volume}</td>
                  <td className={`px-4 py-3 text-right font-mono ${SM_TONE_CLASS[row.marketsTone]}`}>{row.markets}</td>
                  <td className={`px-4 py-3 ${SM_TONE_CLASS[row.usedByTone]}`}>{row.usedBy}</td>
                  <td className="px-4 py-3">
                    <Chip tone={SM_CHIP_TONE[row.stateTone]}>{row.state}</Chip>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      <Callout tone="rose" title="Built-and-silent is a different problem from never-built and is worded differently">
        `loyalty.tier_shown` exists in the codebase and has never fired, which means somebody wrote it and the call
        site was never reached or was removed. `checkout.fee_shown` was never written. The first is a bug with a
        name; the second is a request in a queue. A single missing state would flatten them into one row and one
        wrong conversation.
      </Callout>

      <Callout tone="ultra" title="An event that fires in three markets of four is a partial event and is shown as one">
        Nothing here rounds a 3-of-4 market coverage up to firing. A funnel step built on a partially fired event
        produces a figure that is right for some markets and silently wrong for the fourth, which is the shape of
        most wrong numbers in event-driven analytics.
      </Callout>
    </div>
  );
};

export default EventsRoute;
