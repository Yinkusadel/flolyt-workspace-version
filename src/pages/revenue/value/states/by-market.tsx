import { EYEBROW_CLASS } from "@/pages/everyday/lifecycle/data";
import { Callout } from "@/pages/everyday/lifecycle/stage/rail";
import { ValueKvList } from "@/pages/revenue/value/kv-list";
import { ValueTabs } from "@/pages/revenue/value/tabs";
import { VL04_GHANA_KV, VL04_ROWS, VL_TONE_CLASS } from "@/pages/revenue/value/data";

const HEAD_CLASS = "px-4 py-2.5 font-mono text-[8.5px] font-medium tracking-[0.8px] text-ink-4 uppercase";

/** VL04 — /value?by=market. */
export function ByMarketState() {
  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-[17px] font-semibold text-ink">Value</h1>
        <p className="mt-1 text-[11.5px] text-ink-3">Four markets, four currencies · the only fully causal figure is also the smallest</p>
      </div>

      <ValueTabs active="By market" />

      <div className="overflow-x-auto rounded-card border border-line bg-paper">
        <table className="w-full min-w-[880px] text-left text-[11.5px]">
          <thead>
            <tr className="border-b border-line bg-paper-2">
              <th className={HEAD_CLASS}>Market</th>
              <th className={HEAD_CLASS}>Rooms</th>
              <th className={`${HEAD_CLASS} text-right`}>Recovered</th>
              <th className={`${HEAD_CLASS} text-right`}>On a holdout</th>
              <th className={`${HEAD_CLASS} text-right`}>Weaker method</th>
              <th className={`${HEAD_CLASS} text-right`}>Unmeasurable</th>
              <th className={`${HEAD_CLASS} text-right`}>Share of base</th>
            </tr>
          </thead>
          <tbody>
            {VL04_ROWS.map((row) => (
              <tr key={row.market} className="border-b border-line last:border-0">
                <td className="px-4 py-3 font-semibold text-ink">{row.market}</td>
                <td className="px-4 py-3 text-ink-3">{row.rooms}</td>
                <td className={`px-4 py-3 text-right font-mono ${VL_TONE_CLASS[row.recoveredTone]}`}>{row.recovered}</td>
                <td className={`px-4 py-3 text-right font-mono ${VL_TONE_CLASS[row.holdoutTone]}`}>{row.holdout}</td>
                <td className={`px-4 py-3 text-right font-mono ${VL_TONE_CLASS[row.weakerTone]}`}>{row.weaker}</td>
                <td className={`px-4 py-3 text-right font-mono ${VL_TONE_CLASS[row.unmeasurableTone]}`}>{row.unmeasurable}</td>
                <td className="px-4 py-3 text-right font-mono text-ink">{row.share}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <Callout tone="amber" title="The UK's £61k is the only figure here that is entirely causal, and it is the smallest">
        One room, one holdout, 269,000 customers and a clean answer. Nigeria has 31 closed rooms and 23% of its
        money on a holdout. Size and rigour are running in opposite directions, because the small market was easy
        to experiment in and the large one was busy. The two columns are next to each other so the pattern cannot
        be missed.
      </Callout>

      <section className="space-y-3">
        <p className={EYEBROW_CLASS}>Ghana · two rooms closed, one figure attributable, and a date coming</p>
        <ValueKvList rows={VL04_GHANA_KV} />
      </section>

      <Callout tone="neutral" title="Comparing these four columns is the one thing the screen makes easy and the one thing to be careful with">
        GHS 1.4M against ₦411M is not a comparison of performance; it is a comparison of size, age and
        instrumentation. The share-of-base column is there so the arithmetic anybody would do in their head has the
        denominator next to it.
      </Callout>
    </div>
  );
}
