import { Link } from "react-router-dom";

import { Callout } from "@/pages/everyday/lifecycle/stage/rail";
import { EYEBROW_CLASS } from "@/pages/everyday/lifecycle/data";
import { IdentityTabs } from "@/pages/data/identity/tabs";
import { ID05_UNJOINABLE_ROWS, ID_TONE_CLASS } from "@/pages/data/identity/data";

const HEAD_CLASS = "px-4 py-2.5 font-mono text-[8.5px] font-medium tracking-[0.8px] text-ink-4 uppercase";
const HEAD_RIGHT_CLASS = "px-4 py-2.5 text-right font-mono text-[8.5px] font-medium tracking-[0.8px] text-ink-4 uppercase";

/** ID05 — /identity/unjoinable. */
const UnjoinableRoute = () => {
  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-[17px] font-semibold text-ink">Identity</h1>
        <p className="mt-1 text-[11.5px] text-ink-3">Four kinds of unjoinable record · two are gaps and two are correct</p>
      </div>

      <IdentityTabs active="Unjoinable" />

      <section className="space-y-3">
        <p className={EYEBROW_CLASS}>Records that exist and cannot be attached to a customer</p>
        <div className="overflow-x-auto rounded-card border border-line bg-paper">
          <table className="w-full min-w-[980px] text-left text-[11.5px]">
            <thead>
              <tr className="border-b border-line bg-paper-2">
                <th className={HEAD_CLASS}>What</th>
                <th className={HEAD_RIGHT_CLASS}>Count</th>
                <th className={HEAD_CLASS}>Why</th>
                <th className={HEAD_CLASS}>What it breaks</th>
                <th className={HEAD_CLASS}>Fixable by</th>
                <th className={HEAD_RIGHT_CLASS}>Asked</th>
              </tr>
            </thead>
            <tbody>
              {ID05_UNJOINABLE_ROWS.map((row) => (
                <tr key={row.what} className="border-b border-line last:border-0">
                  <td className="px-4 py-3 font-semibold text-ink">{row.what}</td>
                  <td className={`px-4 py-3 text-right font-mono ${ID_TONE_CLASS[row.countTone]}`}>{row.count}</td>
                  <td className="px-4 py-3 text-ink-2">{row.why}</td>
                  <td className="px-4 py-3 text-ink-2">{row.breaks}</td>
                  <td className={`px-4 py-3 ${ID_TONE_CLASS[row.fixableByTone]}`}>{row.fixableBy}</td>
                  <td className={`px-4 py-3 text-right font-mono ${ID_TONE_CLASS[row.askedTone]}`}>{row.asked}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      <Callout tone="rose" title="Forty-two thousand people bought something and left no way to be recognised">
        They are counted in the base, appear in every total, and can be in no segment, no cohort, no audience and
        no experiment. Three health signals read 99% of the base instead of 100% because of them, the Acquire line
        on the leakage map cannot be priced, and the fix is one column that was requested three weeks ago.
      </Callout>

      <Callout tone="ultra" title="Not every unjoinable record is a problem, and the screen distinguishes them">
        The 880 one-off payments are correctly outside the subscription model and joining them would be wrong. The
        1,204 support contacts came from people who chose to write from a different address. Only the first and
        last rows are gaps; the middle two are the data being accurate about a business that is more complicated
        than one model.
      </Callout>

      <p className="text-[11px] text-ink-3">
        See{" "}
        <Link to="/identity/limits" className="font-semibold text-ultra hover:underline">
          what identity resolution cannot fix
        </Link>
        , including the failure nobody can see.
      </p>
    </div>
  );
};

export default UnjoinableRoute;
