import { Callout } from "@/pages/everyday/lifecycle/stage/rail";
import { EYEBROW_CLASS } from "@/pages/everyday/lifecycle/data";
import { SchemaTabs } from "@/pages/data/schema/tabs";
import { SM07_REQUESTED_ROWS, SM_TONE_CLASS } from "@/pages/data/schema/data";

const HEAD_CLASS = "px-4 py-2.5 font-mono text-[8.5px] font-medium tracking-[0.8px] text-ink-4 uppercase";
const HEAD_RIGHT_CLASS = "px-4 py-2.5 text-right font-mono text-[8.5px] font-medium tracking-[0.8px] text-ink-4 uppercase";

/** SM07 — /schema/requested. */
const RequestedRoute = () => {
  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-[17px] font-semibold text-ink">Schema</h1>
        <p className="mt-1 text-[11.5px] text-ink-3">Five outstanding · four with one person · one nobody has ever asked for</p>
      </div>

      <SchemaTabs active="Requested" />

      <section className="space-y-3">
        <p className={EYEBROW_CLASS}>Fields and events asked for and not yet delivered</p>
        <div className="overflow-x-auto rounded-card border border-line bg-paper">
          <table className="w-full min-w-[980px] text-left text-[11.5px]">
            <thead>
              <tr className="border-b border-line bg-paper-2">
                <th className={HEAD_CLASS}>What</th>
                <th className={HEAD_CLASS}>Kind</th>
                <th className={HEAD_CLASS}>What it would unblock</th>
                <th className={HEAD_RIGHT_CLASS}>First asked</th>
                <th className={HEAD_RIGHT_CLASS}>Asked</th>
                <th className={HEAD_RIGHT_CLASS}>Overdue</th>
                <th className={HEAD_CLASS}>Owner</th>
              </tr>
            </thead>
            <tbody>
              {SM07_REQUESTED_ROWS.map((row) => (
                <tr key={row.what} className="border-b border-line last:border-0">
                  <td className="px-4 py-3 font-mono font-semibold text-ink">{row.what}</td>
                  <td className="px-4 py-3 text-ink-4">{row.kind}</td>
                  <td className="px-4 py-3 text-ink-2">{row.unblocks}</td>
                  <td className={`px-4 py-3 text-right font-mono ${SM_TONE_CLASS[row.firstAskedTone]}`}>{row.firstAsked}</td>
                  <td className={`px-4 py-3 text-right font-mono ${SM_TONE_CLASS[row.askedTone]}`}>{row.asked}</td>
                  <td className={`px-4 py-3 text-right font-mono ${SM_TONE_CLASS[row.overdueTone]}`}>{row.overdue}</td>
                  <td className={`px-4 py-3 ${SM_TONE_CLASS[row.ownerTone]}`}>{row.owner}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      <Callout tone="rose" title="Four requests sit with one person and the fifth has never been made by anybody">
        Repeat requests attach to the original and keep its date, so the second column reads five asks over 133
        days rather than a fresh request today. The last row is a different failure: the stage that would ask has
        no owner, so no request exists to be overdue.
      </Callout>

      <Callout tone="ultra" title="Every row here names what it unblocks rather than how urgent it is">
        A request that says important competes with every other request that says important. A request that says
        one funnel step, one causal upgrade and a specific monetary line is a different conversation, and it is the
        only framing this product will generate.
      </Callout>
    </div>
  );
};

export default RequestedRoute;
