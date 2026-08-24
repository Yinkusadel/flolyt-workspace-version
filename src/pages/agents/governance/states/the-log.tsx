import { Link } from "react-router-dom";

import { EYEBROW_CLASS } from "@/pages/everyday/lifecycle/data";
import { Callout } from "@/pages/everyday/lifecycle/stage/rail";
import { Chip } from "@/pages/everyday/lifecycle/stage/chip";
import { KpiCards } from "@/pages/everyday/lifecycle/stage/kpi-cards";
import { GovernanceTabs } from "@/pages/agents/governance/tabs";
import { GovernanceKvList } from "@/pages/agents/governance/kv-list";
import { GV03_ROWS, GV03_STATS, GV18_QUARTER, GV_CHIP_TONE, GV_KPI_TONE, GV_TONE_CLASS } from "@/pages/agents/governance/data";

const HEAD_CLASS = "px-4 py-2.5 font-mono text-[8.5px] font-medium tracking-[0.8px] text-ink-4 uppercase";

/** GV03 — the default populated "The log" state, with GV18's quarter summary folded in. */
export function TheLogState() {
  return (
    <div className="space-y-8">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <h1 className="text-[17px] font-semibold text-ink">Governance</h1>
          <p className="mt-1 text-[11.5px] text-ink-3">412,088 entries · 18 actions, all under a human identity · 0 under an agent's</p>
        </div>
        <div className="flex shrink-0 flex-wrap items-center gap-2">
          <Link to="/settings/governance" className="text-[11.5px] font-semibold text-ink-3 hover:text-ink">
            Settings
          </Link>
          <Link
            to="/governance/capability"
            className="inline-flex items-center rounded-control border border-line px-3 py-1.5 text-[11.5px] font-semibold text-ink hover:border-ink-4"
          >
            Can an agent act?
          </Link>
          <Link
            to="/governance/export"
            className="inline-flex items-center rounded-control bg-ink px-3 py-1.5 text-[11.5px] font-semibold text-white hover:opacity-90"
          >
            Export for an auditor
          </Link>
        </div>
      </div>

      <GovernanceTabs active="The log" />

      <KpiCards items={GV03_STATS.map((s) => ({ eyebrow: s.eyebrow, value: s.value, note: s.note, tone: GV_KPI_TONE[s.tone] }))} />

      <section className="space-y-3">
        <p className={EYEBROW_CLASS}>Today · newest first</p>
        <div className="overflow-x-auto rounded-card border border-line bg-paper">
          <table className="w-full min-w-[880px] text-left text-[11.5px]">
            <thead>
              <tr className="border-b border-line bg-paper-2">
                <th className={HEAD_CLASS}>Time</th>
                <th className={HEAD_CLASS}>Entry</th>
                <th className={`${HEAD_CLASS} text-right`}>Identity</th>
                <th className={`${HEAD_CLASS} text-right`}>Kind</th>
                <th className={`${HEAD_CLASS} text-right`}>Re-auth</th>
              </tr>
            </thead>
            <tbody>
              {GV03_ROWS.map((row) => (
                <tr key={row.time + row.entry} className="border-b border-line last:border-0">
                  <td className="px-4 py-3 font-mono text-ink-4">{row.time}</td>
                  <td className="px-4 py-3 font-semibold text-ink">
                    {row.id ? (
                      <Link to={`/governance/${row.id}`} className="text-ultra hover:underline">
                        {row.entry}
                      </Link>
                    ) : (
                      row.entry
                    )}
                  </td>
                  <td className={`px-4 py-3 text-right ${GV_TONE_CLASS[row.identityTone]}`}>{row.identity}</td>
                  <td className="px-4 py-3 text-right">
                    <Chip tone={GV_CHIP_TONE[row.kindTone]}>{row.kind}</Chip>
                  </td>
                  <td className="px-4 py-3 text-right">
                    <Chip tone={GV_CHIP_TONE[row.reauthTone]}>{row.reauth}</Chip>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      <Callout tone="ultra" title="Look at the two rows about the Kenya retry and the order they are in">
        The agent proposed at 07:58 with an audience and a holdout. Ravi approved and executed at 08:04 with a
        re-authentication. There is no third row, because there is no step in between where the thing became a
        send on its own. Every one of the eighteen sends in this workspace's history has that shape, and this
        screen is where somebody sceptical would go to check.
      </Callout>

      <Callout tone="teal" title="Four hundred and twelve thousand entries and eighteen of them are actions">
        Everything else is reading and stating. That ratio is the actual shape of what these agents do — they
        consume enormous amounts of data and produce a small number of sentences, and the only things that touched
        a customer were done by four named people who re-authenticated each time.
      </Callout>

      <section className="space-y-3">
        <p className={EYEBROW_CLASS}>This quarter, at a glance</p>
        <GovernanceKvList rows={GV18_QUARTER.map((q) => ({ label: q.label, value: `${q.value} · ${q.note}`, tone: q.tone }))} />
      </section>

      <Callout tone="amber" title="One review is overdue">
        Data Integrity has not been reviewed since March, twelve sources with the widest reach of any agent here.
        See <Link to="/governance/reviews" className="font-semibold text-ultra hover:underline">Reviews</Link> for
        the full schedule.
      </Callout>

      <p className="text-[10.5px] text-ink-4">The log cannot be edited, shortened or turned off by anybody.</p>
    </div>
  );
}
