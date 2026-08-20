import { EYEBROW_CLASS } from "@/pages/everyday/lifecycle/data";
import { Callout } from "@/pages/everyday/lifecycle/stage/rail";
import { AttributionKvList } from "@/pages/revenue/attribution/kv-list";
import { AT11_DURATION_KV, AT11_SIZE_ROWS, AT11_SUBJECT, AT_TONE_CLASS } from "@/pages/revenue/attribution/data";

const HEAD_CLASS = "px-4 py-2.5 font-mono text-[8.5px] font-medium tracking-[0.8px] text-ink-4 uppercase";

/** AT11 — step 1 of "Design a holdout": what you are measuring, and the size trade-off. */
export function StepSize() {
  return (
    <div className="space-y-8">
      <section className="space-y-3">
        <p className={EYEBROW_CLASS}>What you are measuring</p>
        <div className="rounded-panel border border-line bg-paper-2 px-4 py-3">
          <p className="text-[12.5px] font-semibold text-ink">{AT11_SUBJECT.title}</p>
          <p className="mt-1 font-mono text-[10px] text-ink-4">{AT11_SUBJECT.sub}</p>
        </div>
      </section>

      <section className="space-y-3">
        <p className={EYEBROW_CLASS}>Size</p>
        <div className="overflow-x-auto rounded-card border border-line bg-paper">
          <table className="w-full min-w-[760px] text-left text-[11.5px]">
            <thead>
              <tr className="border-b border-line bg-paper-2">
                <th className={HEAD_CLASS}>Holdout</th>
                <th className={`${HEAD_CLASS} text-right`}>Held</th>
                <th className={`${HEAD_CLASS} text-right`}>Treated</th>
                <th className={`${HEAD_CLASS} text-right`}>Detects a change of</th>
                <th className={`${HEAD_CLASS} text-right`}>Time to an answer</th>
                <th className={`${HEAD_CLASS} text-right`}>Cost of holding</th>
              </tr>
            </thead>
            <tbody>
              {AT11_SIZE_ROWS.map((row) => (
                <tr key={row.pct} className="border-b border-line last:border-0">
                  <td className="px-4 py-3 font-semibold text-ink">{row.pct}</td>
                  <td className="px-4 py-3 text-right font-mono text-ink">{row.held}</td>
                  <td className="px-4 py-3 text-right font-mono text-ink-3">{row.treated}</td>
                  <td className={`px-4 py-3 text-right ${AT_TONE_CLASS[row.detectsTone]}`}>{row.detects}</td>
                  <td className={`px-4 py-3 text-right ${AT_TONE_CLASS[row.timeToAnswerTone]}`}>{row.timeToAnswer}</td>
                  <td className={`px-4 py-3 text-right font-mono ${AT_TONE_CLASS[row.costTone]}`}>{row.cost}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      <Callout tone="ultra" title="There is no recommended row and the trade is stated instead">
        A bigger holdout answers faster and costs more customers a thing that probably works. Flolyt will not pick
        for you, because the right answer depends on how confident you already are and how much the prompt is
        worth — neither of which is in the data. What it will do is refuse to run below 5%, where the answer would
        take longer than the intervention lasts.
      </Callout>

      <section className="space-y-3">
        <p className={EYEBROW_CLASS}>Duration</p>
        <AttributionKvList rows={AT11_DURATION_KV} />
      </section>
    </div>
  );
}
