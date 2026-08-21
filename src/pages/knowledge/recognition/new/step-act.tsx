import { EYEBROW_CLASS } from "@/pages/everyday/lifecycle/data";
import { Callout } from "@/pages/everyday/lifecycle/stage/rail";
import { Chip } from "@/pages/everyday/lifecycle/stage/chip";
import { RC09_ACT, RC09_KIND_ROWS, RC09_NOTE, RC_CHIP_TONE } from "@/pages/knowledge/recognition/data";

const HEAD_CLASS = "px-4 py-2.5 font-mono text-[8.5px] font-medium tracking-[0.8px] text-ink-4 uppercase";

/** RC09 — "What did somebody do?", step 1 of the recognise wizard. */
export function StepAct() {
  return (
    <div className="space-y-8">
      <section className="space-y-3">
        <p className={EYEBROW_CLASS}>What did somebody do?</p>
        <div className="rounded-card border border-line bg-paper p-4">
          <p className="text-[12.5px] font-semibold text-ink">{RC09_ACT.title}</p>
          <p className="mt-2 font-mono text-[10px] text-ink-4">{RC09_ACT.detail}</p>
        </div>
      </section>

      <section className="space-y-3">
        <p className={EYEBROW_CLASS}>What kind of act is this?</p>
        <div className="overflow-x-auto rounded-card border border-line bg-paper">
          <table className="w-full min-w-[760px] text-left text-[11.5px]">
            <thead>
              <tr className="border-b border-line bg-paper-2">
                <th className={HEAD_CLASS}>Kind</th>
                <th className={HEAD_CLASS}>What it means</th>
                <th className={`${HEAD_CLASS} text-right`}>This one?</th>
                <th className={`${HEAD_CLASS} text-right`}>How many this quarter</th>
              </tr>
            </thead>
            <tbody>
              {RC09_KIND_ROWS.map((row) => (
                <tr key={row.kind} className="border-b border-line last:border-0">
                  <td className="px-4 py-3 font-semibold text-ink-2">{row.kind}</td>
                  <td className="px-4 py-3 text-ink-3">{row.means}</td>
                  <td className="px-4 py-3 text-right">
                    {row.thisOne ? <Chip tone={RC_CHIP_TONE[row.thisOneTone]}>{row.thisOne}</Chip> : null}
                  </td>
                  <td className="px-4 py-3 text-right font-mono text-ink-4">{row.count}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      <Callout tone="ultra" title="This one cost Zainab ₦24M off her own stage's contribution">
        {RC09_NOTE}
      </Callout>
    </div>
  );
}
