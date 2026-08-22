import { useState } from "react";
import { Link } from "react-router-dom";

import { Button } from "@/components/ui/button";
import { EYEBROW_CLASS } from "@/pages/everyday/lifecycle/data";
import { Callout } from "@/pages/everyday/lifecycle/stage/rail";
import { Chip } from "@/pages/everyday/lifecycle/stage/chip";
import { KpiCards } from "@/pages/everyday/lifecycle/stage/kpi-cards";
import { MarketplaceTabs } from "@/pages/agents/marketplace/tabs";
import { InstallModal } from "@/pages/agents/marketplace/modals/install-modal";
import { MK03_ROWS, MK03_STATS, MK_CHIP_TONE, MK_KPI_TONE, MK_TONE_CLASS } from "@/pages/agents/marketplace/data";

const HEAD_CLASS = "px-4 py-2.5 font-mono text-[8.5px] font-medium tracking-[0.8px] text-ink-4 uppercase";

/** MK03 — the default populated "Available" state. */
export function AvailableState() {
  const [installOpen, setInstallOpen] = useState(false);

  return (
    <div className="space-y-8">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <h1 className="text-[17px] font-semibold text-ink">Marketplace</h1>
          <p className="mt-1 text-[11.5px] text-ink-3">34 agents · 19 would work here · two cannot run and one is already built here</p>
        </div>
        <div className="flex shrink-0 flex-wrap items-center gap-2">
          <Link to="/settings/marketplace" className="text-[11.5px] font-semibold text-ink-3 hover:text-ink">
            Settings
          </Link>
          <Button asChild type="button" variant="outline" size="sm">
            <Link to="/marketplace/refused">What this is not</Link>
          </Button>
          <Button asChild type="button" size="sm">
            <Link to="/marketplace/retry-timing">See one</Link>
          </Button>
        </div>
      </div>

      <MarketplaceTabs active="Available" />

      <KpiCards items={MK03_STATS.map((s) => ({ eyebrow: s.eyebrow, value: s.value, note: s.note, tone: MK_KPI_TONE[s.tone] }))} />

      <section className="space-y-3">
        <p className={EYEBROW_CLASS}>Ordered by how many companies use them · which is a count of experience, not a result</p>
        <div className="overflow-x-auto rounded-card border border-line bg-paper">
          <table className="w-full min-w-[920px] text-left text-[11.5px]">
            <thead>
              <tr className="border-b border-line bg-paper-2">
                <th className={HEAD_CLASS}>Agent</th>
                <th className={HEAD_CLASS}>What it watches</th>
                <th className={`${HEAD_CLASS} text-right`}>Publisher</th>
                <th className={`${HEAD_CLASS} text-right`}>Companies</th>
                <th className={HEAD_CLASS}>What it needs here</th>
                <th className={`${HEAD_CLASS} text-right`}>Here</th>
              </tr>
            </thead>
            <tbody>
              {MK03_ROWS.map((row) => (
                <tr key={row.agent} className="border-b border-line last:border-0">
                  <td className="px-4 py-3 font-semibold text-ink">
                    {row.id ? (
                      <Link to={`/marketplace/${row.id}`} className="text-ultra hover:underline">
                        {row.agent}
                      </Link>
                    ) : (
                      row.agent
                    )}
                  </td>
                  <td className="px-4 py-3 text-ink-3">{row.watches}</td>
                  <td className={`px-4 py-3 text-right ${MK_TONE_CLASS[row.publisherTone]}`}>{row.publisher}</td>
                  <td className={`px-4 py-3 text-right font-mono ${MK_TONE_CLASS[row.companiesTone]}`}>{row.companies}</td>
                  <td className="px-4 py-3 text-ink-4">{row.needs}</td>
                  <td className="px-4 py-3 text-right">
                    <div className="flex items-center justify-end gap-2">
                      <Chip tone={MK_CHIP_TONE[row.hereTone]}>{row.here}</Chip>
                      {row.id && row.here === "would work" && (
                        <button
                          type="button"
                          onClick={() => setInstallOpen(true)}
                          className="shrink-0 text-[10.5px] font-semibold text-ink-3 hover:text-ink"
                        >
                          Install
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

      <Callout tone="amber" title="Two of the seven cannot run here and both fail on something this workspace already knows about">
        Referral attribution needs an event that was never built. Margin watch needs COGS, missing since 12
        January. Neither is a limitation of the agent, and the listing checks against your actual sources rather
        than letting you install something that would sit paused forever wondering why.
      </Callout>

      <Callout tone="ultra" title="Schema drift is marked duplicate rather than available">
        Sam built one in March that does the same thing and has produced six findings. The marketplace knows what
        is already running here and says so, because the failure mode of a marketplace is not bad agents — it is
        four agents watching the same table and three people wondering why the queue is noisy.
      </Callout>

      <InstallModal open={installOpen} onOpenChange={setInstallOpen} />
    </div>
  );
}
