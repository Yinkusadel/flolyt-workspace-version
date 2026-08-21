import { useState } from "react";

import { EYEBROW_CLASS } from "@/pages/everyday/lifecycle/data";
import { Callout } from "@/pages/everyday/lifecycle/stage/rail";
import { Chip, CHIP_INTERACTIVE_CLASS } from "@/pages/everyday/lifecycle/stage/chip";
import { PlaybooksTabs } from "@/pages/knowledge/playbooks/tabs";
import { PlaybooksKvList } from "@/pages/knowledge/playbooks/kv-list";
import { RetireAPlaybookModal } from "@/pages/knowledge/playbooks/modals/retire-a-playbook-modal";
import {
  PB07_NOTE_CONSTRAINT,
  PB07_NOTE_WORKED,
  PB07_WHAT_RETIRING_DOES_ROWS,
  PB_CHIP_TONE,
  RETIRED_ROWS,
  type RetiredRow,
} from "@/pages/knowledge/playbooks/data";

const HEAD_CLASS = "px-4 py-2.5 font-mono text-[8.5px] font-medium tracking-[0.8px] text-ink-4 uppercase";

function ReplacedByCell({ row, onRetire }: { row: RetiredRow; onRetire: () => void }) {
  if (row.rowAction === "retire") {
    return (
      <button type="button" onClick={onRetire}>
        <Chip tone={PB_CHIP_TONE[row.replacedByTone]} className={CHIP_INTERACTIVE_CLASS}>
          {row.replacedBy}
        </Chip>
      </button>
    );
  }
  return <Chip tone={PB_CHIP_TONE[row.replacedByTone]}>{row.replacedBy}</Chip>;
}

/** PB07 — /playbooks/retired. */
const RetiredRoute = () => {
  const [retireOpen, setRetireOpen] = useState(false);

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-[17px] font-semibold text-ink">Playbooks</h1>
        <p className="mt-1 text-[11.5px] text-ink-3">
          Two retired · one because it cannot be measured, one because something beat it
        </p>
      </div>

      <PlaybooksTabs active="Retired" />

      <section className="space-y-3">
        <p className={EYEBROW_CLASS}>Playbooks that will not run again · kept, readable, unrunnable</p>
        <div className="overflow-x-auto rounded-card border border-line bg-paper">
          <table className="w-full min-w-[900px] text-left text-[11.5px]">
            <thead>
              <tr className="border-b border-line bg-paper-2">
                <th className={HEAD_CLASS}>Playbook</th>
                <th className={`${HEAD_CLASS} text-right`}>Ran</th>
                <th className={`${HEAD_CLASS} text-right`}>Retired</th>
                <th className={HEAD_CLASS}>Why</th>
                <th className={`${HEAD_CLASS} text-right`}>What replaced it</th>
                <th className={`${HEAD_CLASS} text-right`}>Still cited</th>
              </tr>
            </thead>
            <tbody>
              {RETIRED_ROWS.map((row) => (
                <tr key={row.id} className="border-b border-line last:border-0">
                  <td className="px-4 py-3 font-semibold text-ink-2 whitespace-nowrap">{row.playbook}</td>
                  <td className="px-4 py-3 text-right text-ink-4">{row.ran}</td>
                  <td className="px-4 py-3 text-right font-mono text-ink-4">{row.retired}</td>
                  <td className="px-4 py-3 text-ink-3">{row.why}</td>
                  <td className="px-4 py-3 text-right">
                    <ReplacedByCell row={row} onRetire={() => setRetireOpen(true)} />
                  </td>
                  <td className="px-4 py-3 text-right font-mono text-teal">{row.stillCited}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      <Callout tone="ultra" title="The second one worked and was retired for working less well than something else">
        {PB07_NOTE_WORKED}
      </Callout>

      <section className="space-y-3">
        <p className={EYEBROW_CLASS}>What retiring does</p>
        <PlaybooksKvList rows={PB07_WHAT_RETIRING_DOES_ROWS} />
      </section>

      <Callout tone="amber" title="The first one is retired because of a constraint, and will come back if the constraint does">
        {PB07_NOTE_CONSTRAINT}
      </Callout>

      <RetireAPlaybookModal open={retireOpen} onOpenChange={setRetireOpen} />
    </div>
  );
};

export default RetiredRoute;
