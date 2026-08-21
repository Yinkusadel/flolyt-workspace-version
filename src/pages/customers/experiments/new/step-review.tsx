import { EYEBROW_CLASS } from "@/pages/everyday/lifecycle/data";
import { Callout } from "@/pages/everyday/lifecycle/stage/rail";
import { Chip } from "@/pages/everyday/lifecycle/stage/chip";
import { EX_CHIP_TONE, XP11_REGISTERED_ROWS } from "@/pages/customers/experiments/data";

const HEAD_CLASS = "px-4 py-2.5 font-mono text-[8.5px] font-medium tracking-[0.8px] text-ink-4 uppercase";

/** XP11 — step 3, "Review". */
export function StepReview() {
  return (
    <div className="space-y-8">
      <div className="rounded-card border border-ultra-border bg-ultra-bg p-5">
        <p className="font-mono text-[9px] font-medium tracking-[0.85px] text-ultra uppercase">Would be held back</p>
        <p className="mt-2 text-[28px] font-semibold text-ink">10,900</p>
        <p className="mt-1.5 max-w-xl text-[11px] leading-relaxed text-ink-2">
          For 21 days, from 109,000 eligible. They receive nothing and are not told.
        </p>
        <div className="mt-3 border-t border-dashed border-ultra-border pt-3">
          <p className="font-mono text-[8.5px] text-ink-4 uppercase">Readable from</p>
          <p className="mt-0.5 text-[13px] font-semibold text-ultra">Day 21 · for a 3.1-point change</p>
        </div>
      </div>

      <section className="space-y-3">
        <p className={EYEBROW_CLASS}>Registered, and locked the moment it starts</p>
        <div className="overflow-x-auto rounded-card border border-line bg-paper">
          <table className="w-full min-w-[680px] text-left text-[11.5px]">
            <thead>
              <tr className="border-b border-line bg-paper-2">
                <th className={HEAD_CLASS}>Field</th>
                <th className={HEAD_CLASS}>Value</th>
                <th className={`${HEAD_CLASS} text-right`}>Editable after it starts?</th>
              </tr>
            </thead>
            <tbody>
              {XP11_REGISTERED_ROWS.map((row) => (
                <tr key={row.field} className="border-b border-line last:border-0">
                  <td className="px-4 py-3 font-semibold text-ink-2">{row.field}</td>
                  <td className="px-4 py-3 text-ink-3">{row.value}</td>
                  <td className="px-4 py-3 text-right">
                    <Chip tone={EX_CHIP_TONE[row.editableTone]}>{row.editable}</Chip>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      <Callout tone="ultra" title="This is the first experiment anybody has designed for the strongest signal in the workspace">
        Feature depth has been readable at 43 points since April, has produced nineteen agent findings and has
        never been tested. Running this turns the largest association in the leakage map into something that can
        be argued with — and if it comes back at +1 point, that is worth knowing too, because ₦134M is currently
        attributed to it.
      </Callout>

      <Callout tone="amber" title="Ten thousand nine hundred people will get nothing for three weeks and will never know">
        They are not harmed and they are not told, which is standard and is still worth writing on the screen
        where somebody signs it. The alternative — asking them — would produce a group that knows it is in a
        study, and that group answers a different question.
      </Callout>
    </div>
  );
}
