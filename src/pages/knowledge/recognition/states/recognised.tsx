import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { EYEBROW_CLASS } from "@/pages/everyday/lifecycle/data";
import { Callout } from "@/pages/everyday/lifecycle/stage/rail";
import { RecognitionTabs } from "@/pages/knowledge/recognition/tabs";
import { WhoCell } from "@/pages/knowledge/recognition/who-cell";
import { RemoveARecognitionModal } from "@/pages/knowledge/recognition/modals/remove-a-recognition-modal";
import { KpiCards } from "@/pages/everyday/lifecycle/stage/kpi-cards";
import {
  RC03_NOTES,
  RC03_STATS,
  RC_KPI_TONE,
  RC_TONE_CLASS,
  RECOGNISED_ROWS,
  type RecognisedRow,
} from "@/pages/knowledge/recognition/data";

const HEAD_CLASS = "px-4 py-2.5 font-mono text-[8.5px] font-medium tracking-[0.8px] text-ink-4 uppercase";

function CostCell({ row, onRemove }: { row: RecognisedRow; onRemove: () => void }) {
  if (row.rowAction === "remove") {
    return (
      <button type="button" onClick={onRemove} className={cn("text-right font-semibold text-ultra hover:underline", RC_TONE_CLASS[row.costTone])}>
        {row.cost}
      </button>
    );
  }
  return <span className={RC_TONE_CLASS[row.costTone]}>{row.cost}</span>;
}

/** RC03 — the default populated "Recognised" state, the main /recognition table. */
export function RecognisedState() {
  const navigate = useNavigate();
  const [removeOpen, setRemoveOpen] = useState(false);

  return (
    <div className="space-y-8">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <h1 className="text-[17px] font-semibold text-ink">Recognition</h1>
          <p className="mt-1 text-[11.5px] text-ink-3">
            34 acts this quarter · 15 of them for closing something at zero · none for recovering money
          </p>
        </div>
        <div className="flex shrink-0 flex-wrap items-center gap-4">
          <Link to="/recognition/absent" className="text-[11.5px] font-semibold text-ink-3 hover:text-ink">
            Who never appears
          </Link>
          <Link to="/recognition/no-ranking" className="text-[11.5px] font-semibold text-ink-3 hover:text-ink">
            Why there is no leaderboard
          </Link>
          <Button type="button" onClick={() => navigate("/recognition/new")}>
            Recognise somebody
          </Button>
        </div>
      </div>

      <RecognitionTabs active="Recognised" />

      <KpiCards items={RC03_STATS.map((s) => ({ eyebrow: s.eyebrow, value: s.value, note: s.note, tone: RC_KPI_TONE[s.tone] }))} />

      <section className="space-y-3">
        <p className={EYEBROW_CLASS}>This quarter · in the order they happened, which is the only order available</p>
        <div className="overflow-x-auto rounded-card border border-line bg-paper">
          <table className="w-full min-w-[920px] text-left text-[11.5px]">
            <thead>
              <tr className="border-b border-line bg-paper-2">
                <th className={HEAD_CLASS}>What was done</th>
                <th className={HEAD_CLASS}>Who</th>
                <th className={HEAD_CLASS}>Why it was recognised</th>
                <th className={`${HEAD_CLASS} text-right`}>When</th>
                <th className={`${HEAD_CLASS} text-right`}>What it cost</th>
              </tr>
            </thead>
            <tbody>
              {RECOGNISED_ROWS.map((row) => (
                <tr key={row.id} className="border-b border-line last:border-0">
                  <td className="px-4 py-3 font-semibold text-ink-2">{row.what}</td>
                  <td className="px-4 py-3">
                    <WhoCell actor={row.who} />
                  </td>
                  <td className="px-4 py-3 text-ink-3">{row.why}</td>
                  <td className="px-4 py-3 text-right font-mono text-ink-4">{row.when}</td>
                  <td className="px-4 py-3 text-right">
                    <CostCell row={row} onRemove={() => setRemoveOpen(true)} />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      <Callout tone="teal" title="Fifteen of thirty-four are for closing something at zero, and that is the healthiest number in the workspace">
        {RC03_NOTES.zeroPct}
      </Callout>

      <Callout tone="ultra" title="There is no order to this table except when things happened">
        {RC03_NOTES.noOrder}
      </Callout>

      <RemoveARecognitionModal open={removeOpen} onOpenChange={setRemoveOpen} />
    </div>
  );
}
