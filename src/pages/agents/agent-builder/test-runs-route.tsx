import { Link } from "react-router-dom";

import { Button } from "@/components/ui/button";
import { EYEBROW_CLASS } from "@/pages/everyday/lifecycle/data";
import { Callout } from "@/pages/everyday/lifecycle/stage/rail";
import { Chip } from "@/pages/everyday/lifecycle/stage/chip";
import { AgentBuilderTabs } from "@/pages/agents/agent-builder/tabs";
import { AB10_ROWS, AB_TONE_CLASS } from "@/pages/agents/agent-builder/data";

const HEAD_CLASS = "px-4 py-2.5 font-mono text-[8.5px] font-medium tracking-[0.8px] text-ink-4 uppercase";

/** AB10 — /agent-builder/test-runs. */
const TestRunsRoute = () => {
  return (
    <div className="space-y-8">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <h1 className="text-[17px] font-semibold text-ink">Test runs</h1>
          <p className="mt-1 text-[11.5px] text-ink-3">Eight months replayed · it would have fired twice · and not in March</p>
        </div>
        <Button asChild type="button">
          <Link to="/agent-builder/waiting-for-approval">Send for approval</Link>
        </Button>
      </div>

      <AgentBuilderTabs active="Test runs" />

      <section className="space-y-3">
        <p className={EYEBROW_CLASS}>Release Watch, run against the last eight months as if it had existed</p>
        <div className="overflow-x-auto rounded-card border border-line bg-paper">
          <table className="w-full min-w-[880px] text-left text-[11.5px]">
            <thead>
              <tr className="border-b border-line bg-paper-2">
                <th className={HEAD_CLASS}>When</th>
                <th className={HEAD_CLASS}>What happened</th>
                <th className={`${HEAD_CLASS} text-right`}>Would it have fired?</th>
                <th className={`${HEAD_CLASS} text-right`}>To whom</th>
                <th className={HEAD_CLASS}>What was true at the time</th>
              </tr>
            </thead>
            <tbody>
              {AB10_ROWS.map((row) => (
                <tr key={row.when} className="border-b border-line last:border-0">
                  <td className="px-4 py-3 font-mono text-ink-4">{row.when}</td>
                  <td className="px-4 py-3 font-semibold text-ink">{row.what}</td>
                  <td className="px-4 py-3 text-right">
                    <Chip tone={row.fired === "yes" ? "ultra" : "neutral"}>{row.fired}</Chip>
                  </td>
                  <td className="px-4 py-3 text-right text-ink-3">{row.to}</td>
                  <td className={`px-4 py-3 ${AB_TONE_CLASS[row.contextTone]}`}>{row.context}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      <Callout tone="rose" title="It would not have caught the fee change in March, and building it anyway is still right">
        On 4 March there was no prior loss on the map, so the condition could not have fired — this agent needs
        one expensive mistake before it can prevent the second one. The test run says so plainly rather than
        letting somebody believe they have built the thing that would have saved ₦1.08B.
      </Callout>

      <Callout tone="ultra" title="It would have fired in June, eight weeks before anybody connected the cause">
        Kenya received the same release on 6 June and Nigeria's loss was already on the map. A finding would have
        reached Ifeoma that day, as an association, saying this looks like the thing that cost ₦437M. That is
        what this agent is worth, and it is a smaller and truer claim than the one anybody would make for it in a
        meeting.
      </Callout>
    </div>
  );
};

export default TestRunsRoute;
