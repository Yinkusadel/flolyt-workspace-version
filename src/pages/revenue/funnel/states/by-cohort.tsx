import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { EYEBROW_CLASS } from "@/pages/everyday/lifecycle/data";
import { Callout } from "@/pages/everyday/lifecycle/stage/rail";
import { Chip } from "@/pages/everyday/lifecycle/stage/chip";
import { FunnelTabs } from "@/pages/revenue/funnel/tabs";
import { FN07_ROWS, FN_TONE_CLASS } from "@/pages/revenue/funnel/data";

const HEAD_CLASS = "px-4 py-2.5 font-mono text-[8.5px] font-medium tracking-[0.8px] text-ink-4 uppercase";

/** FN07 — /funnel?by=cohort. */
export function ByCohortState() {
  return (
    <div className="space-y-8">
      <FunnelTabs active="By cohort" />

      <div className="flex flex-wrap items-center justify-between gap-3">
        <p className={EYEBROW_CLASS}>Who gets through, split by how they arrived</p>
        <Button type="button" size="sm" onClick={() => toast.success("Audience builder opened")}>
          Build an audience
        </Button>
      </div>

      <div className="overflow-x-auto rounded-card border border-line bg-paper">
        <table className="w-full min-w-[820px] text-left text-[11.5px]">
          <thead>
            <tr className="border-b border-line bg-paper-2">
              <th className={HEAD_CLASS}>Cohort</th>
              <th className={`${HEAD_CLASS} text-right`}>Size</th>
              <th className={`${HEAD_CLASS} text-right`}>Reached value</th>
              <th className={`${HEAD_CLASS} text-right`}>Ordered again</th>
              <th className={`${HEAD_CLASS} text-right`}>vs average</th>
              <th className={HEAD_CLASS}>Can they be contacted?</th>
            </tr>
          </thead>
          <tbody>
            {FN07_ROWS.map((row) => (
              <tr key={row.cohort} className="border-b border-line last:border-0">
                <td className="px-4 py-3 font-semibold text-ink">{row.cohort}</td>
                <td className={`px-4 py-3 text-right font-mono ${FN_TONE_CLASS[row.sizeTone]}`}>{row.size}</td>
                <td className={`px-4 py-3 text-right font-mono ${FN_TONE_CLASS[row.reachedValueTone]}`}>{row.reachedValue}</td>
                <td className={`px-4 py-3 text-right font-mono ${FN_TONE_CLASS[row.orderedAgainTone]}`}>{row.orderedAgain}</td>
                <td className={`px-4 py-3 text-right font-mono ${FN_TONE_CLASS[row.vsAverageTone]}`}>{row.vsAverage}</td>
                <td className="px-4 py-3">
                  <Chip tone={row.canContact === "yes" ? "teal" : "rose"}>{row.canContact}</Chip>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <Callout tone="rose" title="The bottom two rows are the strongest predictor in the workspace and neither has an owner">
        Two features against none is 70.2% versus 12.8% on the second order — a 43-point gap, larger than referral,
        larger than channel, larger than anything the fee did. It has been visible since April, has produced
        nineteen agent findings, and has never been proposed as an action because Adopt has nobody on it.
      </Callout>

      <Callout tone="amber" title="42,000 people are in this table as a row and cannot be in any other screen">
        Guest-checkout customers have orders and no identity, so they can be counted here and never contacted, never
        cohorted, never measured through the funnel. The row exists to keep them visible. Dropping them would make
        every percentage on this screen slightly wrong and entirely unremarkable.
      </Callout>
    </div>
  );
}
