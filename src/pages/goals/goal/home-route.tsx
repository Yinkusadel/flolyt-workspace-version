import { useState } from "react";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Chip } from "@/pages/lifecycle/stage/chip";
import { Callout } from "@/pages/lifecycle/stage/rail";
import { KpiCards, type Kpi } from "@/pages/lifecycle/stage/kpi-cards";
import { StageSubpageHeader } from "@/pages/lifecycle/stage/stage-subpage-header";
import { BarTrack } from "@/pages/lifecycle/stage/bar";
import { TONE_TEXT_CLASS } from "@/pages/rooms/tone";
import { useGoalContext } from "@/pages/goals/goal/layout";
import { ChangeTargetModal } from "@/pages/goals/goal/change-target-modal";

const HEAD_CLASS = "px-4 py-2.5 font-mono text-[8.5px] font-medium tracking-[0.8px] text-ink-4 uppercase";

/** G08 — One goal. */
export function GoalHomeRoute() {
  const { goal } = useGoalContext();
  const [editOpen, setEditOpen] = useState(false);

  const kpis: Kpi[] = [
    { eyebrow: "Target", value: goal.target, note: goal.targetDate },
    { eyebrow: "Today", value: goal.today, tone: "amber", note: "trailing 90 days" },
    { eyebrow: "Gap", value: goal.gap, tone: "rose", note: "≈58,600 customers" },
    { eyebrow: "Baseline", value: goal.baseline, note: goal.baselineLockedDate },
  ];

  return (
    <div className="space-y-6">
      <StageSubpageHeader
        crumbs={[{ label: "Goals", to: "/goals" }, { label: goal.metric }]}
        title={goal.metric}
        subtitle={`Owner ${goal.owner.name} · lead agent ${goal.leadAgent.name} · ${goal.reviewCadence}`}
        action={<Button onClick={() => setEditOpen(true)}>Edit this goal</Button>}
      />

      <KpiCards items={kpis} />

      <div>
        <p className="font-mono text-[9.5px] font-medium tracking-[1.05px] text-ink-4 uppercase">
          How it has moved, and what moved it
        </p>
        <div className="mt-2 space-y-3 rounded-card border border-line bg-paper p-4">
          {goal.timeline.map((point) => (
            <div key={point.label} className="space-y-1.5">
              <div className="flex flex-wrap items-baseline justify-between gap-x-4 gap-y-0.5">
                <span className="text-[11.5px] text-ink-2">{point.label}</span>
                <span className={cn("font-mono text-[11px]", TONE_TEXT_CLASS_BAR[point.tone])}>
                  {point.value}
                  {point.delta && <span className="ml-1.5">· {point.delta}</span>}
                </span>
              </div>
              <BarTrack percent={point.percent} tone={point.tone} />
            </div>
          ))}
        </div>
      </div>

      <Callout tone={goal.paceCallout.tone} title={goal.paceCallout.title}>
        {goal.paceCallout.body}
      </Callout>

      <div>
        <p className="font-mono text-[9.5px] font-medium tracking-[1.05px] text-ink-4 uppercase">
          Everything credited to this goal
        </p>
        <div className="mt-2 overflow-x-auto rounded-card border border-line bg-paper">
          <table className="w-full min-w-[720px] text-left text-[11.5px]">
            <thead>
              <tr className="border-b border-line bg-paper-2">
                <th className={HEAD_CLASS}>What</th>
                <th className={HEAD_CLASS}>Type</th>
                <th className={cn(HEAD_CLASS, "text-right")}>Contribution</th>
                <th className={HEAD_CLASS}>Measured how</th>
                <th className={HEAD_CLASS}>State</th>
              </tr>
            </thead>
            <tbody>
              {goal.contributions.map((row) => (
                <tr key={row.what} className="border-b border-line last:border-0">
                  <td className="px-4 py-3 font-semibold text-ink-2">{row.what}</td>
                  <td className="px-4 py-3">
                    <Chip tone="neutral">{row.type}</Chip>
                  </td>
                  <td className={cn("px-4 py-3 text-right font-mono", TONE_TEXT_CLASS[row.contributionTone])}>
                    {row.contribution}
                  </td>
                  <td className="px-4 py-3 text-ink-3">{row.measuredHow}</td>
                  <td className="px-4 py-3">
                    <Chip tone={row.stateTone}>{row.state}</Chip>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <Callout tone={goal.contributionsCallout.tone} title={goal.contributionsCallout.title}>
        {goal.contributionsCallout.body}
      </Callout>

      <ChangeTargetModal open={editOpen} onOpenChange={setEditOpen} goal={goal} />
    </div>
  );
}

const TONE_TEXT_CLASS_BAR: Record<string, string> = {
  teal: "text-teal",
  amber: "text-amber",
  rose: "text-rose",
  ink: "text-ink-3",
  ultra: "text-ultra",
};
