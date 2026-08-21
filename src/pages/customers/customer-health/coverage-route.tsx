import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { EYEBROW_CLASS } from "@/pages/everyday/lifecycle/data";
import { Callout } from "@/pages/everyday/lifecycle/stage/rail";
import { Chip } from "@/pages/everyday/lifecycle/stage/chip";
import { CoverageBar } from "@/pages/customers/customer-health/coverage-bar";
import { HealthTabs } from "@/pages/customers/customer-health/tabs";
import { HL09_BAR_ROWS, HL09_ROWS, HL_CHIP_TONE, HL_TONE_CLASS } from "@/pages/customers/customer-health/data";

const HEAD_CLASS = "px-4 py-2.5 font-mono text-[8.5px] font-medium tracking-[0.8px] text-ink-4 uppercase";

/** HL09 — /customer-health/coverage. */
const CustomerHealthCoverageRoute = () => {
  return (
    <div className="space-y-8">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <h1 className="text-[17px] font-semibold text-ink">Coverage</h1>
          <p className="mt-1 text-[11.5px] text-ink-3">Six signals · one covers nobody · the strongest covers 73.8% and always will</p>
        </div>
        <Button type="button" onClick={() => toast.success("Field request sent to data")}>
          Request the guest-checkout field
        </Button>
      </div>

      <HealthTabs active="Coverage" />

      <section className="space-y-3">
        <p className={EYEBROW_CLASS}>How much of the base each signal can actually read</p>
        <CoverageBar rows={HL09_BAR_ROWS} />
      </section>

      <Callout tone="amber" title="A third of the base is read on fewer than five signals and the screen shows which third">
        890,000 customers predate the feature-event instrumentation and will never have a week-one depth reading,
        because that week is in the past. Their absence is not a gap that can be filled — it is a fact about when
        the events were built, and it means the strongest signal in the workspace covers 68% of the people it
        describes.
      </Callout>

      <section className="space-y-3">
        <p className={EYEBROW_CLASS}>Signal by signal</p>
        <div className="overflow-x-auto rounded-card border border-line bg-paper">
          <table className="w-full min-w-[820px] text-left text-[11.5px]">
            <thead>
              <tr className="border-b border-line bg-paper-2">
                <th className={HEAD_CLASS}>Signal</th>
                <th className={`${HEAD_CLASS} text-right`}>Covers</th>
                <th className={`${HEAD_CLASS} text-right`}>Of the base</th>
                <th className={HEAD_CLASS}>Who is missing</th>
                <th className={`${HEAD_CLASS} text-right`}>Fixable?</th>
              </tr>
            </thead>
            <tbody>
              {HL09_ROWS.map((row) => (
                <tr key={row.signal} className="border-b border-line last:border-0">
                  <td className="px-4 py-3 font-semibold text-ink-2">{row.signal}</td>
                  <td className={`px-4 py-3 text-right font-mono ${HL_TONE_CLASS[row.coversTone]}`}>{row.covers}</td>
                  <td className={`px-4 py-3 text-right ${HL_TONE_CLASS[row.ofBaseTone]}`}>{row.ofBase}</td>
                  <td className="px-4 py-3 text-ink-2">{row.missing}</td>
                  <td className="px-4 py-3 text-right">
                    <Chip tone={HL_CHIP_TONE[row.fixableTone]}>{row.fixable}</Chip>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      <Callout tone="amber" title="Three of six signals are blocked by the same missing field, and one has never been asked for">
        A customer reference on guest orders would lift three signals from 99.0% to complete. Referral attribution
        has never been requested by anybody, because Advocate has nobody to request it. The two failures look
        identical in this table and are shown differently, because only one of them has a person who could act.
      </Callout>
    </div>
  );
};

export default CustomerHealthCoverageRoute;
