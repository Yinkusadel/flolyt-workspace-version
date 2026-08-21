import { Link } from "react-router-dom";

import { EYEBROW_CLASS } from "@/pages/everyday/lifecycle/data";
import { Callout } from "@/pages/everyday/lifecycle/stage/rail";
import { Chip } from "@/pages/everyday/lifecycle/stage/chip";
import { ForecastTabs } from "@/pages/revenue/forecast/tabs";
import { FC03_ROWS, FC_CHIP_TONE, FC_TONE_CLASS } from "@/pages/revenue/forecast/data";

const HEAD_CLASS = "px-4 py-2.5 font-mono text-[8.5px] font-medium tracking-[0.8px] text-ink-4 uppercase";

/**
 * By stage — no dedicated frame in the export (fc.py's own TABS lists it but
 * no frame ever calls `subtabs(p, "By stage", TABS)`), so this reuses FC03's
 * own per-stage table, the same "reuse an adjacent frame's data shape rather
 * than inventing new copy from nothing" call the Scenario rebuild's History
 * tab made for the same kind of gap.
 */
export function ByStageState() {
  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-[17px] font-semibold text-ink">Forecast</h1>
        <p className="mt-1 text-[11.5px] text-ink-3">Nine stages, one row each · no cards, no summary, just the table</p>
      </div>

      <ForecastTabs active="By stage" />

      <section className="space-y-3">
        <p className={EYEBROW_CLASS}>Every stage, forecast or not, in one place</p>
        <div className="overflow-x-auto rounded-card border border-line bg-paper">
          <table className="w-full min-w-[980px] text-left text-[11.5px]">
            <thead>
              <tr className="border-b border-line bg-paper-2">
                <th className={HEAD_CLASS}>Stage</th>
                <th className={`${HEAD_CLASS} text-right`}>Now</th>
                <th className={`${HEAD_CLASS} text-right`}>Forecast</th>
                <th className={`${HEAD_CLASS} text-right`}>Range</th>
                <th className={HEAD_CLASS}>What the range depends on</th>
                <th className={`${HEAD_CLASS} text-right`}>Owner</th>
                <th className={`${HEAD_CLASS} text-right`}>State</th>
              </tr>
            </thead>
            <tbody>
              {FC03_ROWS.map((row) => (
                <tr key={row.stage} className="border-b border-line last:border-0">
                  <td className="px-4 py-3 font-semibold">
                    {row.detailId ? (
                      <Link to={`/forecast/${row.detailId}`} className="text-ultra hover:underline">
                        {row.stage}
                      </Link>
                    ) : (
                      <span className="text-ink">{row.stage}</span>
                    )}
                  </td>
                  <td className={`px-4 py-3 text-right font-mono ${FC_TONE_CLASS[row.nowTone]}`}>{row.now}</td>
                  <td className={`px-4 py-3 text-right font-mono ${FC_TONE_CLASS[row.forecastTone]}`}>{row.forecast}</td>
                  <td className="px-4 py-3 text-right font-mono text-ink-4">{row.range}</td>
                  <td className="px-4 py-3 text-ink-2">{row.dependsOn}</td>
                  <td className={`px-4 py-3 text-right ${FC_TONE_CLASS[row.ownerTone]}`}>{row.owner}</td>
                  <td className="px-4 py-3 text-right">
                    <Chip tone={FC_CHIP_TONE[row.stateTone]}>{row.state}</Chip>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      <Callout tone="amber" title="Two stages are unforecastable because nobody would be wrong if they were wrong">
        Churn and Adopt have the data to support a projection and no one to sign it. The product will not produce an
        ownerless number, because a forecast nobody owns is never revised, never checked against what happened, and
        never wrong — which makes it the most quotable figure in the workspace and the least useful.
      </Callout>
    </div>
  );
}
