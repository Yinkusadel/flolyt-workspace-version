import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { EYEBROW_CLASS } from "@/pages/everyday/lifecycle/data";
import { Callout } from "@/pages/everyday/lifecycle/stage/rail";
import { Chip } from "@/pages/everyday/lifecycle/stage/chip";
import { StageSubpageHeader } from "@/pages/everyday/lifecycle/stage/stage-subpage-header";
import { LeaksKvList } from "@/pages/revenue/leakage-map/kv-list";
import { LK18_RULE_ROWS, LK18_SOURCE_ROWS, LK_CHIP_TONE } from "@/pages/revenue/leakage-map/data";

const HEAD_CLASS = "px-4 py-2.5 font-mono text-[8.5px] font-medium tracking-[0.8px] text-ink-4 uppercase";

/** LK18 — /settings/leakage-map, outside the /leakage-map tree, matching the /settings/digest and /settings/authority precedent. */
const LeaksSettingsRoute = () => {
  return (
    <div className="space-y-8">
      <StageSubpageHeader
        crumbs={[{ label: "Leakage map", to: "/leakage-map" }, { label: "Settings" }]}
        title="Leakage map settings"
        subtitle="Eight rules · two are yours, three cannot be turned off, three cannot be turned on"
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
            {LK18_RULE_ROWS.map((row) => (
              <tr key={row.rule} className="border-b border-line last:border-0">
                <td className="px-4 py-3 font-semibold text-ink-2">{row.rule}</td>
                <td className="px-4 py-3 text-right font-mono text-ink-3">{row.currently}</td>
                <td className="px-4 py-3 text-ink-4">{row.who}</td>
                <td className="px-4 py-3">
                  <Chip tone={row.canChange ? "teal" : "rose"}>{row.canChange ? "yes" : "no"}</Chip>
                </td>
                <td className="px-4 py-3">
                  <Chip tone={LK_CHIP_TONE[row.stateTone]}>{row.state}</Chip>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <Callout tone="amber" title="Raising the minimum hides lines, and the screen says how many before you save">
        Moving the ₦1M floor to ₦10M would drop three lines worth ₦4.2M combined. That is a defensible thing to
        want and a dangerous thing to do quietly, so the count and the total appear next to the field, and a hidden
        line is still returned by search.
      </Callout>

      <section className="space-y-3">
        <p className={EYEBROW_CLASS}>Where the numbers come from</p>
        <LeaksKvList rows={LK18_SOURCE_ROWS} />
      </section>
    </div>
  );
};

export default LeaksSettingsRoute;
