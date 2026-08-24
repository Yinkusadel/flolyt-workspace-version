import { useState } from "react";

import { Callout } from "@/pages/everyday/lifecycle/stage/rail";
import { EYEBROW_CLASS } from "@/pages/everyday/lifecycle/data";
import { SchemaTabs } from "@/pages/data/schema/tabs";
import { DisputedDefinitionModal } from "@/pages/data/schema/modals/disputed-definition-modal";
import { SM08_DEFINITION_ROWS, SM_TONE_CLASS } from "@/pages/data/schema/data";

const HEAD_CLASS = "px-4 py-2.5 font-mono text-[8.5px] font-medium tracking-[0.8px] text-ink-4 uppercase";

/** SM08 — /schema/definitions. */
const DefinitionsRoute = () => {
  const [disputeOpen, setDisputeOpen] = useState(false);

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-[17px] font-semibold text-ink">Schema</h1>
        <p className="mt-1 text-[11.5px] text-ink-3">Six terms · one genuinely disputed between two teams for months</p>
      </div>

      <SchemaTabs active="Definitions" />

      <section className="space-y-3">
        <p className={EYEBROW_CLASS}>What a term means here · the shared vocabulary the metrics rest on</p>
        <div className="overflow-x-auto rounded-card border border-line bg-paper">
          <table className="w-full min-w-[820px] text-left text-[11.5px]">
            <thead>
              <tr className="border-b border-line bg-paper-2">
                <th className={HEAD_CLASS}>Term</th>
                <th className={HEAD_CLASS}>What it means here</th>
                <th className={HEAD_CLASS}>Set by</th>
                <th className={HEAD_CLASS}>Cited</th>
                <th className={HEAD_CLASS}>Disputed</th>
              </tr>
            </thead>
            <tbody>
              {SM08_DEFINITION_ROWS.map((row) => (
                <tr key={row.term} className="border-b border-line last:border-0">
                  <td className="px-4 py-3 font-semibold text-ink">{row.term}</td>
                  <td className="px-4 py-3 text-ink-2">{row.meaning}</td>
                  <td className="px-4 py-3 text-ink-4">{row.setBy}</td>
                  <td className="px-4 py-3 font-mono text-teal">{row.cited}</td>
                  <td className={`px-4 py-3 ${SM_TONE_CLASS[row.disputedTone]}`}>
                    {row.rowAction === "dispute" ? (
                      <button type="button" onClick={() => setDisputeOpen(true)} className="underline decoration-dotted underline-offset-2 hover:text-rose">
                        {row.disputed}
                      </button>
                    ) : (
                      row.disputed
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      <Callout tone="rose" title="One term is genuinely disputed and the dispute is the useful part">
        Retention uses ninety days for active and Sales uses one hundred and eighty. Both are defensible and the
        two teams have been reporting different active counts for months. The definition screen does not resolve
        it — it names both, shows which metrics use which, and puts the disagreement in front of the two people who
        can settle it.
      </Callout>

      <Callout tone="ultra" title="A definition is a schema object here, not a wiki page">
        It is attached to the fields it governs, cited in rooms, and surfaced whenever somebody maps a field that
        touches it. That is why the most cited entry in business memory is a note about a word: definitions get
        used far more often than findings, and they are almost never written down anywhere a metric can point at.
      </Callout>

      <DisputedDefinitionModal open={disputeOpen} onOpenChange={setDisputeOpen} />
    </div>
  );
};

export default DefinitionsRoute;
