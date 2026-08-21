import { cn } from "@/lib/utils";
import { EYEBROW_CLASS } from "@/pages/everyday/lifecycle/data";
import { Callout } from "@/pages/everyday/lifecycle/stage/rail";
import { PlaybooksTabs } from "@/pages/knowledge/playbooks/tabs";
import { PlaybooksKvList } from "@/pages/knowledge/playbooks/kv-list";
import { PB05_NOTE, PB05_RUN_ROWS, PB05_USED_FOR_ROWS, PB_TONE_CLASS } from "@/pages/knowledge/playbooks/data";

const HEAD_CLASS = "px-4 py-2.5 font-mono text-[8.5px] font-medium tracking-[0.8px] text-ink-4 uppercase";

/** PB05 — /playbooks/record. */
const RecordRoute = () => {
  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-[17px] font-semibold text-ink">Playbooks</h1>
        <p className="mt-1 text-[11.5px] text-ink-3">Eight runs · six clean, one contaminated, one refused to start</p>
      </div>

      <PlaybooksTabs active="Track record" />

      <section className="space-y-3">
        <p className={EYEBROW_CLASS}>Every run of every playbook · including the ones that went wrong</p>
        <div className="overflow-x-auto rounded-card border border-line bg-paper">
          <table className="w-full min-w-[900px] text-left text-[11.5px]">
            <thead>
              <tr className="border-b border-line bg-paper-2">
                <th className={HEAD_CLASS}>Playbook</th>
                <th className={`${HEAD_CLASS} text-right`}>Market</th>
                <th className={`${HEAD_CLASS} text-right`}>When</th>
                <th className={`${HEAD_CLASS} text-right`}>Result</th>
                <th className={HEAD_CLASS}>How it was measured</th>
                <th className={`${HEAD_CLASS} text-right`}>Notes</th>
              </tr>
            </thead>
            <tbody>
              {PB05_RUN_ROWS.map((row, i) => (
                <tr key={`${row.playbook}-${row.market}-${i}`} className="border-b border-line last:border-0">
                  <td className="px-4 py-3 font-semibold text-ink-2 whitespace-nowrap">{row.playbook}</td>
                  <td className="px-4 py-3 text-right text-ink-4">{row.market}</td>
                  <td className="px-4 py-3 text-right font-mono text-ink-4">{row.when}</td>
                  <td className={cn("px-4 py-3 text-right font-mono", PB_TONE_CLASS[row.resultTone])}>{row.result}</td>
                  <td className="px-4 py-3 text-ink-3">{row.measured}</td>
                  <td className={cn("px-4 py-3 text-right", PB_TONE_CLASS[row.notesTone])}>{row.notes}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      <Callout tone="amber" title="Eight runs, six clean, one contaminated and one refused to start">
        {PB05_NOTE}
      </Callout>

      <section className="space-y-3">
        <p className={EYEBROW_CLASS}>What the record is used for, and what it is not</p>
        <PlaybooksKvList rows={PB05_USED_FOR_ROWS} />
      </section>
    </div>
  );
};

export default RecordRoute;
