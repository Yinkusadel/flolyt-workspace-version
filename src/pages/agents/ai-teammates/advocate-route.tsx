import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { EYEBROW_CLASS } from "@/pages/everyday/lifecycle/data";
import { Callout } from "@/pages/everyday/lifecycle/stage/rail";
import { Chip } from "@/pages/everyday/lifecycle/stage/chip";
import { StageSubpageHeader } from "@/pages/everyday/lifecycle/stage/stage-subpage-header";
import { TM16_HERO, TM16_ROWS, TM_CHIP_TONE, TM_TONE_CLASS } from "@/pages/agents/ai-teammates/data";

const HEAD_CLASS = "px-4 py-2.5 font-mono text-[8.5px] font-medium tracking-[0.8px] text-ink-4 uppercase";

/** TM16 — /ai-teammates/advocate. */
const AdvocateRoute = () => {
  return (
    <div className="space-y-8">
      <StageSubpageHeader
        crumbs={[{ label: "AI teammates", to: "/ai-teammates" }, { label: "Advocate" }]}
        title="A stage nobody watches"
        subtitle="No agent · 124,000 referrers · three of four inputs never asked for by anybody"
        action={
          <Button type="button" onClick={() => toast.info("Assigning stage owners lives in Lifecycle settings")}>
            Assign an owner
          </Button>
        }
      />

      <div className="relative overflow-hidden rounded-card border border-rose-border bg-rose-bg p-5">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div>
            <p className="font-mono text-[8.5px] font-medium tracking-[0.9px] text-ink-4 uppercase">{TM16_HERO.leftLabel}</p>
            <p className="mt-2 text-[26px] font-semibold text-ink">{TM16_HERO.leftBig}</p>
            <p className="mt-1.5 max-w-md text-[11px] text-ink-3">{TM16_HERO.sub}</p>
          </div>
          <div className="text-right">
            <p className="font-mono text-[8.5px] font-medium tracking-[0.9px] text-ink-4 uppercase">{TM16_HERO.rightLabel}</p>
            <p className="mt-2 text-[20px] font-semibold text-ink">{TM16_HERO.rightBig}</p>
            <p className="mt-1.5 font-mono text-[10px] font-semibold text-rose">{TM16_HERO.rightSub}</p>
          </div>
        </div>
      </div>

      <section className="space-y-3">
        <p className={EYEBROW_CLASS}>What an agent would need, and what exists</p>
        <div className="overflow-x-auto rounded-card border border-line bg-paper">
          <table className="w-full min-w-[820px] text-left text-[11.5px]">
            <thead>
              <tr className="border-b border-line bg-paper-2">
                <th className={HEAD_CLASS}>What it would read</th>
                <th className={`${HEAD_CLASS} text-right`}>Does it exist?</th>
                <th className={`${HEAD_CLASS} text-right`}>Since</th>
                <th className={`${HEAD_CLASS} text-right`}>Who could build it</th>
                <th className={`${HEAD_CLASS} text-right`}>Asked</th>
              </tr>
            </thead>
            <tbody>
              {TM16_ROWS.map((row) => (
                <tr key={row.would} className="border-b border-line last:border-0">
                  <td className="px-4 py-3 font-semibold text-ink">{row.would}</td>
                  <td className="px-4 py-3 text-right">
                    <Chip tone={TM_CHIP_TONE[row.existsTone]}>{row.exists}</Chip>
                  </td>
                  <td className="px-4 py-3 text-right text-ink-4">{row.since}</td>
                  <td className="px-4 py-3 text-right text-ink-4">{row.who}</td>
                  <td className={`px-4 py-3 text-right ${TM_TONE_CLASS[row.askedTone]}`}>{row.asked}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      <Callout tone="rose" title="Three of four inputs have never been asked for by anybody, because Advocate has no owner to ask">
        This is the clearest loop in the workspace: no owner means no requests, no requests means no
        instrumentation, no instrumentation means no agent, no agent means no findings, and no findings means
        nothing that would make anybody assign an owner. It has been running for eleven months and nothing inside
        this product will break it.
      </Callout>

      <Callout tone="ultra" title="Adding an agent here today would be worse than adding nothing">
        It would read an empty referral table, find nothing, and appear on the roster as a healthy agent with zero
        findings — identical to an agent watching a stage where nothing is wrong. The row on the coverage screen
        says nobody for that reason, and it is the only stage in the workspace where that is the honest answer.
      </Callout>
    </div>
  );
};

export default AdvocateRoute;
