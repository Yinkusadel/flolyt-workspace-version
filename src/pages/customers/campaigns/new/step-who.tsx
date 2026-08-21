import { EYEBROW_CLASS } from "@/pages/everyday/lifecycle/data";
import { Callout } from "@/pages/everyday/lifecycle/stage/rail";
import { Chip } from "@/pages/everyday/lifecycle/stage/chip";
import { CP09_SEGMENT_ROWS, CP_TONE_CLASS } from "@/pages/customers/campaigns/data";

const HEAD_CLASS = "px-4 py-2.5 font-mono text-[8.5px] font-medium tracking-[0.8px] text-ink-4 uppercase";

/** CP09 — step 1, "Who it reaches". */
export function StepWho() {
  return (
    <div className="space-y-8">
      <section className="space-y-3">
        <p className={EYEBROW_CLASS}>Which segment is this for?</p>
        <div className="overflow-x-auto rounded-card border border-line bg-paper">
          <table className="w-full min-w-[760px] text-left text-[11.5px]">
            <thead>
              <tr className="border-b border-line bg-paper-2">
                <th className={HEAD_CLASS}>Segment</th>
                <th className={`${HEAD_CLASS} text-right`}>Included</th>
                <th className={`${HEAD_CLASS} text-right`}>Eligible after rules</th>
                <th className={HEAD_CLASS}>In use elsewhere</th>
                <th className={`${HEAD_CLASS} text-right`}>Pick</th>
              </tr>
            </thead>
            <tbody>
              {CP09_SEGMENT_ROWS.map((row) => (
                <tr key={row.segment} className="border-b border-line last:border-0">
                  <td className="px-4 py-3 font-semibold text-ink-2">{row.segment}</td>
                  <td className="px-4 py-3 text-right font-mono text-ink-3">{row.included}</td>
                  <td className={`px-4 py-3 text-right font-mono ${CP_TONE_CLASS[row.eligibleTone]}`}>{row.eligible}</td>
                  <td className={`px-4 py-3 ${CP_TONE_CLASS[row.inUseElsewhereTone]}`}>{row.inUseElsewhere}</td>
                  <td className="px-4 py-3 text-right">
                    {row.picked && <Chip tone="ultra">selected</Chip>}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      <Callout tone="amber" title="The segment you picked has 100,000 people in it and 42,300 you can actually reach today">
        51,000 are already in waves one and two and are inside the seven-day cap. 6,700 are permanently excluded.
        Nothing is wrong — this is the third campaign into the same group in a fortnight, and the number falls each
        time. The next screen will not let you raise the cap to fix it.
      </Callout>

      <Callout tone="rose" title="Ghana returns zero eligible and the row is shown anyway">
        Every Ghanaian customer is excluded until 14 September, because the fee change ships there and a campaign
        running across it would be unmeasurable and unfair in the same fortnight. Hiding the row would make it look
        like the market has no customers rather than a date.
      </Callout>
    </div>
  );
}
