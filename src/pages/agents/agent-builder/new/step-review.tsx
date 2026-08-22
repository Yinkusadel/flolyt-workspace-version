import { EYEBROW_CLASS } from "@/pages/everyday/lifecycle/data";
import { Callout } from "@/pages/everyday/lifecycle/stage/rail";
import { Chip } from "@/pages/everyday/lifecycle/stage/chip";
import { AB09_HERO, AB09_ROWS, AB_CHIP_TONE } from "@/pages/agents/agent-builder/data";

const HEAD_CLASS = "px-4 py-2.5 font-mono text-[8.5px] font-medium tracking-[0.8px] text-ink-4 uppercase";

/** AB09 — step 6, "Review". */
export function StepReview() {
  return (
    <div className="space-y-8">
      <div className="relative overflow-hidden rounded-card border border-amber-border bg-amber-bg p-5">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div>
            <p className="font-mono text-[8.5px] font-medium tracking-[0.9px] text-ink-4 uppercase">{AB09_HERO.leftLabel}</p>
            <p className="mt-2 text-[26px] font-semibold text-ink">{AB09_HERO.leftBig}</p>
            <p className="mt-1.5 max-w-md text-[11px] text-ink-2">{AB09_HERO.sub}</p>
          </div>
          <div className="text-right">
            <p className="font-mono text-[8.5px] font-medium tracking-[0.9px] text-ink-4 uppercase">{AB09_HERO.rightLabel}</p>
            <p className="mt-2 text-[20px] font-semibold text-ink">{AB09_HERO.rightBig}</p>
            <p className="mt-1.5 font-mono text-[10px] font-semibold text-amber">{AB09_HERO.rightSub}</p>
          </div>
        </div>
      </div>

      <section className="space-y-3">
        <p className={EYEBROW_CLASS}>Everything it is, on one screen</p>
        <div className="overflow-x-auto rounded-card border border-line bg-paper">
          <table className="w-full min-w-[720px] text-left text-[11.5px]">
            <thead>
              <tr className="border-b border-line bg-paper-2">
                <th className={HEAD_CLASS}></th>
                <th className={HEAD_CLASS}>What you chose</th>
                <th className={`${HEAD_CLASS} text-right`}>Changeable later?</th>
              </tr>
            </thead>
            <tbody>
              {AB09_ROWS.map((row) => (
                <tr key={row.field} className="border-b border-line last:border-0">
                  <td className="px-4 py-3 font-mono font-semibold text-ink-4">{row.field}</td>
                  <td className="px-4 py-3 text-ink-2">{row.chose}</td>
                  <td className="px-4 py-3 text-right">
                    <Chip tone={AB_CHIP_TONE[row.changeableTone]}>{row.changeable}</Chip>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      <Callout tone="ultra" title="It cannot be given anything the twelve do not have, and this screen is where people find that out">
        Several people building their first agent try to give it the ability to send a warning directly to
        Engineering. There is no such option on any of the six steps, on any plan. What it can do is put a
        finding in front of Ifeoma on the day, which is the same thing every other agent in this workspace does.
      </Callout>

      <Callout tone="teal" title="₦2 a run is worth saying out loud on the screen where somebody decides">
        It reads 412 releases and ten map lines. Repeat & Decay reads 4.2M rows and costs ₦18. Most built agents
        are small, cheap and specific, and the budget conversation in Governance is almost entirely about the
        twelve rather than about anything anybody builds here.
      </Callout>
    </div>
  );
}
