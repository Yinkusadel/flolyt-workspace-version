import { Link } from "react-router-dom";

import { Button } from "@/components/ui/button";
import { EYEBROW_CLASS } from "@/pages/everyday/lifecycle/data";
import { Callout } from "@/pages/everyday/lifecycle/stage/rail";
import { Chip } from "@/pages/everyday/lifecycle/stage/chip";
import { AttributionTabs } from "@/pages/revenue/attribution/tabs";
import { AT08_ROWS, AT_CHIP_TONE, AT_TONE_CLASS } from "@/pages/revenue/attribution/data";

const HEAD_CLASS = "px-4 py-2.5 font-mono text-[8.5px] font-medium tracking-[0.8px] text-ink-4 uppercase";

/** AT08 — /attribution/methods. */
const MethodsRoute = () => {
  return (
    <div className="space-y-8">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <h1 className="text-[17px] font-semibold text-ink">Methods</h1>
          <p className="mt-1 text-[11.5px] text-ink-3">Six methods ordered by trust · the strongest is used least · one is refused permanently</p>
        </div>
        <Button asChild type="button">
          <Link to="/attribution/holdouts/new">Design a holdout</Link>
        </Button>
      </div>

      <AttributionTabs active="Methods" />

      <section className="space-y-3">
        <p className={EYEBROW_CLASS}>Every method available here, in the order they are trusted</p>
        <div className="overflow-x-auto rounded-card border border-line bg-paper">
          <table className="w-full min-w-[920px] text-left text-[11.5px]">
            <thead>
              <tr className="border-b border-line bg-paper-2">
                <th className={HEAD_CLASS}>Method</th>
                <th className={HEAD_CLASS}>What it compares</th>
                <th className={`${HEAD_CLASS} text-right`}>Strength</th>
                <th className={`${HEAD_CLASS} text-right`}>Used</th>
                <th className={`${HEAD_CLASS} text-right`}>Available now?</th>
                <th className={HEAD_CLASS}>Why not</th>
              </tr>
            </thead>
            <tbody>
              {AT08_ROWS.map((row) => (
                <tr key={row.method} className="border-b border-line last:border-0">
                  <td className="px-4 py-3 font-semibold text-ink">{row.method}</td>
                  <td className="px-4 py-3 text-ink-2">{row.compares}</td>
                  <td className="px-4 py-3 text-right">
                    <Chip tone={AT_CHIP_TONE[row.strengthTone]}>{row.strength}</Chip>
                  </td>
                  <td className={`px-4 py-3 text-right font-mono ${AT_TONE_CLASS[row.usedTone]}`}>{row.used}</td>
                  <td className="px-4 py-3 text-right">
                    <Chip tone={AT_CHIP_TONE[row.availableTone]}>{row.available}</Chip>
                  </td>
                  <td className={`px-4 py-3 ${AT_TONE_CLASS[row.whyNotTone]}`}>{row.whyNot}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      <Callout tone="amber" title="The strongest method is used in three rooms and the weakest in fourteen">
        Holdouts are harder: they need an approver, an end date, an exclusion list and somebody willing to leave
        money on the table for a fortnight. Before-and-after needs a date. That asymmetry is why ₦297M of the
        ledger rests on the weaker one, and why this table is ordered by trust rather than by how often each is
        used.
      </Callout>

      <Callout tone="rose" title="Against forecast is listed so that it can be refused in public">
        It is the method people reach for when nothing else is available, and it measures the forecast rather than
        the intervention. Leaving it off the list would mean answering the same question in a meeting every
        quarter; putting it here with "never" next to it answers it once.
      </Callout>
    </div>
  );
};

export default MethodsRoute;
