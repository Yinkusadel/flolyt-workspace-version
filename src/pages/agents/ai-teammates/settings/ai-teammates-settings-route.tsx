import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { EYEBROW_CLASS } from "@/pages/everyday/lifecycle/data";
import { Callout } from "@/pages/everyday/lifecycle/stage/rail";
import { Chip } from "@/pages/everyday/lifecycle/stage/chip";
import { StageSubpageHeader } from "@/pages/everyday/lifecycle/stage/stage-subpage-header";
import { TeammatesKvList } from "@/pages/agents/ai-teammates/kv-list";
import { TM17_ELSEWHERE_KV, TM17_ROWS, TM_CHIP_TONE, TM_TONE_CLASS } from "@/pages/agents/ai-teammates/data";

const HEAD_CLASS = "px-4 py-2.5 font-mono text-[8.5px] font-medium tracking-[0.8px] text-ink-4 uppercase";

/** TM17 — /settings/ai-teammates, outside the /ai-teammates tree, matching the /settings/attribution precedent. */
const AiTeammatesSettingsRoute = () => {
  return (
    <div className="space-y-8">
      <StageSubpageHeader
        crumbs={[{ label: "AI teammates", to: "/ai-teammates" }, { label: "Settings" }]}
        title="Teammate settings"
        subtitle="Eleven rules · three are yours, five cannot be turned off, three can never be turned on"
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
            {TM17_ROWS.map((row) => (
              <tr key={row.rule} className="border-b border-line last:border-0">
                <td className="px-4 py-3 font-semibold text-ink-2">{row.rule}</td>
                <td className={`px-4 py-3 text-right font-mono ${TM_TONE_CLASS[row.currentlyTone]}`}>{row.currently}</td>
                <td className="px-4 py-3 text-ink-4">{row.who}</td>
                <td className="px-4 py-3">
                  <Chip tone={row.canChange ? "teal" : "rose"}>{row.canChange ? "yes" : "no"}</Chip>
                </td>
                <td className="px-4 py-3">
                  <Chip tone={TM_CHIP_TONE[row.stateTone]}>{row.state}</Chip>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <Callout tone="amber" title="The last rule is the one that keeps thirty-six findings visibly unread">
        Routing to the nearest available person would empty the Adopt and Churn queues by Friday and give both
        stages an owner who never agreed to be one. That person then stops reading agent findings entirely, and the
        stage is worse off than when it was visibly unowned. The count staying uncomfortable is the mechanism.
      </Callout>

      <section className="space-y-3">
        <p className={EYEBROW_CLASS}>Where agents appear outside this section</p>
        <TeammatesKvList rows={TM17_ELSEWHERE_KV} />
      </section>
    </div>
  );
};

export default AiTeammatesSettingsRoute;
