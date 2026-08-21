import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { EYEBROW_CLASS } from "@/pages/everyday/lifecycle/data";
import { Callout } from "@/pages/everyday/lifecycle/stage/rail";
import { Chip, CHIP_INTERACTIVE_CLASS } from "@/pages/everyday/lifecycle/stage/chip";
import { KpiCards } from "@/pages/everyday/lifecycle/stage/kpi-cards";
import { ExperimentsTabs } from "@/pages/customers/experiments/tabs";
import { StopEarlyModal } from "@/pages/customers/experiments/modals/stop-early-modal";
import { ChangeTheConditionModal } from "@/pages/customers/experiments/modals/change-the-condition-modal";
import {
  EX_CHIP_TONE,
  EX_KPI_TONE,
  EX_TONE_CLASS,
  XP03_CONDITION_ROWS,
  XP03_ROWS,
  XP03_STATS,
  type ConditionRow,
  type ExperimentRow,
} from "@/pages/customers/experiments/data";

const HEAD_CLASS = "px-4 py-2.5 font-mono text-[8.5px] font-medium tracking-[0.8px] text-ink-4 uppercase";

function StateCell({ row, onStop }: { row: ExperimentRow; onStop: () => void }) {
  if (row.rowAction === "contaminated") {
    return (
      <Link to="/experiments/contaminated">
        <Chip tone={EX_CHIP_TONE[row.stateTone]} className={CHIP_INTERACTIVE_CLASS}>
          {row.state}
        </Chip>
      </Link>
    );
  }
  if (row.rowAction === "stop") {
    return (
      <button type="button" onClick={onStop}>
        <Chip tone={EX_CHIP_TONE[row.stateTone]} className={CHIP_INTERACTIVE_CLASS}>
          {row.state}
        </Chip>
      </button>
    );
  }
  return <Chip tone={EX_CHIP_TONE[row.stateTone]}>{row.state}</Chip>;
}

function WrittenCell({ row, onChange }: { row: ConditionRow; onChange: () => void }) {
  if (row.rowAction === "changeCondition") {
    return (
      <button
        type="button"
        onClick={onChange}
        className={cn("font-mono text-[10.5px] text-ink-2 underline decoration-dotted underline-offset-2 hover:text-ink")}
      >
        {row.written}
      </button>
    );
  }
  return <span className="font-mono text-[10.5px] text-ink-4">{row.written}</span>;
}

