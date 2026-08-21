import { EYEBROW_CLASS } from "@/pages/everyday/lifecycle/data";
import { Callout } from "@/pages/everyday/lifecycle/stage/rail";
import { Chip } from "@/pages/everyday/lifecycle/stage/chip";
import { PB09_NOTES, PB09_PRECONDITION_ROWS, PB_CHIP_TONE } from "@/pages/knowledge/playbooks/data";

const HEAD_CLASS = "px-4 py-2.5 font-mono text-[8.5px] font-medium tracking-[0.8px] text-ink-4 uppercase";

/** PB09 — "What has to be true before this may run?", step 2 of the write-a-playbook wizard. */
export function StepPreconditions() {
  return (
    <div className="space-y-8">
      <section className="space-y-3">
        <p className={EYEBROW_CLASS}>What has to be true before this may run · it will refuse without them</p>
        <div className="overflow-x-auto rounded-card border border-line bg-paper">
          <table className="w-full min-w-[860px] text-left text-[11.5px]">
            <thead>
              <tr className="border-b border-line bg-paper-2">
                <th className={HEAD_CLASS}>Precondition</th>
                <th className={HEAD_CLASS}>Where it came from</th>
                <th className={`${HEAD_CLASS} text-right`}>Markets that pass</th>
                <th className={`${HEAD_CLASS} text-right`}>If it fails</th>
                <th className={`${HEAD_CLASS} text-right`}>Required</th>
              </tr>
            </thead>
            <tbody>
              {PB09_PRECONDITION_ROWS.map((row) => (
                <tr key={row.precondition} className="border-b border-line last:border-0">
                  <td className="px-4 py-3 font-semibold text-ink-2">{row.precondition}</td>
                  <td className="px-4 py-3 text-ink-3">{row.from}</td>
                  <td className="px-4 py-3 text-right">
                    <Chip tone={PB_CHIP_TONE[row.passTone]}>{row.pass}</Chip>
                  </td>
                  <td className="px-4 py-3 text-right text-ink-4">{row.ifFails}</td>
                  <td className="px-4 py-3 text-right">
                    <Chip tone={PB_CHIP_TONE[row.requiredTone]}>{row.required}</Chip>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      <Callout tone="ultra" title="Two of these five exist because a run went wrong, and that is where preconditions come from">
        {PB09_NOTES.fromFailure}
      </Callout>

      <Callout tone="amber" title="Ghana passes three of five today and passes four in October">
        {PB09_NOTES.ghanaOctober}
      </Callout>
    </div>
  );
}
