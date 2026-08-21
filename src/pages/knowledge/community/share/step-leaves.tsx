import { EYEBROW_CLASS } from "@/pages/everyday/lifecycle/data";
import { Callout } from "@/pages/everyday/lifecycle/stage/rail";
import { Chip } from "@/pages/everyday/lifecycle/stage/chip";
import { CM10_IN_WORKSPACE, CM10_NOTE, CM10_STRIPPED_ROWS, CM10_WOULD_LEAVE, CM_CHIP_TONE } from "@/pages/knowledge/community/data";

const HEAD_CLASS = "px-4 py-2.5 font-mono text-[8.5px] font-medium tracking-[0.8px] text-ink-4 uppercase";

/** CM10 — "What leaves", step 2 of the share wizard. */
export function StepLeaves() {
  return (
    <div className="space-y-8">
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
        <div className="rounded-card border border-line bg-paper-2 p-4">
          <p className="font-mono text-[8.5px] font-medium tracking-[0.85px] text-ink-4 uppercase">In your workspace</p>
          <p className="mt-2 text-[11px] leading-relaxed text-ink-2">{CM10_IN_WORKSPACE}</p>
        </div>
        <div className="rounded-card border-2 border-teal-border bg-white p-4">
          <p className="font-mono text-[8.5px] font-medium tracking-[0.85px] text-teal uppercase">What would leave</p>
          <p className="mt-2 text-[11px] leading-relaxed text-ink-2">{CM10_WOULD_LEAVE}</p>
          <p className="mt-3 font-mono text-[9.5px] font-semibold text-teal">31 words · no figures, no dates, no names</p>
        </div>
      </div>

      <section className="space-y-3">
        <p className={EYEBROW_CLASS}>Stripped automatically · you cannot put them back</p>
        <div className="overflow-x-auto rounded-card border border-line bg-paper">
          <table className="w-full min-w-[640px] text-left text-[11.5px]">
            <thead>
              <tr className="border-b border-line bg-paper-2">
                <th className={HEAD_CLASS}>Removed</th>
                <th className={HEAD_CLASS}>Why</th>
                <th className={`${HEAD_CLASS} text-right`}>Reinstatable?</th>
              </tr>
            </thead>
            <tbody>
              {CM10_STRIPPED_ROWS.map((row) => (
                <tr key={row.removed} className="border-b border-line last:border-0">
                  <td className="px-4 py-3 font-semibold text-ink-2">{row.removed}</td>
                  <td className="px-4 py-3 text-ink-3">{row.why}</td>
                  <td className="px-4 py-3 text-right">
                    <Chip tone={CM_CHIP_TONE[row.reinstatableTone]}>{row.reinstatable}</Chip>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      <Callout tone="ultra" title="Attribution is the only thing on this list you can turn on, and almost nobody does">
        {CM10_NOTE}
      </Callout>
    </div>
  );
}
