import { useState } from "react";

import { Button } from "@/components/ui/button";
import { EYEBROW_CLASS } from "@/pages/everyday/lifecycle/data";
import { Callout } from "@/pages/everyday/lifecycle/stage/rail";
import { Chip } from "@/pages/everyday/lifecycle/stage/chip";
import { ReviseASignedForecastModal } from "@/pages/revenue/forecast/modals/revise-a-signed-forecast-modal";
import { ForecastKvList } from "@/pages/revenue/forecast/kv-list";
import { ForecastTabs } from "@/pages/revenue/forecast/tabs";
import { FC07_KV_ROWS, FC07_ROWS, FC_CHIP_TONE, FC_TONE_CLASS } from "@/pages/revenue/forecast/data";

const HEAD_CLASS = "px-4 py-2.5 font-mono text-[8.5px] font-medium tracking-[0.8px] text-ink-4 uppercase";

/** FC07 (disk) — /forecast/actuals. Also hosts the "Revise a signed forecast" modal (FC11), whose base frame in the export is this tab even though its preset (Retain, 29.8%) is a live forecast rather than one of this table's own closed rows. */
const ForecastActualsRoute = () => {
  const [reviseOpen, setReviseOpen] = useState(false);

  return (
    <div className="space-y-8">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <h1 className="text-[17px] font-semibold text-ink">Forecast</h1>
          <p className="mt-1 text-[11.5px] text-ink-3">Six forecasts have reached their date · three Q1 misses, one release, one reason</p>
        </div>
        <Button type="button" variant="outline" onClick={() => setReviseOpen(true)}>
          Revise a signed forecast
        </Button>
      </div>

      <ForecastTabs active="Against actuals" />

      <section className="space-y-3">
        <p className={EYEBROW_CLASS}>Every forecast that has reached its date · the record, kept whole</p>
        <div className="overflow-x-auto rounded-card border border-line bg-paper">
          <table className="w-full min-w-[920px] text-left text-[11.5px]">
            <thead>
              <tr className="border-b border-line bg-paper-2">
                <th className={HEAD_CLASS}>Period</th>
                <th className={HEAD_CLASS}>Stage</th>
                <th className={`${HEAD_CLASS} text-right`}>Forecast</th>
                <th className={`${HEAD_CLASS} text-right`}>Actual</th>
                <th className={`${HEAD_CLASS} text-right`}>Inside range?</th>
                <th className={`${HEAD_CLASS} text-right`}>Who signed it</th>
                <th className={HEAD_CLASS}>Why it landed there</th>
              </tr>
            </thead>
            <tbody>
              {FC07_ROWS.map((row, i) => (
                <tr key={`${row.period}-${row.stage}-${i}`} className="border-b border-line last:border-0">
                  <td className="px-4 py-3 text-ink-4">{row.period}</td>
                  <td className="px-4 py-3 font-semibold text-ink">{row.stage}</td>
                  <td className="px-4 py-3 text-right font-mono text-ink-4">{row.forecast}</td>
                  <td className={`px-4 py-3 text-right font-mono ${FC_TONE_CLASS[row.actualTone]}`}>{row.actual}</td>
                  <td className="px-4 py-3 text-right">
                    <Chip tone={FC_CHIP_TONE[row.insideTone]}>{row.inside}</Chip>
                  </td>
                  <td className="px-4 py-3 text-right text-ink-4">{row.signer}</td>
                  <td className="px-4 py-3 text-ink-2">{row.why}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      <Callout tone="rose" title="Every Q1 forecast was wrong in the same direction, on the same date, for the same reason">
        Three people, three stages, three independent misses — and all three are the 4 March release arriving in a
        number nobody had modelled because nobody knew it existed. The forecasting was not bad. The company was
        forecasting a business that had quietly changed, which is the same finding as the leakage map arriving from
        the opposite end.
      </Callout>

      <section className="space-y-3">
        <p className={EYEBROW_CLASS}>What the record is used for, and what it is not</p>
        <div className="max-w-2xl">
          <ForecastKvList rows={FC07_KV_ROWS} />
        </div>
      </section>

      <ReviseASignedForecastModal open={reviseOpen} onOpenChange={setReviseOpen} />
    </div>
  );
};

export default ForecastActualsRoute;
