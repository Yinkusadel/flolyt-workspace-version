import { useState } from "react";
import { toast } from "sonner";
import { Link } from "react-router-dom";

import { Button } from "@/components/ui/button";
import { EYEBROW_CLASS } from "@/pages/everyday/lifecycle/data";
import { Callout } from "@/pages/everyday/lifecycle/stage/rail";
import { Chip } from "@/pages/everyday/lifecycle/stage/chip";
import { KpiCards } from "@/pages/everyday/lifecycle/stage/kpi-cards";
import { AgentCell } from "@/pages/agents/ai-teammates/agent-cell";
import { TeammatesTabs } from "@/pages/agents/ai-teammates/tabs";
import { PauseAgentModal } from "@/pages/agents/ai-teammates/modals/pause-agent-modal";
import { PR, RD, TM03_ROWS, TM03_STATS, TM_CHIP_TONE, TM_KPI_TONE, TM_TONE_CLASS } from "@/pages/agents/ai-teammates/data";

const HEAD_CLASS = "px-4 py-2.5 font-mono text-[8.5px] font-medium tracking-[0.8px] text-ink-4 uppercase";

/** TM03 — the default populated "roster" state. */
export function TheRosterState() {
  const [pauseOpen, setPauseOpen] = useState(false);

  return (
    <div className="space-y-8">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <h1 className="text-[17px] font-semibold text-ink">AI Teammates</h1>
          <p className="mt-1 text-[11.5px] text-ink-3">Twelve agents · 141 findings · two of them have opened no rooms in 214 days</p>
        </div>
        <div className="flex shrink-0 flex-wrap items-center gap-3">
          <Link to="/settings/ai-teammates" className="text-[11.5px] font-semibold text-ink-3 hover:text-ink">
            Settings
          </Link>
          <Button asChild type="button" variant="outline" size="sm">
            <Link to="/ai-teammates/record">See their record</Link>
          </Button>
          <Button type="button" size="sm" onClick={() => toast.info("Opening the agent builder")}>
            Add an agent
          </Button>
        </div>
      </div>

      <TeammatesTabs active="The roster" />

      <KpiCards items={TM03_STATS.map((s) => ({ eyebrow: s.eyebrow, value: s.value, note: s.note, tone: TM_KPI_TONE[s.tone] }))} />

      <section className="space-y-3">
        <p className={EYEBROW_CLASS}>The twelve</p>
        <div className="overflow-x-auto rounded-card border border-line bg-paper">
          <table className="w-full min-w-[880px] text-left text-[11.5px]">
            <thead>
              <tr className="border-b border-line bg-paper-2">
                <th className={HEAD_CLASS}>Agent</th>
                <th className={HEAD_CLASS}>What it watches</th>
                <th className={`${HEAD_CLASS} text-right`}>Role</th>
                <th className={`${HEAD_CLASS} text-right`}>Findings</th>
                <th className={`${HEAD_CLASS} text-right`}>Rooms opened</th>
                <th className={HEAD_CLASS}>State</th>
              </tr>
            </thead>
            <tbody>
              {TM03_ROWS.map((row) => (
                <tr key={row.agent.initials} className="border-b border-line last:border-0">
                  <td className="px-4 py-3">
                    <AgentCell agent={row.agent} href={row.agent.initials === RD.initials ? "/agent-detail" : undefined} />
                  </td>
                  <td className="px-4 py-3 text-ink-3">{row.watches}</td>
                  <td className="px-4 py-3 text-right text-ink-4">{row.role}</td>
                  <td className={`px-4 py-3 text-right font-mono ${TM_TONE_CLASS[row.findingsTone]}`}>{row.findings}</td>
                  <td className={`px-4 py-3 text-right font-mono ${TM_TONE_CLASS[row.roomsTone]}`}>{row.rooms}</td>
                  <td className="px-4 py-3">
                    <div className="flex items-center justify-between gap-2">
                      <Chip tone={TM_CHIP_TONE[row.stateTone]}>{row.state}</Chip>
                      {row.agent.initials === PR.initials && (
                        <button
                          type="button"
                          onClick={() => setPauseOpen(true)}
                          className="shrink-0 text-[10.5px] font-semibold text-ink-3 hover:text-ink"
                        >
                          Pause
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      <Callout tone="rose" title="Two agents have produced thirty-six findings between them and opened no rooms at all">
        Product Reason and Churn Reason are working correctly, ranking correctly and routing correctly to the
        owners of Adopt and Churn, who do not exist. Nothing in this table is broken. Thirty-six findings have
        arrived at two empty fields over 214 days, and no agent escalates, reassigns or gives up.
      </Callout>

      <Callout tone="amber" title="Expansion and Data Integrity are on the roster and not on this screen">
        Both are running and neither has produced a finding this quarter, so they sit below the ten shown.
        Advocate has no agent at all — there is nothing instrumented for one to read, so the coverage screen has a
        row that reads nobody rather than an agent that reads nothing.
      </Callout>

      <PauseAgentModal open={pauseOpen} onOpenChange={setPauseOpen} />
    </div>
  );
}
