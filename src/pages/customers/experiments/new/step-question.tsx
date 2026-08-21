import { EYEBROW_CLASS } from "@/pages/everyday/lifecycle/data";
import { Callout } from "@/pages/everyday/lifecycle/stage/rail";
import { Chip } from "@/pages/everyday/lifecycle/stage/chip";
import { XP09_QUESTION, XP09_REQUIRED_ROWS } from "@/pages/customers/experiments/data";

const HEAD_CLASS = "px-4 py-2.5 font-mono text-[8.5px] font-medium tracking-[0.8px] text-ink-4 uppercase";

/** XP09 — step 1, "The question". */
export function StepQuestion() {
  return (
    <div className="space-y-8">
      <section className="space-y-3">
        <p className={EYEBROW_CLASS}>What are you trying to find out?</p>
        <div className="rounded-panel border border-line bg-white p-4">
          <p className="text-[12.5px] font-semibold text-ink">{XP09_QUESTION.headline}</p>
          <p className="mt-2 font-mono text-[10px] text-ink-4">{XP09_QUESTION.detail}</p>
        </div>
      </section>

      <section className="space-y-3">
        <p className={EYEBROW_CLASS}>Required before this can go any further</p>
        <div className="overflow-x-auto rounded-card border border-line bg-paper">
          <table className="w-full min-w-[720px] text-left text-[11.5px]">
            <thead>
              <tr className="border-b border-line bg-paper-2">
                <th className={HEAD_CLASS}>Field</th>
                <th className={HEAD_CLASS}>What you have written</th>
                <th className={`${HEAD_CLASS} text-right`}>Required?</th>
                <th className={`${HEAD_CLASS} text-right`}>Locked once it starts</th>
              </tr>
            </thead>
            <tbody>
              {XP09_REQUIRED_ROWS.map((row) => (
                <tr key={row.field} className="border-b border-line last:border-0">
                  <td className="px-4 py-3 font-semibold text-ink-2">{row.field}</td>
                  <td className="px-4 py-3 text-ink-3">{row.written}</td>
                  <td className="px-4 py-3 text-right">
                    <Chip tone={row.required ? "rose" : "neutral"}>{row.required ? "yes" : "no"}</Chip>
                  </td>
                  <td className="px-4 py-3 text-right">
                    <Chip tone={row.lockedOnceStarted ? "rose" : "amber"}>{row.lockedOnceStarted ? "yes" : "no"}</Chip>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      <Callout tone="ultra" title="You are asked what you expect before you are shown anything, and the number is kept">
        Writing "+6 to +12" now is a prediction that can be wrong. Writing it afterwards is a description. The gap
        between the expectation and the result is the most useful thing an experiment produces after the result
        itself, and it only exists if the expectation is recorded before anybody has seen anything.
      </Callout>

      <Callout tone="amber" title="The last row is what stops a successful experiment from sitting in a folder">
        Two of the three closed experiments in this workspace produced a clear answer and no decision for weeks.
        Writing down what happens if it works, before it works, turns the result into something already agreed
        rather than a new conversation with a busy person.
      </Callout>
    </div>
  );
}
