import { EYEBROW_CLASS } from "@/pages/everyday/lifecycle/data";
import { Callout } from "@/pages/everyday/lifecycle/stage/rail";
import { Chip } from "@/pages/everyday/lifecycle/stage/chip";
import { SC05_ROWS, SC_IN_MODEL_CHIP, SC_TONE_CLASS } from "@/pages/revenue/scenario/data";

const HEAD_CLASS = "px-4 py-2.5 font-mono text-[8.5px] font-medium tracking-[0.8px] text-ink-4 uppercase";

/** SC05 — step 2 of "Model a change": who the change would reach. */
export function StepReach() {
  return (
    <div className="space-y-8">
      <section className="space-y-3">
        <p className={EYEBROW_CLASS}>Who the change would reach, and who it could not</p>
        <div className="overflow-x-auto rounded-card border border-line bg-paper">
          <table className="w-full min-w-[720px] text-left text-[11.5px]">
            <thead>
              <tr className="border-b border-line bg-paper-2">
                <th className={HEAD_CLASS}>Group</th>
                <th className={`${HEAD_CLASS} text-right`}>Size</th>
                <th className={HEAD_CLASS}>In the model?</th>
                <th className={HEAD_CLASS}>Why</th>
                <th className={HEAD_CLASS}>Effect on the range</th>
              </tr>
            </thead>
            <tbody>
              {SC05_ROWS.map((row) => (
                <tr key={row.group} className="border-b border-line last:border-0">
                  <td className="px-4 py-3 font-semibold text-ink">{row.group}</td>
                  <td className={`px-4 py-3 text-right font-mono ${SC_TONE_CLASS[row.sizeTone]}`}>{row.size}</td>
                  <td className="px-4 py-3">
                    <Chip tone={SC_IN_MODEL_CHIP[row.inModel]}>{row.inModel}</Chip>
                  </td>
                  <td className={`px-4 py-3 ${SC_TONE_CLASS[row.whyTone]}`}>{row.why}</td>
                  <td className={`px-4 py-3 ${SC_TONE_CLASS[row.effectTone]}`}>{row.effect}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      <Callout tone="teal" title="Excluding Ghana and the UK costs the model reach and buys it the only control it has">
        679,000 customers are deliberately left out. If the reversal shipped everywhere at once there would be
        nothing left to compare against and the result would be unmeasurable in the same way the Accra campaign was.
        The two markets that did not receive the original change are worth more as a control than as an audience.
      </Callout>

      <Callout tone="amber" title="48,000 lapsed customers are in the population and cannot be contacted about it">
        They are counted because the change would affect them if they returned on their own, and they cannot be
        prompted because 42,000 checked out as guests and 6,000 have opted out. The model carries them in the wide
        half of the range rather than assuming either way.
      </Callout>
    </div>
  );
}
