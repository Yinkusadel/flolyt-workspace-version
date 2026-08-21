import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { EYEBROW_CLASS } from "@/pages/everyday/lifecycle/data";
import { Callout } from "@/pages/everyday/lifecycle/stage/rail";
import { Chip } from "@/pages/everyday/lifecycle/stage/chip";
import { StageSubpageHeader } from "@/pages/everyday/lifecycle/stage/stage-subpage-header";
import { CommunityKvList } from "@/pages/knowledge/community/kv-list";
import { CM13_CONNECTS_ROWS, CM13_NOTE, CM13_RULE_ROWS, CM_TONE_CLASS } from "@/pages/knowledge/community/data";

const HEAD_CLASS = "px-4 py-2.5 font-mono text-[8.5px] font-medium tracking-[0.8px] text-ink-4 uppercase";

/** CM13 — /settings/community, outside the /community tree, matching the /settings/playbooks precedent. */
const CommunitySettingsRoute = () => {
  return (
    <div className="space-y-8">
      <StageSubpageHeader
        crumbs={[{ label: "Community", to: "/community" }, { label: "Settings" }]}
        title="Community settings"
        subtitle="Ten rules · three are yours, four cannot be turned off, three can never be turned on"
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
            {CM13_RULE_ROWS.map((row) => (
              <tr key={row.rule} className="border-b border-line last:border-0">
                <td className="px-4 py-3 font-semibold text-ink-2">{row.rule}</td>
                <td className={cn("px-4 py-3 text-right font-mono", CM_TONE_CLASS[row.currentlyTone])}>{row.currently}</td>
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

      <Callout tone="teal" title="Turning the community off removes 214 methods and keeps the six you adopted">
        {CM13_NOTE}
      </Callout>

      <section className="space-y-3">
        <p className={EYEBROW_CLASS}>Where community sits relative to the rest of the workspace</p>
        <CommunityKvList rows={CM13_CONNECTS_ROWS} />
      </section>
    </div>
  );
};

export default CommunitySettingsRoute;
