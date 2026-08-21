import { Link } from "react-router-dom";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { EYEBROW_CLASS } from "@/pages/everyday/lifecycle/data";
import { Callout } from "@/pages/everyday/lifecycle/stage/rail";
import { Chip } from "@/pages/everyday/lifecycle/stage/chip";
import { KpiCards } from "@/pages/everyday/lifecycle/stage/kpi-cards";
import { ForecastTabs } from "@/pages/revenue/forecast/tabs";
import { FC03_ROWS, FC03_STATS, FC_CHIP_TONE, FC_KPI_TONE, FC_TONE_CLASS } from "@/pages/revenue/forecast/data";

const HEAD_CLASS = "px-4 py-2.5 font-mono text-[8.5px] font-medium tracking-[0.8px] text-ink-4 uppercase";

/** FC03 (disk) — the default populated "Next 90 days" state, the /forecast index's landing tab. */
export function NextNinetyDaysState({ onOpenOverdue }: { onOpenOverdue: () => void }) {
  return (
    <div className="space-y-8">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <h1 className="text-[17px] font-semibold text-ink">Forecast</h1>
          <p className="mt-1 text-[11.5px] text-ink-3">Five stages forecast, three blocked, two unowned · one market dated rather than forecast</p>
        </div>
        <Button type="button" variant="outline" onClick={() => toast.info("Opening the re-forecast queue")}>
          Re-forecast
        </Button>
      </div>

      <ForecastTabs active="Next 90 days" />

      <KpiCards items={FC03_STATS.map((s) => ({ eyebrow: s.eyebrow, value: s.value, note: s.note, tone: s.tone ? FC_KPI_TONE[s.tone] : "ink" }))} />

      <section className="space-y-3">
        <p className={EYEBROW_CLASS}>Next 90 days · by stage, with the holes named</p>
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
                    {row.state === "overdue" ? (
                      <button type="button" onClick={onOpenOverdue}>
                        <Chip tone={FC_CHIP_TONE[row.stateTone]} className="cursor-pointer ring-1 ring-current/15 hover:ring-2 hover:ring-current/40">
                          {row.state}
                        </Chip>
                      </button>
                    ) : (
                      <Chip tone={FC_CHIP_TONE[row.stateTone]}>{row.state}</Chip>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      <Callout tone="rose" title="Ghana is not forecast, it is dated">
        The same change that cost ₦1.08B in three markets is scheduled to reach 410,000 Ghanaian customers on 14
        September. Flolyt will not put a number on that, because the honest range spans an order of magnitude and a
        mid-point would be read as a prediction. What it will do is name the date, the release, the market and the
        person who can stop it — which is more useful than a figure and considerably harder to ignore.
      </Callout>

      <Callout tone="amber" title="Two stages are unforecastable because nobody would be wrong if they were wrong">
        Churn and Adopt have the data to support a projection and no one to sign it. The product will not produce an
        ownerless number, because a forecast nobody owns is never revised, never checked against what happened, and
        never wrong — which makes it the most quotable figure in the workspace and the least useful.
      </Callout>

      <Link to="/forecast/blocked" className="inline-block text-[10.5px] font-semibold text-ultra hover:underline">
        See every forecast that cannot be produced →
      </Link>
    </div>
  );
}
