import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Callout } from "@/pages/everyday/lifecycle/stage/rail";
import { Chip } from "@/pages/everyday/lifecycle/stage/chip";
import { StageSubpageHeader } from "@/pages/everyday/lifecycle/stage/stage-subpage-header";
import { VL19_ROWS, VL_TONE_CLASS } from "@/pages/revenue/value/data";

const HEAD_CLASS = "px-4 py-2.5 font-mono text-[8.5px] font-medium tracking-[0.8px] text-ink-4 uppercase";

/** VL19 — /settings/value, outside the /value tree, matching the /settings/attribution precedent. */
const ValueSettingsRoute = () => {
  return (
    <div className="space-y-8">
      <StageSubpageHeader
        crumbs={[{ label: "Value", to: "/value" }, { label: "Settings" }]}
        title="What counts as revenue here"
        subtitle="Ten rules · two are yours, five cannot be turned off, three can never be turned on"
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
              <th className={HEAD_CLASS}>Can you change it?</th>
              <th className={HEAD_CLASS}>State</th>
            </tr>
          </thead>
          <tbody>
            {VL19_ROWS.map((row) => (
              <tr key={row.rule} className="border-b border-line last:border-0">
                <td className="px-4 py-3 font-semibold text-ink-2">{row.rule}</td>
                <td className={`px-4 py-3 text-right font-mono ${VL_TONE_CLASS[row.currentlyTone]}`}>{row.currently}</td>
                <td className="px-4 py-3 text-ink-4">{row.who}</td>
                <td className="px-4 py-3">
                  <Chip tone={row.canChange ? "teal" : "rose"}>{row.canChange ? "yes" : "no"}</Chip>
                </td>
                <td className="px-4 py-3">
                  <Chip tone={row.stateTone === "ok" ? "teal" : "neutral"}>{row.state}</Chip>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <Callout tone="amber" title="Two of these are your accounting policy and eight are not negotiable">
        Recognition and refund timing belong to Ravi, and Flolyt follows whatever Finance sets. The other eight are
        the difference between a ledger and a dashboard, so they are not settings — turning any one of them off
        would let this section produce a number that reads exactly like a measurement and is not one.
      </Callout>

      <Callout tone="rose" title="Changing a recognition rule recomputes 151 days of history, and says so before it does">
        Moving recognition from delivery to order re-dates every figure in the ledger, the map and four closed
        rooms. The screen shows which rooms change and by how much before you save, and every affected figure is
        restated with its original kept. A number that quietly means something different this week than last is
        worse than no number.
      </Callout>
    </div>
  );
};

export default ValueSettingsRoute;
