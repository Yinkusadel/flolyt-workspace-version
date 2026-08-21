import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { EYEBROW_CLASS } from "@/pages/everyday/lifecycle/data";
import { Callout } from "@/pages/everyday/lifecycle/stage/rail";
import { Chip } from "@/pages/everyday/lifecycle/stage/chip";
import { StageSubpageHeader } from "@/pages/everyday/lifecycle/stage/stage-subpage-header";
import { AttributionKvList } from "@/pages/revenue/attribution/kv-list";
import { AT15_PUBLISH_KV, AT15_ROWS, AT_CHIP_TONE, AT_TONE_CLASS } from "@/pages/revenue/attribution/data";

const HEAD_CLASS = "px-4 py-2.5 font-mono text-[8.5px] font-medium tracking-[0.8px] text-ink-4 uppercase";

/** AT15 — /settings/attribution, outside the /attribution tree, matching the /settings/scenario precedent. */
const AttributionSettingsRoute = () => {
  return (
    <div className="space-y-8">
      <StageSubpageHeader
        crumbs={[{ label: "Attribution", to: "/attribution" }, { label: "Settings" }]}
        title="Attribution settings"
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
            {AT15_ROWS.map((row) => (
              <tr key={row.rule} className="border-b border-line last:border-0">
                <td className="px-4 py-3 font-semibold text-ink-2">{row.rule}</td>
                <td className={`px-4 py-3 text-right font-mono ${AT_TONE_CLASS[row.currentlyTone]}`}>{row.currently}</td>
                <td className="px-4 py-3 text-ink-4">{row.who}</td>
                <td className="px-4 py-3">
                  <Chip tone={row.canChange ? "teal" : "rose"}>{row.canChange ? "yes" : "no"}</Chip>
                </td>
                <td className="px-4 py-3">
                  <Chip tone={AT_CHIP_TONE[row.stateTone]}>{row.state}</Chip>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <Callout tone="amber" title="The two settings that are yours both make measurement harder or easier, not truer">
        Holdout sizes are a resourcing decision and belong to Ada. The seven that are fixed are the ones where a
        change would make a weak figure look like a strong one — hiding the method, splitting a disputed figure,
        crediting a person, or measuring against a forecast. None of those would show up as an error afterwards,
        which is precisely why they are not settings.
      </Callout>

      <section className="space-y-3">
        <p className={EYEBROW_CLASS}>What the section publishes about itself</p>
        <AttributionKvList rows={AT15_PUBLISH_KV} />
      </section>
    </div>
  );
};

export default AttributionSettingsRoute;
