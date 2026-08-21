import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { EYEBROW_CLASS } from "@/pages/everyday/lifecycle/data";
import { Callout } from "@/pages/everyday/lifecycle/stage/rail";
import { Chip } from "@/pages/everyday/lifecycle/stage/chip";
import { StageSubpageHeader } from "@/pages/everyday/lifecycle/stage/stage-subpage-header";
import { SegmentsKvList } from "@/pages/customers/segments/kv-list";
import { SG15_RULE_ROWS, SG15_USED_ELSEWHERE_ROWS } from "@/pages/customers/segments/data";

const HEAD_CLASS = "px-4 py-2.5 font-mono text-[8.5px] font-medium tracking-[0.8px] text-ink-4 uppercase";

/** SG15 — /settings/segments, outside the /segments tree, matching the /settings/leakage-map precedent. */
const SegmentsSettingsRoute = () => {
  return (
    <div className="space-y-8">
      <StageSubpageHeader
        crumbs={[{ label: "Segments", to: "/segments" }, { label: "Settings" }]}
        title="Segment settings"
        subtitle="Eleven rules · four are yours, four cannot be turned off, three can never be turned on"
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
              <th className="px-4 py-2.5 text-right font-mono text-[8.5px] font-medium tracking-[0.8px] text-ink-4 uppercase">Currently</th>
              <th className={HEAD_CLASS}>Who set it</th>
              <th className={HEAD_CLASS}>Can you change it?</th>
              <th className={HEAD_CLASS}>State</th>
            </tr>
          </thead>
          <tbody>
            {SG15_RULE_ROWS.map((row) => (
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

      <Callout tone="amber" title="The frequency cap is a setting and it silently changes what every campaign reports">
        Moving it from one in seven days to two would let 6,400 more people be reached this week and would raise the
        response rate of every play running, without any of them working better. The field shows how many sends are
        currently suppressed by it, and any change is written to the campaign log so a rate shift has a visible
        cause.
      </Callout>

      <section className="space-y-3">
        <p className={EYEBROW_CLASS}>Where segment definitions are used outside this section</p>
        <SegmentsKvList rows={SG15_USED_ELSEWHERE_ROWS} />
      </section>
    </div>
  );
};

export default SegmentsSettingsRoute;
