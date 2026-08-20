import { EYEBROW_CLASS } from "@/pages/everyday/lifecycle/data";
import { Callout } from "@/pages/everyday/lifecycle/stage/rail";
import { Chip } from "@/pages/everyday/lifecycle/stage/chip";
import { BM11_BASIS_ROWS, BM11_SUBJECTS, BM_CHIP_TONE } from "@/pages/revenue/benchmarks/data";

const HEAD_CLASS = "px-4 py-2.5 font-mono text-[8.5px] font-medium tracking-[0.8px] text-ink-4 uppercase";

/** BM11 — step 1 of "Build a comparison": what against what, and what kind of comparison it is. */
export function StepWhat() {
  return (
    <div className="space-y-8">
      <section className="space-y-3">
        <p className={EYEBROW_CLASS}>What are you comparing?</p>
        <div className="grid grid-cols-1 items-center gap-3 sm:grid-cols-[1fr_auto_1fr]">
          <div className="rounded-panel border border-line bg-paper px-4 py-3">
            <p className="text-[12px] font-semibold text-ink">{BM11_SUBJECTS.left.title}</p>
            <p className="mt-1 font-mono text-[10px] text-ink-4">{BM11_SUBJECTS.left.sub}</p>
          </div>
          <p className="text-center text-[11px] text-ink-4">against</p>
          <div className="rounded-panel border border-line bg-paper px-4 py-3">
            <p className="text-[12px] font-semibold text-ink">{BM11_SUBJECTS.right.title}</p>
            <p className="mt-1 font-mono text-[10px] text-ink-4">{BM11_SUBJECTS.right.sub}</p>
          </div>
        </div>
      </section>

      <section className="space-y-3">
        <p className={EYEBROW_CLASS}>What kind of comparison this is</p>
        <div className="overflow-x-auto rounded-card border border-line bg-paper">
          <table className="w-full min-w-[760px] text-left text-[11.5px]">
            <thead>
              <tr className="border-b border-line bg-paper-2">
                <th className={HEAD_CLASS}>Basis</th>
                <th className={HEAD_CLASS}>What it would mean here</th>
                <th className={`${HEAD_CLASS} text-right`}>Strength</th>
                <th className={`${HEAD_CLASS} text-right`}>Pick</th>
              </tr>
            </thead>
            <tbody>
              {BM11_BASIS_ROWS.map((row) => (
                <tr key={row.basis} className="border-b border-line last:border-0">
                  <td className="px-4 py-3 font-semibold text-ink">{row.basis}</td>
                  <td className="px-4 py-3 text-ink-2">{row.meaning}</td>
                  <td className="px-4 py-3 text-right">
                    <Chip tone={BM_CHIP_TONE[row.strengthTone]}>{row.strength}</Chip>
                  </td>
                  <td className="px-4 py-3 text-right">{row.selected && <Chip tone="ultra">selected</Chip>}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      <Callout tone="ultra" title="Choosing the second option is a claim about the world, not a display preference">
        Calling the UK a control asserts that it is comparable in every way except the release. That is defensible
        here and it is a statement somebody signs, so the next screen makes you look at what has to be true for it
        to hold — and shows you the one thing that is not.
      </Callout>
    </div>
  );
}
