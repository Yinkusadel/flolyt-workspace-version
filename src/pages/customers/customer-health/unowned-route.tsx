import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { EYEBROW_CLASS } from "@/pages/everyday/lifecycle/data";
import { Callout } from "@/pages/everyday/lifecycle/stage/rail";
import { KpiCards } from "@/pages/everyday/lifecycle/stage/kpi-cards";
import { HealthTabs } from "@/pages/customers/customer-health/tabs";
import { HL08_ROWS, HL08_STATS, HL_KPI_TONE, HL_TONE_CLASS } from "@/pages/customers/customer-health/data";

const HEAD_CLASS = "px-4 py-2.5 font-mono text-[8.5px] font-medium tracking-[0.8px] text-ink-4 uppercase";

/** HL08 — /customer-health/unowned, reached from the By-cohort tab's own callout. Keeps the tab bar with "By cohort" active for orientation, matching the export's own choice. */
const CustomerHealthUnownedRoute = () => {
  return (
    <div className="space-y-8">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <h1 className="text-[17px] font-semibold text-ink">At risk with no owner</h1>
          <p className="mt-1 text-[11.5px] text-ink-3">Three cohorts · 404,000 people · 47 findings routed to empty fields</p>
        </div>
        <Button type="button" onClick={() => toast.info("Owner assignment requires a stage owner to accept")}>
          Assign an owner
        </Button>
      </div>

      <HealthTabs active="By cohort" />

      <KpiCards items={HL08_STATS.map((s) => ({ eyebrow: s.eyebrow, value: s.value, note: s.note, tone: HL_KPI_TONE[s.tone] }))} />

      <section className="space-y-3">
        <p className={EYEBROW_CLASS}>Reading badly, and nobody to hand it to</p>
        <div className="overflow-x-auto rounded-card border border-line bg-paper">
          <table className="w-full min-w-[860px] text-left text-[11.5px]">
            <thead>
              <tr className="border-b border-line bg-paper-2">
                <th className={HEAD_CLASS}>Cohort</th>
                <th className={`${HEAD_CLASS} text-right`}>People</th>
                <th className={HEAD_CLASS}>Worst signals</th>
                <th className={`${HEAD_CLASS} text-right`}>Since</th>
                <th className={HEAD_CLASS}>Stage</th>
                <th className={`${HEAD_CLASS} text-right`}>Findings routed</th>
              </tr>
            </thead>
            <tbody>
              {HL08_ROWS.map((row) => (
                <tr key={row.cohort} className="border-b border-line last:border-0">
                  <td className="px-4 py-3 font-semibold text-ink-2">{row.cohort}</td>
                  <td className={`px-4 py-3 text-right font-mono ${HL_TONE_CLASS[row.peopleTone]}`}>{row.people}</td>
                  <td className="px-4 py-3 text-ink-2">{row.worstSignals}</td>
                  <td className={`px-4 py-3 text-right ${HL_TONE_CLASS[row.sinceTone]}`}>{row.since}</td>
                  <td className={`px-4 py-3 ${HL_TONE_CLASS[row.stageTone]}`}>{row.stage}</td>
                  <td className="px-4 py-3 text-right font-mono text-ink">{row.findingsRouted}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      <Callout tone="rose" title="Forty-seven agent findings about 404,000 people have arrived at three empty fields">
        Adopt, Advocate and Churn have had no owner for 214 days. Every finding about them was produced correctly,
        ranked correctly and routed correctly to a field with nobody in it. This section can describe those
        customers in detail and cannot do a single thing about them, which is the most accurate summary of the
        problem the workspace has.
      </Callout>

      <Callout tone="ultra" title="Nothing on this screen escalates on its own">
        No automatic assignment, no ageing to a default owner, no rising severity. The count goes up and the screen
        stays the same shape, because a finding routed to whoever is nearest is how a stage acquires an owner who
        never agreed to be one — and that person then stops reading the findings entirely.
      </Callout>
    </div>
  );
};

export default CustomerHealthUnownedRoute;
