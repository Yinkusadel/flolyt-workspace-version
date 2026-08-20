import { Link } from "react-router-dom";

import { EYEBROW_CLASS } from "@/pages/everyday/lifecycle/data";
import { Callout } from "@/pages/everyday/lifecycle/stage/rail";
import { Chip } from "@/pages/everyday/lifecycle/stage/chip";
import { BenchmarksTabs } from "@/pages/revenue/benchmarks/tabs";
import { BM10_ROWS, BM_CHIP_TONE, BM_TONE_CLASS } from "@/pages/revenue/benchmarks/data";

const HEAD_CLASS = "px-4 py-2.5 font-mono text-[8.5px] font-medium tracking-[0.8px] text-ink-4 uppercase";

/** BM10 (disk) — /benchmarks/like-for-like, linked from the "Our own past" tab's own table. */
const BenchmarksLikeForLikeRoute = () => {
  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-[17px] font-semibold text-ink">Benchmarks</h1>
        <p className="mt-1 text-[11.5px] text-ink-3">Six checks before any two numbers meet · one currently failing, one that blocks outright</p>
      </div>

      <BenchmarksTabs active="Our own past" />

      <section className="space-y-3">
        <p className={EYEBROW_CLASS}>What has to match before two numbers can sit next to each other</p>
        <div className="overflow-x-auto rounded-card border border-line bg-paper">
          <table className="w-full min-w-[900px] text-left text-[11.5px]">
            <thead>
              <tr className="border-b border-line bg-paper-2">
                <th className={HEAD_CLASS}>Must match</th>
                <th className={HEAD_CLASS}>Why</th>
                <th className={`${HEAD_CLASS} text-right`}>Checked?</th>
                <th className={`${HEAD_CLASS} text-right`}>Failures now</th>
                <th className={HEAD_CLASS}>What happens when it fails</th>
              </tr>
            </thead>
            <tbody>
              {BM10_ROWS.map((row) => (
                <tr key={row.mustMatch} className="border-b border-line last:border-0">
                  <td className="px-4 py-3 font-semibold text-ink">{row.mustMatch}</td>
                  <td className="px-4 py-3 text-ink-2">{row.why}</td>
                  <td className="px-4 py-3 text-right">
                    <Chip tone={BM_CHIP_TONE[row.checkedTone]}>{row.checked}</Chip>
                  </td>
                  <td className={`px-4 py-3 text-right font-mono ${BM_TONE_CLASS[row.failuresNowTone]}`}>{row.failuresNow}</td>
                  <td className={`px-4 py-3 ${BM_TONE_CLASS[row.whenItFailsTone]}`}>{row.whenItFails}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <Link to="/benchmarks" className="inline-block text-[10.5px] font-semibold text-ultra hover:underline">
          ← Back to benchmarks
        </Link>
      </section>

      <Callout tone="amber" title="Five of six checks pass silently and the one that fails changes what a chart looks like">
        The 11 July definition change is the reason the baseline on the previous screen reads 54.1% rather than the
        58.0% that was in June's slides. Nothing was hidden and nothing was overwritten — both figures exist, and
        every chart that spans the change carries a mark at the changeover. Anyone comparing across it is told, on
        the chart, rather than in a footnote nobody opens.
      </Callout>

      <Callout tone="rose" title="The only comparison this section refuses outright is a mismatched window">
        Thirty-day repeat against sixty-day repeat is not a wide comparison or a caveated one; it is two different
        questions. It is the one check that blocks rather than warns, because there is no honest way to present the
        result and no reader who would catch it.
      </Callout>
    </div>
  );
};

export default BenchmarksLikeForLikeRoute;
