import { Link } from "react-router-dom";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Chip } from "@/pages/lifecycle/stage/chip";
import { Callout } from "@/pages/lifecycle/stage/rail";
import { KpiCards, type Kpi } from "@/pages/lifecycle/stage/kpi-cards";
import { BarTrack } from "@/pages/lifecycle/stage/bar";
import { ActorAvatar } from "@/pages/rooms/actor";
import { TONE_TEXT_CLASS } from "@/pages/rooms/tone";
import { GOAL_FINDINGS, GOAL_ROWS, METRIC_READINESS } from "@/pages/goals/data";
import type { GoalRow } from "@/pages/goals/types";

const HEAD_CLASS = "px-4 py-2.5 font-mono text-[8.5px] font-medium tracking-[0.8px] text-ink-4 uppercase";

/** Only `repeat-90` has a built detail page — every other row renders as plain text, per the link-hover convention. */
const LINKED_GOAL_IDS = new Set(["repeat-90"]);

function EmptyState() {
  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <h1 className="text-[17px] font-semibold text-ink">Goals</h1>
          <p className="mt-1 text-[11.5px] text-ink-3">
            Nothing set · four metrics have a baseline, one does not
          </p>
        </div>
        <Button asChild className="shrink-0">
          <Link to="/goals/new">Set your first goal</Link>
        </Button>
      </div>

      <div className="rounded-card border border-dashed border-line bg-paper p-10 text-center">
        <h2 className="text-[16px] font-semibold text-ink">No goals set</h2>
        <p className="mx-auto mt-2.5 max-w-md text-[11.5px] leading-relaxed text-ink-3">
          Flolyt works without goals — agents still read, rooms still open and the daily list still ranks by revenue
          at stake. Goals change one thing: what gets lifted above everything else.
        </p>
        <div className="mt-5 flex justify-center">
          <Button asChild>
            <Link to="/goals/new">Set your first goal</Link>
          </Button>
        </div>
        <p className="mt-4 text-[10px] text-ink-4">
          Four of five metrics already have a baseline. One does not, and it will say so.
        </p>
      </div>

      <div>
        <p className="font-mono text-[9.5px] font-medium tracking-[1.05px] text-ink-4 uppercase">
          What Flolyt can already measure, without you setting anything
        </p>
        <div className="mt-2 overflow-x-auto rounded-card border border-line bg-paper">
          <table className="w-full min-w-[720px] text-left text-[11.5px]">
            <thead>
              <tr className="border-b border-line bg-paper-2">
                <th className={HEAD_CLASS}>Metric</th>
                <th className={cn(HEAD_CLASS, "text-right")}>Today</th>
                <th className={cn(HEAD_CLASS, "text-right")}>Trailing 90 days</th>
                <th className={HEAD_CLASS}>Source</th>
                <th className={cn(HEAD_CLASS, "text-right")}>Can be a goal?</th>
              </tr>
            </thead>
            <tbody>
              {METRIC_READINESS.map((row) => (
                <tr key={row.metric} className="border-b border-line last:border-0">
                  <td className="px-4 py-3 font-semibold text-ink-2">{row.metric}</td>
                  <td className="px-4 py-3 text-right font-mono text-ink">{row.today}</td>
                  <td
                    className={cn(
                      "px-4 py-3 text-right font-mono",
                      row.trailing90Tone ? TONE_TEXT_CLASS[row.trailing90Tone] : "text-ink-3"
                    )}
                  >
                    {row.trailing90}
                  </td>
                  <td className={cn("px-4 py-3", row.sourceTone ? TONE_TEXT_CLASS[row.sourceTone] : "text-ink-3")}>
                    {row.source}
                  </td>
                  <td className="px-4 py-3 text-right">
                    <Chip tone={row.canGoalTone}>{row.canGoalLabel}</Chip>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <Callout tone="amber" title="A goal without a baseline is a wish">
        Margin has no measured starting point, so it cannot be a goal here. Flolyt will not offer a category
        benchmark to fill the gap — a target set against a number nobody measured cannot be hit or missed, only
        argued about at the end of the quarter.
      </Callout>
    </div>
  );
}

function GoalNameCell({ row }: { row: GoalRow }) {
  if (LINKED_GOAL_IDS.has(row.id)) {
    return (
      <Link to={`/goals/${row.id}`} className="font-semibold text-ultra hover:underline">
        {row.metric}
      </Link>
    );
  }
  return <span className="font-semibold text-ink-2">{row.metric}</span>;
}

function MobileGoalCard({ row }: { row: GoalRow }) {
  const percent = row.paceTone === "teal" ? 100 : row.hasBaseline ? 68 : 0;
  return (
    <div className="rounded-card border border-line bg-paper p-4">
      <div className="flex items-start justify-between gap-3">
        <GoalNameCell row={row} />
        <span className={cn("shrink-0 font-mono text-[13px] font-semibold", TONE_TEXT_CLASS[row.paceTone])}>
          {row.pace}
        </span>
      </div>
      <div className="mt-2.5">
        <BarTrack percent={percent} tone={row.paceTone === "neutral" ? "ink" : row.paceTone} />
      </div>
      <div className="mt-2 flex items-center justify-between gap-3 text-[10.5px]">
        <span className="text-ink-3">{row.gapToTarget}</span>
        <span className="text-ink-4">target {row.projectedClose}</span>
      </div>
    </div>
  );
}

function Tracker() {
  const kpis: Kpi[] = [
    { eyebrow: "Quarter", value: "Q1 · day 41 of 91", note: "45% elapsed" },
    { eyebrow: "Net revenue", value: "₦186M behind", tone: "amber", note: "94% of pace" },
    { eyebrow: "Goals on pace", value: "1 of 4", tone: "rose", note: "one has no baseline" },
    { eyebrow: "Projected close", value: "₦4.71B", tone: "amber", note: "against ₦4.90B" },
  ];

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <h1 className="text-[17px] font-semibold text-ink">Goals</h1>
          <p className="mt-1 text-[11.5px] text-ink-3">
            Q1 · day 41 of 91 · one goal has no baseline and is left blank
          </p>
        </div>
        <Button asChild className="shrink-0">
          <Link to="/goals/new">Set a goal</Link>
        </Button>
      </div>

      <KpiCards items={kpis} />

      <div>
        <p className="font-mono text-[9.5px] font-medium tracking-[1.05px] text-ink-4 uppercase">
          Every goal, and what is being done about it
        </p>

        <div className="mt-2 hidden overflow-x-auto rounded-card border border-line bg-paper sm:block">
          <table className="w-full min-w-[820px] text-left text-[11.5px]">
            <thead>
              <tr className="border-b border-line bg-paper-2">
                <th className={HEAD_CLASS}>Goal</th>
                <th className={HEAD_CLASS}>Gap to target</th>
                <th className={HEAD_CLASS}>Working on it</th>
                <th className={cn(HEAD_CLASS, "text-right")}>Projected close</th>
                <th className={HEAD_CLASS}>Owner</th>
                <th className={HEAD_CLASS}>Agent</th>
                <th className={cn(HEAD_CLASS, "text-right")}>Pace</th>
              </tr>
            </thead>
            <tbody>
              {GOAL_ROWS.map((row) => (
                <tr key={row.id} className="border-b border-line last:border-0">
                  <td className="px-4 py-3">
                    <GoalNameCell row={row} />
                  </td>
                  <td className={cn("px-4 py-3", row.gapTone ? TONE_TEXT_CLASS[row.gapTone] : "text-ink-2")}>
                    {row.gapToTarget}
                  </td>
                  <td className="px-4 py-3 text-ink-3">{row.workingOnIt}</td>
                  <td
                    className={cn(
                      "px-4 py-3 text-right font-mono",
                      row.projectedCloseTone ? TONE_TEXT_CLASS[row.projectedCloseTone] : "text-ink"
                    )}
                  >
                    {row.projectedClose}
                  </td>
                  <td className="px-4 py-3">
                    {row.owner ? (
                      <div className="flex items-center gap-1.5">
                        <ActorAvatar actor={{ kind: "human", person: row.owner }} size="sm" />
                        <span className="text-ink-2">{row.owner.name.split(" ")[0]}</span>
                      </div>
                    ) : (
                      <span className="text-ink-4">—</span>
                    )}
                  </td>
                  <td className="px-4 py-3">
                    {row.agent ? (
                      <div className="flex items-center gap-1.5">
                        <ActorAvatar actor={{ kind: "agent", agent: row.agent }} size="sm" />
                        <span className="text-ink-3">{row.agent.initials}</span>
                      </div>
                    ) : (
                      <span className="text-ink-4">—</span>
                    )}
                  </td>
                  <td className={cn("px-4 py-3 text-right font-semibold", TONE_TEXT_CLASS[row.paceTone])}>
                    {row.pace}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="mt-2 space-y-2.5 sm:hidden">
          {GOAL_ROWS.map((row) => (
            <MobileGoalCard key={row.id} row={row} />
          ))}
        </div>
      </div>

      <div>
        <p className="font-mono text-[9.5px] font-medium tracking-[1.05px] text-ink-4 uppercase">
          What the agents say about the ₦186M
        </p>
        <div className="mt-2 grid grid-cols-1 gap-3 lg:grid-cols-2">
          {GOAL_FINDINGS.map((finding) => (
            <div key={finding.title} className="rounded-card border border-line bg-paper p-4">
              <span className="inline-flex items-center gap-1.5 font-mono text-[9.5px] font-semibold tracking-[0.5px] text-ink-4">
                <ActorAvatar actor={{ kind: "agent", agent: finding.agent }} size="sm" />
                {finding.agent.name} · run {finding.runId}
              </span>
              <h3 className="mt-2.5 text-[13px] font-semibold text-ink">{finding.title}</h3>
              <p className="mt-1.5 text-[11px] leading-relaxed text-ink-2">{finding.body}</p>
              <p
                className={cn(
                  "mt-3 border-t border-dashed border-line pt-3 font-mono text-[10.5px]",
                  TONE_TEXT_CLASS[finding.tone]
                )}
              >
                {finding.footnote}
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

const Goals = () => (GOAL_ROWS.length === 0 ? <EmptyState /> : <Tracker />);

export default Goals;
