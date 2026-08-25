import { Callout } from "@/pages/everyday/lifecycle/stage/rail";
import { EYEBROW_CLASS } from "@/pages/everyday/lifecycle/data";
import { DataHealthTabs } from "@/pages/data/data-health/tabs";
import { DH06_UNAVAILABLE_ROWS, DH_TONE_CLASS } from "@/pages/data/data-health/data";

const HEAD_CLASS = "px-4 py-2.5 font-mono text-[8.5px] font-medium tracking-[0.8px] text-ink-4 uppercase";
const HEAD_RIGHT_CLASS = "px-4 py-2.5 text-right font-mono text-[8.5px] font-medium tracking-[0.8px] text-ink-4 uppercase";

/** DH06 — /data-health/unavailable, "What it broke". */
const UnavailableRoute = () => {
  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-[17px] font-semibold text-ink">Data health</h1>
        <p className="mt-1 text-[11.5px] text-ink-3">
          Seven Unavailable figures · two return on their own · the rest are one queue seen four ways
        </p>
      </div>

      <DataHealthTabs active="What it broke" />

      <section className="space-y-3">
        <p className={EYEBROW_CLASS}>Everything currently Unavailable, and the source it names</p>
        <div className="overflow-x-auto rounded-card border border-line bg-paper">
          <table className="w-full min-w-[920px] text-left text-[11.5px]">
            <thead>
              <tr className="border-b border-line bg-paper-2">
                <th className={HEAD_CLASS}>What is Unavailable</th>
                <th className={HEAD_CLASS}>Where it appears</th>
                <th className={HEAD_CLASS}>Source</th>
                <th className={HEAD_RIGHT_CLASS}>Since</th>
                <th className={HEAD_CLASS}>Would return</th>
              </tr>
            </thead>
            <tbody>
              {DH06_UNAVAILABLE_ROWS.map((row, i) => (
                <tr key={`${row.what}-${i}`} className="border-b border-line last:border-0">
                  <td className="px-4 py-3 font-semibold text-ink">{row.what}</td>
                  <td className="px-4 py-3 text-ink-2">{row.where}</td>
                  <td className={`px-4 py-3 font-mono ${DH_TONE_CLASS[row.sourceTone]}`}>{row.source}</td>
                  <td className={`px-4 py-3 text-right font-mono ${DH_TONE_CLASS[row.sinceTone]}`}>{row.since}</td>
                  <td className={`px-4 py-3 ${DH_TONE_CLASS[row.wouldReturnTone]}`}>{row.wouldReturn}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      <Callout tone="rose" title="Seven Unavailable figures and only two of them will come back on their own">
        The checkout steps return when the stream does, with a backfill. Everything else needs somebody to connect
        a source, write a column, fire an event or build a feature. This is the same list that appears as blocked
        figures in Revenue, blocked playbooks in Knowledge and paused agents in Governance — four sections
        describing one queue.
      </Callout>

      <Callout tone="ultra" title="Every Unavailable in this product names a row on this screen, and that is the contract">
        There is no figure anywhere in Flolyt that reads Unavailable without a source behind it that somebody could
        go and look at. It is why the word is used instead of a dash, a zero or a hidden row — the missing thing is
        always traceable to a specific gap with a specific owner.
      </Callout>
    </div>
  );
};

export default UnavailableRoute;
