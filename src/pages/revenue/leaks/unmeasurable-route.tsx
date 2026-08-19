import { EYEBROW_CLASS } from "@/pages/everyday/lifecycle/data";
import { Callout } from "@/pages/everyday/lifecycle/stage/rail";
import { LeaksTabs } from "@/pages/revenue/leaks/tabs";
import { LeaksKvList } from "@/pages/revenue/leaks/kv-list";
import { LK12_COST_ROWS, LK12_ROWS, LK_TONE_CLASS } from "@/pages/revenue/leaks/data";

const HEAD_CLASS = "px-4 py-2.5 font-mono text-[8.5px] font-medium tracking-[0.8px] text-ink-4 uppercase";

/** LK12 — /revenue/leaks/unmeasurable. */
const UnmeasurableRoute = () => {
  return (
    <div className="space-y-8">
      <LeaksTabs active="Unmeasurable" />

      <section className="space-y-3">
        <p className={EYEBROW_CLASS}>Six figures that cannot be produced · every one names what would produce it</p>
        <div className="overflow-x-auto rounded-card border border-line bg-paper">
          <table className="w-full min-w-[820px] text-left text-[11.5px]">
            <thead>
              <tr className="border-b border-line bg-paper-2">
                <th className={HEAD_CLASS}>Figure</th>
                <th className={HEAD_CLASS}>Stage</th>
                <th className={HEAD_CLASS}>Why not</th>
                <th className={HEAD_CLASS}>Blocked since</th>
                <th className={HEAD_CLASS}>Would need</th>
                <th className={HEAD_CLASS}>Asked</th>
              </tr>
            </thead>
            <tbody>
              {LK12_ROWS.map((row) => (
                <tr key={row.figure} className="border-b border-line last:border-0">
                  <td className="px-4 py-3 font-semibold text-ink-2">{row.figure}</td>
                  <td className="px-4 py-3 text-ink-3">{row.stage}</td>
                  <td className="px-4 py-3 text-ink-2">{row.whyNot}</td>
                  <td className={`px-4 py-3 ${LK_TONE_CLASS[row.blockedTone]}`}>{row.blockedSince}</td>
                  <td className={`px-4 py-3 ${LK_TONE_CLASS[row.wouldNeedTone]}`}>{row.wouldNeed}</td>
                  <td className="px-4 py-3 text-ink-4">{row.asked}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      <Callout tone="rose" title="“Nobody asked” and “nobody delivered” are different failures and are shown differently">
        Four of these were requested with a date and are overdue against a person. One was requested today. One —
        Advocate — has never been asked for by anyone, because there is nobody to ask on behalf of. Collapsing
        those into a single “missing data” state would hide the only one of the six that no process will ever fix
        on its own.
      </Callout>

      <section className="space-y-3">
        <p className={EYEBROW_CLASS}>What this costs, stated as a range because that is what is known</p>
        <LeaksKvList rows={LK12_COST_ROWS} />
      </section>
    </div>
  );
};

export default UnmeasurableRoute;
