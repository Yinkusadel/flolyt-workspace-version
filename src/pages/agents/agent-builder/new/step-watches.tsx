import { EYEBROW_CLASS } from "@/pages/everyday/lifecycle/data";
import { Callout } from "@/pages/everyday/lifecycle/stage/rail";
import { Chip } from "@/pages/everyday/lifecycle/stage/chip";
import { AB04_ROWS, AB04_SELECTED, AB_TONE_CLASS } from "@/pages/agents/agent-builder/data";

const HEAD_CLASS = "px-4 py-2.5 font-mono text-[8.5px] font-medium tracking-[0.8px] text-ink-4 uppercase";

/** AB04 — step 1, "What it watches". */
export function StepWatches() {
  return (
    <div className="space-y-8">
      <section className="space-y-3">
        <p className={EYEBROW_CLASS}>What should it watch for?</p>
        <div className="rounded-panel border border-line2 bg-white p-4">
          <p className="text-[12.5px] font-semibold text-ink">{AB04_SELECTED.title}</p>
          <p className="mt-1.5 font-mono text-[10px] text-ink-4">{AB04_SELECTED.meta}</p>
        </div>
      </section>

      <section className="space-y-3">
        <p className={EYEBROW_CLASS}>Where this came from</p>
        <div className="overflow-x-auto rounded-card border border-line bg-paper">
          <table className="w-full min-w-[820px] text-left text-[11.5px]">
            <thead>
              <tr className="border-b border-line bg-paper-2">
                <th className={HEAD_CLASS}>Source of the idea</th>
                <th className={`${HEAD_CLASS} text-right`}>Count</th>
                <th className={HEAD_CLASS}>Example</th>
                <th className={`${HEAD_CLASS} text-right`}>Pick</th>
              </tr>
            </thead>
            <tbody>
              {AB04_ROWS.map((row) => (
                <tr key={row.source} className="border-b border-line last:border-0">
                  <td className="px-4 py-3 font-semibold text-ink">{row.source}</td>
                  <td className={`px-4 py-3 text-right font-mono ${AB_TONE_CLASS[row.countTone]}`}>{row.count}</td>
                  <td className="px-4 py-3 text-ink-3">{row.example}</td>
                  <td className="px-4 py-3 text-right">{row.picked && <Chip tone="ultra">selected</Chip>}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      <Callout tone="ultra" title="Most agents worth building already exist as a sentence somewhere in this workspace">
        Twelve conditions, six unwatched learnings and five open questions are sitting in three different
        sections, each written by somebody who had no way to turn it into something that watches. The builder
        starts from that list rather than from an empty box, because an empty box produces agents that watch what
        is easy to describe.
      </Callout>
    </div>
  );
}
