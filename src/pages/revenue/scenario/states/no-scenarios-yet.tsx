import { Button } from "@/components/ui/button";
import { EYEBROW_CLASS } from "@/pages/everyday/lifecycle/data";
import { Callout } from "@/pages/everyday/lifecycle/stage/rail";
import { Chip } from "@/pages/everyday/lifecycle/stage/chip";
import { SC01_ROWS, SC_TONE_CLASS } from "@/pages/revenue/scenario/data";

const HEAD_CLASS = "px-4 py-2.5 font-mono text-[8.5px] font-medium tracking-[0.8px] text-ink-4 uppercase";

/** SC01 — before anything has been modelled. Wired but unreachable with SCENARIO_STATE's current default. */
export function NoScenariosYetState() {
  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-[17px] font-semibold text-ink">Scenario</h1>
        <p className="mt-1 text-[11.5px] text-ink-3">Nothing modelled · two changes could be, three cannot</p>
      </div>

      <div className="rounded-surface border border-dashed border-line bg-paper p-8 text-center sm:p-10">
        <h2 className="text-[16px] font-semibold text-ink sm:text-[17px]">Nothing has been modelled yet</h2>
        <p className="mx-auto mt-3 max-w-xl text-[11.5px] leading-relaxed text-ink-3">
          A scenario asks what a change would be worth before anybody does it. It needs a change to model, a
          population it would reach, and at least one assumption you are prepared to defend out loud.
        </p>
        <div className="mt-5 flex flex-wrap items-center justify-center gap-3">
          <Button type="button">Model a change</Button>
          <Button type="button" variant="outline">
            See what could be modelled
          </Button>
        </div>
        <p className="mx-auto mt-5 max-w-lg text-[10px] text-ink-4">
          Six things on the leakage map could be modelled today. Four of them cannot be, and the list says which.
        </p>
      </div>

      <section className="space-y-3">
        <p className={EYEBROW_CLASS}>What could be modelled right now</p>
        <div className="overflow-x-auto rounded-card border border-line bg-paper">
          <table className="w-full min-w-[680px] text-left text-[11.5px]">
            <thead>
              <tr className="border-b border-line bg-paper-2">
                <th className={HEAD_CLASS}>Change</th>
                <th className={HEAD_CLASS}>Where it comes from</th>
                <th className={`${HEAD_CLASS} text-right`}>Can it be modelled?</th>
                <th className={`${HEAD_CLASS} text-right`}>Why not</th>
              </tr>
            </thead>
            <tbody>
              {SC01_ROWS.map((row) => (
                <tr key={row.change} className="border-b border-line last:border-0">
                  <td className="px-4 py-3 font-semibold text-ink">{row.change}</td>
                  <td className="px-4 py-3 text-ink-3">{row.from}</td>
                  <td className="px-4 py-3 text-right">
                    <Chip tone={row.can === "yes" ? "teal" : "rose"}>{row.can}</Chip>
                  </td>
                  <td className={`px-4 py-3 text-right ${row.whyTone ? SC_TONE_CLASS[row.whyTone] : "text-ink-2"}`}>{row.why}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      <Callout tone="amber" title="The last row is blocked by a person, not by data">
        Everything needed to model a feature-depth prompt exists — the cohorts, the gap, the population. What is
        missing is somebody who would decide on the result, and a scenario nobody would act on is an argument with
        itself. It is listed as blocked rather than quietly omitted, because the reason is fixable in one click and
        the data ones are not.
      </Callout>
    </div>
  );
}
