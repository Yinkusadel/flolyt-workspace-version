import { useState } from "react";

import { Button } from "@/components/ui/button";
import { EYEBROW_CLASS } from "@/pages/everyday/lifecycle/data";
import { Callout } from "@/pages/everyday/lifecycle/stage/rail";
import { Chip } from "@/pages/everyday/lifecycle/stage/chip";
import { KpiCards } from "@/pages/everyday/lifecycle/stage/kpi-cards";
import { AddASignalModal } from "@/pages/customers/customer-health/modals/add-a-signal-modal";
import { HealthTabs } from "@/pages/customers/customer-health/tabs";
import { HL03_SIGNAL_ROWS, HL03_STATS, HL_CHIP_TONE, HL_KPI_TONE, HL_TONE_CLASS } from "@/pages/customers/customer-health/data";

const HEAD_CLASS = "px-4 py-2.5 font-mono text-[8.5px] font-medium tracking-[0.8px] text-ink-4 uppercase";

/** HL03 — /customer-health, the default populated "Signals" tab. */
export function AllSignalsState() {
  const [modalOpen, setModalOpen] = useState(false);

  return (
    <div className="space-y-8">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <h1 className="text-[17px] font-semibold text-ink">Customer health</h1>
          <p className="mt-1 text-[11.5px] text-ink-3">Six signals · five reading · one causal</p>
        </div>
        <Button type="button" onClick={() => setModalOpen(true)}>
          Add a signal
        </Button>
      </div>

      <HealthTabs active="Signals" />

      <KpiCards items={HL03_STATS.map((s) => ({ eyebrow: s.eyebrow, value: s.value, note: s.note, tone: HL_KPI_TONE[s.tone] }))} />

      <section className="space-y-3">
        <p className={EYEBROW_CLASS}>Every signal, what it predicts, and how strongly</p>
        <div className="overflow-x-auto rounded-card border border-line bg-paper">
          <table className="w-full min-w-[920px] text-left text-[11.5px]">
            <thead>
              <tr className="border-b border-line bg-paper-2">
                <th className={HEAD_CLASS}>Signal</th>
                <th className={HEAD_CLASS}>Predicts</th>
                <th className={`${HEAD_CLASS} text-right`}>Effect</th>
                <th className={`${HEAD_CLASS} text-right`}>Claim type</th>
                <th className={`${HEAD_CLASS} text-right`}>Covers</th>
                <th className={`${HEAD_CLASS} text-right`}>Owner of the stage</th>
              </tr>
            </thead>
            <tbody>
              {HL03_SIGNAL_ROWS.map((row) => (
                <tr key={row.signal} className="border-b border-line last:border-0">
                  <td className="px-4 py-3 font-semibold text-ink-2">{row.signal}</td>
                  <td className="px-4 py-3 text-ink-3">{row.predicts}</td>
                  <td className={`px-4 py-3 text-right font-mono ${HL_TONE_CLASS[row.effectTone]}`}>{row.effect}</td>
                  <td className="px-4 py-3 text-right">
                    <Chip tone={HL_CHIP_TONE[row.claimTypeTone]}>{row.claimType}</Chip>
                  </td>
                  <td className={`px-4 py-3 text-right font-mono ${HL_TONE_CLASS[row.coversTone]}`}>{row.covers}</td>
                  <td className={`px-4 py-3 text-right ${HL_TONE_CLASS[row.ownerTone]}`}>{row.owner}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      <Callout tone="rose" title="The two strongest signals belong to stages with no owner and the only causal one is the smallest">
        Feature depth at 43 points and referral, which cannot be read at all, both sit under stages nobody owns. The
        single causal signal here covers 612,000 people and came from a nine-day holdout on card retries. Strength
        of evidence and size of opportunity are running in opposite directions, and no ranking on this screen
        combines them.
      </Callout>

      <Callout tone="amber" title="Discount dependence reads Unavailable rather than weak">
        It could be given a number today by predicting churn, and churn is not what it is for — it predicts margin,
        and margin has had no source since 12 January. Producing a churn figure for it would answer a question
        nobody asked with a signal that was built for a different one.
      </Callout>

      <AddASignalModal open={modalOpen} onOpenChange={setModalOpen} />
    </div>
  );
}
