import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { EYEBROW_CLASS } from "@/pages/everyday/lifecycle/data";
import { Callout } from "@/pages/everyday/lifecycle/stage/rail";
import { Chip } from "@/pages/everyday/lifecycle/stage/chip";
import { StageSubpageHeader } from "@/pages/everyday/lifecycle/stage/stage-subpage-header";
import { HealthKvList } from "@/pages/customers/customer-health/kv-list";
import { HL15_RULE_ROWS, HL15_USED_ELSEWHERE_ROWS } from "@/pages/customers/customer-health/data";

const HEAD_CLASS = "px-4 py-2.5 font-mono text-[8.5px] font-medium tracking-[0.8px] text-ink-4 uppercase";

/** HL15 — /settings/customer-health, outside the /customer-health tree, matching the /settings/segments precedent. */
const CustomerHealthSettingsRoute = () => {
  return (
    <div className="space-y-8">
      <StageSubpageHeader
        crumbs={[{ label: "Customer health", to: "/customer-health" }, { label: "Settings" }]}
        title="Customer health settings"
        subtitle="Eleven rules · two are yours, five cannot be turned off, four can never be turned on"
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
            {HL15_RULE_ROWS.map((row) => (
              <tr key={row.rule} className="border-b border-line last:border-0">
                <td className="px-4 py-3 font-semibold text-ink-2">{row.rule}</td>
                <td className="px-4 py-3 text-right font-mono text-ink-3">{row.currently}</td>
                <td className="px-4 py-3 text-ink-4">{row.who}</td>
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

      <Callout tone="amber" title="The four that can never be turned on are four ways of saying the same thing">
        A score, a flag, a ranking and a self-adjusting threshold all end with a judgement about a person that no
        person made and nobody can argue with. This section will describe six behaviours in detail and will not sum
        them, because the sum is the point at which the description stops being checkable.
      </Callout>

      <section className="space-y-3">
        <p className={EYEBROW_CLASS}>Where health signals are used elsewhere</p>
        <HealthKvList rows={HL15_USED_ELSEWHERE_ROWS} />
      </section>
    </div>
  );
};

export default CustomerHealthSettingsRoute;
