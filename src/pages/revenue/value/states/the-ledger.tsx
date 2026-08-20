import { useState } from "react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { EYEBROW_CLASS } from "@/pages/everyday/lifecycle/data";
import { Callout } from "@/pages/everyday/lifecycle/stage/rail";
import { Chip } from "@/pages/everyday/lifecycle/stage/chip";
import { KpiCards } from "@/pages/everyday/lifecycle/stage/kpi-cards";
import { RestateAFigureModal } from "@/pages/revenue/value/modals/restate-a-figure-modal";
import { ValueKvList } from "@/pages/revenue/value/kv-list";
import { ValueTabs } from "@/pages/revenue/value/tabs";
import { VL03_LEDGER_ROWS, VL03_STATS, VL03_WONT_DO_KV, VL_CHIP_TONE, VL_KPI_TONE, VL_TONE_CLASS } from "@/pages/revenue/value/data";

const HEAD_CLASS = "px-4 py-2.5 font-mono text-[8.5px] font-medium tracking-[0.8px] text-ink-4 uppercase";

/** VL03 — the default populated "The ledger" state. */
export function TheLedgerState() {
  const [restateOpen, setRestateOpen] = useState(false);

  return (
    <div className="space-y-8">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <h1 className="text-[17px] font-semibold text-ink">Value</h1>
          <p className="mt-1 text-[11.5px] text-ink-3">41 rooms closed since 12 January · four currencies · no total, by design</p>
        </div>
        <Button type="button" size="sm" onClick={() => toast.success("Exported for the board")}>
          Export for the board
        </Button>
      </div>

      <ValueTabs active="The ledger" />

      <KpiCards items={VL03_STATS.map((s) => ({ eyebrow: s.eyebrow, value: s.value, note: s.note, tone: VL_KPI_TONE[s.tone] }))} />

      <Callout tone="teal" title="There is no total on this screen and there will not be one">
        Converting these into one figure needs one exchange rate on one date applied to 151 days of movement, and
        it would quietly turn the UK — 0.4% of this — into a rounding error inside a number the board would then
        quote. Four numbers is harder to present and impossible to misread.
      </Callout>

      <section className="space-y-3">
        <p className={EYEBROW_CLASS}>The line-by-line ledger</p>
        <div className="overflow-x-auto rounded-card border border-line bg-paper">
          <table className="w-full min-w-[960px] text-left text-[11.5px]">
            <thead>
              <tr className="border-b border-line bg-paper-2">
                <th className={HEAD_CLASS}>Room</th>
                <th className={`${HEAD_CLASS} text-right`}>Closed</th>
                <th className={`${HEAD_CLASS} text-right`}>At risk</th>
                <th className={`${HEAD_CLASS} text-right`}>Recovered</th>
                <th className={HEAD_CLASS}>How it was measured</th>
                <th className={`${HEAD_CLASS} text-right`}>Strength</th>
                <th className={HEAD_CLASS}>Credited to</th>
                <th className={HEAD_CLASS} />
              </tr>
            </thead>
            <tbody>
              {VL03_LEDGER_ROWS.map((row) => (
                <tr key={row.room} className="border-b border-line last:border-0">
                  <td className="px-4 py-3 font-semibold text-ink">{row.room}</td>
                  <td className="px-4 py-3 text-right text-ink-4">{row.closed}</td>
                  <td className={`px-4 py-3 text-right font-mono ${VL_TONE_CLASS[row.atRiskTone]}`}>{row.atRisk}</td>
                  <td className={`px-4 py-3 text-right font-mono ${VL_TONE_CLASS[row.recoveredTone]}`}>{row.recovered}</td>
                  <td className="px-4 py-3 text-ink-3">{row.howMeasured}</td>
                  <td className="px-4 py-3 text-right">
                    <Chip tone={VL_CHIP_TONE[row.strengthTone]}>{row.strength}</Chip>
                  </td>
                  <td className="px-4 py-3 text-ink-4">{row.creditedTo}</td>
                  <td className="px-4 py-3 text-right">
                    {row.restatable && (
                      <Button type="button" size="sm" variant="outline" onClick={() => setRestateOpen(true)}>
                        Restate
                      </Button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      <Callout tone="rose" title="₦1.08B was lost and ₦411M was recovered, and none of the ₦411M is against the ₦1.08B">
        Every closed room in this ledger fixed something else. The release that cost the most is still open, still
        unrecovered, and its room was opened 151 days after the money started moving. A ledger that showed only
        recoveries would read as a win; showing both columns on one screen is the only way the ratio is visible at
        all.
      </Callout>

      <section className="space-y-3">
        <p className={EYEBROW_CLASS}>What this ledger will not do</p>
        <ValueKvList rows={VL03_WONT_DO_KV} />
      </section>

      <RestateAFigureModal open={restateOpen} onOpenChange={setRestateOpen} />
    </div>
  );
}
