import { EYEBROW_CLASS } from "@/pages/everyday/lifecycle/data";
import { Callout } from "@/pages/everyday/lifecycle/stage/rail";
import { Chip } from "@/pages/everyday/lifecycle/stage/chip";
import { AB07_ROWS, AB_CHIP_TONE, AB_TONE_CLASS } from "@/pages/agents/agent-builder/data";

const HEAD_CLASS = "px-4 py-2.5 font-mono text-[8.5px] font-medium tracking-[0.8px] text-ink-4 uppercase";

/** AB07 — step 4, "Where findings go". */
export function StepRouting() {
  return (
    <div className="space-y-8">
      <section className="space-y-3">
        <p className={EYEBROW_CLASS}>Who receives what it finds? · this is the step that decides whether it matters</p>
        <div className="overflow-x-auto rounded-card border border-line bg-paper">
          <table className="w-full min-w-[880px] text-left text-[11.5px]">
            <thead>
              <tr className="border-b border-line bg-paper-2">
                <th className={HEAD_CLASS}>Destination</th>
                <th className={HEAD_CLASS}>Why them</th>
                <th className={`${HEAD_CLASS} text-right`}>Their load</th>
                <th className={`${HEAD_CLASS} text-right`}>Would they act?</th>
                <th className={`${HEAD_CLASS} text-right`}>Pick</th>
              </tr>
            </thead>
            <tbody>
              {AB07_ROWS.map((row) => (
                <tr key={row.destination} className="border-b border-line last:border-0">
                  <td className="px-4 py-3 font-semibold text-ink">{row.destination}</td>
                  <td className="px-4 py-3 text-ink-3">{row.why}</td>
                  <td className={`px-4 py-3 text-right ${AB_TONE_CLASS[row.loadTone]}`}>{row.load}</td>
                  <td className="px-4 py-3 text-right">
                    <Chip tone={AB_CHIP_TONE[row.wouldActTone]}>{row.wouldAct}</Chip>
                  </td>
                  <td className="px-4 py-3 text-right">{row.picked && <Chip tone="ultra">selected</Chip>}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      <Callout tone="rose" title="Two destinations are not offered and both are the ways an agent becomes decoration">
        Routing to a team means routing to nobody with extra steps. Logging without routing produces an agent
        that is technically working and functionally invisible — which is what this condition has been doing
        inside Repeat & Decay since June, and the entire reason Ifeoma is on this screen.
      </Callout>

      <Callout tone="amber" title="The honest answer here was a person with fourteen rooms already">
        Ifeoma is not the obvious owner of a release pattern and she is the only one of the three who will read
        it in September. The form shows everybody's load so the choice is made with that in front of you rather
        than discovered afterwards, and Sam's fourteen overdue obligations are the reason the obvious answer was
        the wrong one.
      </Callout>
    </div>
  );
}
