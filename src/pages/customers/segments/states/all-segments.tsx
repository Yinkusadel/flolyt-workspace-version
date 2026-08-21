import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { EYEBROW_CLASS } from "@/pages/everyday/lifecycle/data";
import { Callout } from "@/pages/everyday/lifecycle/stage/rail";
import { Chip, CHIP_INTERACTIVE_CLASS } from "@/pages/everyday/lifecycle/stage/chip";
import { KpiCards } from "@/pages/everyday/lifecycle/stage/kpi-cards";
import { SegmentsKvList } from "@/pages/customers/segments/kv-list";
import { SegmentsTabs } from "@/pages/customers/segments/tabs";
import { FreezeASegmentModal } from "@/pages/customers/segments/modals/freeze-a-segment-modal";
import { RetireASegmentModal } from "@/pages/customers/segments/modals/retire-a-segment-modal";
import { UseASegmentModal } from "@/pages/customers/segments/modals/use-a-segment-modal";
import {
  SEGMENT_ROWS,
  SG03_CANNOT_BE_ROWS,
  SG03_NOTE,
  SG03_STATS,
  SG_CHIP_TONE,
  SG_KPI_TONE,
  SG_TONE_CLASS,
  type SegmentRow,
} from "@/pages/customers/segments/data";

const HEAD_CLASS = "px-4 py-2.5 font-mono text-[8.5px] font-medium tracking-[0.8px] text-ink-4 uppercase";

function StateCell({ row, onAction }: { row: SegmentRow; onAction: (action: "freeze" | "retire" | "use") => void }) {
  if (row.rowAction) {
    return (
      <button type="button" onClick={() => onAction(row.rowAction!)}>
        <Chip tone={SG_CHIP_TONE[row.stateTone]} className={CHIP_INTERACTIVE_CLASS}>
          {row.state}
        </Chip>
      </button>
    );
  }
  return <Chip tone={SG_CHIP_TONE[row.stateTone]}>{row.state}</Chip>;
}

/** SG03 — the default populated "All segments" state. */
export function AllSegmentsState() {
  const navigate = useNavigate();
  const [modal, setModal] = useState<"freeze" | "retire" | "use" | null>(null);

  return (
    <div className="space-y-8">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <h1 className="text-[17px] font-semibold text-ink">Segments</h1>
          <p className="mt-1 text-[11.5px] text-ink-3">34 defined · 11 in use</p>
        </div>
        <Button type="button" onClick={() => navigate("/segments/new")}>
          Define a segment
        </Button>
      </div>

      <SegmentsTabs active="All segments" />

      <KpiCards items={SG03_STATS.map((s) => ({ eyebrow: s.eyebrow, value: s.value, note: s.note, tone: SG_KPI_TONE[s.tone] }))} />

      <section className="space-y-3">
        <p className={EYEBROW_CLASS}>Every segment · matched, included, and what it is for</p>

        <div className="hidden overflow-x-auto rounded-card border border-line bg-paper md:block">
          <table className="w-full min-w-[920px] text-left text-[11.5px]">
            <thead>
              <tr className="border-b border-line bg-paper-2">
                <th className={HEAD_CLASS}>Segment</th>
                <th className={cn(HEAD_CLASS, "text-right")}>Matched</th>
                <th className={cn(HEAD_CLASS, "text-right")}>Included</th>
                <th className={cn(HEAD_CLASS, "text-right")}>Excluded</th>
                <th className={HEAD_CLASS}>What it is for</th>
                <th className={HEAD_CLASS}>Owner</th>
                <th className={HEAD_CLASS}>State</th>
              </tr>
            </thead>
            <tbody>
              {SEGMENT_ROWS.map((row) => (
                <tr key={row.id} className="border-b border-line last:border-0">
                  <td className="px-4 py-3 font-semibold whitespace-nowrap">
                    <Link to={`/segments/${row.id}`} className="text-ultra hover:underline">
                      {row.name}
                    </Link>
                  </td>
                  <td className={cn("px-4 py-3 text-right font-mono", SG_TONE_CLASS[row.matchedTone])}>{row.matched}</td>
                  <td className={cn("px-4 py-3 text-right font-mono", SG_TONE_CLASS[row.includedTone])}>{row.included}</td>
                  <td className={cn("px-4 py-3 text-right font-mono", SG_TONE_CLASS[row.excludedTone])}>{row.excluded}</td>
                  <td className="px-4 py-3 text-ink-2">{row.usedFor}</td>
                  <td className={cn("px-4 py-3", SG_TONE_CLASS[row.ownerTone])}>{row.owner}</td>
                  <td className="px-4 py-3">
                    <StateCell row={row} onAction={setModal} />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="space-y-2.5 md:hidden">
          {SEGMENT_ROWS.map((row) => (
            <Link
              key={row.id}
              to={`/segments/${row.id}`}
              className="block rounded-card border border-line bg-paper p-3.5"
            >
              <div className="flex items-baseline justify-between gap-3">
                <span className="text-[12.5px] font-semibold text-ultra">{row.name}</span>
                <span className={cn("font-mono text-[11.5px] font-semibold", SG_TONE_CLASS[row.includedTone])}>
                  {row.included}
                </span>
              </div>
              <p className="mt-1 text-[10.5px] text-ink-4">{row.usedFor}</p>
              <div className="mt-1.5">
                <Chip tone={SG_CHIP_TONE[row.stateTone]}>{row.state}</Chip>
              </div>
            </Link>
          ))}
        </div>
      </section>

      <Callout tone="rose" title="Twenty-three of thirty-four segments are not used for anything">
        {SG03_NOTE}
      </Callout>

      <section className="space-y-3">
        <p className={EYEBROW_CLASS}>What a segment cannot be</p>
        <SegmentsKvList rows={SG03_CANNOT_BE_ROWS} />
      </section>

      <FreezeASegmentModal open={modal === "freeze"} onOpenChange={(open) => setModal(open ? "freeze" : null)} />
      <RetireASegmentModal open={modal === "retire"} onOpenChange={(open) => setModal(open ? "retire" : null)} />
      <UseASegmentModal open={modal === "use"} onOpenChange={(open) => setModal(open ? "use" : null)} />
    </div>
  );
}
