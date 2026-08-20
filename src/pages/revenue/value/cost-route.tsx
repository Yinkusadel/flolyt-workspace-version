import { EYEBROW_CLASS } from "@/pages/everyday/lifecycle/data";
import { Callout } from "@/pages/everyday/lifecycle/stage/rail";
import { Chip } from "@/pages/everyday/lifecycle/stage/chip";
import { ValueKvList } from "@/pages/revenue/value/kv-list";
import { ValueTabs } from "@/pages/revenue/value/tabs";
import { VL07_KV_ROWS, VL07_ROWS, VL_TONE_CLASS } from "@/pages/revenue/value/data";

const HEAD_CLASS = "px-4 py-2.5 font-mono text-[8.5px] font-medium tracking-[0.8px] text-ink-4 uppercase";

/** VL07 — /value/cost. */
const CostRoute = () => {
  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-[17px] font-semibold text-ink">Value</h1>
        <p className="mt-1 text-[11.5px] text-ink-3">₦82M of known cost, three categories unavailable, and no net figure anywhere</p>
      </div>

      <ValueTabs active="What it cost" />

      <section className="space-y-3">
        <p className={EYEBROW_CLASS}>Everything the recovered money cost to produce</p>
        <div className="overflow-x-auto rounded-card border border-line bg-paper">
          <table className="w-full min-w-[820px] text-left text-[11.5px]">
            <thead>
              <tr className="border-b border-line bg-paper-2">
                <th className={HEAD_CLASS}>Cost</th>
                <th className={`${HEAD_CLASS} text-right`}>Amount</th>
                <th className={HEAD_CLASS}>What it is</th>
                <th className={`${HEAD_CLASS} text-right`}>Known?</th>
                <th className={HEAD_CLASS}>Who holds the figure</th>
              </tr>
            </thead>
            <tbody>
              {VL07_ROWS.map((row) => (
                <tr key={row.cost} className="border-b border-line last:border-0">
                  <td className="px-4 py-3 font-semibold text-ink">{row.cost}</td>
                  <td className={`px-4 py-3 text-right font-mono ${VL_TONE_CLASS[row.amountTone]}`}>{row.amount}</td>
                  <td className="px-4 py-3 text-ink-2">{row.what}</td>
                  <td className="px-4 py-3 text-right">
                    <Chip tone={row.known ? "teal" : "rose"}>{row.known ? "yes" : "no"}</Chip>
                  </td>
                  <td className={`px-4 py-3 ${row.whoTone ? VL_TONE_CLASS[row.whoTone] : "text-ink-4"}`}>{row.who}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      <Callout tone="rose" title="Four costs are known and three are not, so there is no net figure anywhere in this section">
        ₦82M of cost is measurable and at least three more categories are not. Subtracting the known costs from the
        recovered money would produce a net number that looks complete and is missing its largest components —
        engineering time and cost of goods. The costs are published as a list and the subtraction is left undone on
        purpose.
      </Callout>

      <section className="space-y-3">
        <p className={EYEBROW_CLASS}>The one cost this section owns itself</p>
        <ValueKvList rows={VL07_KV_ROWS} />
      </section>
    </div>
  );
};

export default CostRoute;
