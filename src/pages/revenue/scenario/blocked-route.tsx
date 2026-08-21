import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { EYEBROW_CLASS } from "@/pages/everyday/lifecycle/data";
import { Callout } from "@/pages/everyday/lifecycle/stage/rail";
import { ScenarioKvList } from "@/pages/revenue/scenario/kv-list";
import { ScenarioTabs } from "@/pages/revenue/scenario/tabs";
import { S097_KV, SC10_ROWS, SC_TONE_CLASS } from "@/pages/revenue/scenario/data";

const HEAD_CLASS = "px-4 py-2.5 font-mono text-[8.5px] font-medium tracking-[0.8px] text-ink-4 uppercase";

/** SC10 — /scenario/blocked. */
const ScenarioBlockedRoute = () => {
  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-[17px] font-semibold text-ink">Scenario</h1>
        <p className="mt-1 text-[11.5px] text-ink-3">
          Two scenarios cannot produce a range · both name exactly what would let them
        </p>
      </div>

      <ScenarioTabs active="Blocked" />

      <div className="flex flex-wrap items-center justify-between gap-3">
        <p className={EYEBROW_CLASS}>Two scenarios cannot produce a range and both name exactly what would let them</p>
        <Button type="button" size="sm" onClick={() => toast.success("Request sent to Sam Iyer")}>
          Chase the COGS source
        </Button>
      </div>

      <div className="overflow-x-auto rounded-card border border-line bg-paper">
        <table className="w-full min-w-[780px] text-left text-[11.5px]">
          <thead>
            <tr className="border-b border-line bg-paper-2">
              <th className={HEAD_CLASS}>Scenario</th>
              <th className={HEAD_CLASS}>Change</th>
              <th className={HEAD_CLASS}>Missing</th>
              <th className={`${HEAD_CLASS} text-right`}>Blocked since</th>
              <th className={HEAD_CLASS}>Who has it</th>
              <th className={`${HEAD_CLASS} text-right`}>Asked</th>
            </tr>
          </thead>
          <tbody>
            {SC10_ROWS.map((row) => (
              <tr key={row.id} className="border-b border-line last:border-0">
                <td className="px-4 py-3 font-semibold text-ink">{row.id}</td>
                <td className="px-4 py-3 text-ink-2">{row.change}</td>
                <td className="px-4 py-3 text-ink-3">{row.missing}</td>
                <td className={`px-4 py-3 text-right ${SC_TONE_CLASS[row.blockedTone]}`}>{row.blockedSince}</td>
                <td className="px-4 py-3 text-ink-4">{row.who}</td>
                <td className="px-4 py-3 text-right text-ink-4">{row.asked}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <section className="space-y-3">
        <p className={EYEBROW_CLASS}>S-097 · everything that was assembled before it stopped</p>
        <ScenarioKvList rows={S097_KV} />
      </section>

      <Callout tone="rose" title="This scenario could produce a number and it is refusing to">
        Everything except margin is ready, and a revenue-only range would run. The decision this scenario exists to
        inform is whether a 22% premium is justified, which is a margin question end to end. A range that answers a
        different question than the one asked is worse than no range, because it looks like an answer.
      </Callout>

      <Callout tone="neutral" title="Nobody has asked for the second one, and time is the only thing that fixes it">
        Ghana needs ninety days of card history before a retry window can be modelled there. No request will speed
        that up and no person is at fault, so the row names time rather than a name. It is the one kind of blocker on
        this screen that does not belong in anybody's handoff queue.
      </Callout>
    </div>
  );
};

export default ScenarioBlockedRoute;
