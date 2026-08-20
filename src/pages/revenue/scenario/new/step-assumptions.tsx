import { EYEBROW_CLASS } from "@/pages/everyday/lifecycle/data";
import { Callout } from "@/pages/everyday/lifecycle/stage/rail";
import { Chip } from "@/pages/everyday/lifecycle/stage/chip";
import { SC06_ROWS, SC_TONE_CLASS, SC_YOURS_CHIP } from "@/pages/revenue/scenario/data";

const HEAD_CLASS = "px-4 py-2.5 font-mono text-[8.5px] font-medium tracking-[0.8px] text-ink-4 uppercase";

/** SC06 — step 3 of "Model a change": every input, its source, and who can argue with it. */
export function StepAssumptions() {
  return (
    <div className="space-y-8">
      <section className="space-y-3">
        <p className={EYEBROW_CLASS}>Every assumption, where it came from, and who can argue with it</p>
        <div className="overflow-x-auto rounded-card border border-line bg-paper">
          <table className="w-full min-w-[760px] text-left text-[11.5px]">
            <thead>
              <tr className="border-b border-line bg-paper-2">
                <th className={HEAD_CLASS}>Assumption</th>
                <th className={HEAD_CLASS}>Value</th>
                <th className={HEAD_CLASS}>Source</th>
                <th className={`${HEAD_CLASS} text-right`}>Confidence</th>
                <th className={HEAD_CLASS}>Yours to change</th>
              </tr>
            </thead>
            <tbody>
              {SC06_ROWS.map((row) => (
                <tr key={row.assumption} className="border-b border-line last:border-0">
                  <td className="px-4 py-3 font-semibold text-ink-2">{row.assumption}</td>
                  <td className="px-4 py-3 font-mono text-ink">{row.value}</td>
                  <td className="px-4 py-3 text-ink-3">{row.source}</td>
                  <td className={`px-4 py-3 text-right ${SC_TONE_CLASS[row.confidenceTone]}`}>{row.confidence}</td>
                  <td className="px-4 py-3">
                    <Chip tone={SC_YOURS_CHIP[row.yours]}>{row.yours}</Chip>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      <Callout tone="rose" title="Three of eight inputs are unavailable, so this will produce revenue and never profit">
        Without COGS the model can say what comes in and nothing about what it costs to earn. Filling those three
        rows with an industry figure would produce a profit number, and a profit number is exactly what somebody
        would carry into a decision meeting. The result screen shows revenue only and says why in the same place the
        number appears.
      </Callout>

      <Callout tone="amber" title="The second assumption is the weakest and it is marked 2 of 5">
        There is no evidence that a market recovers on the curve it declined on. It is the least defensible input,
        the one most likely to be quoted, and the one you can change on this screen and watch move the answer more
        than anything else here.
      </Callout>
    </div>
  );
}
