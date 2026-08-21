import { EYEBROW_CLASS } from "@/pages/everyday/lifecycle/data";
import { Callout } from "@/pages/everyday/lifecycle/stage/rail";
import { FunnelKvList } from "@/pages/revenue/funnel/kv-list";
import { FunnelTabs } from "@/pages/revenue/funnel/tabs";
import { FN06_ROWS, FN06_SAMPLE_ROWS, FN_TONE_CLASS } from "@/pages/revenue/funnel/data";

const HEAD_CLASS = "px-4 py-2.5 font-mono text-[8.5px] font-medium tracking-[0.8px] text-ink-4 uppercase";

/** FN06 — /funnel?by=market. */
export function ByMarketState() {
  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-[17px] font-semibold text-ink">Funnel</h1>
        <p className="mt-1 text-[11.5px] text-ink-3">
          The whole funnel, four markets · no combined column and no weighted average
        </p>
      </div>

      <FunnelTabs active="By market" />

      <section className="space-y-3">
        <p className={EYEBROW_CLASS}>The whole funnel, four markets, no combined column</p>
        <div className="overflow-x-auto rounded-card border border-line bg-paper">
          <table className="w-full min-w-[720px] text-left text-[11.5px]">
            <thead>
              <tr className="border-b border-line bg-paper-2">
                <th className={HEAD_CLASS}>Step</th>
                <th className={`${HEAD_CLASS} text-right`}>Nigeria</th>
                <th className={`${HEAD_CLASS} text-right`}>Kenya</th>
                <th className={`${HEAD_CLASS} text-right`}>Ghana</th>
                <th className={`${HEAD_CLASS} text-right`}>UK</th>
                <th className={`${HEAD_CLASS} text-right`}>Spread</th>
              </tr>
            </thead>
            <tbody>
              {FN06_ROWS.map((row) => (
                <tr key={row.step} className="border-b border-line last:border-0">
                  <td className="px-4 py-3 font-semibold text-ink">{row.step}</td>
                  <td className={`px-4 py-3 text-right font-mono ${FN_TONE_CLASS[row.ngTone]}`}>{row.ng}</td>
                  <td className={`px-4 py-3 text-right font-mono ${FN_TONE_CLASS[row.keTone]}`}>{row.ke}</td>
                  <td className={`px-4 py-3 text-right font-mono ${FN_TONE_CLASS[row.ghTone]}`}>{row.gh}</td>
                  <td className={`px-4 py-3 text-right font-mono ${FN_TONE_CLASS[row.ukTone]}`}>{row.uk}</td>
                  <td className={`px-4 py-3 text-right font-mono ${FN_TONE_CLASS[row.spreadTone]}`}>{row.spread}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      <Callout tone="rose" title="Ghana loses 38.8% of people at signup completion and has done since before any of this">
        The worst number in this table has nothing to do with the fee. Ghanaian signup completion has sat around 61%
        since the market opened, eleven months ago, and no room has ever been opened about it. It is the clearest
        example of what a leakage map ranked by movement will always miss: a thing that has been equally bad for a
        year does not move, so it never appears as a change.
      </Callout>

      <section className="space-y-3">
        <p className={EYEBROW_CLASS}>Sample sizes, because three of these markets are small</p>
        <FunnelKvList rows={FN06_SAMPLE_ROWS} />
      </section>
    </div>
  );
}
