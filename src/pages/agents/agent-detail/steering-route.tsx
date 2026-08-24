import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { PersonAvatar } from "@/components/person-avatar";
import { EYEBROW_CLASS } from "@/pages/everyday/lifecycle/data";
import { Callout } from "@/pages/everyday/lifecycle/stage/rail";
import { Chip } from "@/pages/everyday/lifecycle/stage/chip";
import { StageSubpageHeader } from "@/pages/everyday/lifecycle/stage/stage-subpage-header";
import { AN11_ROWS, AN_TONE_CLASS } from "@/pages/agents/agent-detail/data";

const HEAD_CLASS = "px-4 py-2.5 font-mono text-[8.5px] font-medium tracking-[0.8px] text-ink-4 uppercase";

const TEAM_SLOT: Record<string, 1 | 2 | 3 | 4> = {
  Finance: 1,
  Marketing: 2,
  Sales: 3,
  Product: 4,
};

/**
 * AN11 — /agent-detail/steering, "Steering history". Built as a standalone
 * page rather than under the "Runs" tab: the export's own an.py calls
 * subtabs(p, "Runs", TABS) here, but the content (redirects from people) has
 * nothing to do with AN07's run-history table, which already fully occupies
 * that tab. Same fix as [[figma_tab_mislabel_check]] established for
 * ai-teammates' TM12.
 */
const SteeringRoute = () => {
  return (
    <div className="space-y-8">
      <StageSubpageHeader
        crumbs={[{ label: "Repeat & Decay", to: "/agent-detail" }, { label: "Steering history" }]}
        title="Steering history"
        subtitle="Six redirects from four people · four changed nothing"
        action={
          <Button type="button" variant="outline" onClick={() => toast.info("Redirect sent to the live run")}>
            Redirect the live run
          </Button>
        }
      />

      <section className="space-y-3">
        <p className={EYEBROW_CLASS}>Every redirect this agent has received</p>
        <div className="overflow-x-auto rounded-card border border-line bg-paper">
          <table className="w-full min-w-[920px] text-left text-[11.5px]">
            <thead>
              <tr className="border-b border-line bg-paper-2">
                <th className={HEAD_CLASS}>When</th>
                <th className={HEAD_CLASS}>Who</th>
                <th className={HEAD_CLASS}>What they said</th>
                <th className={`${HEAD_CLASS} text-right`}>Effect on the number</th>
                <th className={`${HEAD_CLASS} text-right`}>Effect on the conclusion</th>
              </tr>
            </thead>
            <tbody>
              {AN11_ROWS.map((row) => (
                <tr key={row.when + row.said} className="border-b border-line last:border-0">
                  <td className="px-4 py-3 font-mono text-ink-4">{row.when}</td>
                  <td className="px-4 py-3">
                    <span className="flex items-center gap-2">
                      <PersonAvatar kind="human" initials={row.initials} team={TEAM_SLOT[row.team] ?? 1} size="sm" />
                      <span className="text-ink-3">{row.name}</span>
                    </span>
                  </td>
                  <td className="px-4 py-3 text-ink-2">{row.said}</td>
                  <td className={`px-4 py-3 text-right font-mono ${AN_TONE_CLASS[row.effectOnNumberTone]}`}>{row.effectOnNumber}</td>
                  <td className="px-4 py-3 text-right">
                    <Chip tone={row.effectOnConclusionTone === "risk" ? "rose" : row.effectOnConclusionTone === "ok" ? "teal" : row.effectOnConclusionTone === "warn" ? "amber" : "neutral"}>
                      {row.effectOnConclusion}
                    </Chip>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      <Callout tone="ultra" title="Two redirects out of six changed what the agent concluded, and both came from people who knew something it did not">
        Ifeoma knew Ghana had not received the release. Zainab knew the Android checkout differed. Neither fact
        was in any table this agent reads. The other four corrected numbers and left the argument standing,
        which is roughly the ratio you would want and is only visible because the record is kept per agent
        rather than per person.
      </Callout>

      <Callout tone="teal" title="The record lives on the agent and not on the people who steered it">
        Nothing here rolls up into anything about Ravi, Ifeoma, Tunde or Zainab. It exists so somebody deciding
        whether to trust this agent's next conclusion can see how it responds to correction, which is a property
        of the agent. Recognition is where people's judgement is recorded, and it works differently.
      </Callout>
    </div>
  );
};

export default SteeringRoute;
