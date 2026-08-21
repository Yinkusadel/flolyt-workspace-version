import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { EYEBROW_CLASS } from "@/pages/everyday/lifecycle/data";
import { Callout } from "@/pages/everyday/lifecycle/stage/rail";
import { Chip } from "@/pages/everyday/lifecycle/stage/chip";
import { StageSubpageHeader } from "@/pages/everyday/lifecycle/stage/stage-subpage-header";
import { CampaignsKvList } from "@/pages/customers/campaigns/kv-list";
import { CP17_KV_ROWS, CP17_RULE_ROWS } from "@/pages/customers/campaigns/data";

const HEAD_CLASS = "px-4 py-2.5 font-mono text-[8.5px] font-medium tracking-[0.8px] text-ink-4 uppercase";

/** CP17 — /settings/campaigns, outside the /campaigns tree, matching the /settings/segments precedent. */
const CampaignsSettingsRoute = () => {
  return (
    <div className="space-y-8">
      <StageSubpageHeader
        crumbs={[{ label: "Campaigns", to: "/campaigns" }, { label: "Settings" }]}
        title="Campaign settings"
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
            {CP17_RULE_ROWS.map((row) => (
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

      <Callout tone="amber" title="The three that can never be turned on are the three that would make sends cheap">
        Bulk approval, agent sending and one-to-one messages each remove a person from a decision that reaches real
        people. There is no permission level, no admin override and no enterprise plan that enables them, which is
        worth stating on the settings screen rather than in a policy document nobody reads.
      </Callout>

      <section className="space-y-3">
        <p className={EYEBROW_CLASS}>Changing a guardrail changes every report that follows it</p>
        <CampaignsKvList rows={CP17_KV_ROWS} />
      </section>
    </div>
  );
};

export default CampaignsSettingsRoute;
