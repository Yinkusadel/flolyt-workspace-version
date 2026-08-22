import { Link } from "react-router-dom";

import { Button } from "@/components/ui/button";
import { EYEBROW_CLASS } from "@/pages/everyday/lifecycle/data";
import { Callout } from "@/pages/everyday/lifecycle/stage/rail";
import { Chip } from "@/pages/everyday/lifecycle/stage/chip";
import { StageSubpageHeader } from "@/pages/everyday/lifecycle/stage/stage-subpage-header";
import { TM07_HERO, TM07_ROWS, TM_CHIP_TONE } from "@/pages/agents/ai-teammates/data";

const HEAD_CLASS = "px-4 py-2.5 font-mono text-[8.5px] font-medium tracking-[0.8px] text-ink-4 uppercase";

/** TM07 — /ai-teammates/orchestrator. */
const OrchestratorRoute = () => {
  return (
    <div className="space-y-8">
      <StageSubpageHeader
        crumbs={[{ label: "AI teammates", to: "/ai-teammates" }, { label: "Orchestrator" }]}
        title="Orchestrator"
        subtitle="Four conflicts named, none resolved, nothing ever proposed"
        action={
          <Button asChild type="button">
            <Link to="/ai-teammates/conflicts">See the conflicts</Link>
          </Button>
        }
      />

      <div className="relative overflow-hidden rounded-card border border-ultra-border bg-ultra-bg p-5">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div>
            <p className="font-mono text-[8.5px] font-medium tracking-[0.9px] text-ink-4 uppercase">{TM07_HERO.leftLabel}</p>
            <p className="mt-2 text-[26px] font-semibold text-ink">{TM07_HERO.leftBig}</p>
            <p className="mt-1.5 max-w-md text-[11px] text-ink-3">{TM07_HERO.sub}</p>
          </div>
          <div className="text-right">
            <p className="font-mono text-[8.5px] font-medium tracking-[0.9px] text-ink-4 uppercase">{TM07_HERO.rightLabel}</p>
            <p className="mt-2 text-[20px] font-semibold text-ink">{TM07_HERO.rightBig}</p>
            <p className="mt-1.5 font-mono text-[10px] font-semibold text-ultra">{TM07_HERO.rightSub}</p>
          </div>
        </div>
      </div>

      <section className="space-y-3">
        <p className={EYEBROW_CLASS}>What it does and what it is structurally unable to do</p>
        <div className="overflow-x-auto rounded-card border border-line bg-paper">
          <table className="w-full min-w-[760px] text-left text-[11.5px]">
            <thead>
              <tr className="border-b border-line bg-paper-2">
                <th className={HEAD_CLASS}>Action</th>
                <th className={`${HEAD_CLASS} text-right`}>Can it?</th>
                <th className={HEAD_CLASS}>Why</th>
                <th className={`${HEAD_CLASS} text-right`}>Where that shows up</th>
              </tr>
            </thead>
            <tbody>
              {TM07_ROWS.map((row) => (
                <tr key={row.action} className="border-b border-line last:border-0">
                  <td className="px-4 py-3 font-semibold text-ink">{row.action}</td>
                  <td className="px-4 py-3 text-right">
                    <Chip tone={TM_CHIP_TONE[row.canTone]}>{row.can}</Chip>
                  </td>
                  <td className="px-4 py-3 text-ink-3">{row.why}</td>
                  <td className="px-4 py-3 text-right text-ink-4">{row.where}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      <Callout tone="ultra" title="An arbitrator that can also propose is not an arbitrator">
        The Orchestrator is the only agent with a view across every disagreement in the workspace, which is exactly
        why it is the one agent that may not put forward an idea of its own. Give it a proposal and every conflict
        it raises afterwards is a conflict between two agents and one interested party.
      </Callout>

      <Callout tone="amber" title="It refused a split this morning and that is the closest it comes to acting">
        Repeat & Decay suggested sending wave three as two batches of 26,000 to fit under Ada's standing authority.
        The Orchestrator refused, because a limit that can be satisfied by reshaping the request is not a limit.
        Refusing something is available to it. Proposing the alternative is not, so wave three waits for Ada.
      </Callout>
    </div>
  );
};

export default OrchestratorRoute;
