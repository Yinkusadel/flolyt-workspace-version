import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { EYEBROW_CLASS } from "@/pages/everyday/lifecycle/data";
import { Callout } from "@/pages/everyday/lifecycle/stage/rail";
import { Chip } from "@/pages/everyday/lifecycle/stage/chip";
import { ForecastKvList } from "@/pages/revenue/forecast/kv-list";
import { ForecastTabs } from "@/pages/revenue/forecast/tabs";
import { FC05_KV_ROWS, FC05_ROWS, FC_CHIP_TONE, FC_TONE_CLASS } from "@/pages/revenue/forecast/data";

const HEAD_CLASS = "px-4 py-2.5 font-mono text-[8.5px] font-medium tracking-[0.8px] text-ink-4 uppercase";

/** FC05 (disk) — /forecast?by=market. */
export function ByMarketState() {
  return (
    <div className="space-y-8">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <h1 className="text-[17px] font-semibold text-ink">Forecast</h1>
          <p className="mt-1 text-[11.5px] text-ink-3">Three markets signed, one not forecast · no roll-up and no weighted average</p>
        </div>
        <Button type="button" variant="outline" onClick={() => toast.info("Opening the assign-an-owner workflow for Ghana")}>
          Find an owner for Ghana
        </Button>
      </div>

      <ForecastTabs active="By market" />

      <section className="space-y-3">
        <div className="overflow-x-auto rounded-card border border-line bg-paper">
          <table className="w-full min-w-[820px] text-left text-[11.5px]">
            <thead>
              <tr className="border-b border-line bg-paper-2">
                <th className={HEAD_CLASS}>Market</th>
                <th className={`${HEAD_CLASS} text-right`}>Base</th>
                <th className={`${HEAD_CLASS} text-right`}>Renewal now</th>
                <th className={`${HEAD_CLASS} text-right`}>Forecast</th>
                <th className={`${HEAD_CLASS} text-right`}>Range</th>
                <th className={HEAD_CLASS}>Owner</th>
                <th className={`${HEAD_CLASS} text-right`}>State</th>
              </tr>
            </thead>
            <tbody>
              {FC05_ROWS.map((row) => (
                <tr key={row.market} className="border-b border-line last:border-0">
                  <td className="px-4 py-3 font-semibold text-ink">{row.market}</td>
                  <td className="px-4 py-3 text-right font-mono text-ink-4">{row.base}</td>
                  <td className={`px-4 py-3 text-right font-mono ${FC_TONE_CLASS[row.nowTone]}`}>{row.now}</td>
                  <td className={`px-4 py-3 text-right font-mono ${FC_TONE_CLASS[row.forecastTone]}`}>{row.forecast}</td>
                  <td className="px-4 py-3 text-right font-mono text-ink-4">{row.range}</td>
                  <td className={`px-4 py-3 ${FC_TONE_CLASS[row.ownerTone]}`}>{row.owner}</td>
                  <td className="px-4 py-3 text-right">
                    <Chip tone={FC_CHIP_TONE[row.stateTone]}>{row.state}</Chip>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      <Callout tone="rose" title="Ghana has a renewal rate, a base and a trend, and still has no forecast">
        Everything needed to project it exists. What is missing is the person who would be wrong in ninety days, and
        the market that would be forecast is the one receiving a release on 14 September that nobody has sized.
        Producing a number for Ghana would mean producing the least reliable forecast in the workspace and attaching
        no name to it.
      </Callout>

      <section className="space-y-3">
        <p className={EYEBROW_CLASS}>What the four forecasts do not do</p>
        <div className="max-w-2xl">
          <ForecastKvList rows={FC05_KV_ROWS} />
        </div>
      </section>
    </div>
  );
}
