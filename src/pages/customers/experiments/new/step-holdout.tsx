import { EYEBROW_CLASS } from "@/pages/everyday/lifecycle/data";
import { Callout } from "@/pages/everyday/lifecycle/stage/rail";
import { ExperimentsKvList } from "@/pages/customers/experiments/kv-list";
import { EX_TONE_CLASS, XP10_KV_ROWS, XP10_SIZE_ROWS } from "@/pages/customers/experiments/data";

const HEAD_CLASS = "px-4 py-2.5 font-mono text-[8.5px] font-medium tracking-[0.8px] text-ink-4 uppercase";

/** XP10 — step 2, "The holdout". */
export function StepHoldout() {
  return (
    <div className="space-y-8">
      <section className="space-y-3">
        <p className={EYEBROW_CLASS}>How many people to hold back</p>
        <div className="overflow-x-auto rounded-card border border-line bg-paper">
          <table className="w-full min-w-[820px] text-left text-[11.5px]">
            <thead>
              <tr className="border-b border-line bg-paper-2">
                <th className={HEAD_CLASS}>Holdout</th>
                <th className={`${HEAD_CLASS} text-right`}>Held</th>
                <th className={`${HEAD_CLASS} text-right`}>Treated</th>
                <th className={`${HEAD_CLASS} text-right`}>Detects a change of</th>
                <th className={`${HEAD_CLASS} text-right`}>Time to an answer</th>
                <th className={HEAD_CLASS}>What holding costs them</th>
              </tr>
            </thead>
            <tbody>
              {XP10_SIZE_ROWS.map((row) => (
                <tr key={row.holdout} className="border-b border-line last:border-0">
                  <td className="px-4 py-3 font-semibold text-ink-2">{row.holdout}</td>
                  <td className="px-4 py-3 text-right font-mono text-ink">{row.held}</td>
                  <td className="px-4 py-3 text-right font-mono text-ink-4">{row.treated}</td>
                  <td className="px-4 py-3 text-right font-mono text-ink-2">{row.detects}</td>
                  <td className={`px-4 py-3 text-right font-mono ${EX_TONE_CLASS[row.timeTone]}`}>{row.time}</td>
                  <td className="px-4 py-3 text-ink-4">{row.cost}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      <Callout tone="ultra" title="There is no recommended row and the trade is stated instead">
        A bigger holdout answers faster and leaves more people without something that probably helps. Flolyt will
        not pick, because the right answer depends on how confident you already are and what the prompt is worth —
        neither of which is in the data. What it will do is refuse below 5%, where the answer arrives after the
        thing being tested has changed anyway.
      </Callout>

      <section className="space-y-3">
        <p className={EYEBROW_CLASS}>After exclusions, your 11,800 becomes 10,900</p>
        <ExperimentsKvList rows={XP10_KV_ROWS} />
      </section>
    </div>
  );
}
