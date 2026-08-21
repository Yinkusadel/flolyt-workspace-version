import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { EYEBROW_CLASS } from "@/pages/everyday/lifecycle/data";
import { Callout } from "@/pages/everyday/lifecycle/stage/rail";
import { Chip, CHIP_INTERACTIVE_CLASS } from "@/pages/everyday/lifecycle/stage/chip";
import { KpiCards } from "@/pages/everyday/lifecycle/stage/kpi-cards";
import { CommunityTabs } from "@/pages/knowledge/community/tabs";
import { AdoptAMethodModal } from "@/pages/knowledge/community/modals/adopt-a-method-modal";
import {
  CM03_NOTES,
  CM03_STATS,
  CM_CHIP_TONE,
  CM_KPI_TONE,
  CM_TONE_CLASS,
  METHOD_ROWS,
  type MethodRow,
} from "@/pages/knowledge/community/data";

const HEAD_CLASS = "px-4 py-2.5 font-mono text-[8.5px] font-medium tracking-[0.8px] text-ink-4 uppercase";

function YouCell({ row, onAdopt }: { row: MethodRow; onAdopt: () => void }) {
  if (row.rowAction === "adopt") {
    return (
      <button type="button" onClick={onAdopt}>
        <Chip tone={CM_CHIP_TONE[row.youTone]} className={CHIP_INTERACTIVE_CLASS}>
          {row.you}
        </Chip>
      </button>
    );
  }
  return <Chip tone={CM_CHIP_TONE[row.youTone]}>{row.you}</Chip>;
}

/** CM03 — the default populated "Methods" state, the main /community table. */
export function MethodsState() {
  const navigate = useNavigate();
  const [adoptOpen, setAdoptOpen] = useState(false);

  return (
    <div className="space-y-8">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <h1 className="text-[17px] font-semibold text-ink">Community</h1>
          <p className="mt-1 text-[11.5px] text-ink-3">
            214 methods from 88 companies · no results attached to any of them
          </p>
        </div>
        <div className="flex shrink-0 flex-wrap items-center gap-4">
          <Link to="/community/refused" className="text-[11.5px] font-semibold text-ink-3 hover:text-ink">
            What this is not
          </Link>
          <Button type="button" onClick={() => navigate("/community/share")}>
            Share a method
          </Button>
        </div>
      </div>

      <CommunityTabs active="Methods" />

      <KpiCards items={CM03_STATS.map((s) => ({ eyebrow: s.eyebrow, value: s.value, note: s.note, tone: CM_KPI_TONE[s.tone] }))} />

      <section className="space-y-3">
        <p className={EYEBROW_CLASS}>Methods · ordered by how many companies have adopted and kept them</p>

        <div className="hidden overflow-x-auto rounded-card border border-line bg-paper md:block">
          <table className="w-full min-w-[980px] text-left text-[11.5px]">
            <thead>
              <tr className="border-b border-line bg-paper-2">
                <th className={HEAD_CLASS}>Method</th>
                <th className={`${HEAD_CLASS} text-right`}>Adopted by</th>
                <th className={`${HEAD_CLASS} text-right`}>Still in use</th>
                <th className={HEAD_CLASS}>What it needs</th>
                <th className={`${HEAD_CLASS} text-right`}>You</th>
              </tr>
            </thead>
            <tbody>
              {METHOD_ROWS.map((row) => (
                <tr key={row.method} className="border-b border-line last:border-0">
                  <td className="px-4 py-3 font-semibold whitespace-nowrap">
                    {row.detailHref ? (
                      <Link to={row.detailHref} className="text-ultra hover:underline">
                        {row.method}
                      </Link>
                    ) : (
                      <span className="text-ink-2">{row.method}</span>
                    )}
                  </td>
                  <td className={cn("px-4 py-3 text-right font-mono", CM_TONE_CLASS[row.adoptedByTone])}>{row.adoptedBy}</td>
                  <td className={cn("px-4 py-3 text-right font-mono", CM_TONE_CLASS[row.stillInUseTone])}>{row.stillInUse}</td>
                  <td className="px-4 py-3 text-ink-3">{row.needs}</td>
                  <td className="px-4 py-3 text-right">
                    <YouCell row={row} onAdopt={() => setAdoptOpen(true)} />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="space-y-2.5 md:hidden">
          {METHOD_ROWS.map((row) =>
            row.detailHref ? (
              <Link
                key={row.method}
                to={row.detailHref}
                className="block rounded-card border border-line bg-paper p-3.5"
              >
                <span className="text-[12.5px] font-semibold text-ultra">{row.method}</span>
                <p className="mt-1 text-[10.5px] text-ink-4">{row.needs}</p>
                <div className="mt-1.5 flex items-center gap-2">
                  <Chip tone={CM_CHIP_TONE[row.youTone]}>{row.you}</Chip>
                  <span className="font-mono text-[10px] text-ink-4">
                    adopted by {row.adoptedBy} · {row.stillInUse} still in use
                  </span>
                </div>
              </Link>
            ) : (
              <div key={row.method} className="rounded-card border border-line bg-paper p-3.5">
                <span className="text-[12.5px] font-semibold text-ink">{row.method}</span>
                <p className="mt-1 text-[10.5px] text-ink-4">{row.needs}</p>
                <div className="mt-1.5 flex items-center gap-2">
                  <YouCell row={row} onAdopt={() => setAdoptOpen(true)} />
                  <span className="font-mono text-[10px] text-ink-4">
                    adopted by {row.adoptedBy} · {row.stillInUse} still in use
                  </span>
                </div>
              </div>
            )
          )}
        </div>
      </section>

      <Callout tone="rose" title="The sixth row is the one this company should read and has not adopted">
        {CM03_NOTES.supportRow}
      </Callout>

      <Callout tone="ultra" title="Nine of the eighteen companies that adopted the last row have stopped using it">
        {CM03_NOTES.dropoff}
      </Callout>

      <AdoptAMethodModal open={adoptOpen} onOpenChange={setAdoptOpen} />
    </div>
  );
}
