import { EYEBROW_CLASS } from "@/pages/everyday/lifecycle/data";
import { Callout } from "@/pages/everyday/lifecycle/stage/rail";
import { Chip } from "@/pages/everyday/lifecycle/stage/chip";
import { FC08_ROWS, FC_CHIP_TONE, FC_TONE_CLASS } from "@/pages/revenue/forecast/data";

const HEAD_CLASS = "px-4 py-2.5 font-mono text-[8.5px] font-medium tracking-[0.8px] text-ink-4 uppercase";

/** FC08 — step 1 of "Re-forecast": what has moved since the last signed number. */
export function StepWhatChanged() {
  return (
    <div className="space-y-8">
      <section className="space-y-3">
        <p className={EYEBROW_CLASS}>What has moved since you last signed a number, fourteen days ago</p>
        <div className="overflow-x-auto rounded-card border border-line bg-paper">
          <table className="w-full min-w-[880px] text-left text-[11.5px]">
            <thead>
              <tr className="border-b border-line bg-paper-2">
                <th className={HEAD_CLASS}>What changed</th>
                <th className={`${HEAD_CLASS} text-right`}>Effect on the model</th>
                <th className={`${HEAD_CLASS} text-right`}>Direction</th>
                <th className={HEAD_CLASS}>Source</th>
                <th className={`${HEAD_CLASS} text-right`}>In your last forecast?</th>
              </tr>
            </thead>
            <tbody>
              {FC08_ROWS.map((row) => (
                <tr key={row.what} className="border-b border-line last:border-0">
                  <td className="px-4 py-3 font-semibold text-ink">{row.what}</td>
                  <td className={`px-4 py-3 text-right font-mono ${FC_TONE_CLASS[row.effectTone]}`}>{row.effect}</td>
                  <td className={`px-4 py-3 text-right ${FC_TONE_CLASS[row.directionTone]}`}>{row.direction}</td>
                  <td className="px-4 py-3 text-ink-2">{row.source}</td>
                  <td className="px-4 py-3 text-right">
                    <Chip tone={FC_CHIP_TONE[row.inLastTone]}>{row.inLast}</Chip>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      <Callout tone="amber" title="Two of the five things that changed cannot be turned into a number and both are on the list anyway">
        Peter's 41 accounts and the Ghanaian release are the two largest events in this stage's next ninety days and
        neither has a modelled effect. They appear here so that the number Kunle signs is signed in full knowledge
        of them, and so that "nobody mentioned it" is not available in November.
      </Callout>

      <Callout tone="ultra" title="The model moved 0.3 points and the meeting will be about the two rows that moved nothing">
        Everything quantifiable roughly cancels out. The interesting content of this re-forecast is entirely in the
        unquantified rows, which is usually true and almost never how a forecasting screen is laid out.
      </Callout>
    </div>
  );
}
