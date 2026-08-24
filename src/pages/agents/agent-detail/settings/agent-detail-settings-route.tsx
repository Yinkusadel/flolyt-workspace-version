import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { EYEBROW_CLASS } from "@/pages/everyday/lifecycle/data";
import { Callout } from "@/pages/everyday/lifecycle/stage/rail";
import { Chip } from "@/pages/everyday/lifecycle/stage/chip";
import { StageSubpageHeader } from "@/pages/everyday/lifecycle/stage/stage-subpage-header";
import { AgentDetailKvList } from "@/pages/agents/agent-detail/kv-list";
import { AN15_COST_KV, AN15_ROWS, AN_CHIP_TONE, AN_TONE_CLASS } from "@/pages/agents/agent-detail/data";

const HEAD_CLASS = "px-4 py-2.5 font-mono text-[8.5px] font-medium tracking-[0.8px] text-ink-4 uppercase";

/** AN15 — /settings/agent-detail, matching the /settings/governance and /settings/agent-builder precedent. */
const AgentDetailSettingsRoute = () => {
  return (
    <div className="space-y-8">
      <StageSubpageHeader
        crumbs={[{ label: "Repeat & Decay", to: "/agent-detail" }, { label: "Settings" }]}
        title="Repeat & Decay · settings"
        subtitle="Eleven rules · five are yours, three cannot be turned off, three can never be turned on"
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
            {AN15_ROWS.map((row) => (
              <tr key={row.rule} className="border-b border-line last:border-0">
                <td className="px-4 py-3 font-semibold text-ink-2">{row.rule}</td>
                <td className={`px-4 py-3 text-right font-mono ${AN_TONE_CLASS[row.currentlyTone]}`}>{row.currently}</td>
                <td className="px-4 py-3 text-ink-4">{row.who}</td>
                <td className="px-4 py-3">
                  <Chip tone={row.canChange ? "teal" : "rose"}>{row.canChange ? "yes" : "no"}</Chip>
                </td>
                <td className="px-4 py-3">
                  <Chip tone={AN_CHIP_TONE[row.stateTone]}>{row.state}</Chip>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <Callout tone="amber" title="Changing where findings route is the setting with the most effect and the least ceremony">
        One of these five conditions routes nowhere and fires on 14 September. Pointing it at a person takes a
        second, needs no approval, and is the difference between the Ghana release being caught and repeating
        what happened in Kenya in June. It sits in a settings table because that is where it lives, not because
        it is minor.
      </Callout>

      <section className="space-y-3">
        <p className={EYEBROW_CLASS}>What this agent costs and what that buys</p>
        <AgentDetailKvList rows={AN15_COST_KV} />
      </section>
    </div>
  );
};

export default AgentDetailSettingsRoute;
