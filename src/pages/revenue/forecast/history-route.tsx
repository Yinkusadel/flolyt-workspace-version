import { PersonAvatar } from "@/components/person-avatar";
import { DEPARTMENT_COLORS, EYEBROW_CLASS } from "@/pages/everyday/lifecycle/data";
import { Callout } from "@/pages/everyday/lifecycle/stage/rail";
import { ForecastKvList } from "@/pages/revenue/forecast/kv-list";
import { ForecastTabs } from "@/pages/revenue/forecast/tabs";
import { FC12_KV_ROWS, FC12_ROWS, FC_TONE_CLASS } from "@/pages/revenue/forecast/data";

const HEAD_CLASS = "px-4 py-2.5 font-mono text-[8.5px] font-medium tracking-[0.8px] text-ink-4 uppercase";

/** FC12 (disk) — /forecast/history. */
const ForecastHistoryRoute = () => {
  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-[17px] font-semibold text-ink">Forecast</h1>
        <p className="mt-1 text-[11.5px] text-ink-3">Six forecasts, seven revisions · one stage revised three times without moving</p>
      </div>

      <ForecastTabs active="History" />

      <section className="space-y-3">
        <p className={EYEBROW_CLASS}>Every forecast this workspace has ever held, and every hand it passed through</p>
        <div className="overflow-x-auto rounded-card border border-line bg-paper">
          <table className="w-full min-w-[880px] text-left text-[11.5px]">
            <thead>
              <tr className="border-b border-line bg-paper-2">
                <th className={HEAD_CLASS}>Stage</th>
                <th className={`${HEAD_CLASS} text-right`}>Signed</th>
                <th className={`${HEAD_CLASS} text-right`}>Figure</th>
                <th className={`${HEAD_CLASS} text-right`}>Revisions</th>
                <th className={HEAD_CLASS}>Most recent reason</th>
                <th className={`${HEAD_CLASS} text-right`}>Signer</th>
              </tr>
            </thead>
            <tbody>
              {FC12_ROWS.map((row, i) => (
                <tr key={`${row.stage}-${i}`} className="border-b border-line last:border-0">
                  <td className="px-4 py-3 font-semibold text-ink">{row.stage}</td>
                  <td className="px-4 py-3 text-right text-ink-4">{row.signed}</td>
                  <td className={`px-4 py-3 text-right font-mono ${FC_TONE_CLASS[row.figureTone]}`}>{row.figure}</td>
                  <td className={`px-4 py-3 text-right font-mono ${FC_TONE_CLASS[row.revisionsTone]}`}>{row.revisions}</td>
                  <td className="px-4 py-3 text-ink-2">{row.reason}</td>
                  <td className="px-4 py-3 text-right">
                    <span className="flex items-center justify-end gap-1.5 whitespace-nowrap text-ink-2">
                      {row.signer.name.split(" ")[0]}
                      <PersonAvatar
                        kind="human"
                        initials={row.signer.initials}
                        size="sm"
                        style={{ backgroundColor: DEPARTMENT_COLORS[row.signer.department] }}
                      />
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      <Callout tone="amber" title="Activate has been revised three times and has not moved once">
        Zainab has re-signed 41.0% in April, June and July, each time because nothing had been decided since the
        last one. Three revisions that change no number is a stronger signal than any of the moving figures on this
        screen, and it is the only place in the workspace where that pattern is visible.
      </Callout>

      <section className="space-y-3">
        <p className={EYEBROW_CLASS}>What is kept and what is never derived from it</p>
        <div className="max-w-2xl">
          <ForecastKvList rows={FC12_KV_ROWS} />
        </div>
      </section>
    </div>
  );
};

export default ForecastHistoryRoute;
