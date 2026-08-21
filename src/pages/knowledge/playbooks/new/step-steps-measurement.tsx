import { EYEBROW_CLASS } from "@/pages/everyday/lifecycle/data";
import { Callout } from "@/pages/everyday/lifecycle/stage/rail";
import { Chip } from "@/pages/everyday/lifecycle/stage/chip";
import { PlaybooksKvList } from "@/pages/knowledge/playbooks/kv-list";
import { PB10_MEASUREMENT_ROWS, PB10_NOTE, PB10_STEP_ROWS, PB_CHIP_TONE } from "@/pages/knowledge/playbooks/data";

const HEAD_CLASS = "px-4 py-2.5 font-mono text-[8.5px] font-medium tracking-[0.8px] text-ink-4 uppercase";

/** PB10 — "The steps, and who does each one", step 3 of the write-a-playbook wizard. */
export function StepStepsAndMeasurement() {
  return (
    <div className="space-y-8">
      <section className="space-y-3">
        <p className={EYEBROW_CLASS}>The steps, and who does each one</p>
        <div className="overflow-x-auto rounded-card border border-line bg-paper">
          <table className="w-full min-w-[720px] text-left text-[11.5px]">
            <thead>
              <tr className="border-b border-line bg-paper-2">
                <th className={HEAD_CLASS}>Step</th>
                <th className={HEAD_CLASS}>What is done</th>
                <th className={`${HEAD_CLASS} text-right`}>Who</th>
                <th className={`${HEAD_CLASS} text-right`}>Skippable</th>
              </tr>
            </thead>
            <tbody>
              {PB10_STEP_ROWS.map((row) => (
                <tr key={row.step} className="border-b border-line last:border-0">
                  <td className="px-4 py-3 font-mono text-ink-4">{row.step}</td>
                  <td className="px-4 py-3 text-ink-2">{row.what}</td>
                  <td className="px-4 py-3 text-right text-ink-4">{row.who}</td>
                  <td className="px-4 py-3 text-right">
                    <Chip tone={PB_CHIP_TONE[row.skippableTone]}>{row.skippable}</Chip>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      <Callout tone="ultra" title="Step six is doing nothing for eighteen days and it is the step most likely to be skipped">
        {PB10_NOTE}
      </Callout>

      <section className="space-y-3">
        <p className={EYEBROW_CLASS}>Measurement, written into the method rather than beside it</p>
        <PlaybooksKvList rows={PB10_MEASUREMENT_ROWS} />
      </section>
    </div>
  );
}
