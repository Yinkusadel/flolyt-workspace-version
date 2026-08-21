import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { EYEBROW_CLASS } from "@/pages/everyday/lifecycle/data";
import { Callout } from "@/pages/everyday/lifecycle/stage/rail";
import { Chip } from "@/pages/everyday/lifecycle/stage/chip";
import { ScenarioKvList } from "@/pages/revenue/scenario/kv-list";
import { ScenarioTabs } from "@/pages/revenue/scenario/tabs";
import { SC09_INSIDE_CHIP, SC09_KV_ROWS, SC09_ROWS, SC_TONE_CLASS } from "@/pages/revenue/scenario/data";

const HEAD_CLASS = "px-4 py-2.5 font-mono text-[8.5px] font-medium tracking-[0.8px] text-ink-4 uppercase";

/** SC09 — /scenario/actuals. */
const ScenarioActualsRoute = () => {
  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-[17px] font-semibold text-ink">Scenario</h1>
        <p className="mt-1 text-[11.5px] text-ink-3">
          Scenarios that were later run · the only rows this tool can be judged on
        </p>
      </div>

      <ScenarioTabs active="Against what happened" />

      <div className="flex flex-wrap items-center justify-between gap-3">
        <p className={EYEBROW_CLASS}>Scenarios that were later run · the only rows on which this tool can be judged</p>
        <Button type="button" size="sm" variant="outline" onClick={() => toast.success("Record exported")}>
          Export the record
        </Button>
      </div>

      <div className="overflow-x-auto rounded-card border border-line bg-paper">
        <table className="w-full min-w-[760px] text-left text-[11.5px]">
          <thead>
            <tr className="border-b border-line bg-paper-2">
              <th className={HEAD_CLASS}>Scenario</th>
              <th className={HEAD_CLASS}>What was modelled</th>
              <th className={`${HEAD_CLASS} text-right`}>Range</th>
              <th className={`${HEAD_CLASS} text-right`}>Actual</th>
              <th className={HEAD_CLASS}>Inside?</th>
              <th className={HEAD_CLASS}>Why it landed where it did</th>
            </tr>
          </thead>
          <tbody>
            {SC09_ROWS.map((row) => (
              <tr key={row.id} className="border-b border-line last:border-0">
                <td className="px-4 py-3 font-semibold text-ink">{row.id}</td>
                <td className="px-4 py-3 text-ink-2">{row.what}</td>
                <td className="px-4 py-3 text-right font-mono text-ink-4">{row.range}</td>
                <td className={`px-4 py-3 text-right font-mono ${SC_TONE_CLASS[row.actualTone]}`}>{row.actual}</td>
                <td className="px-4 py-3">
                  <Chip tone={SC09_INSIDE_CHIP[row.inside]}>{row.inside}</Chip>
                </td>
                <td className="px-4 py-3 text-ink-3">{row.why}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <Callout tone="amber" title="One of four was outside the range, two can never be scored, and the record is one from two">
        S-062 was under by ₦11M because nobody modelled the payday cycle — a real miss, kept here permanently with
        the reason. Two more were run without a holdout, so this tool will never learn anything from them. A
        scenario feature that only displayed its successes would be indistinguishable from one that has never been
        checked.
      </Callout>

      <section className="space-y-3">
        <p className={EYEBROW_CLASS}>What has been learned, and written into the next model</p>
        <ScenarioKvList rows={SC09_KV_ROWS} />
      </section>

      <Callout tone="neutral" title="Two of four is the honest hit rate and it is printed rather than computed into a score">
        There is no accuracy percentage on this screen. Four is too few to average, two of them are unscoreable, and
        a single figure would be quoted as though the tool had a track record. The four rows and their reasons are
        the track record.
      </Callout>
    </div>
  );
};

export default ScenarioActualsRoute;
