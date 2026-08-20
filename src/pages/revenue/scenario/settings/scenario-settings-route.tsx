import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { EYEBROW_CLASS } from "@/pages/everyday/lifecycle/data";
import { Callout } from "@/pages/everyday/lifecycle/stage/rail";
import { Chip } from "@/pages/everyday/lifecycle/stage/chip";
import { StageSubpageHeader } from "@/pages/everyday/lifecycle/stage/stage-subpage-header";
import { ScenarioKvList } from "@/pages/revenue/scenario/kv-list";
import { SC14_KV_ROWS, SC14_ROWS, SC_CHIP_TONE, SC_TONE_CLASS } from "@/pages/revenue/scenario/data";

const HEAD_CLASS = "px-4 py-2.5 font-mono text-[8.5px] font-medium tracking-[0.8px] text-ink-4 uppercase";

/** SC14 — /settings/scenario, outside the /scenario tree, matching the /settings/funnel precedent. */
const ScenarioSettingsRoute = () => {
  return (
    <div className="space-y-8">
      <StageSubpageHeader
        crumbs={[{ label: "Scenario", to: "/scenario" }, { label: "Settings" }]}
        title="Scenario settings"
        subtitle="Nine rules · two are yours, four cannot be turned off, three cannot be turned on"
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
            {SC14_ROWS.map((row) => (
              <tr key={row.rule} className="border-b border-line last:border-0">
                <td className="px-4 py-3 font-semibold text-ink-2">{row.rule}</td>
                <td className={`px-4 py-3 text-right font-mono ${SC_TONE_CLASS[row.currentlyTone]}`}>{row.currently}</td>
                <td className="px-4 py-3 text-ink-4">{row.who}</td>
                <td className="px-4 py-3">
                  <Chip tone={row.canChange ? "teal" : "rose"}>{row.canChange ? "yes" : "no"}</Chip>
                </td>
                <td className="px-4 py-3">
                  <Chip tone={SC_CHIP_TONE[row.stateTone]}>{row.state}</Chip>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <Callout tone="amber" title="Anyone can model a change and nobody can turn one into a plan">
        The permission that is open is the harmless one — asking what something would be worth costs nothing and is
        worth encouraging. The three that are closed are the ones where a question would quietly become a
        commitment: an agent opening scenarios at scale, a range entering the forecast, or a blank input filled with
        a plausible market figure.
      </Callout>

      <section className="space-y-3">
        <p className={EYEBROW_CLASS}>What is kept, and for how long</p>
        <ScenarioKvList rows={SC14_KV_ROWS} />
      </section>
    </div>
  );
};

export default ScenarioSettingsRoute;
