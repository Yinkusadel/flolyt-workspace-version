import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { EYEBROW_CLASS } from "@/pages/everyday/lifecycle/data";
import { Callout } from "@/pages/everyday/lifecycle/stage/rail";
import { Chip, CHIP_INTERACTIVE_CLASS } from "@/pages/everyday/lifecycle/stage/chip";
import { KpiCards } from "@/pages/everyday/lifecycle/stage/kpi-cards";
import { BusinessMemoryTabs } from "@/pages/knowledge/business-memory/tabs";
import { BusinessMemoryKvList } from "@/pages/knowledge/business-memory/kv-list";
import { CiteALearningModal } from "@/pages/knowledge/business-memory/modals/cite-a-learning-modal";
import {
  BM_CHIP_TONE,
  BM_KPI_TONE,
  BM_TONE_CLASS,
  LEARNING_ROWS,
  ME03_EVIDENCE_BEHIND,
  ME03_NOTES,
  ME03_STATS,
  type LearningRow,
} from "@/pages/knowledge/business-memory/data";

const HEAD_CLASS = "px-4 py-2.5 font-mono text-[8.5px] font-medium tracking-[0.8px] text-ink-4 uppercase";

function StateCell({ row, onCite }: { row: LearningRow; onCite: () => void }) {
  if (row.rowAction === "cite") {
    return (
      <button type="button" onClick={onCite}>
        <Chip tone={BM_CHIP_TONE[row.stateTone]} className={CHIP_INTERACTIVE_CLASS}>
          {row.state}
        </Chip>
      </button>
    );
  }
  return <Chip tone={BM_CHIP_TONE[row.stateTone]}>{row.state}</Chip>;
}

/** ME03 — the default populated "Learnings" state, the main /business-memory table. */
export function LearningsState() {
  const navigate = useNavigate();
  const [citeOpen, setCiteOpen] = useState(false);

  return (
    <div className="space-y-8">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <h1 className="text-[17px] font-semibold text-ink">Business memory</h1>
          <p className="mt-1 text-[11.5px] text-ink-3">61 learnings · 25 validated · 27 never cited</p>
        </div>
        <Button type="button" onClick={() => navigate("/business-memory/new")}>
          Write a learning
        </Button>
      </div>

      <BusinessMemoryTabs active="Learnings" />

      <KpiCards items={ME03_STATS.map((s) => ({ eyebrow: s.eyebrow, value: s.value, note: s.note, tone: BM_KPI_TONE[s.tone] }))} />

      <section className="space-y-3">
        <p className={EYEBROW_CLASS}>Most cited first · this is not a ranking of importance</p>

        <div className="hidden overflow-x-auto rounded-card border border-line bg-paper md:block">
          <table className="w-full min-w-[920px] text-left text-[11.5px]">
            <thead>
              <tr className="border-b border-line bg-paper-2">
                <th className={HEAD_CLASS}>Learning</th>
                <th className={`${HEAD_CLASS} text-right`}>State</th>
                <th className={HEAD_CLASS}>Evidence</th>
                <th className={`${HEAD_CLASS} text-right`}>Cited</th>
                <th className={`${HEAD_CLASS} text-right`}>Written</th>
                <th className={HEAD_CLASS}>Stage</th>
              </tr>
            </thead>
            <tbody>
              {LEARNING_ROWS.map((row) => (
                <tr key={row.id} className="border-b border-line last:border-0">
                  <td className="px-4 py-3 font-semibold whitespace-nowrap">
                    <Link to={`/business-memory/${row.id}`} className="text-ultra hover:underline">
                      {row.learning}
                    </Link>
                  </td>
                  <td className="px-4 py-3 text-right">
                    <StateCell row={row} onCite={() => setCiteOpen(true)} />
                  </td>
                  <td className="px-4 py-3 text-ink-3">{row.evidence}</td>
                  <td className={cn("px-4 py-3 text-right font-mono", BM_TONE_CLASS[row.citedTone])}>{row.cited}</td>
                  <td className="px-4 py-3 text-right font-mono text-ink-4">{row.written}</td>
                  <td className="px-4 py-3 text-ink-4">{row.stage}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="space-y-2.5 md:hidden">
          {LEARNING_ROWS.map((row) => (
            <Link
              key={row.id}
              to={`/business-memory/${row.id}`}
              className="block rounded-card border border-line bg-paper p-3.5"
            >
              <div className="flex items-baseline justify-between gap-3">
                <span className="text-[12.5px] font-semibold text-ultra">{row.learning}</span>
              </div>
              <p className="mt-1 text-[10.5px] text-ink-4">{row.evidence}</p>
              <div className="mt-1.5 flex items-center gap-2">
                <Chip tone={BM_CHIP_TONE[row.stateTone]}>{row.state}</Chip>
                <span className="font-mono text-[10px] text-ink-4">
                  cited {row.cited} · {row.stage}
                </span>
              </div>
            </Link>
          ))}
        </div>
      </section>

      <Callout tone="amber" title="Twenty-seven learnings have never been cited and nobody knows whether that is a problem">
        {ME03_NOTES.neverCited}
      </Callout>

      <Callout tone="ultra" title="The most cited line in the workspace is nine months old and predates Flolyt">
        {ME03_NOTES.mostCited}
      </Callout>

      <section className="space-y-3">
        <p className={EYEBROW_CLASS}>Evidence behind the 61</p>
        <BusinessMemoryKvList
          rows={ME03_EVIDENCE_BEHIND.map((r) => ({ label: r.label, value: r.value, tone: r.tone }))}
        />
      </section>

      <CiteALearningModal open={citeOpen} onOpenChange={setCiteOpen} />
    </div>
  );
}
