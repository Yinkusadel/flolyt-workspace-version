import { EYEBROW_CLASS } from "@/pages/everyday/lifecycle/data";
import { Callout } from "@/pages/everyday/lifecycle/stage/rail";
import { Chip } from "@/pages/everyday/lifecycle/stage/chip";
import { FC09_MODEL, FC09_ROWS, FC09_YOURS } from "@/pages/revenue/forecast/data";

const HEAD_CLASS = "px-4 py-2.5 font-mono text-[8.5px] font-medium tracking-[0.8px] text-ink-4 uppercase";

/** FC09 — step 2 of "Re-forecast": the model's figure beside yours, and the four fields required to sign it. */
export function StepYourNumber() {
  return (
    <div className="space-y-8">
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
        <div className="rounded-card border border-line bg-paper-2 p-4">
          <p className="font-mono text-[8.5px] font-medium tracking-[0.85px] text-ink-4 uppercase">{FC09_MODEL.label}</p>
          <p className="mt-2 text-[24px] font-semibold text-ink-3">{FC09_MODEL.value}</p>
          <p className="mt-1 text-[10px] text-ink-4">{FC09_MODEL.note}</p>
        </div>
        <div className="rounded-card border-2 border-ultra-border bg-white p-4">
          <p className="font-mono text-[8.5px] font-medium tracking-[0.85px] text-ultra uppercase">{FC09_YOURS.label}</p>
          <p className="mt-2 text-[24px] font-semibold text-ink">{FC09_YOURS.value}</p>
          <p className="mt-1 text-[10px] font-semibold text-ultra">{FC09_YOURS.note}</p>
        </div>
      </div>

      <section className="space-y-3">
        <p className={EYEBROW_CLASS}>Required before this can be signed</p>
        <div className="overflow-x-auto rounded-card border border-line bg-paper">
          <table className="w-full min-w-[820px] text-left text-[11.5px]">
            <thead>
              <tr className="border-b border-line bg-paper-2">
                <th className={HEAD_CLASS}>Field</th>
                <th className={HEAD_CLASS}>What you have written</th>
                <th className={`${HEAD_CLASS} text-right`}>Required?</th>
                <th className={`${HEAD_CLASS} text-right`}>Kept for how long</th>
              </tr>
            </thead>
            <tbody>
              {FC09_ROWS.map((row) => (
                <tr key={row.field} className="border-b border-line last:border-0">
                  <td className="px-4 py-3 font-semibold text-ink">{row.field}</td>
                  <td className="px-4 py-3 text-ink-2">{row.written}</td>
                  <td className="px-4 py-3 text-right">
                    <Chip tone={row.required ? "rose" : "neutral"}>{row.required ? "yes" : "no"}</Chip>
                  </td>
                  <td className="px-4 py-3 text-right font-mono text-ink-4">{row.kept}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      <Callout tone="ultra" title="You cannot move the headline without naming the input you moved">
        Typing 87.6% into the box is not enough. A forecast that can be nudged as a single figure becomes a
        negotiation about a decimal; a forecast that has to be moved by naming account coverage becomes a
        conversation about whether anyone is covering Peter's accounts — which is the conversation worth having.
      </Callout>

      <Callout tone="teal" title="Moving it down is not treated as pessimism and moving it up is not treated as confidence">
        There is no sentiment on this screen, no tone in the copy, and no difference in how a downward and an
        upward revision are recorded. Both take the same four fields and both keep the model's figure beside them.
      </Callout>
    </div>
  );
}
