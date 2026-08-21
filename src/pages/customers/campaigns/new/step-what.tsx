import { EYEBROW_CLASS } from "@/pages/everyday/lifecycle/data";
import { Callout } from "@/pages/everyday/lifecycle/stage/rail";
import { Chip } from "@/pages/everyday/lifecycle/stage/chip";
import { CampaignsKvList } from "@/pages/customers/campaigns/kv-list";
import { CP10_CHECK_ROWS, CP10_CLAIM_WARNING, CP10_DRAFT, CP10_KV_ROWS, CP_CHIP_TONE, CP_TONE_CLASS } from "@/pages/customers/campaigns/data";

const HEAD_CLASS = "px-4 py-2.5 font-mono text-[8.5px] font-medium tracking-[0.8px] text-ink-4 uppercase";

/** CP10 — step 2, "What it says". */
export function StepWhat() {
  return (
    <div className="space-y-8">
      <div className="grid grid-cols-1 gap-4 lg:grid-cols-[1.6fr_1fr]">
        <div className="rounded-card border border-line bg-white p-4.5">
          <p className="font-mono text-[8.5px] font-medium tracking-[0.85px] text-ink-4 uppercase">{CP10_DRAFT.eyebrow}</p>
          <p className="mt-3 text-[13.5px] font-semibold text-ink">{CP10_DRAFT.headline}</p>
          <p className="mt-2 text-[11px] leading-relaxed text-ink-2">{CP10_DRAFT.body}</p>
          <p className="mt-3 font-mono text-[9.5px] text-ink-4">{CP10_DRAFT.meta}</p>
        </div>
        <div className="rounded-card border border-amber-border bg-amber-bg p-4.5">
          <p className="font-mono text-[8.5px] font-medium tracking-[0.85px] text-amber uppercase">{CP10_CLAIM_WARNING.eyebrow}</p>
          <p className="mt-3 text-[10.5px] leading-relaxed font-semibold text-amber">{CP10_CLAIM_WARNING.body}</p>
        </div>
      </div>

      <section className="space-y-3">
        <p className={EYEBROW_CLASS}>Checks that run on the copy, before anybody reads it</p>
        <div className="overflow-x-auto rounded-card border border-line bg-paper">
          <table className="w-full min-w-[760px] text-left text-[11.5px]">
            <thead>
              <tr className="border-b border-line bg-paper-2">
                <th className={HEAD_CLASS}>Check</th>
                <th className={`${HEAD_CLASS} text-right`}>Result</th>
                <th className={HEAD_CLASS}>What it found</th>
                <th className={`${HEAD_CLASS} text-right`}>Blocking?</th>
              </tr>
            </thead>
            <tbody>
              {CP10_CHECK_ROWS.map((row) => (
                <tr key={row.check} className="border-b border-line last:border-0">
                  <td className="px-4 py-3 text-ink-2">{row.check}</td>
                  <td className="px-4 py-3 text-right">
                    <Chip tone={CP_CHIP_TONE[row.resultTone]}>{row.result}</Chip>
                  </td>
                  <td className="px-4 py-3 text-ink-3">{row.found}</td>
                  <td className={`px-4 py-3 text-right ${CP_TONE_CLASS[row.blockingTone]}`}>{row.blocking}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      <Callout tone="rose" title="An agent wrote copy for a change that has not been made, and the check caught it rather than the reviewer">
        Repeat & Decay drafted this from scenario S-114, which models reversing the fee. The model is a question,
        the copy reads as a fact, and 42,300 people would have been told something untrue. The check is blocking
        because a claim about the product is the one kind of error that cannot be corrected by a second message.
      </Callout>

      <section className="space-y-3">
        <p className={EYEBROW_CLASS}>What the agent may and may not do with copy</p>
        <CampaignsKvList rows={CP10_KV_ROWS} />
      </section>
    </div>
  );
}
