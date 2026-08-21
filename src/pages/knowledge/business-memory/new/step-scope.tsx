import { Chip } from "@/pages/everyday/lifecycle/stage/chip";
import { EYEBROW_CLASS } from "@/pages/everyday/lifecycle/data";
import { Callout } from "@/pages/everyday/lifecycle/stage/rail";
import { ME13_NOTES, ME13_SCOPE_ROWS } from "@/pages/knowledge/business-memory/data";

const HEAD_CLASS = "px-4 py-2.5 font-mono text-[8.5px] font-medium tracking-[0.8px] text-ink-4 uppercase";

/** ME13 — "Where does this apply, and what would overturn it?", step 2 of the write-a-learning wizard. */
export function StepScope() {
  return (
    <div className="space-y-8">
      <section className="space-y-3">
        <p className={EYEBROW_CLASS}>Where does this apply, and what would overturn it?</p>
        <div className="overflow-x-auto rounded-card border border-line bg-paper">
          <table className="w-full min-w-[860px] text-left text-[11.5px]">
            <thead>
              <tr className="border-b border-line bg-paper-2">
                <th className={HEAD_CLASS}>Field</th>
                <th className={HEAD_CLASS}>What you have written</th>
                <th className={`${HEAD_CLASS} text-right`}>Required?</th>
                <th className={HEAD_CLASS}>Why it is asked</th>
              </tr>
            </thead>
            <tbody>
              {ME13_SCOPE_ROWS.map((row) => (
                <tr key={row.field} className="border-b border-line last:border-0">
                  <td className="px-4 py-3 font-semibold text-ink-2 whitespace-nowrap">{row.field}</td>
                  <td className="px-4 py-3 text-ink-2">{row.value}</td>
                  <td className="px-4 py-3 text-right">
                    <Chip tone="rose">{row.required ? "yes" : "no"}</Chip>
                  </td>
                  <td className="px-4 py-3 text-ink-4">{row.why}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      <Callout tone="ultra" title="The last two fields are the ones that make a learning survive being quoted by somebody in a hurry">
        {ME13_NOTES.lastTwo}
      </Callout>

      <Callout tone="amber" title="Naming a stage with no owner is allowed and it starts something">
        {ME13_NOTES.unownedStage}
      </Callout>
    </div>
  );
}
