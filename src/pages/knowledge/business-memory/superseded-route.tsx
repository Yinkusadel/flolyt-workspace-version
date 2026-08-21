import { useState } from "react";

import { cn } from "@/lib/utils";
import { EYEBROW_CLASS } from "@/pages/everyday/lifecycle/data";
import { Callout } from "@/pages/everyday/lifecycle/stage/rail";
import { Chip, CHIP_INTERACTIVE_CLASS } from "@/pages/everyday/lifecycle/stage/chip";
import { BusinessMemoryTabs } from "@/pages/knowledge/business-memory/tabs";
import { SupersedeALearningModal } from "@/pages/knowledge/business-memory/modals/supersede-a-learning-modal";
import { BM_CHIP_TONE, BM_TONE_CLASS, ME05_NOTES, SUPERSEDED_ROWS, type SupersededRow } from "@/pages/knowledge/business-memory/data";

const HEAD_CLASS = "px-4 py-2.5 font-mono text-[8.5px] font-medium tracking-[0.8px] text-ink-4 uppercase";

function StillTrueCell({ row, onSupersede }: { row: SupersededRow; onSupersede: () => void }) {
  if (row.rowAction === "supersede") {
    return (
      <button type="button" onClick={onSupersede}>
        <Chip tone={BM_CHIP_TONE[row.stillTrueTone]} className={CHIP_INTERACTIVE_CLASS}>
          {row.stillTrue}
        </Chip>
      </button>
    );
  }
  return <Chip tone={BM_CHIP_TONE[row.stillTrueTone]}>{row.stillTrue}</Chip>;
}

/** ME05 — /business-memory/superseded. */
const SupersededRoute = () => {
  const [modalOpen, setModalOpen] = useState(false);

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-[17px] font-semibold text-ink">Business memory</h1>
        <p className="mt-1 text-[11.5px] text-ink-3">Fourteen superseded, none deleted</p>
      </div>

      <BusinessMemoryTabs active="Superseded" />

      <section className="space-y-3">
        <p className={EYEBROW_CLASS}>Fourteen learnings have been superseded · none of them has been deleted</p>
        <div className="overflow-x-auto rounded-card border border-line bg-paper">
          <table className="w-full min-w-[860px] text-left text-[11.5px]">
            <thead>
              <tr className="border-b border-line bg-paper-2">
                <th className={HEAD_CLASS}>Learning</th>
                <th className={`${HEAD_CLASS} text-right`}>Superseded where</th>
                <th className={HEAD_CLASS}>By what</th>
                <th className={`${HEAD_CLASS} text-right`}>When</th>
                <th className={`${HEAD_CLASS} text-right`}>Still true elsewhere?</th>
              </tr>
            </thead>
            <tbody>
              {SUPERSEDED_ROWS.map((row) => (
                <tr key={row.id} className="border-b border-line last:border-0">
                  <td className="px-4 py-3 font-semibold text-ink-2">{row.learning}</td>
                  <td className={cn("px-4 py-3 text-right", BM_TONE_CLASS[row.whereTone])}>{row.where}</td>
                  <td className="px-4 py-3 text-ink-3">{row.by}</td>
                  <td className="px-4 py-3 text-right font-mono text-ink-4">{row.when}</td>
                  <td className="px-4 py-3 text-right">
                    <StillTrueCell row={row} onSupersede={() => setModalOpen(true)} />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      <Callout tone="ultra" title="Superseding is scoped, and the scope is the interesting part of the row">
        {ME05_NOTES.scoped}
      </Callout>

      <Callout tone="amber" title="The third row is a fact that stopped being true and is kept as history">
        {ME05_NOTES.keptAsHistory}
      </Callout>

      <SupersedeALearningModal open={modalOpen} onOpenChange={setModalOpen} />
    </div>
  );
};

export default SupersededRoute;
