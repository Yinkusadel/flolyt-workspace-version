import { Link } from "react-router-dom";

import { EYEBROW_CLASS } from "@/pages/everyday/lifecycle/data";
import { Callout } from "@/pages/everyday/lifecycle/stage/rail";
import { Chip } from "@/pages/everyday/lifecycle/stage/chip";
import { BenchmarksKvList } from "@/pages/revenue/benchmarks/kv-list";
import { BenchmarksTabs } from "@/pages/revenue/benchmarks/tabs";
import { BM09_KV_ROWS, BM09_ROWS, BM_CHIP_TONE, BM_TONE_CLASS } from "@/pages/revenue/benchmarks/data";

const HEAD_CLASS = "px-4 py-2.5 font-mono text-[8.5px] font-medium tracking-[0.8px] text-ink-4 uppercase";

/** BM09 (disk) — /benchmarks/limits, linked from the "Not compared" tab's refused-route. */
const BenchmarksLimitsRoute = () => {
  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-[17px] font-semibold text-ink">Benchmarks</h1>
        <p className="mt-1 text-[11.5px] text-ink-3">Five comparisons · two too small to read, two that cannot be drawn at all</p>
      </div>

      <BenchmarksTabs active="Not compared" />

      <section className="space-y-3">
        <p className={EYEBROW_CLASS}>Comparisons this section will draw but will not let you read quietly</p>
        <div className="overflow-x-auto rounded-card border border-line bg-paper">
          <table className="w-full min-w-[880px] text-left text-[11.5px]">
            <thead>
              <tr className="border-b border-line bg-paper-2">
                <th className={HEAD_CLASS}>Comparison</th>
                <th className={`${HEAD_CLASS} text-right`}>Sample</th>
                <th className={`${HEAD_CLASS} text-right`}>Difference</th>
                <th className={HEAD_CLASS}>Would need</th>
                <th className={HEAD_CLASS}>Shown as</th>
              </tr>
            </thead>
            <tbody>
              {BM09_ROWS.map((row) => (
                <tr key={row.comparison} className="border-b border-line last:border-0">
                  <td className="px-4 py-3 font-semibold text-ink">{row.comparison}</td>
                  <td className={`px-4 py-3 text-right font-mono ${BM_TONE_CLASS[row.sampleTone]}`}>{row.sample}</td>
                  <td className={`px-4 py-3 text-right font-mono ${BM_TONE_CLASS[row.differenceTone]}`}>{row.difference}</td>
                  <td className={`px-4 py-3 ${BM_TONE_CLASS[row.wouldNeedTone]}`}>{row.wouldNeed}</td>
                  <td className="px-4 py-3">
                    <Chip tone={BM_CHIP_TONE[row.shownAsTone]}>{row.shownAs}</Chip>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <Link to="/benchmarks/refused" className="inline-block text-[10.5px] font-semibold text-ultra hover:underline">
          ← Back to what is refused outright
        </Link>
      </section>

      <Callout tone="amber" title="A difference that is real and a difference you can act on are not the same thing">
        Ghana's repeat rate is genuinely 5.1 points below Nigeria's and the sample behind it is 1,940 people. The
        figure is drawn, marked wide, and given the number it would need to be readable. Hiding it would suggest
        nothing is known; showing it plainly would let a five-point gap start a project.
      </Callout>

      <section className="space-y-3">
        <p className={EYEBROW_CLASS}>What is never used to make a small number look bigger</p>
        <div className="max-w-2xl">
          <BenchmarksKvList rows={BM09_KV_ROWS} />
        </div>
      </section>
    </div>
  );
};

export default BenchmarksLimitsRoute;
