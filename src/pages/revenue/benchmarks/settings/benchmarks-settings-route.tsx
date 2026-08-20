import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { EYEBROW_CLASS } from "@/pages/everyday/lifecycle/data";
import { Callout } from "@/pages/everyday/lifecycle/stage/rail";
import { Chip } from "@/pages/everyday/lifecycle/stage/chip";
import { StageSubpageHeader } from "@/pages/everyday/lifecycle/stage/stage-subpage-header";
import { BenchmarksKvList } from "@/pages/revenue/benchmarks/kv-list";
import { BM14_PUBLISH_KV, BM14_ROWS, BM_CHIP_TONE, BM_TONE_CLASS } from "@/pages/revenue/benchmarks/data";

const HEAD_CLASS = "px-4 py-2.5 font-mono text-[8.5px] font-medium tracking-[0.8px] text-ink-4 uppercase";

/** BM13 (disk BM14) — /settings/benchmarks, outside the /benchmarks tree, matching the /settings/attribution precedent. */
const BenchmarksSettingsRoute = () => {
  return (
    <div className="space-y-8">
      <StageSubpageHeader
        crumbs={[{ label: "Benchmarks", to: "/benchmarks" }, { label: "Settings" }]}
        title="Benchmark settings"
        subtitle="Ten rules · two are yours, five cannot be turned off, three can never be turned on"
        action={
          <Button type="button" onClick={() => toast.success("Settings saved")}>
            Save
          </Button>
        }
      />

      <div className="overflow-x-auto rounded-card border border-line bg-paper">
        <table className="w-full min-w-[780px] text-left text-[11.5px]">
          <thead>
            <tr className="border-b border-line bg-paper-2">
              <th className={HEAD_CLASS}>Rule</th>
              <th className={`${HEAD_CLASS} text-right`}>Currently</th>
              <th className={HEAD_CLASS}>Who set it</th>
              <th className={HEAD_CLASS}>Can you change it?</th>
              <th className={HEAD_CLASS}>State</th>
            </tr>
          </thead>
          <tbody>
            {BM14_ROWS.map((row) => (
              <tr key={row.rule} className="border-b border-line last:border-0">
                <td className="px-4 py-3 font-semibold text-ink-2">{row.rule}</td>
                <td className={`px-4 py-3 text-right font-mono ${BM_TONE_CLASS[row.currentlyTone]}`}>{row.currently}</td>
                <td className="px-4 py-3 text-ink-4">{row.who}</td>
                <td className="px-4 py-3">
                  <Chip tone={row.canChange ? "teal" : "rose"}>{row.canChange ? "yes" : "no"}</Chip>
                </td>
                <td className="px-4 py-3">
                  <Chip tone={BM_CHIP_TONE[row.stateTone]}>{row.state}</Chip>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <Callout tone="amber" title="The three that can never be turned on are the three that would make this section popular">
        An industry benchmark, a health score and a league table are the features most often asked for, and each
        one would turn a set of careful comparisons into a number people quote without the definition. They are
        listed here, permanently off, so the answer is visible rather than being a thing the product happens not
        to do yet.
      </Callout>

      <section className="space-y-3">
        <p className={EYEBROW_CLASS}>What the section publishes about itself</p>
        <BenchmarksKvList rows={BM14_PUBLISH_KV} />
      </section>
    </div>
  );
};

export default BenchmarksSettingsRoute;
