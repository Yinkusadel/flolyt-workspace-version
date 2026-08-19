import { toast } from "sonner";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Chip } from "@/pages/everyday/lifecycle/stage/chip";
import { Callout } from "@/pages/everyday/lifecycle/stage/rail";
import { StageSubpageHeader } from "@/pages/everyday/lifecycle/stage/stage-subpage-header";
import { TONE_TEXT_CLASS } from "@/pages/everyday/rooms/tone";
import { ActorAvatar } from "@/pages/everyday/rooms/actor";
import { useGoalContext } from "@/pages/everyday/goals/goal/layout";
import { OFF_TRACK_ACTIONS } from "@/pages/everyday/goals/goal/data";

const HEAD_CLASS = "px-4 py-2.5 font-mono text-[8.5px] font-medium tracking-[0.8px] text-ink-4 uppercase";

/** G09 — Goal · off track. */
export function GoalOffTrackRoute() {
  const { goal } = useGoalContext();

  return (
    <div className="space-y-6">
      <StageSubpageHeader
        crumbs={[{ label: "Goals", to: "/goals" }, { label: goal.metric, to: `/goals/${goal.id}` }, { label: "Off track" }]}
        title={`${goal.metric} · off track`}
        subtitle="Projected to close at 30.6% · four things would change that · 50 days left"
        action={<Button onClick={() => toast.success("Reactivation wave approved")}>Approve the wave</Button>}
      />

      <Callout tone="amber" title="At this pace this goal closes at 30.6%, not 36.4%">
        Day 41 of 91. Two points gained, 7.2 needed. Flolyt raised this rather than waiting for the quarter review —
        with 50 days left there are still four things that would change the answer.
      </Callout>

      <div>
        <p className="font-mono text-[9.5px] font-medium tracking-[1.05px] text-ink-4 uppercase">
          What would close the gap, and who has to do it
        </p>
        <div className="mt-2 overflow-x-auto rounded-card border border-line bg-paper">
          <table className="w-full min-w-[820px] text-left text-[11.5px]">
            <thead>
              <tr className="border-b border-line bg-paper-2">
                <th className={HEAD_CLASS}>Action</th>
                <th className={cn(HEAD_CLASS, "text-right")}>Would add</th>
                <th className={HEAD_CLASS}>Confidence</th>
                <th className={HEAD_CLASS}>Whose</th>
                <th className={HEAD_CLASS}>State</th>
                <th className={HEAD_CLASS}>Blocked by</th>
              </tr>
            </thead>
            <tbody>
              {OFF_TRACK_ACTIONS.map((row) => (
                <tr key={row.action} className="border-b border-line last:border-0">
                  <td className="px-4 py-3 font-semibold text-ink-2">{row.action}</td>
                  <td className={cn("px-4 py-3 text-right font-mono", row.wouldAddTone ? TONE_TEXT_CLASS[row.wouldAddTone] : "text-ink")}>
                    {row.wouldAdd}
                  </td>
                  <td className={cn("px-4 py-3", TONE_TEXT_CLASS[row.confidenceTone])}>{row.confidence}</td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-1.5">
                      {row.whosePerson ? (
                        <ActorAvatar actor={{ kind: "human", person: row.whosePerson }} size="sm" />
                      ) : row.whoseDeptColor ? (
                        <span className="size-2 shrink-0 rounded-full" style={{ backgroundColor: row.whoseDeptColor }} />
                      ) : null}
                      <span className="text-ink-2">{row.whoseLabel}</span>
                    </div>
                  </td>
                  <td className="px-4 py-3">
                    <Chip tone={row.stateTone}>{row.stateLabel}</Chip>
                  </td>
                  <td className={cn("px-4 py-3 font-mono text-[10.5px]", TONE_TEXT_CLASS[row.blockedByTone])}>
                    {row.blockedBy}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <Callout tone="amber" title="The last row is offered on purpose and it is not hidden at the bottom of a menu">
        Lowering a target is sometimes the right call — the fee fix landed six weeks later than the plan assumed.
        What Flolyt refuses to allow is doing it quietly. The change is audited, keeps the old value, requires a
        reason, and everything already credited keeps the number it was measured against.
      </Callout>

      <Callout tone="rose" title="The third row is the biggest untapped one and it has no owner at all">
        Moving a customer from one feature to two is worth 30 points of retention on 371,000 people. Nobody owns
        feature depth, no goal is set on it, and it has never been proposed as an action. It is the largest lever on
        this table and the only one with no name against it.
      </Callout>
    </div>
  );
}
