import { cn } from "@/lib/utils";
import { AgentDot } from "@/pages/rooms/actor";
import { TONE_TEXT_CLASS } from "@/pages/rooms/tone";
import { InboxQuickLinks } from "@/pages/inbox/quick-links";
import { WORKING_AGENTS } from "@/pages/inbox/data";

const HEAD_CLASS = "px-4 py-2.5 font-mono text-[8.5px] font-medium tracking-[0.8px] text-ink-4 uppercase";

/** I01 — Nothing waiting, the default empty state at /inbox. */
export function EmptyState() {
  return (
    <div className="space-y-6">
      <InboxQuickLinks />

      <div>
        <h1 className="text-[17px] font-semibold text-ink">Your inbox</h1>
        <p className="mt-1 text-[11.5px] text-ink-3">Nothing needs a decision · six agents still working</p>
      </div>

      <div className="rounded-card border border-dashed border-line bg-paper p-10 text-center">
        <p className="text-[14px] font-semibold text-ink">Nothing is waiting on you</p>
        <p className="mx-auto mt-2 max-w-md text-[11.5px] leading-relaxed text-ink-3">
          Six agents are working across eleven rooms right now. Anything with real consequences lands here before it
          happens — until then there is nothing for you to do on this screen.
        </p>
        <button
          type="button"
          className="mt-4 rounded-panel border border-line bg-paper px-3.5 py-2 text-[11.5px] font-medium text-ink hover:border-ink-4"
        >
          See what agents are doing
        </button>
        <p className="mt-3 text-[10px] text-ink-4">This screen is empty most of the working day, by design.</p>
      </div>

      <div>
        <p className="mb-2 font-mono text-[9.5px] font-medium tracking-[1.05px] text-ink-4 uppercase">
          Working right now, and not bothering you
        </p>
        <div className="overflow-x-auto rounded-card border border-line bg-paper">
          <table className="w-full min-w-[720px] text-left text-[11.5px]">
            <thead>
              <tr className="border-b border-line bg-paper-2">
                <th className={HEAD_CLASS}>Agent</th>
                <th className={HEAD_CLASS}>In</th>
                <th className={HEAD_CLASS}>Doing</th>
                <th className={HEAD_CLASS}>Since</th>
                <th className={HEAD_CLASS}>Will it reach you?</th>
              </tr>
            </thead>
            <tbody>
              {WORKING_AGENTS.map((row) => (
                <tr key={row.room} className="border-b border-line last:border-0">
                  <td className="px-4 py-3">
                    <span className="flex items-center gap-2 font-semibold text-ink-2">
                      <AgentDot agent={row.agent} size="sm" />
                      {row.agent.name}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-ink-2">{row.room}</td>
                  <td className="px-4 py-3 text-ink-3">{row.doing}</td>
                  <td className="px-4 py-3 whitespace-nowrap text-ink-4">{row.since}</td>
                  <td className={cn("px-4 py-3 whitespace-nowrap", row.willReachTone ? TONE_TEXT_CLASS[row.willReachTone] : "text-ink-3")}>
                    {row.willReach}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
        <div className="rounded-card border border-teal-border bg-teal-bg p-4">
          <h3 className="text-[13px] font-semibold text-ink">The empty inbox is the goal, not a bug</h3>
          <p className="mt-1.5 text-[11px] leading-relaxed text-ink-2">
            Flolyt is built so this screen is empty most of the day. If it is consistently full, either the agents
            are being too cautious or somebody has stopped deciding — both are worth knowing, and neither is fixed
            by sending more notifications.
          </p>
        </div>
        <div className="rounded-card border border-amber-border bg-amber-bg p-4">
          <h3 className="text-[13px] font-semibold text-ink">The last row is the exception worth noticing</h3>
          <p className="mt-1.5 text-[11px] leading-relaxed text-ink-2">
            Acquisition Quality has something to say and nowhere to send it, because that room has no owner. It is
            not in your inbox because it is not yours — it is in the daily list, ranked third, waiting for somebody
            to take it.
          </p>
        </div>
      </div>
    </div>
  );
}
