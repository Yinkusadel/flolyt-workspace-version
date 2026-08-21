import { EYEBROW_CLASS } from "@/pages/everyday/lifecycle/data";
import { Callout } from "@/pages/everyday/lifecycle/stage/rail";
import { Chip } from "@/pages/everyday/lifecycle/stage/chip";
import { SegmentsKvList } from "@/pages/customers/segments/kv-list";
import { SG11_KV_ROWS, SG11_NEAR_MATCH_ROWS, SG_CHIP_TONE, SG_TONE_CLASS } from "@/pages/customers/segments/data";

const HEAD_CLASS = "px-4 py-2.5 font-mono text-[8.5px] font-medium tracking-[0.8px] text-ink-4 uppercase";

/** SG11 — step 3, "Review". */
export function StepReview() {
  return (
    <div className="space-y-8">
      <div className="rounded-card border border-amber-border bg-amber-bg p-5">
        <p className="font-mono text-[9px] font-medium tracking-[0.85px] text-amber uppercase">In the segment</p>
        <p className="mt-2 text-[28px] font-semibold text-ink">127,000</p>
        <p className="mt-1.5 max-w-xl text-[11px] leading-relaxed text-ink-2">
          162,000 matched. 13,400 excluded by the product, 21,600 by you, and every one of them is named.
        </p>
        <div className="mt-3 flex flex-wrap gap-5 border-t border-dashed border-amber-border pt-3">
          <div>
            <p className="font-mono text-[8.5px] text-ink-4 uppercase">Duplicate check</p>
            <p className="mt-0.5 text-[13px] font-semibold text-amber">1 near match</p>
          </div>
          <div>
            <p className="font-mono text-[8.5px] text-ink-4 uppercase">Against</p>
            <p className="mt-0.5 text-[13px] font-semibold text-amber">89,000 people, inverted</p>
          </div>
        </div>
      </div>

      <section className="space-y-3">
        <p className={EYEBROW_CLASS}>The near match, before you save</p>
        <div className="overflow-x-auto rounded-card border border-line bg-paper">
          <table className="w-full min-w-[720px] text-left text-[11.5px]">
            <thead>
              <tr className="border-b border-line bg-paper-2">
                <th className={HEAD_CLASS}>Existing segment</th>
                <th className={`${HEAD_CLASS} text-right`}>Size</th>
                <th className={HEAD_CLASS}>How it differs</th>
                <th className={`${HEAD_CLASS} text-right`}>Overlap</th>
                <th className={HEAD_CLASS}>Suggestion</th>
              </tr>
            </thead>
            <tbody>
              {SG11_NEAR_MATCH_ROWS.map((row) => (
                <tr key={row.name} className="border-b border-line last:border-0">
                  <td className="px-4 py-3 font-semibold text-ink">{row.name}</td>
                  <td className="px-4 py-3 text-right font-mono text-ink">{row.size}</td>
                  <td className="px-4 py-3 text-ink-2">{row.howDiffers}</td>
                  <td className={`px-4 py-3 text-right font-mono ${SG_TONE_CLASS[row.overlapTone]}`}>{row.overlap}</td>
                  <td className="px-4 py-3">
                    <Chip tone={SG_CHIP_TONE[row.suggestionTone]}>{row.suggestion}</Chip>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      <section className="space-y-3">
        <p className={EYEBROW_CLASS}>Before it can be saved</p>
        <SegmentsKvList rows={SG11_KV_ROWS} />
      </section>

      <Callout tone="ultra" title="“Nothing yet” is an accepted purpose and it starts a clock rather than a fight">
        Twenty-three segments have no purpose and this will be the twenty-fourth. Saving it sets a review date, so
        in October somebody is asked whether it earned its place — which is a better mechanism than refusing to
        save it, because the refusal would just move the definition into a spreadsheet nobody can see.
      </Callout>
    </div>
  );
}
