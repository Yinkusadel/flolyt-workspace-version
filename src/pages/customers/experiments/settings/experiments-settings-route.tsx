import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { EYEBROW_CLASS } from "@/pages/everyday/lifecycle/data";
import { Callout } from "@/pages/everyday/lifecycle/stage/rail";
import { Chip } from "@/pages/everyday/lifecycle/stage/chip";
import { StageSubpageHeader } from "@/pages/everyday/lifecycle/stage/stage-subpage-header";
import { ExperimentsKvList } from "@/pages/customers/experiments/kv-list";
import { XP15_KV_ROWS, XP15_RULE_ROWS } from "@/pages/customers/experiments/data";

const HEAD_CLASS = "px-4 py-2.5 font-mono text-[8.5px] font-medium tracking-[0.8px] text-ink-4 uppercase";

/** XP15 — /settings/experiments, outside the /experiments tree, matching the /settings/campaigns precedent. */
const ExperimentsSettingsRoute = () => {
  return (
    <div className="space-y-8">
      <StageSubpageHeader
        crumbs={[{ label: "Experiments", to: "/experiments" }, { label: "Settings" }]}
        title="Experiment settings"
        subtitle="Eleven rules · three are yours, five cannot be turned off, three can never be turned on"
        action={
          <Button type="button" onClick={() => toast.success("Settings saved")}>
            Save
          </Button>
        }
      />

      <div className="overflow-x-auto rounded-card border border-line bg-paper">
        <table className="w-full min-w-[820px] text-left text-[11.5px]">
          <thead>
            <tr className="border-b border-line bg-paper-2">
              <th className={HEAD_CLASS}>Rule</th>
              <th className="px-4 py-2.5 text-right font-mono text-[8.5px] font-medium tracking-[0.8px] text-ink-4 uppercase">Currently</th>
              <th className={HEAD_CLASS}>Who set it</th>
              <th className={HEAD_CLASS}>Can you change it?</th>
              <th className={HEAD_CLASS}>State</th>
            </tr>
          </thead>
          <tbody>
            {XP15_RULE_ROWS.map((row) => (
              <tr key={row.rule} className="border-b border-line last:border-0">
                <td className="px-4 py-3 font-semibold text-ink-2">{row.rule}</td>
                <td className="px-4 py-3 text-right font-mono text-ink-3">{row.currently}</td>
                <td className="px-4 py-3 text-ink-4">{row.whoSetIt}</td>
                <td className="px-4 py-3">
                  <Chip tone={row.canChange ? "teal" : "rose"}>{row.canChange ? "yes" : "no"}</Chip>
                </td>
                <td className="px-4 py-3">
                  <Chip tone={row.stateTone === "neutral" ? "neutral" : "teal"}>{row.state}</Chip>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <Callout tone="amber" title="Raising the maximum simultaneous holds is the setting to be careful with">
        It currently sits at two, which is what keeps 2,900 people out of every experiment and keeps anybody from
        being held back from three things at once. Moving it to three would make every experiment easier to staff
        and would mean a small group of customers quietly receives less of everything the company does.
      </Callout>

      <section className="space-y-3">
        <p className={EYEBROW_CLASS}>What this section publishes about itself</p>
        <ExperimentsKvList rows={XP15_KV_ROWS} />
      </section>
    </div>
  );
};

export default ExperimentsSettingsRoute;
