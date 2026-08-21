import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { EYEBROW_CLASS } from "@/pages/everyday/lifecycle/data";
import { Callout } from "@/pages/everyday/lifecycle/stage/rail";
import { Chip } from "@/pages/everyday/lifecycle/stage/chip";
import { HealthKvList } from "@/pages/customers/customer-health/kv-list";
import { HealthTabs } from "@/pages/customers/customer-health/tabs";
import { HL10_KV_ROWS, HL10_ROWS, HL_CHIP_TONE, HL_TONE_CLASS } from "@/pages/customers/customer-health/data";

const HEAD_CLASS = "px-4 py-2.5 font-mono text-[8.5px] font-medium tracking-[0.8px] text-ink-4 uppercase";

/** HL10 — /customer-health/changed. */
const CustomerHealthChangedRoute = () => {
  return (
    <div className="space-y-8">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <h1 className="text-[17px] font-semibold text-ink">What changed</h1>
          <p className="mt-1 text-[11.5px] text-ink-3">Five movements this week · three of them are about us, not about customers</p>
        </div>
        <Button type="button" onClick={() => toast.success("Subscribed to weekly changes")}>
          Subscribe
        </Button>
      </div>

      <HealthTabs active="What changed" />

      <section className="space-y-3">
        <p className={EYEBROW_CLASS}>This week · what moved, and whether a customer did anything</p>
        <div className="overflow-x-auto rounded-card border border-line bg-paper">
          <table className="w-full min-w-[920px] text-left text-[11.5px]">
            <thead>
              <tr className="border-b border-line bg-paper-2">
                <th className={HEAD_CLASS}>Change</th>
                <th className={HEAD_CLASS}>Signal</th>
                <th className={`${HEAD_CLASS} text-right`}>Was</th>
                <th className={`${HEAD_CLASS} text-right`}>Now</th>
                <th className={HEAD_CLASS}>Why it moved</th>
                <th className={`${HEAD_CLASS} text-right`}>A customer changed?</th>
              </tr>
            </thead>
            <tbody>
              {HL10_ROWS.map((row) => (
                <tr key={row.change + row.signal} className="border-b border-line last:border-0">
                  <td className="px-4 py-3 font-semibold text-ink-2">{row.change}</td>
                  <td className="px-4 py-3 text-ink-2">{row.signal}</td>
                  <td className={`px-4 py-3 text-right font-mono ${HL_TONE_CLASS[row.wasTone]}`}>{row.was}</td>
                  <td className={`px-4 py-3 text-right font-mono ${HL_TONE_CLASS[row.nowTone]}`}>{row.now}</td>
                  <td className="px-4 py-3 text-ink-3">{row.why}</td>
                  <td className="px-4 py-3 text-right">
                    <Chip tone={HL_CHIP_TONE[row.customerChangedTone]}>{row.customerChanged}</Chip>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      <Callout tone="ultra" title="Only two of five changes are about customers, and the last column exists to make that obvious">
        A signal getting stronger because the cohort got fuller looks identical, in a chart, to a signal getting
        stronger because behaviour changed. The fourth row is the first kind and would have been read as good news.
        Every row on this screen answers the same question first: did a person out there do something differently,
        or did we?
      </Callout>

      <section className="space-y-3">
        <p className={EYEBROW_CLASS}>Revisions to signal strength are kept</p>
        <HealthKvList rows={HL10_KV_ROWS} />
      </section>
    </div>
  );
};

export default CustomerHealthChangedRoute;
