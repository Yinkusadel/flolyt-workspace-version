import { Callout } from "@/pages/everyday/lifecycle/stage/rail";
import { EYEBROW_CLASS } from "@/pages/everyday/lifecycle/data";
import { DataHealthTabs } from "@/pages/data/data-health/tabs";
import { DH05_FIELD_ROWS, DH_TONE_CLASS } from "@/pages/data/data-health/data";

const HEAD_CLASS = "px-4 py-2.5 font-mono text-[8.5px] font-medium tracking-[0.8px] text-ink-4 uppercase";
const HEAD_RIGHT_CLASS = "px-4 py-2.5 text-right font-mono text-[8.5px] font-medium tracking-[0.8px] text-ink-4 uppercase";

/** DH05 — /data-health/completeness. */
const CompletenessRoute = () => {
  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-[17px] font-semibold text-ink">Data health</h1>
        <p className="mt-1 text-[11.5px] text-ink-3">Five fields · one is 71% empty and getting worse · one will never improve</p>
      </div>

      <DataHealthTabs active="Completeness" />

      <section className="space-y-3">
        <p className={EYEBROW_CLASS}>Fields that arrive empty · a source can be perfectly healthy and mostly blank</p>
        <div className="overflow-x-auto rounded-card border border-line bg-paper">
          <table className="w-full min-w-[900px] text-left text-[11.5px]">
            <thead>
              <tr className="border-b border-line bg-paper-2">
                <th className={HEAD_CLASS}>Field</th>
                <th className={HEAD_RIGHT_CLASS}>Empty</th>
                <th className={HEAD_RIGHT_CLASS}>Was</th>
                <th className={HEAD_CLASS}>What it costs</th>
                <th className={HEAD_CLASS}>Fixable by</th>
                <th className={HEAD_RIGHT_CLASS}>Since</th>
              </tr>
            </thead>
            <tbody>
              {DH05_FIELD_ROWS.map((row) => (
                <tr key={row.field} className="border-b border-line last:border-0">
                  <td className="px-4 py-3 font-mono font-semibold text-ink">{row.field}</td>
                  <td className={`px-4 py-3 text-right font-mono ${DH_TONE_CLASS[row.emptyTone]}`}>{row.empty}</td>
                  <td className={`px-4 py-3 text-right font-mono ${DH_TONE_CLASS[row.wasTone]}`}>{row.was}</td>
                  <td className="px-4 py-3 text-ink-2">{row.costs}</td>
                  <td className={`px-4 py-3 ${DH_TONE_CLASS[row.fixableByTone]}`}>{row.fixableBy}</td>
                  <td className={`px-4 py-3 text-right font-mono ${DH_TONE_CLASS[row.sinceTone]}`}>{row.since}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      <Callout tone="rose" title="Seventy-one per cent of churn reasons are empty and the number has been getting worse">
        It was 68% in March. The field exists, the form has it, and the agents who fill it in are not required to.
        Churn Reason has produced seventeen findings from the 29% that is filled, all of which describe the people
        who happened to say something — and there is no owner of Churn to ask for the form to change.
      </Callout>

      <Callout tone="ultra" title="The third row will never improve and is on the list anyway">
        Two per cent of customers have no timezone because they never provided one, and there is no version of this
        product that fixes that. It is 84,000 people who cannot receive a message at nine in the morning local
        time, which is a real limit on one playbook, and it belongs next to the fields that could be fixed rather
        than being quietly excluded from the list.
      </Callout>
    </div>
  );
};

export default CompletenessRoute;
