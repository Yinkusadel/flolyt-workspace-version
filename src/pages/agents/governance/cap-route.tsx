import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { EYEBROW_CLASS } from "@/pages/everyday/lifecycle/data";
import { Callout } from "@/pages/everyday/lifecycle/stage/rail";
import { StageSubpageHeader } from "@/pages/everyday/lifecycle/stage/stage-subpage-header";
import { GovernanceKvList } from "@/pages/agents/governance/kv-list";
import { GV10_KV, GV10_ROWS, GV_TONE_CLASS } from "@/pages/agents/governance/data";

const HEAD_CLASS = "px-4 py-2.5 font-mono text-[8.5px] font-medium tracking-[0.8px] text-ink-4 uppercase";

/** GV10 — /governance/cap. */
const CapRoute = () => {
  return (
    <div className="space-y-8">
      <StageSubpageHeader
        crumbs={[{ label: "Governance", to: "/governance/spend" }, { label: "What happens at the cap" }]}
        title="What happens at the cap"
        subtitle="An order written in March · two agents that never stop · it has never happened"
        action={
          <Button type="button" variant="outline" onClick={() => toast.success("Pause order updated")}>
            Change the order
          </Button>
        }
      />

      <section className="space-y-3">
        <p className={EYEBROW_CLASS}>The order agents stop in, decided in advance rather than at the moment</p>
        <div className="overflow-x-auto rounded-card border border-line bg-paper">
          <table className="w-full min-w-[820px] text-left text-[11.5px]">
            <thead>
              <tr className="border-b border-line bg-paper-2">
                <th className={HEAD_CLASS}>Order</th>
                <th className={HEAD_CLASS}>Agent</th>
                <th className={HEAD_CLASS}>Why here</th>
                <th className={`${HEAD_CLASS} text-right`}>What stops being watched</th>
                <th className={`${HEAD_CLASS} text-right`}>Who is told</th>
              </tr>
            </thead>
            <tbody>
              {GV10_ROWS.map((row) => (
                <tr key={row.agent} className="border-b border-line last:border-0">
                  <td className="px-4 py-3 font-mono text-ink-4">{row.order}</td>
                  <td className="px-4 py-3 font-semibold text-ink">{row.agent}</td>
                  <td className="px-4 py-3 text-ink-3">{row.why}</td>
                  <td className={`px-4 py-3 text-right ${GV_TONE_CLASS[row.stopsTone]}`}>{row.stops}</td>
                  <td className="px-4 py-3 text-right text-ink-4">{row.told}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      <Callout tone="ultra" title="The order was written in March, when nothing was near the cap, and that is the point">
        Deciding which agents to stop while watching a budget run out produces a different answer from deciding it
        calmly in advance. Two agents never stop: the one that would tell you a source had failed, and the one
        watching payments fail today. Everything else has a place in the queue and Ada wrote it.
      </Callout>

      <section className="space-y-3">
        <p className={EYEBROW_CLASS}>What happens at 100% of the budget</p>
        <GovernanceKvList rows={GV10_KV} />
      </section>

      <Callout tone="amber" title="An agent paused by a budget must not look like an agent paused by a broken source">
        Both produce Unavailable on a stage screen, and they mean completely different things — one is a data
        problem somebody should fix, the other is a decision this company made about money. The pause reason
        travels with the state onto every screen that shows it.
      </Callout>
    </div>
  );
};

export default CapRoute;
