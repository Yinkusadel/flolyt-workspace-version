import { Button } from "@/components/ui/button";
import { EYEBROW_CLASS } from "@/pages/everyday/lifecycle/data";
import { Callout } from "@/pages/everyday/lifecycle/stage/rail";
import { Chip } from "@/pages/everyday/lifecycle/stage/chip";
import { FN01_ROWS, FN_TONE_CLASS } from "@/pages/revenue/funnel/data";

const HEAD_CLASS = "px-4 py-2.5 font-mono text-[8.5px] font-medium tracking-[0.8px] text-ink-4 uppercase";

/** FN01 — before any funnel steps beyond signup/orders are instrumented. Wired but unreachable with FUNNEL_STATE's current default. */
export function NotInstrumentedYetState() {
  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-[17px] font-semibold text-ink">Funnel</h1>
        <p className="mt-1 text-[11.5px] text-ink-3">3 of 8 steps instrumented · 5 missing</p>
      </div>

      <div className="rounded-surface border border-dashed border-line bg-paper p-8 text-center sm:p-10">
        <h2 className="text-[16px] font-semibold text-ink sm:text-[17px]">Three of eight steps have an event behind them</h2>
        <p className="mx-auto mt-3 max-w-xl text-[11.5px] leading-relaxed text-ink-3">
          Signups, first orders and repeat orders are all readable from the orders table. Everything between them —
          reaching checkout, seeing the delivery fee, abandoning — was never instrumented, so the middle of this
          funnel is a straight line between two facts.
        </p>
        <div className="mt-5 flex flex-wrap items-center justify-center gap-3">
          <Button type="button">Map an event</Button>
          <Button type="button" variant="outline">
            See what is missing
          </Button>
        </div>
        <p className="mx-auto mt-5 max-w-lg text-[10px] text-ink-4">
          A funnel drawn through five gaps would look smooth and be fiction.
        </p>
      </div>

      <section className="space-y-3">
        <p className={EYEBROW_CLASS}>What can be drawn today</p>
        <div className="overflow-x-auto rounded-card border border-line bg-paper">
          <table className="w-full min-w-[680px] text-left text-[11.5px]">
            <thead>
              <tr className="border-b border-line bg-paper-2">
                <th className={HEAD_CLASS}>Step</th>
                <th className={HEAD_CLASS}>Source</th>
                <th className={HEAD_CLASS}>Readable?</th>
                <th className={HEAD_CLASS}>What it cannot tell you</th>
              </tr>
            </thead>
            <tbody>
              {FN01_ROWS.map((row) => (
                <tr key={row.step} className="border-b border-line last:border-0">
                  <td className="px-4 py-3 font-semibold text-ink">{row.step}</td>
                  <td className="px-4 py-3 font-mono text-[10.5px] text-ink-3">{row.source}</td>
                  <td className="px-4 py-3">
                    <Chip tone={row.readable ? "teal" : "rose"}>{row.readable ? "yes" : "no"}</Chip>
                  </td>
                  <td className={`px-4 py-3 ${row.cannotTellTone ? FN_TONE_CLASS[row.cannotTellTone] : "text-ink-2"}`}>{row.cannotTell}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      <Callout tone="rose" title="The missing steps are the ones the whole company is arguing about">
        Three teams have a theory about where people stop in checkout, and no event exists that could settle it.
        Flolyt will not interpolate the middle from the two ends — a curve drawn between signup and first order would
        show a drop-off at exactly the place the model assumed it, and it would be quoted within a week.
      </Callout>
    </div>
  );
}
