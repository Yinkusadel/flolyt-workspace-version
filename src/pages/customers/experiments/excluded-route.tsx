import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { EYEBROW_CLASS } from "@/pages/everyday/lifecycle/data";
import { Callout } from "@/pages/everyday/lifecycle/stage/rail";
import { Chip } from "@/pages/everyday/lifecycle/stage/chip";
import { ExperimentsTabs } from "@/pages/customers/experiments/tabs";
import { EX_CHIP_TONE, EX_TONE_CLASS, XP05_ROWS } from "@/pages/customers/experiments/data";

const HEAD_CLASS = "px-4 py-2.5 font-mono text-[8.5px] font-medium tracking-[0.8px] text-ink-4 uppercase";

/** XP05 — /experiments/excluded, the "Never included" tab. */
const ExperimentsExcludedRoute = () => {
  return (
    <div className="space-y-8">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <h1 className="text-[17px] font-semibold text-ink">Never included</h1>
          <p className="mt-1 text-[11.5px] text-ink-3">8,140 people permanently outside every experiment · and 452,000 excluded for two different reasons</p>
        </div>
        <Button type="button" onClick={() => toast.success("Request sent to data")}>
          Request the guest-checkout field
        </Button>
      </div>

      <ExperimentsTabs active="Never included" />

      <section className="space-y-3">
        <p className={EYEBROW_CLASS}>People who are in no experiment, ever, in either group</p>
        <div className="overflow-x-auto rounded-card border border-line bg-paper">
          <table className="w-full min-w-[860px] text-left text-[11.5px]">
            <thead>
              <tr className="border-b border-line bg-paper-2">
                <th className={HEAD_CLASS}>Excluded</th>
                <th className={`${HEAD_CLASS} text-right`}>People</th>
                <th className={HEAD_CLASS}>Why</th>
                <th className={`${HEAD_CLASS} text-right`}>Set by</th>
                <th className={`${HEAD_CLASS} text-right`}>Overridable</th>
              </tr>
            </thead>
            <tbody>
              {XP05_ROWS.map((row) => (
                <tr key={row.excluded} className="border-b border-line last:border-0">
                  <td className="px-4 py-3 font-semibold text-ink-2">{row.excluded}</td>
                  <td className={`px-4 py-3 text-right font-mono ${EX_TONE_CLASS[row.peopleTone]}`}>{row.people}</td>
                  <td className="px-4 py-3 text-ink-3">{row.why}</td>
                  <td className="px-4 py-3 text-right text-ink-4">{row.setBy}</td>
                  <td className="px-4 py-3 text-right">
                    <Chip tone={EX_CHIP_TONE[row.overridableTone]}>{row.overridable}</Chip>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      <Callout tone="amber" title="Eight thousand people are permanently outside every experiment and that biases every result knowably">
        The most upset, the most owed and the most opted-out are never in a treated or a held group. Every causal
        figure in the workspace — all ₦93M of it — describes a population with those people removed. It cannot be
        fixed by shortening the list, it is not going away, and it is written here rather than in a footnote so
        that the limitation travels with the claim.
      </Callout>

      <Callout tone="rose" title="Ghana and guest checkout are excluded for reasons that look identical and are not">
        Ghana needs ninety days of history and nobody is at fault. Guest checkout needs one field on the orders
        table, requested on 28 July, still outstanding. One will resolve itself by October and the other will not
        resolve at all unless somebody does something, so they are marked differently even though the effect today
        is the same.
      </Callout>
    </div>
  );
};

export default ExperimentsExcludedRoute;
