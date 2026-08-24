import { Link } from "react-router-dom";

import { Callout } from "@/pages/everyday/lifecycle/stage/rail";
import { EYEBROW_CLASS } from "@/pages/everyday/lifecycle/data";
import { DataHealthTabs } from "@/pages/data/data-health/tabs";
import { DH09_INCIDENT_ROWS, DH_TONE_CLASS } from "@/pages/data/data-health/data";

const HEAD_CLASS = "px-4 py-2.5 font-mono text-[8.5px] font-medium tracking-[0.8px] text-ink-4 uppercase";
const HEAD_RIGHT_CLASS = "px-4 py-2.5 text-right font-mono text-[8.5px] font-medium tracking-[0.8px] text-ink-4 uppercase";

/** DH09 — /data-health/incidents. */
const IncidentsRoute = () => {
  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-[17px] font-semibold text-ink">Data health</h1>
        <p className="mt-1 text-[11.5px] text-ink-3">
          Five since December · detection is consistently fast, action ranges from an hour to six weeks
        </p>
      </div>

      <DataHealthTabs active="Incidents" />

      <section className="space-y-3">
        <p className={EYEBROW_CLASS}>Every data incident since December</p>
        <div className="overflow-x-auto rounded-card border border-line bg-paper">
          <table className="w-full min-w-[880px] text-left text-[11.5px]">
            <thead>
              <tr className="border-b border-line bg-paper-2">
                <th className={HEAD_CLASS}>When</th>
                <th className={HEAD_CLASS}>Source</th>
                <th className={HEAD_RIGHT_CLASS}>Duration</th>
                <th className={HEAD_RIGHT_CLASS}>Detected in</th>
                <th className={HEAD_RIGHT_CLASS}>Acted on in</th>
                <th className={HEAD_CLASS}>What it cost</th>
              </tr>
            </thead>
            <tbody>
              {DH09_INCIDENT_ROWS.map((row, i) => (
                <tr key={`${row.source}-${i}`} className="border-b border-line last:border-0">
                  <td className="px-4 py-3 text-ink-4">{row.when}</td>
                  <td className="px-4 py-3 font-mono font-semibold whitespace-nowrap">
                    {row.sourceHref ? (
                      <Link to={row.sourceHref} className="text-ultra hover:underline">
                        {row.source}
                      </Link>
                    ) : (
                      <span className="text-ink">{row.source}</span>
                    )}
                  </td>
                  <td className={`px-4 py-3 text-right font-mono ${DH_TONE_CLASS[row.durationTone]}`}>{row.duration}</td>
                  <td className={`px-4 py-3 text-right font-mono ${DH_TONE_CLASS[row.detectedInTone]}`}>{row.detectedIn}</td>
                  <td className={`px-4 py-3 text-right font-mono ${DH_TONE_CLASS[row.actedOnInTone]}`}>{row.actedOnIn}</td>
                  <td className="px-4 py-3 text-ink-2">{row.cost}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      <Callout tone="rose" title="Detection is fast and consistent · what happens next is neither">
        Two minutes, two minutes, one day, four hours. The pipeline is not the problem in any of these. The gap
        between detection and action ranges from an hour to six weeks and depends entirely on whether the person it
        routed to had space that day, which is the same finding as the leakage map's 151 days arriving from a
        completely different direction.
      </Callout>

      <Callout tone="ultra" title="The ad_spend row is the one worth reading twice">
        Six months to detect, one day to act. Every other incident here is the opposite shape. The checks that
        catch things quickly all describe arrival — and a source that arrives perfectly while being wrong is
        invisible to four of the five, which is why the fifth check exists and why it is the one that routes to a
        stage owner.
      </Callout>
    </div>
  );
};

export default IncidentsRoute;
