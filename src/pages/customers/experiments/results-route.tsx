import { Link } from "react-router-dom";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { EYEBROW_CLASS } from "@/pages/everyday/lifecycle/data";
import { Callout } from "@/pages/everyday/lifecycle/stage/rail";
import { Chip } from "@/pages/everyday/lifecycle/stage/chip";
import { ExperimentsTabs } from "@/pages/customers/experiments/tabs";
import { ExperimentsKvList } from "@/pages/customers/experiments/kv-list";
import { EX_CHIP_TONE, EX_TONE_CLASS, XP06_KV_ROWS, XP06_ROWS } from "@/pages/customers/experiments/data";

const HEAD_CLASS = "px-4 py-2.5 font-mono text-[8.5px] font-medium tracking-[0.8px] text-ink-4 uppercase";

/** XP06 — /experiments/results. */
const ExperimentsResultsRoute = () => {
  return (
    <div className="space-y-8">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <h1 className="text-[17px] font-semibold text-ink">Results</h1>
          <p className="mt-1 text-[11.5px] text-ink-3">Three experiments and two things that were not · shown in one table on purpose</p>
        </div>
        <Button type="button" onClick={() => toast.success("Exported")}>
          Export
        </Button>
      </div>

      <ExperimentsTabs active="Results" />

      <section className="space-y-3">
        <p className={EYEBROW_CLASS}>Every experiment that has closed</p>
        <div className="overflow-x-auto rounded-card border border-line bg-paper">
          <table className="w-full min-w-[920px] text-left text-[11.5px]">
            <thead>
              <tr className="border-b border-line bg-paper-2">
                <th className={HEAD_CLASS}>Experiment</th>
                <th className={`${HEAD_CLASS} text-right`}>Closed</th>
                <th className={`${HEAD_CLASS} text-right`}>Treated</th>
                <th className={`${HEAD_CLASS} text-right`}>Held</th>
                <th className={`${HEAD_CLASS} text-right`}>Difference</th>
                <th className={`${HEAD_CLASS} text-right`}>Result</th>
                <th className={`${HEAD_CLASS} text-right`}>Pre-registered?</th>
              </tr>
            </thead>
            <tbody>
              {XP06_ROWS.map((row) => (
                <tr key={row.experiment} className="border-b border-line last:border-0">
                  <td className="px-4 py-3 font-semibold whitespace-nowrap">
                    {row.id ? (
                      <Link to={`/experiments/${row.id}`} className="text-ultra hover:underline">
                        {row.experiment}
                      </Link>
                    ) : (
                      <span className="text-ink-2">{row.experiment}</span>
                    )}
                  </td>
                  <td className="px-4 py-3 text-right font-mono text-ink-4">{row.closed}</td>
                  <td className="px-4 py-3 text-right font-mono text-ink">{row.treated}</td>
                  <td className="px-4 py-3 text-right font-mono text-ink-4">{row.held}</td>
                  <td className="px-4 py-3 text-right font-mono text-ink">{row.difference}</td>
                  <td className={`px-4 py-3 text-right ${EX_TONE_CLASS[row.resultTone]}`}>{row.result}</td>
                  <td className="px-4 py-3 text-right">
                    <Chip tone={EX_CHIP_TONE[row.preRegisteredTone]}>{row.preRegistered}</Chip>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      <Callout tone="rose" title="Three experiments and two things that were never experiments, in one table on purpose">
        The bottom two rows had no held group and are shown here so that the shape is unavoidable: the ₦188M
        onboarding figure is the largest number in the ledger and the weakest evidence in it, sitting two rows below
        a ₦31M figure nobody can argue with. Separating them into different screens would let each be quoted
        without the other.
      </Callout>

      <section className="space-y-3">
        <p className={EYEBROW_CLASS}>What every closed experiment carries with it, permanently</p>
        <ExperimentsKvList rows={XP06_KV_ROWS} />
      </section>
    </div>
  );
};

export default ExperimentsResultsRoute;
