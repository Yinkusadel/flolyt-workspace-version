import { EYEBROW_CLASS } from "@/pages/everyday/lifecycle/data";
import { Callout } from "@/pages/everyday/lifecycle/stage/rail";
import { Chip } from "@/pages/everyday/lifecycle/stage/chip";
import { DS07_CANDIDATE_ROWS, DS_TONE_CLASS } from "@/pages/data/data-sources/data";

const HEAD_CLASS = "px-4 py-2.5 font-mono text-[8.5px] font-medium tracking-[0.8px] text-ink-4 uppercase";

/** DS07 — step 1, "What to connect". */
export function StepWhat() {
  return (
    <div className="space-y-8">
      <section className="space-y-3">
        <p className={EYEBROW_CLASS}>What are you connecting?</p>
        <div className="overflow-x-auto rounded-card border border-line bg-paper">
          <table className="w-full min-w-[820px] text-left text-[11.5px]">
            <thead>
              <tr className="border-b border-line bg-paper-2">
                <th className={HEAD_CLASS}>Source</th>
                <th className={HEAD_CLASS}>Where it lives</th>
                <th className="px-4 py-2.5 text-right font-mono text-[8.5px] font-medium tracking-[0.8px] text-ink-4 uppercase">Rows</th>
                <th className={HEAD_CLASS}>What it would unblock</th>
                <th className={HEAD_CLASS}>Pick</th>
              </tr>
            </thead>
            <tbody>
              {DS07_CANDIDATE_ROWS.map((row) => (
                <tr key={row.source} className="border-b border-line last:border-0">
                  <td className="px-4 py-3 font-semibold text-ink">{row.source}</td>
                  <td className="px-4 py-3 text-ink-2">{row.where}</td>
                  <td className={`px-4 py-3 text-right font-mono ${DS_TONE_CLASS[row.rowsTone]}`}>{row.rows}</td>
                  <td className="px-4 py-3 text-ink-3">{row.unblocks}</td>
                  <td className="px-4 py-3">{row.selected && <Chip tone="ultra">selected</Chip>}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      <Callout tone="rose" title="The last row cannot be connected because it does not exist to connect">
        Referral attribution is not a source somebody has not wired up — it is data the product has never
        generated. The distinction matters on this screen, because three of these four are an afternoon of work and
        the fourth is a feature nobody has scoped, and they look identical in a list of missing things.
      </Callout>

      <Callout tone="ultra" title="A nightly spreadsheet is a real answer and the screen will treat it as one">
        Cost of goods lives in a file Finance exports. That is worse than a database read and it is what exists,
        and eleven blocked figures are worth more than an ideal integration nobody will build. The next steps will
        state exactly what a nightly file means for freshness and what will be marked stale because of it.
      </Callout>
    </div>
  );
}