/** XP03 — the default populated "Running" state, and /experiments' index tab. */
export function RunningNowState() {
  const navigate = useNavigate();
  const [stopOpen, setStopOpen] = useState(false);
  const [changeOpen, setChangeOpen] = useState(false);

  return (
    <div className="space-y-8">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <h1 className="text-[17px] font-semibold text-ink">Experiments</h1>
          <p className="mt-1 text-[11.5px] text-ink-3">Four running · 17,076 people held · one compromised · every condition written in advance</p>
        </div>
        <Button type="button" onClick={() => navigate("/experiments/new")}>
          Design an experiment
        </Button>
      </div>

      <ExperimentsTabs active="Running" />

      <KpiCards items={XP03_STATS.map((s) => ({ eyebrow: s.eyebrow, value: s.value, note: s.note, tone: EX_KPI_TONE[s.tone] }))} />

      <section className="space-y-3">
        <p className={EYEBROW_CLASS}>Running now</p>

        <div className="hidden overflow-x-auto rounded-card border border-line bg-paper md:block">
          <table className="w-full min-w-[920px] text-left text-[11.5px]">
            <thead>
              <tr className="border-b border-line bg-paper-2">
                <th className={HEAD_CLASS}>Experiment</th>
                <th className={HEAD_CLASS}>Campaign</th>
                <th className={cn(HEAD_CLASS, "text-right")}>Held</th>
                <th className={cn(HEAD_CLASS, "text-right")}>Of</th>
                <th className={cn(HEAD_CLASS, "text-right")}>Day</th>
                <th className={cn(HEAD_CLASS, "text-right")}>Ends</th>
                <th className={HEAD_CLASS}>State</th>
              </tr>
            </thead>
            <tbody>
              {XP03_ROWS.map((row) => (
                <tr key={row.experiment} className="border-b border-line last:border-0">
                  <td className="px-4 py-3 font-semibold whitespace-nowrap">
                    {row.id ? (
                      <Link to={`/experiments/${row.id}`} className="text-ultra hover:underline">
                        {row.experiment}
                      </Link>
                    ) : (
                      <span className="text-ink-2">{row.experiment}</span>
                    )}
                  </td>
                  <td className="px-4 py-3 text-ink-3">{row.campaign}</td>
                  <td className={cn("px-4 py-3 text-right font-mono", EX_TONE_CLASS[row.heldTone])}>{row.held}</td>
                  <td className="px-4 py-3 text-right font-mono text-ink">{row.of}</td>
                  <td className="px-4 py-3 text-right font-mono text-ink-4">{row.day}</td>
                  <td className="px-4 py-3 text-right font-mono text-ink-4">{row.ends}</td>
                  <td className="px-4 py-3">
                    <StateCell row={row} onStop={() => setStopOpen(true)} />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="space-y-2.5 md:hidden">
          {XP03_ROWS.map((row) => (
            <div key={row.experiment} className="rounded-card border border-line bg-paper p-3.5">
              <div className="flex items-baseline justify-between gap-3">
                {row.id ? (
                  <Link to={`/experiments/${row.id}`} className="text-[12.5px] font-semibold text-ultra hover:underline">
                    {row.experiment}
                  </Link>
                ) : (
                  <span className="text-[12.5px] font-semibold text-ink">{row.experiment}</span>
                )}
                <span className={cn("font-mono text-[11.5px] font-semibold", EX_TONE_CLASS[row.heldTone])}>{row.held}</span>
              </div>
              <p className="mt-1 text-[10.5px] text-ink-4">{row.campaign}</p>
              <div className="mt-1.5 flex items-center justify-between gap-3">
                <StateCell row={row} onStop={() => setStopOpen(true)} />
                <span className="font-mono text-[10.5px] text-ink-4">day {row.day} · ends {row.ends}</span>
              </div>
            </div>
          ))}
        </div>
      </section>

      <Callout tone="amber" title="Seventeen thousand people are receiving nothing right now so that four numbers can be believed">
        That is the trade this section exists to keep visible. None of them knows, none of them was harmed, and all
        of them are worse off in a small measurable way than the people who were treated. The figure is published on
        the first screen rather than in a methods appendix, because the person designing the fifth experiment
        should see it before they choose a percentage.
      </Callout>

      <section className="space-y-3">
        <p className={EYEBROW_CLASS}>Every one of these has a condition written before it started</p>
        <div className="overflow-x-auto rounded-card border border-line bg-paper">
          <table className="w-full min-w-[820px] text-left text-[11.5px]">
            <thead>
              <tr className="border-b border-line bg-paper-2">
                <th className={HEAD_CLASS}>Experiment</th>
                <th className={HEAD_CLASS}>What would say it failed</th>
                <th className={cn(HEAD_CLASS, "text-right")}>Written</th>
                <th className={cn(HEAD_CLASS, "text-right")}>Breached?</th>
                <th className={cn(HEAD_CLASS, "text-right")}>Would stop it</th>
              </tr>
            </thead>
            <tbody>
              {XP03_CONDITION_ROWS.map((row) => (
                <tr key={row.experiment} className="border-b border-line last:border-0">
                  <td className="px-4 py-3 font-semibold text-ink-2">{row.experiment}</td>
                  <td className="px-4 py-3 text-ink-3">{row.failsIf}</td>
                  <td className="px-4 py-3 text-right">
                    <WrittenCell row={row} onChange={() => setChangeOpen(true)} />
                  </td>
                  <td className={cn("px-4 py-3 text-right", EX_TONE_CLASS[row.breachedTone])}>{row.breached}</td>
                  <td className="px-4 py-3 text-right">
                    <Chip tone={row.wouldStop ? "teal" : "rose"}>{row.wouldStop ? "yes" : "no"}</Chip>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      <StopEarlyModal open={stopOpen} onOpenChange={setStopOpen} />
      <ChangeTheConditionModal open={changeOpen} onOpenChange={setChangeOpen} />
    </div>
  );
}
