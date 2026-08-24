import { Link } from "react-router-dom";

import { Button } from "@/components/ui/button";
import { EYEBROW_CLASS } from "@/pages/everyday/lifecycle/data";
import { Callout } from "@/pages/everyday/lifecycle/stage/rail";
import { StageSubpageHeader } from "@/pages/everyday/lifecycle/stage/stage-subpage-header";
import { AgentCell } from "@/pages/agents/ai-teammates/agent-cell";
import { TM12_ROWS, TM_TONE_CLASS } from "@/pages/agents/ai-teammates/data";

const HEAD_CLASS = "px-4 py-2.5 font-mono text-[8.5px] font-medium tracking-[0.8px] text-ink-4 uppercase";

/** TM12 — /ai-teammates/record. Standalone page, not a tab: the export's own subtabs() call on this screen highlighted "The roster" while showing unrelated content, which read as broken rather than intentional — see docs/build-tracker.md. Grounded in a breadcrumb instead, same as Orchestrator/Boundary/Steering/Advocate. */
const RecordRoute = () => {
  return (
    <div className="space-y-8">
      <StageSubpageHeader
        crumbs={[{ label: "AI teammates", to: "/ai-teammates" }, { label: "Their record" }]}
        title="Their record"
        subtitle="88 claims · 7 tested · 1 did not hold · and no accuracy score anywhere"
        action={
          <Button asChild type="button">
            <Link to="/experiments/new">Design an experiment</Link>
          </Button>
        }
      />

      <section className="space-y-3">
        <p className={EYEBROW_CLASS}>How often each agent's claims survived being tested</p>
        <div className="overflow-x-auto rounded-card border border-line bg-paper">
          <table className="w-full min-w-[820px] text-left text-[11.5px]">
            <thead>
              <tr className="border-b border-line bg-paper-2">
                <th className={HEAD_CLASS}>Agent</th>
                <th className={`${HEAD_CLASS} text-right`}>Claims</th>
                <th className={`${HEAD_CLASS} text-right`}>Tested against a holdout</th>
                <th className={`${HEAD_CLASS} text-right`}>Held</th>
                <th className={`${HEAD_CLASS} text-right`}>Did not hold</th>
                <th className={`${HEAD_CLASS} text-right`}>Never tested</th>
              </tr>
            </thead>
            <tbody>
              {TM12_ROWS.map((row) => (
                <tr key={row.agent.initials} className="border-b border-line last:border-0">
                  <td className="px-4 py-3">
                    <AgentCell agent={row.agent} />
                  </td>
                  <td className="px-4 py-3 text-right font-mono text-ink-2">{row.claims}</td>
                  <td className="px-4 py-3 text-right font-mono text-ink-3">{row.tested}</td>
                  <td className={`px-4 py-3 text-right font-mono ${TM_TONE_CLASS[row.heldTone]}`}>{row.held}</td>
                  <td className="px-4 py-3 text-right font-mono text-amber">{row.didNotHold}</td>
                  <td className={`px-4 py-3 text-right font-mono ${TM_TONE_CLASS[row.neverTestedTone]}`}>{row.neverTested}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      <Callout tone="rose" title="Eighty-one of eighty-eight claims have never been tested against anything">
        Seven holdouts in seven months, across twelve agents. The agents are not unreliable and are not proven
        reliable either — most of what they say has simply never been checked, which is a fact about how much
        testing this company does rather than about the agents. There is no accuracy score anywhere in this section
        for that reason.
      </Callout>

      <Callout tone="ultra" title="Repeat & Decay has the only claim that did not hold, and it is the most trusted agent here">
        It said day-of-week affected reactivation. Wave one ran across every day and it did not. That one wrong
        claim is the only entry in the did-not-hold column in the whole workspace, and it belongs to the agent with
        the strongest record — because it is the only agent whose claims get tested often enough to be wrong in
        public.
      </Callout>
    </div>
  );
};

export default RecordRoute;
