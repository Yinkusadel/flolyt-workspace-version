import { Link } from "react-router-dom";

import { Button } from "@/components/ui/button";
import { Callout } from "@/pages/lifecycle/stage/rail";
import { HandoffQuickLinks } from "@/pages/handoff/quick-links";

const COMPARISON_ROWS: [string, string][] = [
  ["A play with an owner, a date and a state", "A message asking someone to look at something"],
  ["Created by a decision, never typed from scratch", "A task somebody assigned in a standup"],
  ["Accepted, disputed or re-dated by a named person", "Something that can be read and quietly ignored"],
  ["Visible to both sides until somebody resolves it", "Closed when the room that created it closes"],
  ["Escalating on its own schedule", "Dependent on the creator remembering to chase"],
];

/** H01 — no handoffs yet. Wired but unreachable with HANDOFF_EMPTY=false, same pattern as every prior rebuild's empty state. */
export function EmptyState() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-[17px] font-semibold text-ink">Handoffs</h1>
        <p className="mt-1 text-[11.5px] text-ink-3">
          Nothing yet · handoffs arrive when a room decides something that obliges another team
        </p>
      </div>

      <div className="rounded-card border border-dashed border-line bg-paper p-8 text-center">
        <p className="text-[13.5px] font-semibold text-ink">No handoffs yet</p>
        <p className="mx-auto mt-2 max-w-md text-[11.5px] leading-relaxed text-ink-3">
          A handoff is created when a room decides something that obliges another team to act. You do not create
          them directly — they arrive as the consequence of a decision somebody made.
        </p>
        <Button asChild className="mt-4">
          <Link to="/rooms">See open rooms</Link>
        </Button>
        <p className="mt-3 text-[10.5px] text-ink-4">Eleven rooms are open. None of them has decided anything yet.</p>
      </div>

      <HandoffQuickLinks />

      <div>
        <p className="mb-2 font-mono text-[9px] font-medium tracking-[0.85px] text-ink-4 uppercase">
          What a handoff is, and what it is not
        </p>
        <div className="overflow-x-auto rounded-card border border-line bg-paper">
          <table className="w-full min-w-[560px] text-left text-[11.5px]">
            <thead>
              <tr className="border-b border-line bg-paper-2">
                <th className="px-4 py-2.5 font-mono text-[8.5px] font-medium tracking-[0.8px] text-ink-4 uppercase">
                  A handoff is
                </th>
                <th className="px-4 py-2.5 font-mono text-[8.5px] font-medium tracking-[0.8px] text-ink-4 uppercase">
                  A handoff is not
                </th>
              </tr>
            </thead>
            <tbody>
              {COMPARISON_ROWS.map(([is, isNot]) => (
                <tr key={is} className="border-b border-line last:border-0">
                  <td className="px-4 py-3 text-ink-2">{is}</td>
                  <td className="px-4 py-3 text-ink-4">{isNot}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <Callout tone="teal" title="Nothing here can be satisfied in Slack">
        That is the entire design. A room can decide anything it likes about its own cohort, but the moment a
        decision requires another team to do something, it becomes a record with a name and a date on it. The
        alternative is a message that everybody reads and nobody owns — which is how one release cost ₦1.08B over
        twenty weeks.
      </Callout>
    </div>
  );
}
