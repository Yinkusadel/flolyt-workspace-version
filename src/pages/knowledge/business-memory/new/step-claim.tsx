import { cn } from "@/lib/utils";
import { EYEBROW_CLASS } from "@/pages/everyday/lifecycle/data";
import { Callout } from "@/pages/everyday/lifecycle/stage/rail";
import { Chip } from "@/pages/everyday/lifecycle/stage/chip";
import { BM_CHIP_TONE, ME12_CLAIM, ME12_KIND_ROWS, ME12_NOTE } from "@/pages/knowledge/business-memory/data";

const HEAD_CLASS = "px-4 py-2.5 font-mono text-[8.5px] font-medium tracking-[0.8px] text-ink-4 uppercase";

/** ME12 — "What have you learned?", step 1 of the write-a-learning wizard. */
export function StepClaim() {
  return (
    <div className="space-y-8">
      <section className="space-y-3">
        <p className={EYEBROW_CLASS}>What have you learned?</p>
        <div className="rounded-card border border-line bg-paper p-4">
          <p className="text-[13px] font-semibold text-ink">{ME12_CLAIM.text}</p>
          <p className="mt-2 font-mono text-[10px] text-ink-4">{ME12_CLAIM.detail}</p>
        </div>
      </section>

      <section className="space-y-3">
        <p className={EYEBROW_CLASS}>What kind of claim is this?</p>
        <div className="overflow-x-auto rounded-card border border-line bg-paper">
          <table className="w-full min-w-[760px] text-left text-[11.5px]">
            <thead>
              <tr className="border-b border-line bg-paper-2">
                <th className={HEAD_CLASS}>Kind</th>
                <th className={HEAD_CLASS}>What it means</th>
                <th className={`${HEAD_CLASS} text-right`}>Can be cited as evidence?</th>
                <th className={HEAD_CLASS}>Needs</th>
                <th className={`${HEAD_CLASS} text-right`}>Pick</th>
              </tr>
            </thead>
            <tbody>
              {ME12_KIND_ROWS.map((row) => (
                <tr key={row.kind} className={cn("border-b border-line last:border-0", row.selected && "bg-ultra-bg/40")}>
                  <td className="px-4 py-3 font-semibold text-ink-2">{row.kind}</td>
                  <td className="px-4 py-3 text-ink-3">{row.means}</td>
                  <td className="px-4 py-3 text-right">
                    <Chip tone={BM_CHIP_TONE[row.citableTone]}>{row.citable}</Chip>
                  </td>
                  <td className="px-4 py-3 text-ink-4">{row.needs}</td>
                  <td className="px-4 py-3 text-right">
                    {row.selected ? <Chip tone="ultra">selected</Chip> : null}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      <Callout tone="ultra" title="You have one reading, so this can only be an observation, and the form will not offer you validated">
        {ME12_NOTE}
      </Callout>
    </div>
  );
}
