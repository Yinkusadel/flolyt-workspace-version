import { EYEBROW_CLASS } from "@/pages/everyday/lifecycle/data";
import { Callout } from "@/pages/everyday/lifecycle/stage/rail";
import { Chip } from "@/pages/everyday/lifecycle/stage/chip";
import { RC10_FIELD_ROWS, RC10_NOTES } from "@/pages/knowledge/recognition/data";

const HEAD_CLASS = "px-4 py-2.5 font-mono text-[8.5px] font-medium tracking-[0.8px] text-ink-4 uppercase";

/** RC10 — "Why it counts", step 2 of the recognise wizard. */
export function StepWhy() {
  return (
    <div className="space-y-8">
      <section className="space-y-3">
        <p className={EYEBROW_CLASS}>Required · and all of it is visible to everybody, permanently</p>
        <div className="overflow-x-auto rounded-card border border-line bg-paper">
          <table className="w-full min-w-[780px] text-left text-[11.5px]">
            <thead>
              <tr className="border-b border-line bg-paper-2">
                <th className={HEAD_CLASS}>Field</th>
                <th className={HEAD_CLASS}>What you have written</th>
                <th className={`${HEAD_CLASS} text-right`}>Required?</th>
                <th className={HEAD_CLASS}>Why it is asked</th>
              </tr>
            </thead>
            <tbody>
              {RC10_FIELD_ROWS.map((row) => (
                <tr key={row.field} className="border-b border-line last:border-0">
                  <td className="px-4 py-3 font-semibold text-ink-2 whitespace-nowrap">{row.field}</td>
                  <td className="px-4 py-3 text-ink-3">{row.value}</td>
                  <td className="px-4 py-3 text-right">
                    <Chip tone="rose">{row.required}</Chip>
                  </td>
                  <td className="px-4 py-3 text-ink-4">{row.why}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      <Callout tone="ultra" title="You cannot recognise somebody without naming what it cost them">
        {RC10_NOTES.noEmptyCost}
      </Callout>

      <Callout tone="teal" title="This is visible to everybody in the workspace and appears in no total anywhere">
        {RC10_NOTES.visibleNoTotal}
      </Callout>
    </div>
  );
}
