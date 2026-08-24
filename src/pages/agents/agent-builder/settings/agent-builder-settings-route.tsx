import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { EYEBROW_CLASS } from "@/pages/everyday/lifecycle/data";
import { Callout } from "@/pages/everyday/lifecycle/stage/rail";
import { Chip } from "@/pages/everyday/lifecycle/stage/chip";
import { StageSubpageHeader } from "@/pages/everyday/lifecycle/stage/stage-subpage-header";
import { AgentBuilderKvList } from "@/pages/agents/agent-builder/kv-list";
import { AB15_INHERITS_KV, AB15_ROWS, AB_CHIP_TONE, AB_TONE_CLASS } from "@/pages/agents/agent-builder/data";

const HEAD_CLASS = "px-4 py-2.5 font-mono text-[8.5px] font-medium tracking-[0.8px] text-ink-4 uppercase";

/** AB15 — /settings/agent-builder, matching the /settings/governance and /settings/marketplace precedent. */
const AgentBuilderSettingsRoute = () => {
  return (
    <div className="space-y-8">
      <StageSubpageHeader
        crumbs={[{ label: "Agent Builder", to: "/agent-builder" }, { label: "Settings" }]}
        title="Builder settings"
        subtitle="Eleven rules · two are yours, six cannot be turned off, three can never be turned on"
        action={
          <Button type="button" onClick={() => toast.success("Settings saved")}>
            Save
          </Button>
        }
      />

      <div className="overflow-x-auto rounded-card border border-line bg-paper">
        <table className="w-full min-w-[860px] text-left text-[11.5px]">
          <thead>
            <tr className="border-b border-line bg-paper-2">
              <th className={HEAD_CLASS}>Rule</th>
              <th className={`${HEAD_CLASS} text-right`}>Currently</th>
              <th className={HEAD_CLASS}>Who set it</th>
              <th className={HEAD_CLASS}>Can you change it?</th>
              <th className={HEAD_CLASS}>State</th>
            </tr>
          </thead>
          <tbody>
            {AB15_ROWS.map((row) => (
              <tr key={row.rule} className="border-b border-line last:border-0">
                <td className="px-4 py-3 font-semibold text-ink-2">{row.rule}</td>
                <td className={`px-4 py-3 text-right font-mono ${AB_TONE_CLASS[row.currentlyTone]}`}>{row.currently}</td>
                <td className="px-4 py-3 text-ink-4">{row.who}</td>
                <td className="px-4 py-3">
                  <Chip tone={row.canChange ? "teal" : "rose"}>{row.canChange ? "yes" : "no"}</Chip>
                </td>
                <td className="px-4 py-3">
                  <Chip tone={AB_CHIP_TONE[row.stateTone]}>{row.state}</Chip>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <Callout tone="amber" title="The rule that a builder cannot activate their own agent is the one that gets questioned">
        It looks like bureaucracy on a two-table read costing ₦60 a month, and it is the only thing standing
        between this workspace and forty agents nobody remembers adding. The cost of the rule is four hours of
        Ifeoma waiting; the cost of not having it arrives slowly and is never attributed to anything.
      </Callout>

      <section className="space-y-3">
        <p className={EYEBROW_CLASS}>What a built agent inherits automatically</p>
        <AgentBuilderKvList rows={AB15_INHERITS_KV} />
      </section>
    </div>
  );
};

export default AgentBuilderSettingsRoute;
