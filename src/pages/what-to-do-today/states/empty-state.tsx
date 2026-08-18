import { Link } from "react-router-dom";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Callout } from "@/pages/lifecycle/stage/rail";
import { ActorAvatar } from "@/pages/rooms/actor";
import { TONE_TEXT_CLASS } from "@/pages/rooms/tone";
import { WORKING_NOW } from "@/pages/what-to-do-today/data";

const HEAD_CLASS = "px-4 py-2.5 font-mono text-[8.5px] font-medium tracking-[0.8px] text-ink-4 uppercase";

/** T01 — the zero-items empty state. Unreachable via the current mock (TODAY_ITEMS is never empty), same as Rooms' R01. */
export function EmptyState() {
  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <h1 className="text-[17px] font-semibold text-ink">What to do today</h1>
          <p className="mt-1 text-[11.5px] text-ink-3">Nothing needs a decision from you · six agents working · two plays running</p>
        </div>
        <Button asChild className="shrink-0">
          <Link to="/what-to-do-today?show=all">Show everything</Link>
        </Button>
      </div>

      <div className="rounded-card border border-dashed border-line bg-paper p-10 text-center">
        <h2 className="text-[16px] font-semibold text-ink">Nothing needs you today</h2>
        <p className="mx-auto mt-2.5 max-w-md text-[11.5px] leading-relaxed text-ink-3">
          Six agents are working across your fourteen rooms. Two plays are running and neither needs a decision.
          Nothing above ₦5M is unowned, and nothing is overdue.
        </p>
        <div className="mt-5 flex flex-wrap items-center justify-center gap-3">
          <Button variant="outline">See what agents are doing</Button>
          <Button asChild variant="outline">
            <Link to="/what-to-do-today?show=all">Show everything · 340</Link>
          </Button>
        </div>
        <p className="mt-4 text-[10px] text-ink-4">
          An empty list is the goal, not a bug. This screen is empty about two days a week.
        </p>
      </div>

      <div>
        <p className="font-mono text-[9.5px] font-medium tracking-[1.05px] text-ink-4 uppercase">
          Working right now, and not asking you for anything
        </p>
        <div className="mt-2 overflow-x-auto rounded-card border border-line bg-paper">
          <table className="w-full min-w-[820px] text-left text-[11.5px]">
            <thead>
              <tr className="border-b border-line bg-paper-2">
                <th className={HEAD_CLASS}>Agent</th>
                <th className={HEAD_CLASS}>In</th>
                <th className={HEAD_CLASS}>Doing</th>
                <th className={HEAD_CLASS}>Since</th>
                <th className={cn(HEAD_CLASS, "text-right")}>Will it reach you?</th>
              </tr>
            </thead>
            <tbody>
              {WORKING_NOW.map((row) => (
                <tr key={row.agent.initials} className="border-b border-line last:border-0">
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-2">
                      <ActorAvatar actor={{ kind: "agent", agent: row.agent }} size="sm" />
                      <span className="font-semibold text-ink-2">{row.agent.name}</span>
                    </div>
                  </td>
                  <td className="px-4 py-3 text-ink-2">{row.inWhat}</td>
                  <td className="px-4 py-3 text-ink-3">{row.doing}</td>
                  <td className="px-4 py-3 font-mono text-ink-4">{row.since}</td>
                  <td
                    className={cn(
                      "px-4 py-3 text-right",
                      row.willReachTone ? TONE_TEXT_CLASS[row.willReachTone] : "text-ink-4"
                    )}
                  >
                    {row.willReach}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <Callout tone="teal" title="Why this list can be empty while ₦566M is still at risk">
        Everything at risk is either being worked on by somebody, waiting on a date, or below the line. This screen
        is not a summary of open problems — it is a list of things that need a decision from you today. Those are
        different, and conflating them is how a daily list becomes a backlog nobody opens.
      </Callout>
    </div>
  );
}
