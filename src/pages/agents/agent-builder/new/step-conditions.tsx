import { EYEBROW_CLASS } from "@/pages/everyday/lifecycle/data";
import { Callout } from "@/pages/everyday/lifecycle/stage/rail";
import { Chip } from "@/pages/everyday/lifecycle/stage/chip";
import { AB06_ROWS, AB_TONE_CLASS } from "@/pages/agents/agent-builder/data";

const HEAD_CLASS = "px-4 py-2.5 font-mono text-[8.5px] font-medium tracking-[0.8px] text-ink-4 uppercase";

/** AB06 — step 3, "Conditions". */
export function StepConditions() {
  return (
    <div className="space-y-8">
      <section className="space-y-3">
        <p className={EYEBROW_CLASS}>When should it say something?</p>
        <div className="overflow-x-auto rounded-card border border-line bg-paper">
          <table className="w-full min-w-[820px] text-left text-[11.5px]">
            <thead>
              <tr className="border-b border-line bg-paper-2">
                <th className={HEAD_CLASS}>Condition</th>
                <th className={`${HEAD_CLASS} text-right`}>Threshold</th>
                <th className={`${HEAD_CLASS} text-right`}>Would have fired</th>
                <th className={`${HEAD_CLASS} text-right`}>Frequency</th>
                <th className={`${HEAD_CLASS} text-right`}>Keep</th>
              </tr>
            </thead>
            <tbody>
              {AB06_ROWS.map((row) => (
                <tr key={row.condition} className="border-b border-line last:border-0">
                  <td className="px-4 py-3 font-semibold text-ink">{row.condition}</td>
                  <td className={`px-4 py-3 text-right font-mono ${AB_TONE_CLASS[row.thresholdTone]}`}>{row.threshold}</td>
                  <td className={`px-4 py-3 text-right ${AB_TONE_CLASS[row.firedTone]}`}>{row.fired}</td>
                  <td className={`px-4 py-3 text-right ${AB_TONE_CLASS[row.frequencyTone]}`}>{row.frequency}</td>
                  <td className="px-4 py-3 text-right">
                    <Chip tone={row.keep ? "ultra" : "neutral"}>{row.keep ? "yes" : "no"}</Chip>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      <Callout tone="rose" title="The second condition is the one most people would write and it would fire 412 times">
        Watching every release is easy to describe, easy to build and produces a daily notification that
        everybody mutes within a fortnight. The builder shows how often each condition would have fired against
        real history before you keep it, because the difference between a useful agent and a noisy one is
        entirely in this column.
      </Callout>

      <Callout tone="teal" title="A condition that has never fired is worth keeping and the screen says so">
        The fourth one has fired zero times in eight months. It is kept because the situation it describes — one
        release reaching a fourth market — is exactly the shape of thing nobody notices until it has happened.
        Frequency is shown so you can judge it, not so the form can reject the quiet ones.
      </Callout>
    </div>
  );
}
