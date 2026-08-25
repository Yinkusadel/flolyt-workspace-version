import { EYEBROW_CLASS } from "@/pages/everyday/lifecycle/data";
import { Callout } from "@/pages/everyday/lifecycle/stage/rail";
import { Chip } from "@/pages/everyday/lifecycle/stage/chip";
import { DS08_FIELD_ROWS } from "@/pages/data/data-sources/data";

const HEAD_CLASS = "px-4 py-2.5 font-mono text-[8.5px] font-medium tracking-[0.8px] text-ink-4 uppercase";

/** DS08 — step 2, "Which fields". */
export function StepFields() {
  return (
    <div className="space-y-8">
      <section className="space-y-3">
        <p className={EYEBROW_CLASS}>Nine fields available · take what something needs</p>
        <div className="overflow-x-auto rounded-card border border-line bg-paper">
          <table className="w-full min-w-[780px] text-left text-[11.5px]">
            <thead>
              <tr className="border-b border-line bg-paper-2">
                <th className={HEAD_CLASS}>Field</th>
                <th className={HEAD_CLASS}>What it is</th>
                <th className={HEAD_CLASS}>Take?</th>
                <th className={HEAD_CLASS}>What it would enable</th>
                <th className={HEAD_CLASS}>Personal</th>
              </tr>
            </thead>
            <tbody>
              {DS08_FIELD_ROWS.map((row) => (
                <tr key={row.field} className="border-b border-line last:border-0">
                  <td className="px-4 py-3 font-mono font-semibold text-ink">{row.field}</td>
                  <td className="px-4 py-3 text-ink-2">{row.what}</td>
                  <td className="px-4 py-3">
                    <Chip tone={row.take ? "teal" : row.field === "margin_target" ? "amber" : "neutral"}>{row.take ? "yes" : "no"}</Chip>
                  </td>
                  <td className="px-4 py-3 text-ink-3">{row.enables}</td>
                  <td className="px-4 py-3">
                    <Chip tone="neutral">{row.personal ? "yes" : "no"}</Chip>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      <Callout tone="ultra" title="Four fields of nine, and the one that was hardest to leave is `margin_target`">
        It would arrive looking exactly like a goal — a number, per product, set by Finance — and would immediately
        appear beside real margin on a screen somebody reads quickly. Goals in this product have an owner, a
        baseline and a review date. A target imported from a spreadsheet has none of those, and it would be
        indistinguishable from one that does.
      </Callout>

      <Callout tone="amber" title="Nothing here is personal, which is unusual and worth noticing">
        Cost of goods is the only source in this workspace with no personal field on offer at all. Every other
        connection required somebody to decide what not to take. This one requires deciding what not to clutter the
        schema with, which is a much easier conversation and is why it is strange that it has taken twenty-one
        days.
      </Callout>
    </div>
  );
}
