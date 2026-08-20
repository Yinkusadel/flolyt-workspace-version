import { EYEBROW_CLASS } from "@/pages/everyday/lifecycle/data";
import { Callout } from "@/pages/everyday/lifecycle/stage/rail";
import { ValueBars } from "@/pages/revenue/value/bars";
import { ValueTabs } from "@/pages/revenue/value/tabs";
import { VL09_BARS, VL09_MONTH_ROWS, VL_TONE_CLASS } from "@/pages/revenue/value/data";

const HEAD_CLASS = "px-4 py-2.5 font-mono text-[8.5px] font-medium tracking-[0.8px] text-ink-4 uppercase";

/** VL09 — /value/over-time. */
const OverTimeRoute = () => {
  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-[17px] font-semibold text-ink">Value</h1>
        <p className="mt-1 text-[11.5px] text-ink-3">₦1.08B found, ₦411M recovered, ₦93M of it causal · found more than fixed, three to one</p>
      </div>

      <ValueTabs active="The ledger" />

      <section className="space-y-3">
        <p className={EYEBROW_CLASS}>Since 1 January · what was found and what came back, on the same axis</p>
        <div className="max-w-2xl">
          <ValueBars rows={VL09_BARS} />
        </div>
      </section>

      <Callout tone="rose" title="The gap between the first bar and the second is not a backlog, it is the state of things">
        ₦669M of identified loss has not been recovered, and most of it sits in one open room about a release that
        shipped in March. This chart is the honest summary of the whole product after seven months: it finds more
        than it fixes, by roughly three to one, and the fixing is bounded by how many people are available to own
        rooms rather than by how much the agents can see.
      </Callout>

      <section className="space-y-3">
        <p className={EYEBROW_CLASS}>Month by month</p>
        <div className="overflow-x-auto rounded-card border border-line bg-paper">
          <table className="w-full min-w-[780px] text-left text-[11.5px]">
            <thead>
              <tr className="border-b border-line bg-paper-2">
                <th className={HEAD_CLASS}>Month</th>
                <th className={`${HEAD_CLASS} text-right`}>Rooms closed</th>
                <th className={`${HEAD_CLASS} text-right`}>Recovered</th>
                <th className={`${HEAD_CLASS} text-right`}>On a holdout</th>
                <th className={`${HEAD_CLASS} text-right`}>Identified</th>
                <th className={`${HEAD_CLASS} text-right`}>Ratio</th>
              </tr>
            </thead>
            <tbody>
              {VL09_MONTH_ROWS.map((row) => (
                <tr key={row.month} className="border-b border-line last:border-0">
                  <td className="px-4 py-3 font-semibold text-ink">{row.month}</td>
                  <td className="px-4 py-3 text-right font-mono text-ink">{row.closed}</td>
                  <td className="px-4 py-3 text-right font-mono text-ink">{row.recovered}</td>
                  <td className="px-4 py-3 text-right font-mono text-ink-4">{row.holdout}</td>
                  <td className={`px-4 py-3 text-right font-mono ${VL_TONE_CLASS[row.identifiedTone]}`}>{row.identified}</td>
                  <td className={`px-4 py-3 text-right font-mono ${VL_TONE_CLASS[row.ratioTone]}`}>{row.ratio}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      <Callout tone="rose" title="February recovered more than February found, and it is the weakest row on the table">
        ₦260M of it was the onboarding rewrite and the basket prompt, both measured before and after with no
        control, in the four weeks before the 4 March release. A ratio above 1.0 is not a good month; it is two
        large figures resting on the weakest method landing together. Sorting this table by ratio would put it at
        the top, which is why it is in date order and cannot be sorted.
      </Callout>
    </div>
  );
};

export default OverTimeRoute;
