import { Callout } from "@/pages/everyday/lifecycle/stage/rail";
import { EYEBROW_CLASS } from "@/pages/everyday/lifecycle/data";
import { DataSourcesTabs } from "@/pages/data/data-sources/tabs";
import { DS06_DEPENDENCY_ROWS, DS_TONE_CLASS } from "@/pages/data/data-sources/data";

const HEAD_CLASS = "px-4 py-2.5 font-mono text-[8.5px] font-medium tracking-[0.8px] text-ink-4 uppercase";
const HEAD_RIGHT_CLASS = "px-4 py-2.5 text-right font-mono text-[8.5px] font-medium tracking-[0.8px] text-ink-4 uppercase";

/** DS06 — /data-sources/dependencies. */
const DependenciesRoute = () => {
  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-[17px] font-semibold text-ink">Data sources</h1>
        <p className="mt-1 text-[11.5px] text-ink-3">
          Seven sources ranked by blast radius · the cheapest one produced the causal finding
        </p>
      </div>

      <DataSourcesTabs active="What depends on it" />

      <section className="space-y-3">
        <p className={EYEBROW_CLASS}>Every source, and how much of the product rests on it</p>
        <div className="overflow-x-auto rounded-card border border-line bg-paper">
          <table className="w-full min-w-[900px] text-left text-[11.5px]">
            <thead>
              <tr className="border-b border-line bg-paper-2">
                <th className={HEAD_CLASS}>Source</th>
                <th className={HEAD_RIGHT_CLASS}>Stages</th>
                <th className={HEAD_RIGHT_CLASS}>Agents</th>
                <th className={HEAD_RIGHT_CLASS}>Goals</th>
                <th className={HEAD_RIGHT_CLASS}>Figures</th>
                <th className={HEAD_CLASS}>If it stopped for a day</th>
              </tr>
            </thead>
            <tbody>
              {DS06_DEPENDENCY_ROWS.map((row) => (
                <tr key={row.source} className="border-b border-line last:border-0">
                  <td className="px-4 py-3 font-mono font-semibold text-ink">{row.source}</td>
                  <td className={`px-4 py-3 text-right font-mono ${DS_TONE_CLASS[row.stagesTone]}`}>{row.stages}</td>
                  <td className={`px-4 py-3 text-right font-mono ${DS_TONE_CLASS[row.agentsTone]}`}>{row.agents}</td>
                  <td className={`px-4 py-3 text-right font-mono ${DS_TONE_CLASS[row.goalsTone]}`}>{row.goals}</td>
                  <td className={`px-4 py-3 text-right font-mono ${DS_TONE_CLASS[row.figuresTone]}`}>{row.figures}</td>
                  <td className={`px-4 py-3 ${DS_TONE_CLASS[row.ifStoppedTone]}`}>{row.ifStopped}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      <Callout tone="ultra" title="The `releases` table carries 412 rows and is the reason ₦1.08B has a date on it">
        Nothing depends on it today and one causal finding in the workspace exists because of it. It is the
        cheapest source connected here by every measure — 412 rows, live, six fields — and it went unconnected for
        seven months while five stages argued about what happened in March.
      </Callout>

      <Callout tone="rose" title="`customers` is the source that would take everything down and nobody thinks about it">
        Nine stages, seven agents, three goals and more than sixty figures. It has never failed, it is not
        interesting, and it is the single point this entire product rests on. The dependency table exists so that
        fact is visible before an outage rather than during one.
      </Callout>
    </div>
  );
};

export default DependenciesRoute;
