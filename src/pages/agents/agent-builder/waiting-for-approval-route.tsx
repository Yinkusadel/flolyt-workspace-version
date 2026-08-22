import { useState } from "react";

import { Button } from "@/components/ui/button";
import { EYEBROW_CLASS } from "@/pages/everyday/lifecycle/data";
import { Callout } from "@/pages/everyday/lifecycle/stage/rail";
import { Chip } from "@/pages/everyday/lifecycle/stage/chip";
import { KpiCards } from "@/pages/everyday/lifecycle/stage/kpi-cards";
import { AgentBuilderTabs } from "@/pages/agents/agent-builder/tabs";
import { ActivateModal } from "@/pages/agents/agent-builder/modals/activate-modal";
import { AB11_ROWS, AB11_STATS, AB_KPI_TONE } from "@/pages/agents/agent-builder/data";

const HEAD_CLASS = "px-4 py-2.5 font-mono text-[8.5px] font-medium tracking-[0.8px] text-ink-4 uppercase";

/** AB11 — /agent-builder/waiting-for-approval. */
const WaitingForApprovalRoute = () => {
  const [activateOpen, setActivateOpen] = useState(false);

  return (
    <div className="space-y-8">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <h1 className="text-[17px] font-semibold text-ink">Waiting for approval</h1>
          <p className="mt-1 text-[11.5px] text-ink-3">One agent, four hours, ₦60 a month · and the person who built it cannot activate it</p>
        </div>
        <Button type="button" onClick={() => setActivateOpen(true)}>
          Activate
        </Button>
      </div>

      <AgentBuilderTabs active="Waiting for approval" />

      <KpiCards items={AB11_STATS.map((s) => ({ eyebrow: s.eyebrow, value: s.value, note: s.note, tone: AB_KPI_TONE[s.tone] }))} />

      <section className="space-y-3">
        <p className={EYEBROW_CLASS}>What Ada is being asked to approve</p>
        <div className="overflow-x-auto rounded-card border border-line bg-paper">
          <table className="w-full min-w-[720px] text-left text-[11.5px]">
            <thead>
              <tr className="border-b border-line bg-paper-2">
                <th className={HEAD_CLASS}>What activation grants</th>
                <th className={HEAD_CLASS}>Detail</th>
                <th className={`${HEAD_CLASS} text-right`}>Reversible?</th>
              </tr>
            </thead>
            <tbody>
              {AB11_ROWS.map((row) => (
                <tr key={row.grants} className="border-b border-line last:border-0">
                  <td className="px-4 py-3 font-semibold text-ink">{row.grants}</td>
                  <td className="px-4 py-3 text-ink-3">{row.detail}</td>
                  <td className="px-4 py-3 text-right">
                    <Chip tone={row.reversibleTone === "muted" ? "neutral" : "teal"}>{row.reversible}</Chip>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      <Callout tone="ultra" title="Everything about this is reversible and the approval is still required">
        Nothing here is dangerous — two read-only tables and ₦60 a month. The approval exists because activation
        is the moment an agent starts putting things in front of a person, and the number of agents quietly
        filling somebody's queue is exactly the kind of thing that grows without anybody deciding it should.
      </Callout>

      <Callout tone="amber" title="Ifeoma built it and cannot activate her own agent">
        She owns Retain, she chose herself as the destination, and she still cannot switch it on. The person who
        benefits from an agent is the worst person to judge whether the workspace needs another one, and the four
        hours she has waited is the visible cost of that being true.
      </Callout>

      <ActivateModal open={activateOpen} onOpenChange={setActivateOpen} />
    </div>
  );
};

export default WaitingForApprovalRoute;
