import { Link } from "react-router-dom";

import { Button } from "@/components/ui/button";
import { EYEBROW_CLASS } from "@/pages/everyday/lifecycle/data";
import { Callout } from "@/pages/everyday/lifecycle/stage/rail";
import { Chip } from "@/pages/everyday/lifecycle/stage/chip";
import { BenchmarksKvList } from "@/pages/revenue/benchmarks/kv-list";
import { BenchmarksTabs } from "@/pages/revenue/benchmarks/tabs";
import { BM04_KV_ROWS, BM04_ROWS, BM_CHIP_TONE, BM_TONE_CLASS } from "@/pages/revenue/benchmarks/data";

const HEAD_CLASS = "px-4 py-2.5 font-mono text-[8.5px] font-medium tracking-[0.8px] text-ink-4 uppercase";

/** BM04 (disk) — /benchmarks?by=market. */
export function MarketAgainstMarketState() {
  return (
    <div className="space-y-8">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <h1 className="text-[17px] font-semibold text-ink">Benchmarks</h1>
          <p className="mt-1 text-[11.5px] text-ink-3">Six metrics, four markets · rates compare, money does not, and the leader is an accident</p>
        </div>
        <Button asChild type="button" size="sm">
          <Link to="/benchmarks/new">Build a comparison</Link>
        </Button>
      </div>

      <BenchmarksTabs active="Market vs market" />

      <section className="space-y-3">
        <div className="overflow-x-auto rounded-card border border-line bg-paper">
          <table className="w-full min-w-[900px] text-left text-[11.5px]">
            <thead>
              <tr className="border-b border-line bg-paper-2">
                <th className={HEAD_CLASS}>Metric</th>
                <th className={`${HEAD_CLASS} text-right`}>Nigeria</th>
                <th className={`${HEAD_CLASS} text-right`}>Kenya</th>
                <th className={`${HEAD_CLASS} text-right`}>Ghana</th>
                <th className={`${HEAD_CLASS} text-right`}>UK</th>
                <th className={`${HEAD_CLASS} text-right`}>Spread</th>
                <th className={HEAD_CLASS}>Comparable?</th>
              </tr>
            </thead>
            <tbody>
              {BM04_ROWS.map((row) => (
                <tr key={row.metric} className="border-b border-line last:border-0">
                  <td className="px-4 py-3 font-semibold text-ink">{row.metric}</td>
                  <td className={`px-4 py-3 text-right font-mono ${BM_TONE_CLASS[row.ngTone]}`}>{row.ng}</td>
                  <td className={`px-4 py-3 text-right font-mono ${BM_TONE_CLASS[row.keTone]}`}>{row.ke}</td>
                  <td className={`px-4 py-3 text-right font-mono ${BM_TONE_CLASS[row.ghTone]}`}>{row.gh}</td>
                  <td className={`px-4 py-3 text-right font-mono ${BM_TONE_CLASS[row.ukTone]}`}>{row.uk}</td>
                  <td className={`px-4 py-3 text-right font-mono ${BM_TONE_CLASS[row.spreadTone]}`}>{row.spread}</td>
                  <td className="px-4 py-3">
                    <Chip tone={BM_CHIP_TONE[row.comparableTone]}>{row.comparable}</Chip>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      <Callout tone="teal" title="Percentages compare across markets and money does not">
        The rate rows sit side by side because a percentage means the same thing in Lagos and in Leeds. The
        order-value row is shown in four currencies and marked not comparable, because turning it into one number
        needs a rate, a date and a decision nobody would be able to reproduce. It is on the screen rather than
        removed, so that the absence is deliberate rather than an oversight.
      </Callout>

      <section className="space-y-3">
        <p className={EYEBROW_CLASS}>Before comparing these, four things worth knowing</p>
        <div className="max-w-2xl">
          <BenchmarksKvList rows={BM04_KV_ROWS} />
        </div>
      </section>

      <Callout tone="rose" title="The UK is winning because nothing was done to it">
        It is tempting to read column four as a well-run market. It is a market a release flag happened to miss,
        and every causal claim in the workspace depends on that accident. Reading it as best practice would be
        reading the control group as a strategy.
      </Callout>
    </div>
  );
}
