import { Callout } from "@/pages/everyday/lifecycle/stage/rail";
import { EYEBROW_CLASS } from "@/pages/everyday/lifecycle/data";
import { DataSourcesTabs } from "@/pages/data/data-sources/tabs";
import { DS12_HISTORY_ROWS, DS_TONE_CLASS } from "@/pages/data/data-sources/data";

const HEAD_CLASS = "px-4 py-2.5 font-mono text-[8.5px] font-medium tracking-[0.8px] text-ink-4 uppercase";

/** DS12 — /data-sources/history. */
const HistoryRoute = () => {
  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-[17px] font-semibold text-ink">Data sources</h1>
        <p className="mt-1 text-[11.5px] text-ink-3">Seven changes since December · nothing has ever been disconnected</p>
      </div>

      <DataSourcesTabs active="History" />

      <section className="space-y-3">
        <p className={EYEBROW_CLASS}>Every change to what this product can read</p>
        <div className="overflow-x-auto rounded-card border border-line bg-paper">
          <table className="w-full min-w-[800px] text-left text-[11.5px]">
            <thead>
              <tr className="border-b border-line bg-paper-2">
                <th className={HEAD_CLASS}>When</th>
                <th className={HEAD_CLASS}>What</th>
                <th className={HEAD_CLASS}>By</th>
                <th className={HEAD_CLASS}>Effect</th>
                <th className={HEAD_CLASS}>Approved</th>
              </tr>
            </thead>
            <tbody>
              {DS12_HISTORY_ROWS.map((row, i) => (
                <tr key={`${row.when}-${i}`} className="border-b border-line last:border-0">
                  <td className="px-4 py-3 text-ink-4">{row.when}</td>
                  <td className="px-4 py-3 font-semibold text-ink-2">{row.what}</td>
                  <td className="px-4 py-3 text-ink-4">{row.by}</td>
                  <td className={`px-4 py-3 ${DS_TONE_CLASS[row.effectTone]}`}>{row.effect}</td>
                  <td className="px-4 py-3 text-ink-4">{row.approved}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      <Callout tone="ultra" title="Two lines of this history are worth more than the other five put together">
        Connecting `releases` on 2 August took an afternoon and ended a question that had been open since 11 March.
        Cost of goods stopping on 12 January blocked eleven figures and nobody noticed for six weeks. Both are one
        row in a change log, and the difference between them is the entire argument for reading this screen
        occasionally.
      </Callout>

      <Callout tone="amber" title="Nothing here has ever been disconnected">
        Ten connections, no removals, and no scope has ever been narrowed. That is normal and it is also how a
        workspace ends up reading three hundred fields it stopped needing in year two. The June access review in
        Governance is the counterweight, and it has revoked two fields to date.
      </Callout>
    </div>
  );
};

export default HistoryRoute;
