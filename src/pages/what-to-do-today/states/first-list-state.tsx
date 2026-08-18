import { Link } from "react-router-dom";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { DEPARTMENT_COLORS } from "@/pages/lifecycle/data";
import { Callout } from "@/pages/lifecycle/stage/rail";
import { PersonDot } from "@/pages/rooms/actor";
import { TONE_TEXT_CLASS } from "@/pages/rooms/tone";
import { FIRST_LIST_ITEMS, NOT_YOUR_LIST } from "@/pages/what-to-do-today/data";

const HEAD_CLASS = "px-4 py-2.5 font-mono text-[8.5px] font-medium tracking-[0.8px] text-ink-4 uppercase";

/** T02 — the "day four" onboarding narrative, a distinct dataset from TODAY_ITEMS. Reached when WORKSPACE_AGE_DAYS <= 4. */
export function FirstListState() {
  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <h1 className="text-[17px] font-semibold text-ink">What to do today</h1>
          <p className="mt-1 text-[11.5px] text-ink-3">Day four · three things, all decisions, all under two minutes</p>
        </div>
        <Button asChild className="shrink-0">
          <Link to="/what-to-do-today/ranking">How this is ranked</Link>
        </Button>
      </div>

      <Callout tone="ultra" title="This list is an opinion, and here is how it was formed">
        Revenue at stake × confidence ÷ effort, then anything blocking one of your Q1 goals is lifted above anything
        that is not. Nothing moves up because it is old. Age is shown and never scored — a three-week-old ₦2M item
        stays below a fresh ₦200M one.
      </Callout>

      <div>
        <p className="font-mono text-[9.5px] font-medium tracking-[1.05px] text-ink-4 uppercase">Your first three</p>
        <div className="mt-2 overflow-x-auto rounded-card border border-line bg-paper">
          <table className="w-full min-w-[820px] text-left text-[12.5px]">
            <thead>
              <tr className="border-b border-line bg-paper-2">
                <th className={HEAD_CLASS}>#</th>
                <th className={HEAD_CLASS}>Do this</th>
                <th className={HEAD_CLASS}>Team</th>
                <th className={HEAD_CLASS}>Why it is here</th>
                <th className={cn(HEAD_CLASS, "text-right")}>At stake</th>
                <th className={cn(HEAD_CLASS, "text-right")}>Effort</th>
                <th className={cn(HEAD_CLASS, "text-right")}>Impact</th>
              </tr>
            </thead>
            <tbody>
              {FIRST_LIST_ITEMS.map((row) => (
                <tr key={row.rank} className="border-b border-line last:border-0 hover:bg-paper-2">
                  <td className="px-4 py-3.5 font-mono text-ink-4">{row.rank}</td>
                  <td className="px-4 py-3.5 font-semibold text-ink">{row.title}</td>
                  <td className="px-4 py-3.5">
                    <div className="flex items-center gap-1.5">
                      <span
                        className="size-2 rounded-full"
                        style={{ backgroundColor: DEPARTMENT_COLORS[row.department] }}
                      />
                      <span className="text-ink-2">{row.department}</span>
                    </div>
                  </td>
                  <td className="px-4 py-3.5 text-ink-3">{row.why}</td>
                  <td
                    className={cn(
                      "px-4 py-3.5 text-right font-mono font-semibold",
                      row.atStakeTone ? TONE_TEXT_CLASS[row.atStakeTone] : "text-ink"
                    )}
                  >
                    {row.atStake}
                  </td>
                  <td className="px-4 py-3.5 text-right font-mono text-ink-4">{row.effort}/5</td>
                  <td className="px-4 py-3.5 text-right font-mono text-ink-4">{row.impact}/5</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <Callout tone="teal" title="All three of these take under two minutes and none of them are work">
        A first list is deliberately weighted toward decisions rather than projects — naming an owner, confirming a
        duplicate, approving something already proven elsewhere. The ₦412M item is on somebody else's list because
        somebody else owns it.
      </Callout>

      <div>
        <p className="font-mono text-[9.5px] font-medium tracking-[1.05px] text-ink-4 uppercase">
          What is not on your list, and who has it
        </p>
        <div className="mt-2 overflow-x-auto rounded-card border border-line bg-paper">
          <table className="w-full min-w-[720px] text-left text-[12.5px]">
            <thead>
              <tr className="border-b border-line bg-paper-2">
                <th className={HEAD_CLASS}>Item</th>
                <th className={cn(HEAD_CLASS, "text-right")}>At stake</th>
                <th className={HEAD_CLASS}>Whose list it is on</th>
                <th className={HEAD_CLASS}>Why not yours</th>
              </tr>
            </thead>
            <tbody>
              {NOT_YOUR_LIST.map((row) => (
                <tr key={row.item} className="border-b border-line last:border-0">
                  <td className="px-4 py-3.5 text-ink-2">{row.item}</td>
                  <td
                    className={cn(
                      "px-4 py-3.5 text-right font-mono font-semibold",
                      row.atStakeTone ? TONE_TEXT_CLASS[row.atStakeTone] : "text-ink"
                    )}
                  >
                    {row.atStake}
                  </td>
                  <td className="px-4 py-3.5">
                    <div className="flex items-center gap-1.5">
                      <PersonDot person={row.owner} size="sm" />
                      <span className="text-ink-2">{row.owner.name}</span>
                    </div>
                  </td>
                  <td className="px-4 py-3.5 text-ink-3">{row.why}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <Callout tone="neutral" title="The biggest number in the company is not on your list and that is correct">
        Flolyt does not show you everything that matters. It shows you what needs a decision from you. Everything
        above is visible under "Everything · 340" and none of it is hidden — it is just not yours today.
      </Callout>
    </div>
  );
}
