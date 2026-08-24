import { Link } from "react-router-dom";

import { EYEBROW_CLASS } from "@/pages/everyday/lifecycle/data";
import { Callout } from "@/pages/everyday/lifecycle/stage/rail";
import { KpiCards } from "@/pages/everyday/lifecycle/stage/kpi-cards";
import { AgentCell } from "@/pages/agents/ai-teammates/agent-cell";
import { TeammatesTabs } from "@/pages/agents/ai-teammates/tabs";
import { TM11_ROWS, TM11_STATS, TM_KPI_TONE, TM_TONE_CLASS } from "@/pages/agents/ai-teammates/data";

const HEAD_CLASS = "px-4 py-2.5 font-mono text-[8.5px] font-medium tracking-[0.8px] text-ink-4 uppercase";

/** TM11 — /ai-teammates/cost. */
const CostRoute = () => {
  return (
    <div className="space-y-8">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <h1 className="text-[17px] font-semibold text-ink">What they cost</h1>
          <p className="mt-1 text-[11.5px] text-ink-3">₦7,400 this month across 412 runs · and why cost per finding is the wrong column</p>
        </div>
        <Link to="/plan-and-billing" className="text-[11.5px] font-semibold text-ultra hover:underline">
          See the budget
        </Link>
      </div>

      <TeammatesTabs active="What they cost" />

      <KpiCards items={TM11_STATS.map((s) => ({ eyebrow: s.eyebrow, value: s.value, note: s.note, tone: TM_KPI_TONE[s.tone] }))} />

      <section className="space-y-3">
        <p className={EYEBROW_CLASS}>By agent · runs, rows and naira</p>
        <div className="overflow-x-auto rounded-card border border-line bg-paper">
          <table className="w-full min-w-[820px] text-left text-[11.5px]">
            <thead>
              <tr className="border-b border-line bg-paper-2">
                <th className={HEAD_CLASS}>Agent</th>
                <th className={`${HEAD_CLASS} text-right`}>Runs</th>
                <th className={`${HEAD_CLASS} text-right`}>Rows read</th>
                <th className={`${HEAD_CLASS} text-right`}>Cost</th>
                <th className={`${HEAD_CLASS} text-right`}>Findings</th>
                <th className={`${HEAD_CLASS} text-right`}>Cost per finding</th>
              </tr>
            </thead>
            <tbody>
              {TM11_ROWS.map((row) => (
                <tr key={row.agent.initials} className="border-b border-line last:border-0">
                  <td className="px-4 py-3">
                    <AgentCell agent={row.agent} />
                  </td>
                  <td className="px-4 py-3 text-right font-mono text-ink-2">{row.runs}</td>
                  <td className="px-4 py-3 text-right font-mono text-ink-3">{row.rowsRead}</td>
                  <td className={`px-4 py-3 text-right font-mono ${TM_TONE_CLASS[row.costTone]}`}>{row.cost}</td>
                  <td className="px-4 py-3 text-right font-mono text-ink-2">{row.findings}</td>
                  <td className="px-4 py-3 text-right font-mono text-ink-4">{row.costPerFinding}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      <Callout tone="amber" title="Cost per finding is shown and is the most misleading column on this screen">
        Churn Reason looks like the best value in the workspace at ₦49 a finding, and every one of its seventeen
        findings has arrived at an empty field and done nothing. Repeat & Decay looks expensive and opened eleven
        rooms including the one that connected ₦1.08B. The column is here because somebody will compute it anyway,
        and it is better computed next to that sentence.
      </Callout>

      <Callout tone="ultra" title="₦7,400 a month is the entire compute cost of watching a ₦4.2 billion business">
        It is a rounding error against a single day of the fee change, and it is published because the alternative
        is nobody knowing what any of this costs until a budget conversation in which nobody has the figure.
        Governance holds the caps and what happens when one is reached.
      </Callout>
    </div>
  );
};

export default CostRoute;
