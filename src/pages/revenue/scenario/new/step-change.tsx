import { EYEBROW_CLASS } from "@/pages/everyday/lifecycle/data";
import { Callout } from "@/pages/everyday/lifecycle/stage/rail";
import { Chip } from "@/pages/everyday/lifecycle/stage/chip";
import { ScenarioKvList } from "@/pages/revenue/scenario/kv-list";
import { SC04_KV_ROWS, SC04_ROWS, SC_TONE_CLASS } from "@/pages/revenue/scenario/data";

const HEAD_CLASS = "px-4 py-2.5 font-mono text-[8.5px] font-medium tracking-[0.8px] text-ink-4 uppercase";

/** SC04 — step 1 of "Model a change": what is being changed. */
export function StepChange() {
  return (
    <div className="space-y-8">
      <section className="space-y-3">
        <p className={EYEBROW_CLASS}>What are you changing?</p>
        <div className="overflow-x-auto rounded-card border border-line bg-paper">
          <table className="w-full min-w-[760px] text-left text-[11.5px]">
            <thead>
              <tr className="border-b border-line bg-paper-2">
                <th className={HEAD_CLASS}>Change</th>
                <th className={HEAD_CLASS}>Where it applies</th>
                <th className={`${HEAD_CLASS} text-right`}>Affects</th>
                <th className={`${HEAD_CLASS} text-right`}>Measured before?</th>
                <th className={HEAD_CLASS}>Pick</th>
              </tr>
            </thead>
            <tbody>
              {SC04_ROWS.map((row) => (
                <tr key={row.change} className={`border-b border-line last:border-0 ${row.selected ? "bg-ultra-bg/40" : ""}`}>
                  <td className="px-4 py-3 font-semibold text-ink">{row.change}</td>
                  <td className="px-4 py-3 text-ink-3">{row.where}</td>
                  <td className={`px-4 py-3 text-right ${SC_TONE_CLASS[row.affectsTone]}`}>{row.affects}</td>
                  <td className={`px-4 py-3 text-right ${SC_TONE_CLASS[row.measuredTone]}`}>{row.measured}</td>
                  <td className="px-4 py-3">{row.selected && <Chip tone="ultra">selected</Chip>}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      <Callout tone="amber" title="The one you have chosen is the only one with no precedent anywhere">
        Two of these five have been run and measured; one has a close analogue. Reversing a nine-month-old release is
        a different kind of act — the customers who left are not the customers who would come back, and no market
        held the old behaviour long enough to serve as a control. The remaining steps will keep saying so rather
        than saying it once here.
      </Callout>

      <section className="space-y-3">
        <p className={EYEBROW_CLASS}>What is being changed, precisely</p>
        <ScenarioKvList rows={SC04_KV_ROWS} />
      </section>
    </div>
  );
}
