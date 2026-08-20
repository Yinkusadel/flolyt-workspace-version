import { Link } from "react-router-dom";

import { Button } from "@/components/ui/button";
import { EYEBROW_CLASS } from "@/pages/everyday/lifecycle/data";
import { Callout } from "@/pages/everyday/lifecycle/stage/rail";
import { Chip } from "@/pages/everyday/lifecycle/stage/chip";
import { KpiCards } from "@/pages/everyday/lifecycle/stage/kpi-cards";
import { AttributionKvList } from "@/pages/revenue/attribution/kv-list";
import { AttributionTabs } from "@/pages/revenue/attribution/tabs";
import { AT03_REFUSE_KV, AT03_ROWS, AT03_STATS, AT_CHIP_TONE, AT_KPI_TONE, AT_TONE_CLASS } from "@/pages/revenue/attribution/data";

const HEAD_CLASS = "px-4 py-2.5 font-mono text-[8.5px] font-medium tracking-[0.8px] text-ink-4 uppercase";

/** AT03 — the default populated "Attributed" board state. */
export function TheBoardState() {
  return (
    <div className="space-y-8">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <h1 className="text-[17px] font-semibold text-ink">Attribution</h1>
          <p className="mt-1 text-[11.5px] text-ink-3">₦93M on holdouts · ₦297M on weaker evidence · ₦21M that cannot be attributed at all</p>
        </div>
        <Button asChild type="button" size="sm">
          <Link to="/attribution/holdouts/new">Design a holdout</Link>
        </Button>
      </div>

      <AttributionTabs active="Attributed" />

      <KpiCards items={AT03_STATS.map((s) => ({ eyebrow: s.eyebrow, value: s.value, note: s.note, tone: AT_KPI_TONE[s.tone] }))} />

      <section className="space-y-3">
        <p className={EYEBROW_CLASS}>What has been credited, to what, and on what evidence</p>
        <div className="overflow-x-auto rounded-card border border-line bg-paper">
          <table className="w-full min-w-[900px] text-left text-[11.5px]">
            <thead>
              <tr className="border-b border-line bg-paper-2">
                <th className={HEAD_CLASS}>What was done</th>
                <th className={HEAD_CLASS}>Credited to</th>
                <th className={`${HEAD_CLASS} text-right`}>Amount</th>
                <th className={HEAD_CLASS}>Method</th>
                <th className={`${HEAD_CLASS} text-right`}>Strength</th>
                <th className={HEAD_CLASS}>Signed</th>
              </tr>
            </thead>
            <tbody>
              {AT03_ROWS.map((row) => (
                <tr key={row.whatWasDone} className="border-b border-line last:border-0">
                  <td className="px-4 py-3 font-semibold text-ink">{row.whatWasDone}</td>
                  <td className="px-4 py-3 text-ink-2">{row.creditedTo}</td>
                  <td className={`px-4 py-3 text-right font-mono ${AT_TONE_CLASS[row.amountTone]}`}>{row.amount}</td>
                  <td className="px-4 py-3 text-ink-3">{row.method}</td>
                  <td className="px-4 py-3 text-right">
                    <Chip tone={AT_CHIP_TONE[row.strengthTone]}>{row.strength}</Chip>
                  </td>
                  <td className="px-4 py-3 text-ink-4">{row.signed}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      <Callout tone="rose" title="Seven naira in every ten credited here rest on the weakest method available">
        ₦297M of ₦411M was measured by comparing before with after, which cannot separate the intervention from
        anything else that happened in the same weeks — including the 4 March release, which was running through
        all of it. The figure is not withdrawn and it is not promoted. It sits in the same table as the ₦93M that
        came off real holdouts, with a different chip and a different colour, so nobody has to remember which was
        which.
      </Callout>

      <section className="space-y-3">
        <p className={EYEBROW_CLASS}>What this board refuses to do</p>
        <AttributionKvList rows={AT03_REFUSE_KV} />
      </section>
    </div>
  );
}
