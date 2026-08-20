import { useState } from "react";

import { Button } from "@/components/ui/button";
import { EYEBROW_CLASS } from "@/pages/everyday/lifecycle/data";
import { Callout } from "@/pages/everyday/lifecycle/stage/rail";
import { Chip } from "@/pages/everyday/lifecycle/stage/chip";
import { MarkUnmeasurableModal } from "@/pages/revenue/value/modals/mark-unmeasurable-modal";
import { ValueKvList } from "@/pages/revenue/value/kv-list";
import { ValueTabs } from "@/pages/revenue/value/tabs";
import { VL08_KV_ROWS, VL08_ROWS, VL_TONE_CLASS } from "@/pages/revenue/value/data";

const HEAD_CLASS = "px-4 py-2.5 font-mono text-[8.5px] font-medium tracking-[0.8px] text-ink-4 uppercase";

/** VL08 — /value/unmeasurable. Also the base page the "Mark it unmeasurable" modal (VL15) opens from, on the Accra reactivation row. */
const UnmeasurableRoute = () => {
  const [markOpen, setMarkOpen] = useState(false);

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-[17px] font-semibold text-ink">Value</h1>
        <p className="mt-1 text-[11.5px] text-ink-3">Three rooms · ₦21M and GHS 380k · one of them should never have been preventable</p>
      </div>

      <ValueTabs active="The ledger" />

      <section className="space-y-3">
        <p className={EYEBROW_CLASS}>Three rooms closed with money in them and no way to claim it</p>
        <div className="overflow-x-auto rounded-card border border-line bg-paper">
          <table className="w-full min-w-[860px] text-left text-[11.5px]">
            <thead>
              <tr className="border-b border-line bg-paper-2">
                <th className={HEAD_CLASS}>Room</th>
                <th className={`${HEAD_CLASS} text-right`}>Amount</th>
                <th className={HEAD_CLASS}>Why</th>
                <th className={`${HEAD_CLASS} text-right`}>Avoidable?</th>
                <th className={HEAD_CLASS}>Rule it produced</th>
                <th className={HEAD_CLASS} />
              </tr>
            </thead>
            <tbody>
              {VL08_ROWS.map((row) => (
                <tr key={row.room} className="border-b border-line last:border-0">
                  <td className="px-4 py-3 font-semibold text-ink">{row.room}</td>
                  <td className={`px-4 py-3 text-right font-mono ${VL_TONE_CLASS[row.amountTone]}`}>{row.amount}</td>
                  <td className="px-4 py-3 text-ink-2">{row.why}</td>
                  <td className="px-4 py-3 text-right">
                    <Chip tone={row.avoidableTone === "ok" ? "teal" : "amber"}>{row.avoidable}</Chip>
                  </td>
                  <td className="px-4 py-3 text-ink-4">{row.rule}</td>
                  <td className="px-4 py-3 text-right">
                    {row.room === "Accra reactivation" && (
                      <Button type="button" size="sm" variant="outline" onClick={() => setMarkOpen(true)}>
                        Details
                      </Button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      <Callout tone="amber" title="₦21M is roughly a fifth of everything the holdouts proved, and it will happen again every quarter">
        Some things worth doing cannot be withheld from anybody. The figure is published next to ₦93M so the ratio
        stays visible rather than becoming something people mention only when it is small. Two of these three
        produced a written rule that the next play inherits; the third is the one nobody should try to prevent.
      </Callout>

      <section className="space-y-3">
        <p className={EYEBROW_CLASS}>What happens to an unmeasurable figure</p>
        <ValueKvList rows={VL08_KV_ROWS} />
      </section>

      <MarkUnmeasurableModal open={markOpen} onOpenChange={setMarkOpen} />
    </div>
  );
};

export default UnmeasurableRoute;
