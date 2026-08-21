import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { EYEBROW_CLASS } from "@/pages/everyday/lifecycle/data";
import { Callout } from "@/pages/everyday/lifecycle/stage/rail";
import { KpiCards } from "@/pages/everyday/lifecycle/stage/kpi-cards";
import { AttributionKvList } from "@/pages/revenue/attribution/kv-list";
import { AttributionTabs } from "@/pages/revenue/attribution/tabs";
import { AT06_KV_ROWS, AT06_ROWS, AT06_STATS, AT_KPI_TONE, AT_TONE_CLASS } from "@/pages/revenue/attribution/data";

const HEAD_CLASS = "px-4 py-2.5 font-mono text-[8.5px] font-medium tracking-[0.8px] text-ink-4 uppercase";

/** AT06 — /attribution/overlap. */
const OverlapRoute = () => {
  return (
    <div className="space-y-8">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <h1 className="text-[17px] font-semibold text-ink">Overlap</h1>
          <p className="mt-1 text-[11.5px] text-ink-3">41,300 people in more than one room · ₦16M claimed twice and held out of the ledger</p>
        </div>
        <Button type="button" onClick={() => toast.info("Opening the overlap resolution workflow")}>
          Resolve an overlap
        </Button>
      </div>

      <AttributionTabs active="Overlap" />

      <KpiCards items={AT06_STATS.map((s) => ({ eyebrow: s.eyebrow, value: s.value, note: s.note, tone: AT_KPI_TONE[s.tone] }))} />

      <section className="space-y-3">
        <p className={EYEBROW_CLASS}>Where two rooms are claiming the same customers</p>
        <div className="overflow-x-auto rounded-card border border-line bg-paper">
          <table className="w-full min-w-[880px] text-left text-[11.5px]">
            <thead>
              <tr className="border-b border-line bg-paper-2">
                <th className={HEAD_CLASS}>Overlap</th>
                <th className={`${HEAD_CLASS} text-right`}>People</th>
                <th className={`${HEAD_CLASS} text-right`}>Claimed by A</th>
                <th className={`${HEAD_CLASS} text-right`}>Claimed by B</th>
                <th className={`${HEAD_CLASS} text-right`}>Resolution</th>
                <th className={HEAD_CLASS}>Who decided</th>
              </tr>
            </thead>
            <tbody>
              {AT06_ROWS.map((row) => (
                <tr key={row.overlap} className="border-b border-line last:border-0">
                  <td className="px-4 py-3 font-semibold text-ink">{row.overlap}</td>
                  <td className="px-4 py-3 text-right font-mono text-ink">{row.people}</td>
                  <td className={`px-4 py-3 text-right font-mono ${AT_TONE_CLASS[row.claimedByATone]}`}>{row.claimedByA}</td>
                  <td className={`px-4 py-3 text-right font-mono ${AT_TONE_CLASS[row.claimedByBTone]}`}>{row.claimedByB}</td>
                  <td className={`px-4 py-3 text-right ${AT_TONE_CLASS[row.resolutionTone]}`}>{row.resolution}</td>
                  <td className={`px-4 py-3 ${row.whoDecidedTone ? AT_TONE_CLASS[row.whoDecidedTone] : "text-ink-4"}`}>{row.whoDecided}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      <Callout tone="rose" title="₦16M is claimed by two rooms and the ledger contains neither figure">
        Tunde says the basket prompt moved those 9,200 customers; Ravi says they were discount-only buyers who
        would have converted anyway. Both readings are on the line, the money is held out of the ledger until a
        person settles it, and no default was applied. Splitting it at ₦8M would clear the screen and produce a
        figure neither of them believes.
      </Callout>

      <section className="space-y-3">
        <p className={EYEBROW_CLASS}>How overlap is found and what it cannot see</p>
        <AttributionKvList rows={AT06_KV_ROWS} />
      </section>
    </div>
  );
};

export default OverlapRoute;
