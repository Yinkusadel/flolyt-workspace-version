import { cn } from "@/lib/utils";
import { EYEBROW_CLASS } from "@/pages/everyday/lifecycle/data";
import { Callout } from "@/pages/everyday/lifecycle/stage/rail";
import { BusinessMemoryTabs } from "@/pages/knowledge/business-memory/tabs";
import { BM_TONE_CLASS, CONSTRAINT_ROWS, ME06_NOTES } from "@/pages/knowledge/business-memory/data";

const HEAD_CLASS = "px-4 py-2.5 font-mono text-[8.5px] font-medium tracking-[0.8px] text-ink-4 uppercase";

/** ME06 — /business-memory/constraints. */
const ConstraintsRoute = () => {
  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-[17px] font-semibold text-ink">Business memory</h1>
        <p className="mt-1 text-[11.5px] text-ink-3">Six constraints · thirty citations</p>
      </div>

      <BusinessMemoryTabs active="Constraints" />

      <section className="space-y-3">
        <p className={EYEBROW_CLASS}>Facts about how this company works · not about customers</p>
        <div className="overflow-x-auto rounded-card border border-line bg-paper">
          <table className="w-full min-w-[900px] text-left text-[11.5px]">
            <thead>
              <tr className="border-b border-line bg-paper-2">
                <th className={HEAD_CLASS}>Constraint</th>
                <th className={HEAD_CLASS}>Found by</th>
                <th className={`${HEAD_CLASS} text-right`}>When</th>
                <th className={`${HEAD_CLASS} text-right`}>Cited</th>
                <th className={`${HEAD_CLASS} text-right`}>Still true?</th>
                <th className={HEAD_CLASS}>Who could change it</th>
              </tr>
            </thead>
            <tbody>
              {CONSTRAINT_ROWS.map((row) => (
                <tr key={row.constraint} className="border-b border-line last:border-0">
                  <td className="px-4 py-3 font-semibold text-ink-2">{row.constraint}</td>
                  <td className="px-4 py-3 text-ink-3">{row.foundBy}</td>
                  <td className="px-4 py-3 text-right font-mono text-ink-4">{row.when}</td>
                  <td className={cn("px-4 py-3 text-right font-mono", BM_TONE_CLASS[row.citedTone])}>{row.cited}</td>
                  <td className={cn("px-4 py-3 text-right", BM_TONE_CLASS[row.stillTrueTone])}>{row.stillTrue}</td>
                  <td className={cn("px-4 py-3", BM_TONE_CLASS[row.whoTone])}>{row.who}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      <Callout tone="rose" title="Constraints are the most cited thing in this section and the least celebrated">
        {ME06_NOTES.mostCited}
      </Callout>

      <Callout tone="ultra" title="The last one was written three days ago by an incident">
        {ME06_NOTES.latest}
      </Callout>
    </div>
  );
};

export default ConstraintsRoute;
