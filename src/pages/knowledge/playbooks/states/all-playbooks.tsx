import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { EYEBROW_CLASS } from "@/pages/everyday/lifecycle/data";
import { Callout } from "@/pages/everyday/lifecycle/stage/rail";
import { Chip, CHIP_INTERACTIVE_CLASS } from "@/pages/everyday/lifecycle/stage/chip";
import { KpiCards } from "@/pages/everyday/lifecycle/stage/kpi-cards";
import { PlaybooksTabs } from "@/pages/knowledge/playbooks/tabs";
import { RunAPlaybookModal } from "@/pages/knowledge/playbooks/modals/run-a-playbook-modal";
import {
  PB03_NOTES,
  PB03_STATS,
  PB_CHIP_TONE,
  PB_KPI_TONE,
  PB_TONE_CLASS,
  PLAYBOOK_ROWS,
  type PlaybookRow,
} from "@/pages/knowledge/playbooks/data";

const HEAD_CLASS = "px-4 py-2.5 font-mono text-[8.5px] font-medium tracking-[0.8px] text-ink-4 uppercase";

function StateCell({ row, onRun }: { row: PlaybookRow; onRun: () => void }) {
  if (row.rowAction === "run") {
    return (
      <button type="button" onClick={onRun}>
        <Chip tone={PB_CHIP_TONE[row.stateTone]} className={CHIP_INTERACTIVE_CLASS}>
          {row.state}
        </Chip>
      </button>
    );
  }
  return <Chip tone={PB_CHIP_TONE[row.stateTone]}>{row.state}</Chip>;
}

/** PB03 — the default populated "Playbooks" state, the main /playbooks table. */
export function AllPlaybooksState() {
  const navigate = useNavigate();
  const [runOpen, setRunOpen] = useState(false);

  return (
    <div className="space-y-8">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <h1 className="text-[17px] font-semibold text-ink">Playbooks</h1>
          <p className="mt-1 text-[11.5px] text-ink-3">
            Nine playbooks · four carry a holdout · one is complete and has never been run
          </p>
        </div>
        <Button type="button" onClick={() => navigate("/playbooks/new")}>
          Write a playbook
        </Button>
      </div>

      <PlaybooksTabs active="Playbooks" />

      <KpiCards items={PB03_STATS.map((s) => ({ eyebrow: s.eyebrow, value: s.value, note: s.note, tone: PB_KPI_TONE[s.tone] }))} />

      <section className="space-y-3">
        <p className={EYEBROW_CLASS}>Every playbook · where it has run and what happened</p>

        <div className="hidden overflow-x-auto rounded-card border border-line bg-paper md:block">
          <table className="w-full min-w-[960px] text-left text-[11.5px]">
            <thead>
              <tr className="border-b border-line bg-paper-2">
                <th className={HEAD_CLASS}>Playbook</th>
                <th className={`${HEAD_CLASS} text-right`}>Runs</th>
                <th className={`${HEAD_CLASS} text-right`}>Best result</th>
                <th className={`${HEAD_CLASS} text-right`}>Worst result</th>
                <th className={HEAD_CLASS}>Measurement</th>
                <th className={`${HEAD_CLASS} text-right`}>State</th>
                <th className={`${HEAD_CLASS} text-right`}>Owner</th>
              </tr>
            </thead>
            <tbody>
              {PLAYBOOK_ROWS.map((row) => (
                <tr key={row.id} className="border-b border-line last:border-0">
                  <td className="px-4 py-3 font-semibold whitespace-nowrap">
                    <Link to={`/playbooks/${row.id}`} className="text-ultra hover:underline">
                      {row.playbook}
                    </Link>
                  </td>
                  <td className={cn("px-4 py-3 text-right font-mono", PB_TONE_CLASS[row.runsTone])}>{row.runs}</td>
                  <td className={cn("px-4 py-3 text-right font-mono", PB_TONE_CLASS[row.bestTone])}>{row.best}</td>
                  <td className={cn("px-4 py-3 text-right font-mono", PB_TONE_CLASS[row.worstTone])}>{row.worst}</td>
                  <td className="px-4 py-3 text-ink-3">{row.measurement}</td>
                  <td className="px-4 py-3 text-right">
                    <StateCell row={row} onRun={() => setRunOpen(true)} />
                  </td>
                  <td className="px-4 py-3 text-right text-ink-4">{row.owner}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="space-y-2.5 md:hidden">
          {PLAYBOOK_ROWS.map((row) => (
            <Link
              key={row.id}
              to={`/playbooks/${row.id}`}
              className="block rounded-card border border-line bg-paper p-3.5"
            >
              <div className="flex items-baseline justify-between gap-3">
                <span className="text-[12.5px] font-semibold text-ultra">{row.playbook}</span>
              </div>
              <p className="mt-1 text-[10.5px] text-ink-4">{row.measurement}</p>
              <div className="mt-1.5 flex items-center gap-2">
                <Chip tone={PB_CHIP_TONE[row.stateTone]}>{row.state}</Chip>
                <span className="font-mono text-[10px] text-ink-4">
                  {row.runs} runs · {row.owner}
                </span>
              </div>
            </Link>
          ))}
        </div>
      </section>

      <Callout tone="amber" title="Four playbooks carry a holdout and four of the nine do not, and the split is not about rigour">
        {PB03_NOTES.holdoutSplit}
      </Callout>

      <Callout tone="rose" title="The sixth row has never run and is still a playbook">
        {PB03_NOTES.neverRun}
      </Callout>

      <RunAPlaybookModal open={runOpen} onOpenChange={setRunOpen} />
    </div>
  );
}
