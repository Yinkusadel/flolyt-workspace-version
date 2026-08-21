import { Link } from "react-router-dom";

import { Button } from "@/components/ui/button";
import { EYEBROW_CLASS } from "@/pages/everyday/lifecycle/data";
import { Callout } from "@/pages/everyday/lifecycle/stage/rail";
import { Chip } from "@/pages/everyday/lifecycle/stage/chip";
import { BenchmarksKvList } from "@/pages/revenue/benchmarks/kv-list";
import { BenchmarksTabs } from "@/pages/revenue/benchmarks/tabs";
import { BM06_KV_ROWS, BM06_ROWS, BM_CHIP_TONE, BM_TONE_CLASS } from "@/pages/revenue/benchmarks/data";

const HEAD_CLASS = "px-4 py-2.5 font-mono text-[8.5px] font-medium tracking-[0.8px] text-ink-4 uppercase";

/** BM06 (disk) — /benchmarks/holdouts. "Design a holdout" reuses Attribution's already-built wizard rather than duplicating it. */
const BenchmarksHoldoutsRoute = () => {
  return (
    <div className="space-y-8">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <h1 className="text-[17px] font-semibold text-ink">Benchmarks</h1>
          <p className="mt-1 text-[11.5px] text-ink-3">Five comparisons · three closed and causal · ₦8.2M borne by held customers</p>
        </div>
        <Button asChild type="button" size="sm">
          <Link to="/attribution/holdouts/new">Design a holdout</Link>
        </Button>
      </div>

      <BenchmarksTabs active="Against a holdout" />

      <section className="space-y-3">
        <p className={EYEBROW_CLASS}>The only comparisons here that support a causal claim</p>
        <div className="overflow-x-auto rounded-card border border-line bg-paper">
          <table className="w-full min-w-[900px] text-left text-[11.5px]">
            <thead>
              <tr className="border-b border-line bg-paper-2">
                <th className={HEAD_CLASS}>Comparison</th>
                <th className={`${HEAD_CLASS} text-right`}>Treated</th>
                <th className={`${HEAD_CLASS} text-right`}>Held</th>
                <th className={`${HEAD_CLASS} text-right`}>Difference</th>
                <th className={`${HEAD_CLASS} text-right`}>n</th>
                <th className={`${HEAD_CLASS} text-right`}>Strength</th>
                <th className={HEAD_CLASS}>Closed</th>
              </tr>
            </thead>
            <tbody>
              {BM06_ROWS.map((row) => (
                <tr key={row.comparison} className="border-b border-line last:border-0">
                  <td className="px-4 py-3 font-semibold text-ink">{row.comparison}</td>
                  <td className={`px-4 py-3 text-right font-mono ${BM_TONE_CLASS[row.treatedTone]}`}>{row.treated}</td>
                  <td className={`px-4 py-3 text-right font-mono ${BM_TONE_CLASS[row.heldTone]}`}>{row.held}</td>
                  <td className={`px-4 py-3 text-right font-mono ${BM_TONE_CLASS[row.differenceTone]}`}>{row.difference}</td>
                  <td className="px-4 py-3 text-right font-mono text-ink">{row.n}</td>
                  <td className="px-4 py-3 text-right">
                    <Chip tone={BM_CHIP_TONE[row.strengthTone]}>{row.strength}</Chip>
                  </td>
                  <td className="px-4 py-3 text-ink-4">{row.closed}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      <Callout tone="amber" title="Three closed comparisons in seven months, and they are the only causal claims in the workspace">
        Everything else on the leakage map, in the ledger and in this section is an association wearing a number.
        Three is not many, and it is not a criticism of the people — a holdout needs an approver, an end date, an
        exclusion list and a fortnight of somebody being willing to leave money on the table. This screen exists to
        show how rare that is rather than to imply it should be routine.
      </Callout>

      <section className="space-y-3">
        <p className={EYEBROW_CLASS}>What each of these comparisons cost</p>
        <div className="max-w-2xl">
          <BenchmarksKvList rows={BM06_KV_ROWS} />
        </div>
      </section>
    </div>
  );
};

export default BenchmarksHoldoutsRoute;
