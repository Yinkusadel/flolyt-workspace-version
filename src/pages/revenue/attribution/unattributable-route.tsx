import { useState } from "react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { EYEBROW_CLASS } from "@/pages/everyday/lifecycle/data";
import { Callout } from "@/pages/everyday/lifecycle/stage/rail";
import { AttributionKvList } from "@/pages/revenue/attribution/kv-list";
import { AttributionTabs } from "@/pages/revenue/attribution/tabs";
import { MarkUnattributableModal } from "@/pages/revenue/attribution/modals/mark-unattributable-modal";
import { AT07_KV_ROWS, AT07_ROWS, AT_TONE_CLASS } from "@/pages/revenue/attribution/data";

const HEAD_CLASS = "px-4 py-2.5 font-mono text-[8.5px] font-medium tracking-[0.8px] text-ink-4 uppercase";

/** AT07 — /attribution/unattributable. Also the base page the "Mark it unattributable" modal (AT10) opens from, on the Accra reactivation row. */
const UnattributableRoute = () => {
  const [markOpen, setMarkOpen] = useState(false);

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-[17px] font-semibold text-ink">Unattributable</h1>
        <p className="mt-1 text-[11.5px] text-ink-3">Four things that moved money and cannot be credited · two avoidable, one that should not be</p>
      </div>

      <AttributionTabs active="Unattributable" />

      <section className="space-y-3">
        <p className={EYEBROW_CLASS}>Money that moved, and cannot be credited to anything</p>
        <div className="overflow-x-auto rounded-card border border-line bg-paper">
          <table className="w-full min-w-[860px] text-left text-[11.5px]">
            <thead>
              <tr className="border-b border-line bg-paper-2">
                <th className={HEAD_CLASS}>What happened</th>
                <th className={`${HEAD_CLASS} text-right`}>Amount</th>
                <th className={HEAD_CLASS}>Why it cannot be attributed</th>
                <th className={HEAD_CLASS}>Whose call</th>
                <th className={`${HEAD_CLASS} text-right`}>Would it be fixable?</th>
                <th className={HEAD_CLASS} />
              </tr>
            </thead>
            <tbody>
              {AT07_ROWS.map((row) => (
                <tr key={row.what} className="border-b border-line last:border-0">
                  <td className="px-4 py-3 font-semibold text-ink">{row.what}</td>
                  <td className={`px-4 py-3 text-right font-mono ${AT_TONE_CLASS[row.amountTone]}`}>{row.amount}</td>
                  <td className="px-4 py-3 text-ink-2">{row.why}</td>
                  <td className="px-4 py-3 text-ink-4">{row.whoseCall}</td>
                  <td className={`px-4 py-3 text-right ${AT_TONE_CLASS[row.fixableTone]}`}>{row.fixable}</td>
                  <td className="px-4 py-3 text-right">
                    {row.what === "Accra reactivation" && (
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

      <Callout tone="amber" title="Two of these were avoidable and two were not, and the difference is the point of the column">
        Ifeoma could have held a weekend group and did not think of it; Kunle could have waited ninety days and had
        a reason not to. Amara could have held 310 people and refused, which is the one row here nobody should try
        to fix. Grouping all four as "unmeasured" would put a good decision and two oversights in the same bucket.
      </Callout>

      <section className="space-y-3">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <p className={EYEBROW_CLASS}>What happens to unattributable money</p>
          <Button type="button" size="sm" variant="outline" onClick={() => toast.info("Opening the rule editor")}>
            Write the rule
          </Button>
        </div>
        <AttributionKvList rows={AT07_KV_ROWS} />
      </section>

      <Callout tone="neutral" title="₦21M of unattributable money is roughly a third of everything the holdouts proved">
        It is not a rounding error and it is not going away. Every quarter will produce some, because some things
        worth doing cannot be withheld from anybody. The figure is published next to ₦93M so the ratio stays
        visible rather than becoming a thing people only mention when it is small.
      </Callout>

      <MarkUnattributableModal open={markOpen} onOpenChange={setMarkOpen} />
    </div>
  );
};

export default UnattributableRoute;
