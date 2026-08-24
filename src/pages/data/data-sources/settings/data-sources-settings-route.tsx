import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { EYEBROW_CLASS } from "@/pages/everyday/lifecycle/data";
import { Callout } from "@/pages/everyday/lifecycle/stage/rail";
import { Chip } from "@/pages/everyday/lifecycle/stage/chip";
import { StageSubpageHeader } from "@/pages/everyday/lifecycle/stage/stage-subpage-header";
import { DataSourcesKvList } from "@/pages/data/data-sources/kv-list";
import { DS17_ELSEWHERE_KV, DS17_RULE_ROWS, DS_TONE_CLASS } from "@/pages/data/data-sources/data";

const HEAD_CLASS = "px-4 py-2.5 font-mono text-[8.5px] font-medium tracking-[0.8px] text-ink-4 uppercase";

/** DS17 — /settings/data-sources, outside the /data-sources tree, matching the /settings/leakage-map precedent. */
const DataSourcesSettingsRoute = () => {
  return (
    <div className="space-y-8">
      <StageSubpageHeader
        crumbs={[{ label: "Data sources", to: "/data-sources" }, { label: "Settings" }]}
        title="Source settings"
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
              <th className="px-4 py-2.5 text-right font-mono text-[8.5px] font-medium tracking-[0.8px] text-ink-4 uppercase">Currently</th>
              <th className={HEAD_CLASS}>Who set it</th>
              <th className={HEAD_CLASS}>Can you change it?</th>
              <th className={HEAD_CLASS}>State</th>
            </tr>
          </thead>
          <tbody>
            {DS17_RULE_ROWS.map((row) => (
              <tr key={row.rule} className="border-b border-line last:border-0">
                <td className="px-4 py-3 font-semibold text-ink-2">{row.rule}</td>
                <td className={`px-4 py-3 text-right font-mono ${DS_TONE_CLASS[row.currentlyTone]}`}>{row.currently}</td>
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

      <Callout tone="amber" title="Credential rotation is manual and is the weakest thing in this section">
        Four of six credentials were last rotated in March, none expires, and nothing on any screen goes amber
        about it. It is a setting rather than a rule because rotation cadence is a real judgement, and it is called
        out here because everything else in this section is enforced and this one depends on somebody remembering.
      </Callout>

      <section className="space-y-3">
        <p className={EYEBROW_CLASS}>How sources connect to the rest of the product</p>
        <DataSourcesKvList rows={DS17_ELSEWHERE_KV} />
      </section>
    </div>
  );
};

export default DataSourcesSettingsRoute;
