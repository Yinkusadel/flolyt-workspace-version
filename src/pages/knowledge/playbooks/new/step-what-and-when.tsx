import { EYEBROW_CLASS } from "@/pages/everyday/lifecycle/data";
import { Callout } from "@/pages/everyday/lifecycle/stage/rail";
import { Chip } from "@/pages/everyday/lifecycle/stage/chip";
import { PlaybooksKvList } from "@/pages/knowledge/playbooks/kv-list";
import { PB08_FOR_ROWS, PB08_NOTE, PB08_RUN_ROWS, PB_CHIP_TONE, PB_TONE_CLASS } from "@/pages/knowledge/playbooks/data";

const HEAD_CLASS = "px-4 py-2.5 font-mono text-[8.5px] font-medium tracking-[0.8px] text-ink-4 uppercase";

/** PB08 — "Which runs is this being written from?", step 1 of the write-a-playbook wizard. */
export function StepWhatAndWhen() {
  return (
    <div className="space-y-8">
      <section className="space-y-3">
        <p className={EYEBROW_CLASS}>Which runs is this being written from?</p>
        <div className="overflow-x-auto rounded-card border border-line bg-paper">
          <table className="w-full min-w-[820px] text-left text-[11.5px]">
            <thead>
              <tr className="border-b border-line bg-paper-2">
                <th className={HEAD_CLASS}>Run</th>
                <th className={`${HEAD_CLASS} text-right`}>Market</th>
                <th className={`${HEAD_CLASS} text-right`}>When</th>
                <th className={`${HEAD_CLASS} text-right`}>Result</th>
                <th className={HEAD_CLASS}>Measured how</th>
                <th className={`${HEAD_CLASS} text-right`}>Include</th>
              </tr>
            </thead>
            <tbody>
              {PB08_RUN_ROWS.map((row) => (
                <tr key={row.run} className="border-b border-line last:border-0">
                  <td className="px-4 py-3 font-semibold text-ink-2 whitespace-nowrap">{row.run}</td>
                  <td className="px-4 py-3 text-right text-ink-4">{row.market}</td>
                  <td className="px-4 py-3 text-right font-mono text-ink-4">{row.when}</td>
                  <td className={`px-4 py-3 text-right font-mono ${PB_TONE_CLASS[row.resultTone]}`}>{row.result}</td>
                  <td className="px-4 py-3 text-ink-3">{row.measured}</td>
                  <td className="px-4 py-3 text-right">
                    <Chip tone={PB_CHIP_TONE[row.includeTone]}>{row.include}</Chip>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      <Callout tone="rose" title="The Accra run is included and it is the most valuable row">
        {PB08_NOTE}
      </Callout>

      <section className="space-y-3">
        <p className={EYEBROW_CLASS}>What this playbook will be for</p>
        <PlaybooksKvList rows={PB08_FOR_ROWS} />
      </section>
    </div>
  );
}
