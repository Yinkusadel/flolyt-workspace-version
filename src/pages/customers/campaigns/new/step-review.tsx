import { EYEBROW_CLASS } from "@/pages/everyday/lifecycle/data";
import { Callout } from "@/pages/everyday/lifecycle/stage/rail";
import { Chip } from "@/pages/everyday/lifecycle/stage/chip";
import { CP12_COMMITMENT_ROWS, CP_CHIP_TONE } from "@/pages/customers/campaigns/data";

const HEAD_CLASS = "px-4 py-2.5 font-mono text-[8.5px] font-medium tracking-[0.8px] text-ink-4 uppercase";

/** CP12 — step 4, "Review". */
export function StepReview() {
  return (
    <div className="space-y-8">
      <div className="rounded-card border border-amber-border bg-amber-bg p-5">
        <p className="font-mono text-[9px] font-medium tracking-[0.85px] text-amber uppercase">Would be sent to</p>
        <p className="mt-2 text-[28px] font-semibold text-ink">38,070</p>
        <p className="mt-1.5 max-w-xl text-[11px] leading-relaxed text-ink-2">
          From a segment of 100,000. Every reduction is on the previous screen and travels with the send.
        </p>
        <div className="mt-3 border-t border-dashed border-amber-border pt-3">
          <p className="font-mono text-[8.5px] text-ink-4 uppercase">Needs approval from</p>
          <p className="mt-0.5 text-[13px] font-semibold text-amber">Ada Obi · over Ifeoma&apos;s authority</p>
        </div>
      </div>

      <section className="space-y-3">
        <p className={EYEBROW_CLASS}>Everything this campaign commits to, before anybody approves it</p>
        <div className="overflow-x-auto rounded-card border border-line bg-paper">
          <table className="w-full min-w-[680px] text-left text-[11.5px]">
            <thead>
              <tr className="border-b border-line bg-paper-2">
                <th className={HEAD_CLASS}>Commitment</th>
                <th className={HEAD_CLASS}>Value</th>
                <th className={`${HEAD_CLASS} text-right`}>Changeable after sending?</th>
              </tr>
            </thead>
            <tbody>
              {CP12_COMMITMENT_ROWS.map((row) => (
                <tr key={row.commitment} className="border-b border-line last:border-0">
                  <td className="px-4 py-3 font-semibold text-ink-2">{row.commitment}</td>
                  <td className="px-4 py-3 text-ink-3">{row.value}</td>
                  <td className="px-4 py-3 text-right">
                    <Chip tone={CP_CHIP_TONE[row.changeableTone]}>{row.changeable}</Chip>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      <Callout tone="ultra" title="The failure condition cannot be changed once this is sent, and that is the whole reason it exists">
        Writing "below 6% in 14 days" now costs nothing. Writing it in fifteen days, after seeing 5.8%, costs the
        ability to ever be wrong about this campaign. Everything else on this screen is locked for practical
        reasons; this one is locked for an honest one.
      </Callout>

      <Callout tone="amber" title="Three people have seen this and none of them can approve it">
        Ifeoma built it, Repeat & Decay drafted the copy, and Ada has to re-authenticate because 38,070 is inside
        her authority but the segment overlaps two running waves. The approval is not a formality and it is not a
        role — it is Ada, by name, today.
      </Callout>
    </div>
  );
}
