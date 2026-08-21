import { Link } from "react-router-dom";

import { Button } from "@/components/ui/button";
import { EYEBROW_CLASS } from "@/pages/everyday/lifecycle/data";
import { Callout } from "@/pages/everyday/lifecycle/stage/rail";
import { FunnelStepBars } from "@/pages/revenue/funnel/step-bars";
import { FunnelTabs } from "@/pages/revenue/funnel/tabs";
import { FN03_COMPARE_ROWS, FN03_STEPS, FN_TONE_CLASS } from "@/pages/revenue/funnel/data";

const HEAD_CLASS = "px-4 py-2.5 font-mono text-[8.5px] font-medium tracking-[0.8px] text-ink-4 uppercase";

/** FN03 — the default populated "The funnel" state. */
export function TheFunnelState() {
  return (
    <div className="space-y-8">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <h1 className="text-[17px] font-semibold text-ink">Funnel</h1>
          <p className="mt-1 text-[11.5px] text-ink-3">
            1.24M reached the app in the last 90 days · two steps account for most of the loss
          </p>
        </div>
      </div>

      <FunnelTabs active="The funnel" />

      <div className="flex flex-wrap items-center justify-between gap-3">
        <p className="font-mono text-[9.5px] font-medium tracking-[1.05px] text-ink-4 uppercase">
          Last 90 days · Nigeria · 1.24M who reached the app
        </p>
        <Button asChild type="button" size="sm">
          <Link to="/funnel/compare">Compare periods</Link>
        </Button>
      </div>

      <FunnelStepBars rows={FN03_STEPS} />

      <Callout tone="rose" title="Two steps do the damage and one of them is invisible">
        Checkout to first order lost 36.2% — it lost 25.9% before 4 March. The 10.3 points between those two figures
        is 27,900 first orders a quarter. What happens inside that step cannot be seen at all, because the event that
        would show it was never built, so the funnel jumps from 271,000 to 173,000 with nothing in between.
      </Callout>

      <section className="space-y-3">
        <p className={EYEBROW_CLASS}>The same funnel before the release, for comparison</p>
        <div className="overflow-x-auto rounded-card border border-line bg-paper">
          <table className="w-full min-w-[720px] text-left text-[11.5px]">
            <thead>
              <tr className="border-b border-line bg-paper-2">
                <th className={HEAD_CLASS}>Step</th>
                <th className={`${HEAD_CLASS} text-right`}>Before 4 Mar</th>
                <th className={`${HEAD_CLASS} text-right`}>Now</th>
                <th className={`${HEAD_CLASS} text-right`}>Change</th>
                <th className={`${HEAD_CLASS} text-right`}>Customers a quarter</th>
              </tr>
            </thead>
            <tbody>
              {FN03_COMPARE_ROWS.map((row) => (
                <tr key={row.step} className="border-b border-line last:border-0">
                  <td className="px-4 py-3 font-semibold text-ink-2">{row.step}</td>
                  <td className="px-4 py-3 text-right font-mono text-ink-4">{row.before}</td>
                  <td className="px-4 py-3 text-right font-mono text-ink-4">{row.now}</td>
                  <td className={`px-4 py-3 text-right font-mono ${FN_TONE_CLASS[row.tone]}`}>{row.change}</td>
                  <td className={`px-4 py-3 text-right font-mono ${FN_TONE_CLASS[row.tone]}`}>{row.customers}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      <Callout tone="ultra" title="Three steps moved and two did not, which is what makes this a change rather than a decline">
        The two steps above checkout are flat to within a point. If the business were simply getting worse, the top
        of the funnel would show it too. The break starts exactly where the fee now appears and compounds through
        every step after it.
      </Callout>
    </div>
  );
}
