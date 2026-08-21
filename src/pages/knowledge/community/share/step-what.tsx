import { EYEBROW_CLASS } from "@/pages/everyday/lifecycle/data";
import { Callout } from "@/pages/everyday/lifecycle/stage/rail";
import { Chip } from "@/pages/everyday/lifecycle/stage/chip";
import { CM09_CANDIDATE_ROWS, CM09_NOTES, CM_CHIP_TONE } from "@/pages/knowledge/community/data";

const HEAD_CLASS = "px-4 py-2.5 font-mono text-[8.5px] font-medium tracking-[0.8px] text-ink-4 uppercase";

/** CM09 — "What are you sharing?", step 1 of the share wizard. */
export function StepWhat() {
  return (
    <div className="space-y-8">
      <section className="space-y-3">
        <p className={EYEBROW_CLASS}>What are you sharing?</p>
        <div className="overflow-x-auto rounded-card border border-line bg-paper">
          <table className="w-full min-w-[820px] text-left text-[11.5px]">
            <thead>
              <tr className="border-b border-line bg-paper-2">
                <th className={HEAD_CLASS}>From your workspace</th>
                <th className={HEAD_CLASS}>Kind</th>
                <th className={`${HEAD_CLASS} text-right`}>Can it be shared?</th>
                <th className={HEAD_CLASS}>What would have to go</th>
              </tr>
            </thead>
            <tbody>
              {CM09_CANDIDATE_ROWS.map((row) => (
                <tr key={row.from} className="border-b border-line last:border-0">
                  <td className="px-4 py-3 font-semibold text-ink-2">{row.from}</td>
                  <td className="px-4 py-3">
                    <Chip tone={CM_CHIP_TONE[row.kindTone]}>{row.kind}</Chip>
                  </td>
                  <td className="px-4 py-3 text-right">
                    <Chip tone={CM_CHIP_TONE[row.canShareTone]}>{row.canShare}</Chip>
                  </td>
                  <td className="px-4 py-3 text-ink-3">{row.whatGoes}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      <Callout tone="ultra" title="The third row can be shared and what survives is a sentence, not a finding">
        {CM09_NOTES.thirdRow}
      </Callout>

      <Callout tone="amber" title="The fourth row is offered so it can be refused rather than hidden">
        {CM09_NOTES.fourthRow}
      </Callout>
    </div>
  );
}
