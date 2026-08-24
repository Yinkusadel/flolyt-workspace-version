import { Callout } from "@/pages/everyday/lifecycle/stage/rail";
import { EYEBROW_CLASS } from "@/pages/everyday/lifecycle/data";
import { DataHealthTabs } from "@/pages/data/data-health/tabs";
import { DH08_HISTORY_ROWS, DH08_STEP_ROWS, DH_TONE_CLASS } from "@/pages/data/data-health/data";

const HEAD_CLASS = "px-4 py-2.5 font-mono text-[8.5px] font-medium tracking-[0.8px] text-ink-4 uppercase";
const HEAD_RIGHT_CLASS = "px-4 py-2.5 text-right font-mono text-[8.5px] font-medium tracking-[0.8px] text-ink-4 uppercase";

/** DH08 — /data-health/backfill. */
const BackfillRoute = () => {
  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-[17px] font-semibold text-ink">Data health</h1>
        <p className="mt-1 text-[11.5px] text-ink-3">Six steps, a seven-day label · and one backfill in three changed something</p>
      </div>

      <DataHealthTabs active="Backfill" />

      <section className="space-y-3">
        <p className={EYEBROW_CLASS}>What happens when a source comes back</p>
        <div className="overflow-x-auto rounded-card border border-line bg-paper">
          <table className="w-full min-w-[820px] text-left text-[11.5px]">
            <thead>
              <tr className="border-b border-line bg-paper-2">
                <th className={HEAD_CLASS}>Step</th>
                <th className={HEAD_CLASS}>What happens</th>
                <th className={HEAD_CLASS}>Marked how</th>
                <th className={HEAD_CLASS}>Who is told</th>
              </tr>
            </thead>
            <tbody>
              {DH08_STEP_ROWS.map((row) => (
                <tr key={row.step} className="border-b border-line last:border-0">
                  <td className="px-4 py-3 font-mono text-ink-4">{row.step}</td>
                  <td className="px-4 py-3 text-ink-2">{row.what}</td>
                  <td className={`px-4 py-3 ${DH_TONE_CLASS[row.markedTone]}`}>{row.marked}</td>
                  <td className={`px-4 py-3 ${DH_TONE_CLASS[row.whoTone]}`}>{row.who}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      <Callout tone="ultra" title="A backfilled figure is labelled for a week, which is longer than most people would choose">
        Somebody who looked at the funnel this morning saw Unavailable. Somebody who looks tomorrow sees a number.
        Without a label those are the same screen with different content and no explanation, and a week is roughly
        how long it takes for the person who saw the gap to come back and wonder whether it was ever filled.
      </Callout>

      <section className="space-y-3">
        <p className={EYEBROW_CLASS}>Backfills that have happened</p>
        <div className="overflow-x-auto rounded-card border border-line bg-paper">
          <table className="w-full min-w-[820px] text-left text-[11.5px]">
            <thead>
              <tr className="border-b border-line bg-paper-2">
                <th className={HEAD_CLASS}>Source</th>
                <th className={HEAD_RIGHT_CLASS}>When</th>
                <th className={HEAD_RIGHT_CLASS}>Gap</th>
                <th className={HEAD_RIGHT_CLASS}>Rows recovered</th>
                <th className={HEAD_CLASS}>Anything change materially?</th>
              </tr>
            </thead>
            <tbody>
              {DH08_HISTORY_ROWS.map((row) => (
                <tr key={row.source} className="border-b border-line last:border-0">
                  <td className="px-4 py-3 font-mono font-semibold text-ink">{row.source}</td>
                  <td className="px-4 py-3 text-right font-mono text-ink-4">{row.when}</td>
                  <td className={`px-4 py-3 text-right font-mono ${DH_TONE_CLASS[row.gapTone]}`}>{row.gap}</td>
                  <td className={`px-4 py-3 text-right font-mono ${DH_TONE_CLASS[row.rowsRecoveredTone]}`}>{row.rowsRecovered}</td>
                  <td className={`px-4 py-3 ${DH_TONE_CLASS[row.materialChangeTone]}`}>{row.materialChange}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      <Callout tone="amber" title="One backfill in three changed something, and it changed a theme rather than a number">
        The tickets gap in June hid fourteen hours of contacts, and when they arrived a theme that had looked small
        was the second largest that week. Nothing was wrong with any figure in the meantime — they were all marked
        Unavailable — but the shape of what people were writing about was genuinely different afterwards.
      </Callout>
    </div>
  );
};

export default BackfillRoute;
