import { Callout } from "@/pages/everyday/lifecycle/stage/rail";
import { EYEBROW_CLASS } from "@/pages/everyday/lifecycle/data";
import { DataSourcesTabs } from "@/pages/data/data-sources/tabs";
import { DS05_MISSING_ROWS, DS_TONE_CLASS } from "@/pages/data/data-sources/data";

const HEAD_CLASS = "px-4 py-2.5 font-mono text-[8.5px] font-medium tracking-[0.8px] text-ink-4 uppercase";
const HEAD_RIGHT_CLASS = "px-4 py-2.5 text-right font-mono text-[8.5px] font-medium tracking-[0.8px] text-ink-4 uppercase";

/** DS05 — /data-sources/missing. */
const MissingRoute = () => {
  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-[17px] font-semibold text-ink">Data sources</h1>
        <p className="mt-1 text-[11.5px] text-ink-3">
          Four missing sources · eleven blocked figures · two nobody has ever asked for
        </p>
      </div>

      <DataSourcesTabs active="Not connected" />

      <section className="space-y-3">
        <p className={EYEBROW_CLASS}>Sources that do not exist here, and what each one costs</p>
        <div className="overflow-x-auto rounded-card border border-line bg-paper">
          <table className="w-full min-w-[900px] text-left text-[11.5px]">
            <thead>
              <tr className="border-b border-line bg-paper-2">
                <th className={HEAD_CLASS}>Source</th>
                <th className={HEAD_CLASS}>What it would carry</th>
                <th className={HEAD_RIGHT_CLASS}>Blocks</th>
                <th className={HEAD_RIGHT_CLASS}>Asked</th>
                <th className={HEAD_RIGHT_CLASS}>Overdue</th>
                <th className={HEAD_CLASS}>Who could connect it</th>
              </tr>
            </thead>
            <tbody>
              {DS05_MISSING_ROWS.map((row) => (
                <tr key={row.source} className="border-b border-line last:border-0">
                  <td className="px-4 py-3 font-semibold text-ink">{row.source}</td>
                  <td className="px-4 py-3 text-ink-2">{row.carries}</td>
                  <td className={`px-4 py-3 text-right font-mono ${DS_TONE_CLASS[row.blocksTone]}`}>{row.blocks}</td>
                  <td className={`px-4 py-3 text-right font-mono ${DS_TONE_CLASS[row.askedTone]}`}>{row.asked}</td>
                  <td className={`px-4 py-3 text-right font-mono ${DS_TONE_CLASS[row.overdueTone]}`}>{row.overdue}</td>
                  <td className={`px-4 py-3 ${DS_TONE_CLASS[row.whoTone]}`}>{row.who}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      <Callout tone="rose" title="Two of these were asked for three weeks ago and two have never been asked for by anybody">
        Cost of goods and `order_lines` sit in Sam's queue with dates. Referral attribution has no owner to request
        it, and the payday calendar is public data that would take an afternoon — it was noted as Unavailable in a
        scenario in March and nobody has picked it up since, because noting something is not asking for it.
      </Callout>

      <Callout tone="amber" title="Cost of goods blocks eleven figures and it is not an engineering problem">
        It lives in Finance's system and needs somebody there to agree to a read-only connection. Sam has been named
        as the person who could connect it since 28 July, which is slightly wrong — he can do the wiring and cannot
        give the permission. That is why it has been twenty-one days rather than an afternoon.
      </Callout>
    </div>
  );
};

export default MissingRoute;
