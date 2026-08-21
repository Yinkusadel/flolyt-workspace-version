import { useState } from "react";

import { cn } from "@/lib/utils";
import { EYEBROW_CLASS } from "@/pages/everyday/lifecycle/data";
import { Callout } from "@/pages/everyday/lifecycle/stage/rail";
import { Chip, CHIP_INTERACTIVE_CLASS } from "@/pages/everyday/lifecycle/stage/chip";
import { PlaybooksTabs } from "@/pages/knowledge/playbooks/tabs";
import { AdaptAPlaybookModal } from "@/pages/knowledge/playbooks/modals/adapt-a-playbook-modal";
import { BLOCKED_ROWS, PB06_NOTES, PB_CHIP_TONE, PB_TONE_CLASS, type BlockedRow } from "@/pages/knowledge/playbooks/data";

const HEAD_CLASS = "px-4 py-2.5 font-mono text-[8.5px] font-medium tracking-[0.8px] text-ink-4 uppercase";

function KindCell({ row, onAdapt }: { row: BlockedRow; onAdapt: () => void }) {
  if (row.rowAction === "adapt") {
    return (
      <button type="button" onClick={onAdapt}>
        <Chip tone={PB_CHIP_TONE[row.kindTone]} className={CHIP_INTERACTIVE_CLASS}>
          {row.kind}
        </Chip>
      </button>
    );
  }
  return <Chip tone={PB_CHIP_TONE[row.kindTone]}>{row.kind}</Chip>;
}

/** PB06 — /playbooks/blocked. */
const BlockedRoute = () => {
  const [adaptOpen, setAdaptOpen] = useState(false);

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-[17px] font-semibold text-ink">Playbooks</h1>
        <p className="mt-1 text-[11.5px] text-ink-3">Five blocks · three are a person, one is data, one is time</p>
      </div>

      <PlaybooksTabs active="Blocked" />

      <section className="space-y-3">
        <p className={EYEBROW_CLASS}>Playbooks that will not run somewhere, and exactly what stops them</p>
        <div className="overflow-x-auto rounded-card border border-line bg-paper">
          <table className="w-full min-w-[900px] text-left text-[11.5px]">
            <thead>
              <tr className="border-b border-line bg-paper-2">
                <th className={HEAD_CLASS}>Playbook</th>
                <th className={`${HEAD_CLASS} text-right`}>Blocked in</th>
                <th className={HEAD_CLASS}>The precondition it fails</th>
                <th className={`${HEAD_CLASS} text-right`}>Kind of blocker</th>
                <th className={`${HEAD_CLASS} text-right`}>Who could clear it</th>
                <th className={`${HEAD_CLASS} text-right`}>Since</th>
              </tr>
            </thead>
            <tbody>
              {BLOCKED_ROWS.map((row) => (
                <tr key={row.id} className="border-b border-line last:border-0">
                  <td className="px-4 py-3 font-semibold text-ink-2 whitespace-nowrap">{row.playbook}</td>
                  <td className={cn("px-4 py-3 text-right", PB_TONE_CLASS[row.blockedInTone])}>{row.blockedIn}</td>
                  <td className="px-4 py-3 text-ink-3">{row.precondition}</td>
                  <td className="px-4 py-3 text-right">
                    <KindCell row={row} onAdapt={() => setAdaptOpen(true)} />
                  </td>
                  <td className={cn("px-4 py-3 text-right", PB_TONE_CLASS[row.whoTone])}>{row.who}</td>
                  <td className={cn("px-4 py-3 text-right font-mono", PB_TONE_CLASS[row.sinceTone])}>{row.since}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      <Callout tone="rose" title="Three of five blockers are a person and one of them has been in place for 214 days">
        {PB06_NOTES.personBlockers}
      </Callout>

      <Callout tone="teal" title="A playbook refusing to run is not an error state and it is not shown as one">
        {PB06_NOTES.notAnError}
      </Callout>

      <AdaptAPlaybookModal open={adaptOpen} onOpenChange={setAdaptOpen} />
    </div>
  );
};

export default BlockedRoute;
