import { EYEBROW_CLASS } from "@/pages/everyday/lifecycle/data";
import { Callout } from "@/pages/everyday/lifecycle/stage/rail";
import { Chip } from "@/pages/everyday/lifecycle/stage/chip";
import { AgentCell } from "@/pages/agents/ai-teammates/agent-cell";
import { TeammatesTabs } from "@/pages/agents/ai-teammates/tabs";
import { TeammatesKvList } from "@/pages/agents/ai-teammates/kv-list";
import { TM10_KV, TM10_ROWS, TM_CHIP_TONE } from "@/pages/agents/ai-teammates/data";

const HEAD_CLASS = "px-4 py-2.5 font-mono text-[8.5px] font-medium tracking-[0.8px] text-ink-4 uppercase";

/** TM10 — /ai-teammates/paused. */
const PausedRoute = () => {
  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-[17px] font-semibold text-ink">Paused</h1>
        <p className="mt-1 text-[11.5px] text-ink-3">Two paused · one for 219 days · neither is estimating anything in the meantime</p>
      </div>

      <TeammatesTabs active="Paused" />

      <section className="space-y-3">
        <p className={EYEBROW_CLASS}>Two agents are paused and neither of them is guessing in the meantime</p>
        <div className="overflow-x-auto rounded-card border border-line bg-paper">
          <table className="w-full min-w-[880px] text-left text-[11.5px]">
            <thead>
              <tr className="border-b border-line bg-paper-2">
                <th className={HEAD_CLASS}>Agent</th>
                <th className={HEAD_CLASS}>Since</th>
                <th className={HEAD_CLASS}>Why</th>
                <th className={HEAD_CLASS}>What is not being watched</th>
                <th className={HEAD_CLASS}>Who can clear it</th>
                <th className={HEAD_CLASS}>Auto-resume</th>
              </tr>
            </thead>
            <tbody>
              {TM10_ROWS.map((row) => (
                <tr key={row.agent.initials} className="border-b border-line last:border-0">
                  <td className="px-4 py-3">
                    <AgentCell agent={row.agent} />
                  </td>
                  <td className="px-4 py-3">
                    <Chip tone={TM_CHIP_TONE[row.sinceTone]}>{row.since}</Chip>
                  </td>
                  <td className="px-4 py-3 text-ink-2">{row.why}</td>
                  <td className="px-4 py-3 text-ink-3">{row.notWatched}</td>
                  <td className="px-4 py-3 text-ink-4">{row.who}</td>
                  <td className="px-4 py-3">
                    <Chip tone="teal">{row.autoResume}</Chip>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      <Callout tone="ultra" title="A paused agent produces nothing rather than producing something from what is left">
        Activation could read the orders table this morning and estimate time-to-value without checkout events. It
        would be a real number, roughly right, and indistinguishable from the number it produces on a normal day.
        It is paused instead, and the funnel shows two steps as Unavailable, which is the same decision made in two
        places.
      </Callout>

      <section className="space-y-3">
        <p className={EYEBROW_CLASS}>What happens while an agent is paused</p>
        <TeammatesKvList rows={TM10_KV} />
      </section>

      <Callout tone="rose" title="Price & Margin has been paused for 219 days and it is still on the roster">
        It has not been removed, hidden or replaced with a simpler agent that works without margin. It sits there
        paused, with the reason and the name of the person who could clear it, because an agent quietly
        disappearing is how a whole stage stops being watched without anybody deciding that.
      </Callout>
    </div>
  );
};

export default PausedRoute;
