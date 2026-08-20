import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { EYEBROW_CLASS } from "@/pages/everyday/lifecycle/data";
import { Callout } from "@/pages/everyday/lifecycle/stage/rail";
import { Chip } from "@/pages/everyday/lifecycle/stage/chip";
import { BM01_ROWS, BM_CHIP_TONE } from "@/pages/revenue/benchmarks/data";

const HEAD_CLASS = "px-4 py-2.5 font-mono text-[8.5px] font-medium tracking-[0.8px] text-ink-4 uppercase";

/** BM01 — before the baseline locks. Wired but unreachable with BENCHMARK_STATE's current default. */
export function NothingToCompareYetState() {
  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-[17px] font-semibold text-ink">Benchmarks</h1>
        <p className="mt-1 text-[11.5px] text-ink-3">No baseline yet · four bases will be available, and one never will</p>
      </div>

      <div className="rounded-surface border border-dashed border-line bg-paper p-8 text-center sm:p-10">
        <h2 className="text-[16px] font-semibold text-ink sm:text-[17px]">There is nothing to compare this to yet</h2>
        <p className="mx-auto mt-3 max-w-xl text-[11.5px] leading-relaxed text-ink-3">
          A benchmark is one number held against another, and this workspace currently has one number. The first
          comparison becomes possible on 1 January, when the baseline locks and today acquires a yesterday.
        </p>
        <div className="mt-5 flex flex-wrap items-center justify-center gap-3">
          <Button type="button" onClick={() => toast.info("Baseline locks automatically on 1 January")}>
            Lock a baseline
          </Button>
          <Button type="button" variant="outline" onClick={() => toast.info("Scroll down · the table below is what will be compared")}>
            What we will compare against
          </Button>
        </div>
        <p className="mx-auto mt-5 max-w-lg text-[10px] text-ink-4">
          Four days of live data cannot be a benchmark for four days of live data.
        </p>
      </div>

      <section className="space-y-3">
        <p className={EYEBROW_CLASS}>The four things this section will ever compare against</p>
        <div className="overflow-x-auto rounded-card border border-line bg-paper">
          <table className="w-full min-w-[720px] text-left text-[11.5px]">
            <thead>
              <tr className="border-b border-line bg-paper-2">
                <th className={HEAD_CLASS}>Basis</th>
                <th className={HEAD_CLASS}>What it compares</th>
                <th className={`${HEAD_CLASS} text-right`}>Strength</th>
                <th className={`${HEAD_CLASS} text-right`}>Available from</th>
              </tr>
            </thead>
            <tbody>
              {BM01_ROWS.map((row) => (
                <tr key={row.basis} className="border-b border-line last:border-0">
                  <td className="px-4 py-3 font-semibold text-ink">{row.basis}</td>
                  <td className="px-4 py-3 text-ink-2">{row.compares}</td>
                  <td className="px-4 py-3 text-right">
                    <Chip tone={BM_CHIP_TONE[row.strengthTone]}>{row.strength}</Chip>
                  </td>
                  <td className="px-4 py-3 text-right">
                    <Chip tone={BM_CHIP_TONE[row.availableTone]}>{row.available}</Chip>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      <Callout tone="rose" title="The last row is the only one that would be available today and it is the one that is refused">
        An industry benchmark could be bought this afternoon and put on a slide by Friday. It would sit in the same
        column, in the same typeface, as a figure measured against a real holdout, and nobody reading it six months
        later would be able to tell which was which. That is the whole argument, and it is on the first screen
        rather than in a settings note.
      </Callout>
    </div>
  );
}
