import { useState } from "react";

import { Callout } from "@/pages/everyday/lifecycle/stage/rail";
import { EYEBROW_CLASS } from "@/pages/everyday/lifecycle/data";
import { KpiCards } from "@/pages/everyday/lifecycle/stage/kpi-cards";
import { IdentityTabs } from "@/pages/data/identity/tabs";
import { MergeTwoRecordsModal } from "@/pages/data/identity/modals/merge-two-records-modal";
import { ID06_DUPLICATE_ROWS, ID06_STATS, ID_KPI_TONE, ID_TONE_CLASS } from "@/pages/data/identity/data";

const HEAD_CLASS = "px-4 py-2.5 font-mono text-[8.5px] font-medium tracking-[0.8px] text-ink-4 uppercase";
const HEAD_RIGHT_CLASS = "px-4 py-2.5 text-right font-mono text-[8.5px] font-medium tracking-[0.8px] text-ink-4 uppercase";

/** ID06 — /identity/duplicates. */
const DuplicatesRoute = () => {
  const [mergeOpen, setMergeOpen] = useState(false);

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-[17px] font-semibold text-ink">Identity</h1>
        <p className="mt-1 text-[11.5px] text-ink-3">
          61,000 merged, 84,000 deliberately not · a false merge is worse than a missed one
        </p>
      </div>

      <IdentityTabs active="Duplicates" />

      <KpiCards items={ID06_STATS.map((s) => ({ eyebrow: s.eyebrow, value: s.value, note: s.note, tone: ID_KPI_TONE[s.tone] }))} />

      <section className="space-y-3">
        <p className={EYEBROW_CLASS}>Suspected duplicates the rule will not merge</p>
        <div className="overflow-x-auto rounded-card border border-line bg-paper">
          <table className="w-full min-w-[900px] text-left text-[11.5px]">
            <thead>
              <tr className="border-b border-line bg-paper-2">
                <th className={HEAD_CLASS}>Signal</th>
                <th className={HEAD_RIGHT_CLASS}>Pairs</th>
                <th className={HEAD_CLASS}>Why the rule declines</th>
                <th className={HEAD_CLASS}>Would merging be right?</th>
                <th className={HEAD_CLASS}>Action</th>
              </tr>
            </thead>
            <tbody>
              {ID06_DUPLICATE_ROWS.map((row) => (
                <tr key={row.signal} className="border-b border-line last:border-0">
                  <td className="px-4 py-3 font-semibold text-ink">{row.signal}</td>
                  <td className={`px-4 py-3 text-right font-mono ${ID_TONE_CLASS[row.pairsTone]}`}>{row.pairs}</td>
                  <td className="px-4 py-3 text-ink-2">{row.whyDeclines}</td>
                  <td className={`px-4 py-3 ${ID_TONE_CLASS[row.wouldBeRightTone]}`}>{row.wouldBeRight}</td>
                  <td className={`px-4 py-3 ${ID_TONE_CLASS[row.actionTone]}`}>
                    {row.rowAction === "merge" ? (
                      <button type="button" onClick={() => setMergeOpen(true)} className="underline decoration-dotted underline-offset-2 hover:text-amber">
                        {row.action}
                      </button>
                    ) : (
                      row.action
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      <Callout tone="rose" title="Eighty-four thousand suspected duplicates are deliberately not merged">
        Every signal here would merge some genuine duplicates and some genuinely different people, and a false
        merge is worse than a missed one — it combines two people's orders, consent states and contact history into
        a record that is wrong in a way nobody can see afterwards. Merges are reversible; the reasoning that
        produced them usually is not.
      </Callout>

      <Callout tone="amber" title="Seven merges have been reversed and all seven were found within a week">
        A reversal restores both records and everything computed from them; it is possible because a merge stores
        both source records rather than collapsing them. Beyond about a week a reversal becomes expensive, because
        plays have been sent and figures have been credited against the merged identity.
      </Callout>

      <MergeTwoRecordsModal open={mergeOpen} onOpenChange={setMergeOpen} />
    </div>
  );
};

export default DuplicatesRoute;
