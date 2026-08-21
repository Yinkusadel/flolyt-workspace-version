import { useState } from "react";

import { Button } from "@/components/ui/button";
import { EYEBROW_CLASS } from "@/pages/everyday/lifecycle/data";
import { Callout } from "@/pages/everyday/lifecycle/stage/rail";
import { Chip, CHIP_INTERACTIVE_CLASS } from "@/pages/everyday/lifecycle/stage/chip";
import { HealthKvList } from "@/pages/customers/customer-health/kv-list";
import { HealthTabs } from "@/pages/customers/customer-health/tabs";
import { ChangeAThresholdModal } from "@/pages/customers/customer-health/modals/change-a-threshold-modal";
import { HL11_KV_ROWS, HL11_ROWS, HL_CHIP_TONE, HL_TONE_CLASS } from "@/pages/customers/customer-health/data";

const HEAD_CLASS = "px-4 py-2.5 font-mono text-[8.5px] font-medium tracking-[0.8px] text-ink-4 uppercase";

/** HL11 — /customer-health/thresholds. The header CTA and the "Feature depth" row's chip both open the one threshold preset this export shows (HL13). */
const CustomerHealthThresholdsRoute = () => {
  const [modalOpen, setModalOpen] = useState(false);

  return (
    <div className="space-y-8">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <h1 className="text-[17px] font-semibold text-ink">Thresholds</h1>
          <p className="mt-1 text-[11.5px] text-ink-3">Five thresholds · nine breaches routed to an empty field, and nothing escalates</p>
        </div>
        <Button type="button" onClick={() => setModalOpen(true)}>
          Change a threshold
        </Button>
      </div>

      <HealthTabs active="Thresholds" />

      <section className="space-y-3">
        <p className={EYEBROW_CLASS}>What a signal has to do before anybody hears about it</p>
        <div className="overflow-x-auto rounded-card border border-line bg-paper">
          <table className="w-full min-w-[900px] text-left text-[11.5px]">
            <thead>
              <tr className="border-b border-line bg-paper-2">
                <th className={HEAD_CLASS}>Signal</th>
                <th className={HEAD_CLASS}>Threshold</th>
                <th className={`${HEAD_CLASS} text-right`}>Breached</th>
                <th className={`${HEAD_CLASS} text-right`}>Last breach</th>
                <th className={HEAD_CLASS}>Routes to</th>
                <th className={`${HEAD_CLASS} text-right`}>Arrived?</th>
              </tr>
            </thead>
            <tbody>
              {HL11_ROWS.map((row) => (
                <tr key={row.signal} className="border-b border-line last:border-0">
                  <td className="px-4 py-3 font-semibold text-ink-2">{row.signal}</td>
                  <td className="px-4 py-3 text-ink-3">{row.threshold}</td>
                  <td className="px-4 py-3 text-right">
                    {row.signal === "Feature depth" ? (
                      <button type="button" onClick={() => setModalOpen(true)}>
                        <Chip tone={HL_CHIP_TONE[row.breachedTone]} className={CHIP_INTERACTIVE_CLASS}>
                          {row.breached}
                        </Chip>
                      </button>
                    ) : (
                      <Chip tone={HL_CHIP_TONE[row.breachedTone]}>{row.breached}</Chip>
                    )}
                  </td>
                  <td className={`px-4 py-3 text-right ${HL_TONE_CLASS[row.lastBreachTone]}`}>{row.lastBreach}</td>
                  <td className={`px-4 py-3 ${HL_TONE_CLASS[row.routesToTone]}`}>{row.routesTo}</td>
                  <td className="px-4 py-3 text-right">
                    <Chip tone={HL_CHIP_TONE[row.arrivedTone]}>{row.arrived}</Chip>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      <Callout tone="rose" title="Nine breaches have arrived at an empty field and the tenth will too">
        The feature-depth threshold is set correctly, fires correctly and routes correctly to the owner of Adopt,
        who does not exist. Nothing is queued, nothing escalates and nothing is redirected to the nearest available
        person. The breach count rises and that is the entire mechanism — which is uncomfortable and is the honest
        consequence of refusing to auto-assign.
      </Callout>

      <section className="space-y-3">
        <p className={EYEBROW_CLASS}>What a threshold cannot be</p>
        <HealthKvList rows={HL11_KV_ROWS} />
      </section>

      <ChangeAThresholdModal open={modalOpen} onOpenChange={setModalOpen} />
    </div>
  );
};

export default CustomerHealthThresholdsRoute;
