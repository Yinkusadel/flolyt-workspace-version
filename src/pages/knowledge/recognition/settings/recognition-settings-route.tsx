import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { EYEBROW_CLASS } from "@/pages/everyday/lifecycle/data";
import { Callout } from "@/pages/everyday/lifecycle/stage/rail";
import { Chip } from "@/pages/everyday/lifecycle/stage/chip";
import { StageSubpageHeader } from "@/pages/everyday/lifecycle/stage/stage-subpage-header";
import { RecognitionKvList } from "@/pages/knowledge/recognition/kv-list";
import { RC13_BAD_AT_ROWS, RC13_NOTE, RC13_RULE_ROWS, RC_TONE_CLASS } from "@/pages/knowledge/recognition/data";

const HEAD_CLASS = "px-4 py-2.5 font-mono text-[8.5px] font-medium tracking-[0.8px] text-ink-4 uppercase";

/** RC13 — /settings/recognition, outside the /recognition tree, matching the /settings/community precedent. */
const RecognitionSettingsRoute = () => {
  return (
    <div className="space-y-8">
      <StageSubpageHeader
        crumbs={[{ label: "Recognition", to: "/recognition" }, { label: "Settings" }]}
        title="Recognition settings"
        subtitle="Eleven rules · two are yours, four cannot be turned off, five can never be turned on"
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
            {RC13_RULE_ROWS.map((row) => (
              <tr key={row.rule} className="border-b border-line last:border-0">
                <td className="px-4 py-3 font-semibold text-ink-2">{row.rule}</td>
                <td className={cn("px-4 py-3 text-right font-mono", RC_TONE_CLASS[row.currentlyTone])}>{row.currently}</td>
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

      <Callout tone="rose" title="Export to a performance system is refused, and that refusal is the one that protects the rest">
        {RC13_NOTE}
      </Callout>

      <section className="space-y-3">
        <p className={EYEBROW_CLASS}>What this section is deliberately bad at</p>
        <RecognitionKvList rows={RC13_BAD_AT_ROWS} />
      </section>
    </div>
  );
};

export default RecognitionSettingsRoute;
