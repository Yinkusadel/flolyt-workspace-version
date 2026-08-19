import { Link } from "react-router-dom";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { Callout } from "@/pages/everyday/lifecycle/stage/rail";
import { TeamDot } from "@/pages/everyday/inbox/team-dot";
import { HandoffTabs } from "@/pages/everyday/handoff/handoff-tabs";
import { HandoffQuickLinks } from "@/pages/everyday/handoff/quick-links";
import { OVERDUE_ROWS } from "@/pages/everyday/handoff/data";
import { OwnerCell } from "@/pages/everyday/handoff/owner-cell";
import { TONE_TEXT_CLASS } from "@/pages/everyday/rooms/tone";

const HEAD_CLASS = "px-4 py-2.5 font-mono text-[8.5px] font-medium tracking-[0.8px] text-ink-4 uppercase";

/** H10 — `/handoff?state=overdue`. */
export function OverdueState() {
  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <h1 className="text-[17px] font-semibold text-ink">Overdue</h1>
          <p className="mt-1 text-[11.5px] text-ink-3">
            Nine overdue · two escalated to nobody · four sit with one person
          </p>
        </div>
        <Button onClick={() => toast.success("Escalated to Ada")}>Escalate to Ada</Button>
      </div>

      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <HandoffTabs active="overdue" />
        <HandoffQuickLinks />
      </div>

      <div className="overflow-x-auto rounded-card border border-line bg-paper">
        <table className="w-full min-w-[880px] text-left text-[11.5px]">
          <thead>
            <tr className="border-b border-line bg-paper-2">
              <th className={HEAD_CLASS}>Owes</th>
              <th className={HEAD_CLASS}>Team</th>
              <th className={HEAD_CLASS}>Owner</th>
              <th className={HEAD_CLASS}>Due</th>
              <th className={cn(HEAD_CLASS, "text-right")}>Days over</th>
              <th className={HEAD_CLASS}>Blocks</th>
              <th className={HEAD_CLASS}>Escalated to</th>
            </tr>
          </thead>
          <tbody>
            {OVERDUE_ROWS.map((row) => (
              <tr key={row.id} className="border-b border-line last:border-0">
                <td className="px-4 py-3 font-semibold whitespace-nowrap">
                  {row.id === "renewal-reforecast" && row.chainId ? (
                    <Link to={`/handoff/${row.chainId}/o/${row.id}`} className="text-ultra hover:underline">
                      {row.title}
                    </Link>
                  ) : (
                    <span className="text-ink-2">{row.title}</span>
                  )}
                </td>
                <td className="px-4 py-3 whitespace-nowrap">
                  <TeamDot team={row.team} />
                </td>
                <td className="px-4 py-3 whitespace-nowrap">
                  <OwnerCell owner={row.owner} />
                </td>
                <td className="px-4 py-3 text-rose whitespace-nowrap">{row.due}</td>
                <td className="px-4 py-3 text-right font-semibold text-rose">{row.daysOver}</td>
                <td className={cn("px-4 py-3 whitespace-nowrap", row.blocksTone ? TONE_TEXT_CLASS[row.blocksTone] : "font-mono text-[10.5px] text-ink-3")}>
                  {row.blocks}
                </td>
                <td className={cn("px-4 py-3 whitespace-nowrap", row.escalatedToTone ? TONE_TEXT_CLASS[row.escalatedToTone] : "text-ink-3")}>
                  {row.escalatedTo}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <Callout tone="rose" title="Two of these have escalated to nobody, and both are unaccepted">
        The escalation ladder runs owner → chain owner → their manager. An obligation nobody accepted has no owner
        to start the ladder from. That is the same circular gap as the unowned account renewals, and it is why the
        Ghana retry rollout has been outstanding for 134 days without a single reminder.
      </Callout>

      <div>
        <p className="mb-2 font-mono text-[9px] font-medium tracking-[0.85px] text-ink-4 uppercase">
          Four of six sit with one person
        </p>
        <div className="divide-y divide-line rounded-card border border-line bg-paper">
          {[
            { label: "Sam Iyer holds", value: "4 of the 6 overdue · 41 obligations in total", tone: "rose" as const },
            { label: "Three of his four are instrumentation", value: "the same class of request, from four different rooms", tone: "amber" as const },
            { label: "Nobody has aggregated them", value: "each room chased its own, none saw the queue", tone: "rose" as const },
            { label: "What would help", value: "one prioritisation call above the teams, not four reminders", tone: "teal" as const },
          ].map((row) => (
            <div key={row.label} className="flex flex-col gap-1 px-3.5 py-2.5 sm:flex-row sm:items-baseline sm:justify-between sm:gap-4">
              <span className="text-[11px] text-ink-3">{row.label}</span>
              <span className={cn("text-[10.5px] font-medium sm:text-right", TONE_TEXT_CLASS[row.tone])}>{row.value}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
