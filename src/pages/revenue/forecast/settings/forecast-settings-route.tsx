import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { EYEBROW_CLASS } from "@/pages/everyday/lifecycle/data";
import { Callout } from "@/pages/everyday/lifecycle/stage/rail";
import { Chip } from "@/pages/everyday/lifecycle/stage/chip";
import { StageSubpageHeader } from "@/pages/everyday/lifecycle/stage/stage-subpage-header";
import { ForecastKvList } from "@/pages/revenue/forecast/kv-list";
import { FC13_RELATED_KV, FC13_ROWS, FC_CHIP_TONE, FC_TONE_CLASS } from "@/pages/revenue/forecast/data";

const HEAD_CLASS = "px-4 py-2.5 font-mono text-[8.5px] font-medium tracking-[0.8px] text-ink-4 uppercase";

/** FC13 (disk) — /settings/forecast, outside the /forecast tree, matching the /settings/benchmarks precedent. */
const ForecastSettingsRoute = () => {
  return (
    <div className="space-y-8">
      <StageSubpageHeader
        crumbs={[{ label: "Forecast", to: "/forecast" }, { label: "Settings" }]}
        title="Forecast settings"
        subtitle="Eleven rules · two are yours, five cannot be turned off, four can never be turned on"
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
            {FC13_ROWS.map((row) => (
              <tr key={row.rule} className="border-b border-line last:border-0">
                <td className="px-4 py-3 font-semibold text-ink-2">{row.rule}</td>
                <td className={`px-4 py-3 text-right font-mono ${FC_TONE_CLASS[row.currentlyTone]}`}>{row.currently}</td>
                <td className="px-4 py-3 text-ink-4">{row.who}</td>
                <td className="px-4 py-3">
                  <Chip tone={row.canChange ? "teal" : "rose"}>{row.canChange ? "yes" : "no"}</Chip>
                </td>
                <td className="px-4 py-3">
                  <Chip tone={FC_CHIP_TONE[row.stateTone]}>{row.state}</Chip>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <Callout tone="amber" title="The four that can never be turned on are the four that would remove the person">
        A model signing, a stale figure rolling forward, an accuracy score and a scenario promoting itself all end
        in the same place: a number in the workspace that nobody is standing behind. Everything else in Revenue is
        measured, and this is the one section whose entire content is somebody's judgement — so the settings
        protect the judgement rather than the number.
      </Callout>

      <section className="space-y-3">
        <p className={EYEBROW_CLASS}>How Forecast relates to the sections either side of it</p>
        <div className="max-w-2xl">
          <ForecastKvList rows={FC13_RELATED_KV} />
        </div>
      </section>
    </div>
  );
};

export default ForecastSettingsRoute;
