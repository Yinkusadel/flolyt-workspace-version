import { cn } from "@/lib/utils";
import { EYEBROW_CLASS } from "@/pages/everyday/lifecycle/data";
import { Callout } from "@/pages/everyday/lifecycle/stage/rail";
import { PersonDot } from "@/pages/everyday/rooms/actor";
import { PlaybooksTabs } from "@/pages/knowledge/playbooks/tabs";
import { PlaybooksKvList } from "@/pages/knowledge/playbooks/kv-list";
import { HISTORY_ROWS, PB14_NOTE, PB14_WHO_MAY_ROWS, PB_TONE_CLASS } from "@/pages/knowledge/playbooks/data";

const HEAD_CLASS = "px-4 py-2.5 font-mono text-[8.5px] font-medium tracking-[0.8px] text-ink-4 uppercase";

/** PB14 — /playbooks/history. */
const HistoryRoute = () => {
  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-[17px] font-semibold text-ink">Playbooks</h1>
        <p className="mt-1 text-[11.5px] text-ink-3">Six changes · three of them came from something going wrong</p>
      </div>

      <PlaybooksTabs active="History" />

      <section className="space-y-3">
        <p className={EYEBROW_CLASS}>Every change to every playbook, since the first one was written</p>
        <div className="overflow-x-auto rounded-card border border-line bg-paper">
          <table className="w-full min-w-[820px] text-left text-[11.5px]">
            <thead>
              <tr className="border-b border-line bg-paper-2">
                <th className={HEAD_CLASS}>Change</th>
                <th className={HEAD_CLASS}>Playbook</th>
                <th className={`${HEAD_CLASS} text-right`}>When</th>
                <th className={HEAD_CLASS}>By</th>
                <th className={HEAD_CLASS}>Effect</th>
              </tr>
            </thead>
            <tbody>
              {HISTORY_ROWS.map((row, i) => (
                <tr key={`${row.change}-${row.playbook}-${i}`} className="border-b border-line last:border-0">
                  <td className="px-4 py-3 font-semibold text-ink-2 whitespace-nowrap">{row.change}</td>
                  <td className="px-4 py-3 text-ink-3">{row.playbook}</td>
                  <td className="px-4 py-3 text-right font-mono text-ink-4">{row.when}</td>
                  <td className="px-4 py-3">
                    <span className="flex items-center gap-1.5 whitespace-nowrap text-ink-2">
                      <PersonDot person={row.by} size="sm" />
                      {row.by.name}
                    </span>
                  </td>
                  <td className={cn("px-4 py-3", PB_TONE_CLASS[row.effectTone])}>{row.effect}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      <Callout tone="ultra" title="Three of six changes came directly from something going wrong">
        {PB14_NOTE}
      </Callout>

      <section className="space-y-3">
        <p className={EYEBROW_CLASS}>Who may write and change one</p>
        <PlaybooksKvList rows={PB14_WHO_MAY_ROWS} />
      </section>
    </div>
  );
};

export default HistoryRoute;
