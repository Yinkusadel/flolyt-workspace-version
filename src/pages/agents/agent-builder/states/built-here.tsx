import { Link } from "react-router-dom";

import { PersonAvatar } from "@/components/person-avatar";
import { EYEBROW_CLASS } from "@/pages/everyday/lifecycle/data";
import { Callout } from "@/pages/everyday/lifecycle/stage/rail";
import { Chip } from "@/pages/everyday/lifecycle/stage/chip";
import { KpiCards } from "@/pages/everyday/lifecycle/stage/kpi-cards";
import { Button } from "@/components/ui/button";
import { AgentBuilderTabs } from "@/pages/agents/agent-builder/tabs";
import { AB03_ROWS, AB03_STATS, AB16_WAITING_FOR_YOU, AB_CHIP_TONE, AB_KPI_TONE, AB_TONE_CLASS } from "@/pages/agents/agent-builder/data";

const HEAD_CLASS = "px-4 py-2.5 font-mono text-[8.5px] font-medium tracking-[0.8px] text-ink-4 uppercase";

const TEAM_SLOT: Record<string, 1 | 2 | 3 | 4> = {
  Engineering: 1,
  Marketing: 2,
  "Customer Success": 3,
};

/** AB03 — the default populated "Built here" state, with AB16's "waiting for you" highlight folded in. */
export function BuiltHereState() {
  return (
    <div className="space-y-8">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <h1 className="text-[17px] font-semibold text-ink">Agent Builder</h1>
          <p className="mt-1 text-[11.5px] text-ink-3">Four built by three people · one active, one waiting, two retired with reasons</p>
        </div>
        <div className="flex shrink-0 flex-wrap items-center gap-2">
          <Link to="/settings/agent-builder" className="text-[11.5px] font-semibold text-ink-3 hover:text-ink">
            Settings
          </Link>
          <Button asChild type="button">
            <Link to="/agent-builder/new">Build an agent</Link>
          </Button>
        </div>
      </div>

      <AgentBuilderTabs active="Built here" />

      <Link
        to="/agent-builder/waiting-for-approval"
        className="block rounded-card border border-amber-border bg-amber-bg p-4 transition-colors hover:border-amber"
      >
        <p className="font-mono text-[8.5px] font-medium tracking-[0.85px] text-amber uppercase">Waiting for you</p>
        <p className="mt-1.5 text-[13px] font-semibold text-ink">{AB16_WAITING_FOR_YOU.agent}</p>
        <p className="mt-1 font-mono text-[10.5px] font-semibold text-amber">{AB16_WAITING_FOR_YOU.note}</p>
      </Link>

      <KpiCards items={AB03_STATS.map((s) => ({ eyebrow: s.eyebrow, value: s.value, note: s.note, tone: AB_KPI_TONE[s.tone] }))} />

      <section className="space-y-3">
        <p className={EYEBROW_CLASS}>Everything built in this workspace</p>
        <div className="overflow-x-auto rounded-card border border-line bg-paper">
          <table className="w-full min-w-[920px] text-left text-[11.5px]">
            <thead>
              <tr className="border-b border-line bg-paper-2">
                <th className={HEAD_CLASS}>Agent</th>
                <th className={HEAD_CLASS}>Built by</th>
                <th className={`${HEAD_CLASS} text-right`}>Built</th>
                <th className={HEAD_CLASS}>What it watches</th>
                <th className={`${HEAD_CLASS} text-right`}>Findings</th>
                <th className={`${HEAD_CLASS} text-right`}>State</th>
              </tr>
            </thead>
            <tbody>
              {AB03_ROWS.map((row) => (
                <tr key={row.agent} className="border-b border-line last:border-0">
                  <td className="px-4 py-3 font-semibold text-ink">
                    {row.id ? (
                      <Link to={`/agent-builder/${row.id}`} className="text-ultra hover:underline">
                        {row.agent}
                      </Link>
                    ) : (
                      row.agent
                    )}
                  </td>
                  <td className="px-4 py-3">
                    <span className="flex items-center gap-2">
                      <PersonAvatar kind="human" initials={row.builderInitials} team={TEAM_SLOT[row.builderTeam] ?? 1} size="sm" />
                      <span className="text-ink-3">{row.builderName}</span>
                    </span>
                  </td>
                  <td className="px-4 py-3 text-right text-ink-4">{row.built}</td>
                  <td className="px-4 py-3 text-ink-3">{row.watches}</td>
                  <td className={`px-4 py-3 text-right font-mono ${AB_TONE_CLASS[row.findingsTone]}`}>{row.findings}</td>
                  <td className="px-4 py-3 text-right">
                    <Chip tone={AB_CHIP_TONE[row.stateTone]}>{row.state}</Chip>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      <Callout tone="ultra" title="Two of four were retired and both for the same reason, which was not that they were bad">
        Weekend Watch could never produce a finding, because push frequency is a global setting and there is
        nothing to compare against. Reseller Terms produced two findings and became unnecessary when the terms
        were written into business memory. Neither was a mistake to build; both are retired with the reason
        attached and readable.
      </Callout>

      <Callout tone="teal" title="The only person here who is an engineer built the least interesting one">
        Sam built a source monitor, which is what an engineer builds. Ifeoma and Kunle built agents about their
        own work — a release pattern and a payment habit — and neither could have written a query for either. The
        builder is aimed at the second kind of person, and three of the four were built by them.
      </Callout>
    </div>
  );
}
