import { cn } from "@/lib/utils";
import { Chip } from "@/pages/lifecycle/stage/chip";
import { Callout } from "@/pages/lifecycle/stage/rail";
import { StageSubpageHeader } from "@/pages/lifecycle/stage/stage-subpage-header";
import { TONE_TEXT_CLASS } from "@/pages/rooms/tone";
import { useGoalContext } from "@/pages/goals/goal/layout";
import { CONTRIBUTION_RULES, SCORED_CONTRIBUTIONS } from "@/pages/goals/goal/data";

const HEAD_CLASS = "px-4 py-2.5 font-mono text-[8.5px] font-medium tracking-[0.8px] text-ink-4 uppercase";

/** G13 — Goal · contributions. */
export function GoalContributionsRoute() {
  const { goal } = useGoalContext();

  return (
    <div className="space-y-6">
      <StageSubpageHeader
        crumbs={[{ label: "Goals", to: "/goals" }, { label: goal.metric, to: `/goals/${goal.id}` }, { label: "Contributions" }]}
        title="Contributions"
        subtitle="Six rules · two claims excluded · the goal has moved 2.0 points, not 7.0"
      />

      <div>
        <p className="font-mono text-[9.5px] font-medium tracking-[1.05px] text-ink-4 uppercase">
          How a contribution gets counted, and what disqualifies one
        </p>
        <div className="mt-2 overflow-x-auto rounded-card border border-line bg-paper">
          <table className="w-full min-w-[680px] text-left text-[11.5px]">
            <thead>
              <tr className="border-b border-line bg-paper-2">
                <th className={HEAD_CLASS}>Rule</th>
                <th className={HEAD_CLASS}>What it means</th>
                <th className={HEAD_CLASS}>If it fails</th>
              </tr>
            </thead>
            <tbody>
              {CONTRIBUTION_RULES.map((row) => (
                <tr key={row.rule} className="border-b border-line last:border-0">
                  <td className="px-4 py-3 font-semibold text-ink-2">{row.rule}</td>
                  <td className="px-4 py-3 text-ink-3">{row.meaning}</td>
                  <td className={cn("px-4 py-3", TONE_TEXT_CLASS[row.ifFailsTone])}>{row.ifFails}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <div>
        <p className="font-mono text-[9.5px] font-medium tracking-[1.05px] text-ink-4 uppercase">
          This goal's contributions, against those rules
        </p>
        <div className="mt-2 overflow-x-auto rounded-card border border-line bg-paper">
          <table className="w-full min-w-[820px] text-left text-[11.5px]">
            <thead>
              <tr className="border-b border-line bg-paper-2">
                <th className={HEAD_CLASS}>What</th>
                <th className={cn(HEAD_CLASS, "text-right")}>Claimed</th>
                <th className={HEAD_CLASS}>Holdout?</th>
                <th className={HEAD_CLASS}>Window closed?</th>
                <th className={HEAD_CLASS}>Separable?</th>
                <th className={HEAD_CLASS}>Counted</th>
              </tr>
            </thead>
            <tbody>
              {SCORED_CONTRIBUTIONS.map((row) => (
                <tr key={row.what} className="border-b border-line last:border-0">
                  <td className="px-4 py-3 font-semibold text-ink-2">{row.what}</td>
                  <td className={cn("px-4 py-3 text-right font-mono", TONE_TEXT_CLASS[row.claimedTone])}>{row.claimed}</td>
                  <td className={cn("px-4 py-3", TONE_TEXT_CLASS[row.holdoutTone])}>{row.holdout}</td>
                  <td className={cn("px-4 py-3", TONE_TEXT_CLASS[row.windowClosedTone])}>{row.windowClosed}</td>
                  <td className={cn("px-4 py-3", TONE_TEXT_CLASS[row.separableTone])}>{row.separable}</td>
                  <td className="px-4 py-3">
                    <Chip tone={row.countedTone}>{row.counted}</Chip>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <Callout tone="rose" title="Two claims of 1.9 and 3.1 points are excluded from the 2.0 the goal has actually moved">
        If both were counted, this goal would read as +7.0 and on track. One has no holdout and coincides with
        Ramadan; the other is six days old. Adding them would make the tracker friendlier and the quarter-end
        conversation much worse.
      </Callout>
    </div>
  );
}
