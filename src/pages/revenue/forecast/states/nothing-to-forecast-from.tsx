import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { EYEBROW_CLASS } from "@/pages/everyday/lifecycle/data";
import { Callout } from "@/pages/everyday/lifecycle/stage/rail";
import { Chip } from "@/pages/everyday/lifecycle/stage/chip";
import { FC01_ROWS, FC_CHIP_TONE, FC_TONE_CLASS } from "@/pages/revenue/forecast/data";

const HEAD_CLASS = "px-4 py-2.5 font-mono text-[8.5px] font-medium tracking-[0.8px] text-ink-4 uppercase";

/** FC01 — before a baseline exists. Wired but unreachable with FORECAST_STATE's current default. */
export function NothingToForecastFromState() {
  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-[17px] font-semibold text-ink">Forecast</h1>
        <p className="mt-1 text-[11.5px] text-ink-3">No baseline · locks 1 January</p>
      </div>

      <div className="rounded-surface border border-dashed border-line bg-paper p-8 text-center sm:p-10">
        <h2 className="text-[16px] font-semibold text-ink sm:text-[17px]">There is nothing here to forecast from yet</h2>
        <p className="mx-auto mt-3 max-w-xl text-[11.5px] leading-relaxed text-ink-3">
          A forecast is a claim about the future made out of a stable past. There are four days of live data, no
          baseline, and no owner has committed to a number. What appears here on 1 January is not a projection but a
          set of commitments people have signed.
        </p>
        <div className="mt-5 flex flex-wrap items-center justify-center gap-3">
          <Button type="button" onClick={() => toast.info("Baseline locks automatically on 1 January")}>
            Lock a baseline
          </Button>
          <Button type="button" variant="outline" onClick={() => toast.info("Scroll down · the table below is who will own a number")}>
            Who forecasts what
          </Button>
        </div>
        <p className="mx-auto mt-5 max-w-lg text-[10px] text-ink-4">
          A projection built from four days would be arithmetic, and it would be quoted as a plan.
        </p>
      </div>

      <section className="space-y-3">
        <p className={EYEBROW_CLASS}>Who will own a number here, and what they will be committing to</p>
        <div className="overflow-x-auto rounded-card border border-line bg-paper">
          <table className="w-full min-w-[760px] text-left text-[11.5px]">
            <thead>
              <tr className="border-b border-line bg-paper-2">
                <th className={HEAD_CLASS}>Stage</th>
                <th className={`${HEAD_CLASS} text-right`}>Owner</th>
                <th className={HEAD_CLASS}>What they will forecast</th>
                <th className={HEAD_CLASS}>Needs</th>
                <th className={`${HEAD_CLASS} text-right`}>Ready?</th>
              </tr>
            </thead>
            <tbody>
              {FC01_ROWS.map((row) => (
                <tr key={row.stage} className="border-b border-line last:border-0">
                  <td className="px-4 py-3 font-semibold text-ink">{row.stage}</td>
                  <td className={`px-4 py-3 text-right ${FC_TONE_CLASS[row.ownerTone]}`}>{row.owner}</td>
                  <td className="px-4 py-3 text-ink-2">{row.what}</td>
                  <td className="px-4 py-3 text-ink-2">{row.needs}</td>
                  <td className="px-4 py-3 text-right">
                    <Chip tone={FC_CHIP_TONE[row.readyTone]}>{row.ready}</Chip>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      <Callout tone="ultra" title="A forecast is the only figure in Flolyt that a person owes rather than the data produces">
        Everything else in Revenue is measured and reported. A forecast is somebody standing behind a number, which
        is why two of these rows read "nobody" and will keep reading "nobody" until a person is named. The product
        will not generate a projection to fill a stage that has no one to answer for it.
      </Callout>
    </div>
  );
}
