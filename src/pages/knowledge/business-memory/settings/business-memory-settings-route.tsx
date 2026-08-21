import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { EYEBROW_CLASS } from "@/pages/everyday/lifecycle/data";
import { Callout } from "@/pages/everyday/lifecycle/stage/rail";
import { Chip } from "@/pages/everyday/lifecycle/stage/chip";
import { StageSubpageHeader } from "@/pages/everyday/lifecycle/stage/stage-subpage-header";
import { BusinessMemoryKvList } from "@/pages/knowledge/business-memory/kv-list";
import { ME17_NOTE, ME17_RULE_ROWS, ME17_USED_ELSEWHERE_ROWS } from "@/pages/knowledge/business-memory/data";

const HEAD_CLASS = "px-4 py-2.5 font-mono text-[8.5px] font-medium tracking-[0.8px] text-ink-4 uppercase";

/** ME17 — /settings/business-memory, outside the /business-memory tree, matching the /settings/leakage-map precedent. */
const BusinessMemorySettingsRoute = () => {
  return (
    <div className="space-y-8">
      <StageSubpageHeader
        crumbs={[{ label: "Business memory", to: "/business-memory" }, { label: "Settings" }]}
        title="Business memory settings"
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
              <th className={`${HEAD_CLASS} text-right`}>Currently</th>
              <th className={HEAD_CLASS}>Who set it</th>
              <th className={`${HEAD_CLASS} text-right`}>Can you change it?</th>
              <th className={`${HEAD_CLASS} text-right`}>State</th>
            </tr>
          </thead>
          <tbody>
            {ME17_RULE_ROWS.map((row) => (
              <tr key={row.rule} className="border-b border-line last:border-0">
                <td className="px-4 py-3 font-semibold text-ink-2">{row.rule}</td>
                <td className="px-4 py-3 text-right font-mono text-ink-3">{row.currently}</td>
                <td className="px-4 py-3 text-ink-4">{row.who}</td>
                <td className="px-4 py-3 text-right">
                  <Chip tone={row.canChange ? "teal" : "rose"}>{row.canChange ? "yes" : "no"}</Chip>
                </td>
                <td className="px-4 py-3 text-right">
                  <Chip tone={row.stateTone === "off" ? "neutral" : "teal"}>{row.state}</Chip>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <Callout tone="amber" title="Promotion by citation count is the one people ask for and it is the most dangerous">
        {ME17_NOTE}
      </Callout>

      <section className="space-y-3">
        <p className={EYEBROW_CLASS}>Where business memory is read from</p>
        <BusinessMemoryKvList rows={ME17_USED_ELSEWHERE_ROWS} />
      </section>
    </div>
  );
};

export default BusinessMemorySettingsRoute;
