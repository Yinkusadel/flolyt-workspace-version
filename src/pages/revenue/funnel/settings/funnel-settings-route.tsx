import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { EYEBROW_CLASS } from "@/pages/everyday/lifecycle/data";
import { Callout } from "@/pages/everyday/lifecycle/stage/rail";
import { Chip } from "@/pages/everyday/lifecycle/stage/chip";
import { StageSubpageHeader } from "@/pages/everyday/lifecycle/stage/stage-subpage-header";
import { FunnelKvList } from "@/pages/revenue/funnel/kv-list";
import { FN13_REFUSE_ROWS, FN13_RULE_ROWS, FN_CHIP_TONE, FN_TONE_CLASS } from "@/pages/revenue/funnel/data";

const HEAD_CLASS = "px-4 py-2.5 font-mono text-[8.5px] font-medium tracking-[0.8px] text-ink-4 uppercase";

/** FN13 — /settings/funnel, outside the /funnel tree, matching the /settings/leakage-map precedent. */
const FunnelSettingsRoute = () => {
  return (
    <div className="space-y-8">
      <StageSubpageHeader
        crumbs={[{ label: "Funnel", to: "/funnel" }, { label: "Settings" }]}
        title="What counts as a step"
        subtitle="Eight rules · three are yours, four cannot be turned off, one cannot be turned on"
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
            {FN13_RULE_ROWS.map((row) => (
              <tr key={row.rule} className="border-b border-line last:border-0">
                <td className="px-4 py-3 font-semibold text-ink-2">{row.rule}</td>
                <td className={`px-4 py-3 text-right font-mono ${FN_TONE_CLASS[row.currentlyTone]}`}>{row.currently}</td>
                <td className="px-4 py-3 text-ink-4">{row.who}</td>
                <td className="px-4 py-3">
                  <Chip tone={row.canChange ? "teal" : "rose"}>{row.canChange ? "yes" : "no"}</Chip>
                </td>
                <td className="px-4 py-3">
                  <Chip tone={FN_CHIP_TONE[row.stateTone]}>{row.state}</Chip>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <Callout tone="amber" title="The two windows are the only settings here that can quietly change history">
        Moving "reached value" from 30 days to 60 would lift the figure by roughly four points across every period at
        once, and it would look like an improvement. The field shows the size of the retroactive shift before you
        save, writes it to the definition log, and marks the changeover on every chart afterwards.
      </Callout>

      <section className="space-y-3">
        <p className={EYEBROW_CLASS}>What the funnel refuses to do</p>
        <FunnelKvList rows={FN13_REFUSE_ROWS} />
      </section>
    </div>
  );
};

export default FunnelSettingsRoute;
