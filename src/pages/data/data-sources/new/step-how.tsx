import { EYEBROW_CLASS } from "@/pages/everyday/lifecycle/data";
import { Callout } from "@/pages/everyday/lifecycle/stage/rail";
import { Chip } from "@/pages/everyday/lifecycle/stage/chip";
import { DataSourcesKvList } from "@/pages/data/data-sources/kv-list";
import { DS09_METHOD_ROWS, DS09_MISSED_FILE_KV, DS_TONE_CLASS } from "@/pages/data/data-sources/data";

const HEAD_CLASS = "px-4 py-2.5 font-mono text-[8.5px] font-medium tracking-[0.8px] text-ink-4 uppercase";

/** DS09 — step 3, "How and how often". */
export function StepHow() {
  return (
    <div className="space-y-8">
      <section className="space-y-3">
        <p className={EYEBROW_CLASS}>How it arrives</p>
        <div className="overflow-x-auto rounded-card border border-line bg-paper">
          <table className="w-full min-w-[780px] text-left text-[11.5px]">
            <thead>
              <tr className="border-b border-line bg-paper-2">
                <th className={HEAD_CLASS}>Method</th>
                <th className={HEAD_CLASS}>What it means</th>
                <th className="px-4 py-2.5 text-right font-mono text-[8.5px] font-medium tracking-[0.8px] text-ink-4 uppercase">Freshness</th>
                <th className={HEAD_CLASS}>Available here</th>
                <th className={HEAD_CLASS}>Pick</th>
              </tr>
            </thead>
            <tbody>
              {DS09_METHOD_ROWS.map((row) => (
                <tr key={row.method} className="border-b border-line last:border-0">
                  <td className="px-4 py-3 font-semibold text-ink">{row.method}</td>
                  <td className="px-4 py-3 text-ink-2">{row.what}</td>
                  <td className={`px-4 py-3 text-right font-mono ${DS_TONE_CLASS[row.freshTone]}`}>{row.fresh}</td>
                  <td className={`px-4 py-3 ${DS_TONE_CLASS[row.availableTone]}`}>{row.available}</td>
                  <td className="px-4 py-3">{row.selected && <Chip tone="ultra">selected</Chip>}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      <Callout tone="amber" title="A nightly file means every margin figure is marked as up to a day old, everywhere it appears">
        That caveat travels with the number into the leakage map, the scenario, the board pack and the forecast. It
        is not a footnote on this screen — it is a property of every figure this source will ever produce, and the
        fourth option would make it a property nobody could state at all.
      </Callout>

      <section className="space-y-3">
        <p className={EYEBROW_CLASS}>What happens when a nightly file does not arrive</p>
        <DataSourcesKvList rows={DS09_MISSED_FILE_KV} />
      </section>
    </div>
  );
}
