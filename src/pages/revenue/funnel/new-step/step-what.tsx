import { EYEBROW_CLASS } from "@/pages/everyday/lifecycle/data";
import { Callout } from "@/pages/everyday/lifecycle/stage/rail";
import { FunnelKvList } from "@/pages/revenue/funnel/kv-list";
import { FN09_POSITION_ROWS, FN09_RULE_ROWS, FN_TONE_CLASS } from "@/pages/revenue/funnel/data";

const HEAD_CLASS = "px-4 py-2.5 font-mono text-[8.5px] font-medium tracking-[0.8px] text-ink-4 uppercase";

/** FN09 — step 1 of the "Define a step" wizard. */
export function StepWhat() {
  return (
    <div className="space-y-8">
      <section className="space-y-2">
        <p className={EYEBROW_CLASS}>What are you adding?</p>
        <div className="flex flex-wrap items-center justify-between gap-3 rounded-panel border border-line bg-white px-4 py-3">
          <span className="text-[13px] font-semibold text-ink">Saw the delivery fee</span>
          <span className="text-[11px] text-ink-3">between Reached checkout and Placed a first order</span>
        </div>
      </section>

      <section className="space-y-3">
        <p className={EYEBROW_CLASS}>Where it goes</p>
        <div className="overflow-x-auto rounded-card border border-line bg-paper">
          <table className="w-full min-w-[520px] text-left text-[11.5px]">
            <thead>
              <tr className="border-b border-line bg-paper-2">
                <th className={HEAD_CLASS}>Position</th>
                <th className={HEAD_CLASS}>Step</th>
                <th className={`${HEAD_CLASS} text-right`}>Population now</th>
                <th className={`${HEAD_CLASS} text-right`}>After this step is added</th>
              </tr>
            </thead>
            <tbody>
              {FN09_POSITION_ROWS.map((row) => (
                <tr key={row.position} className="border-b border-line last:border-0">
                  <td className="px-4 py-3 font-mono text-ink-4">{row.position}</td>
                  <td className="px-4 py-3 font-semibold text-ink-2">{row.step}</td>
                  <td className={`px-4 py-3 text-right font-mono ${FN_TONE_CLASS[row.beforeTone]}`}>{row.before}</td>
                  <td className={`px-4 py-3 text-right font-mono ${FN_TONE_CLASS[row.afterTone]}`}>{row.after}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      <Callout tone="amber" title="Adding this step does not add a number, it adds a hole with a name on it">
        Until `checkout.fee_shown` exists, this step reads Unavailable and the funnel shows a gap between 271,000 and
        173,000 instead of a smooth drop. That is the point. The gap is already there — defining the step is what
        makes it visible and gives the request something to attach to.
      </Callout>

      <section className="space-y-3">
        <p className={EYEBROW_CLASS}>Rules this step has to satisfy</p>
        <FunnelKvList rows={FN09_RULE_ROWS} />
      </section>
    </div>
  );
}
