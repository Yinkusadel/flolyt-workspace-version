import { EYEBROW_CLASS } from "@/pages/everyday/lifecycle/data";
import { Callout } from "@/pages/everyday/lifecycle/stage/rail";
import { Chip } from "@/pages/everyday/lifecycle/stage/chip";
import { AgentBuilderKvList } from "@/pages/agents/agent-builder/kv-list";
import { AB08_KV, AB08_ROWS, AB_CHIP_TONE, AB_TONE_CLASS } from "@/pages/agents/agent-builder/data";

const HEAD_CLASS = "px-4 py-2.5 font-mono text-[8.5px] font-medium tracking-[0.8px] text-ink-4 uppercase";

/** AB08 — step 5, "What it may say". */
export function StepClaims() {
  return (
    <div className="space-y-8">
      <section className="space-y-3">
        <p className={EYEBROW_CLASS}>The strongest claim it may make</p>
        <div className="overflow-x-auto rounded-card border border-line bg-paper">
          <table className="w-full min-w-[780px] text-left text-[11.5px]">
            <thead>
              <tr className="border-b border-line bg-paper-2">
                <th className={HEAD_CLASS}>Claim type</th>
                <th className={HEAD_CLASS}>What it would mean here</th>
                <th className={`${HEAD_CLASS} text-right`}>Available?</th>
                <th className={`${HEAD_CLASS} text-right`}>Why</th>
              </tr>
            </thead>
            <tbody>
              {AB08_ROWS.map((row) => (
                <tr key={row.claim} className="border-b border-line last:border-0">
                  <td className="px-4 py-3 font-semibold text-ink">{row.claim}</td>
                  <td className="px-4 py-3 text-ink-3">{row.means}</td>
                  <td className="px-4 py-3 text-right">
                    <Chip tone={AB_CHIP_TONE[row.availableTone]}>{row.available}</Chip>
                  </td>
                  <td className={`px-4 py-3 text-right ${AB_TONE_CLASS[row.whyTone]}`}>{row.why}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      <Callout tone="ultra" title="The claim ceiling is set by what this agent can read, not by how confident it feels">
        It sees releases and a map of past losses. That supports a dated pattern and nothing stronger. Causal is
        unavailable because it has no market that did not receive the change, and a figure is unavailable because
        it never reads an order. The ceiling is derived from step two rather than chosen here.
      </Callout>

      <section className="space-y-3">
        <p className={EYEBROW_CLASS}>What every finding it makes will have to carry</p>
        <AgentBuilderKvList rows={AB08_KV} />
      </section>
    </div>
  );
}
