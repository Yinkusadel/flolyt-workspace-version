import { useState } from "react";

import { Button } from "@/components/ui/button";
import { EYEBROW_CLASS } from "@/pages/everyday/lifecycle/data";
import { Callout } from "@/pages/everyday/lifecycle/stage/rail";
import { Chip } from "@/pages/everyday/lifecycle/stage/chip";
import { KpiCards } from "@/pages/everyday/lifecycle/stage/kpi-cards";
import { KUNLE } from "@/pages/everyday/rooms/data";
import { LensBar } from "@/pages/revenue/leakage-map/lens-bar";
import { CreditARecoveryModal } from "@/pages/revenue/value/modals/credit-a-recovery-modal";
import { ValueTabs } from "@/pages/revenue/value/tabs";
import { VL13_ROWS, VL13_STATS, VL_CHIP_TONE, VL_KPI_TONE, VL_TONE_CLASS } from "@/pages/revenue/value/data";

const HEAD_CLASS = "px-4 py-2.5 font-mono text-[8.5px] font-medium tracking-[0.8px] text-ink-4 uppercase";

/** VL13 — /value?as=owner, the "My rooms" lens for Kunle (Customer Success, owns Renew · Nairobi). Also the base page the "Credit a recovery" modal (VL14) opens from, on the Kenya retry window row. */
export function MyRoomsState() {
  const [creditOpen, setCreditOpen] = useState(false);

  return (
    <div className="space-y-8">
      <LensBar
        person={KUNLE}
        holds="owns Renew · Nairobi"
        body="Showing 8 rooms of 41, and one currency of four. Kenyan figures stay in KES; nothing is converted to make his contribution comparable to Lagos."
      />

      <ValueTabs active="By room" />

      <KpiCards items={VL13_STATS.map((s) => ({ eyebrow: s.eyebrow, value: s.value, note: s.note, tone: s.tone ? VL_KPI_TONE[s.tone] : "ink" }))} />

      <section className="space-y-3">
        <p className={EYEBROW_CLASS}>His rooms</p>
        <div className="overflow-x-auto rounded-card border border-line bg-paper">
          <table className="w-full min-w-[820px] text-left text-[11.5px]">
            <thead>
              <tr className="border-b border-line bg-paper-2">
                <th className={HEAD_CLASS}>Room</th>
                <th className={`${HEAD_CLASS} text-right`}>Closed</th>
                <th className={`${HEAD_CLASS} text-right`}>Recovered</th>
                <th className={HEAD_CLASS}>How it was measured</th>
                <th className={`${HEAD_CLASS} text-right`}>Strength</th>
                <th className={HEAD_CLASS} />
              </tr>
            </thead>
            <tbody>
              {VL13_ROWS.map((row) => (
                <tr key={row.room} className="border-b border-line last:border-0">
                  <td className="px-4 py-3 font-semibold text-ink">{row.room}</td>
                  <td className="px-4 py-3 text-right text-ink-4">{row.closed}</td>
                  <td className={`px-4 py-3 text-right font-mono ${VL_TONE_CLASS[row.recoveredTone]}`}>{row.recovered}</td>
                  <td className="px-4 py-3 text-ink-2">{row.howMeasured}</td>
                  <td className="px-4 py-3 text-right">
                    <Chip tone={VL_CHIP_TONE[row.strengthTone]}>{row.strength}</Chip>
                  </td>
                  <td className="px-4 py-3 text-right">
                    {row.creditable && (
                      <Button type="button" size="sm" variant="outline" onClick={() => setCreditOpen(true)}>
                        Credit
                      </Button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      <Callout tone="teal" title="KES 18.2M is not a smaller number than ₦411M, it is a different number">
        Kunle's whole contribution converts to roughly 3% of the Nigerian figure at this morning's rate, which is
        the first thing anybody would compute and the least useful. The lens keeps him in his own currency, beside
        his own 610,000 customers, because a Nairobi lead whose work is displayed as a rounding error in Lagos stops
        filing it.
      </Callout>

      <Callout tone="amber" title="The one overdue item is his and it is not on this list">
        His re-forecast is four days late and it blocks a figure in a section he does not own. It appears in
        Handoff with a date and a name, not here — this view is what his work produced, and the thing he owes
        somebody else belongs where obligations live rather than mixed into his own ledger.
      </Callout>

      <CreditARecoveryModal open={creditOpen} onOpenChange={setCreditOpen} />
    </div>
  );
}
