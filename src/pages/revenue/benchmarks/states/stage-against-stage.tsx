import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { EYEBROW_CLASS } from "@/pages/everyday/lifecycle/data";
import { Callout } from "@/pages/everyday/lifecycle/stage/rail";
import { Chip } from "@/pages/everyday/lifecycle/stage/chip";
import { BenchmarksKvList } from "@/pages/revenue/benchmarks/kv-list";
import { BenchmarksTabs } from "@/pages/revenue/benchmarks/tabs";
import { BM05_KV_ROWS, BM05_ROWS, BM_CHIP_TONE, BM_TONE_CLASS } from "@/pages/revenue/benchmarks/data";

const HEAD_CLASS = "px-4 py-2.5 font-mono text-[8.5px] font-medium tracking-[0.8px] text-ink-4 uppercase";

/** BM05 (disk) — /benchmarks?by=stage. */
export function StageAgainstStageState() {
  return (
    <div className="space-y-8">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <h1 className="text-[17px] font-semibold text-ink">Benchmarks</h1>
          <p className="mt-1 text-[11.5px] text-ink-3">Ten stages side by side · three have no owner, no rooms and no recovered money</p>
        </div>
        <Button type="button" onClick={() => toast.info("Opening the assign-an-owner workflow")}>
          Assign an owner
        </Button>
      </div>

      <BenchmarksTabs active="Stage vs stage" />

      <section className="space-y-3">
        <p className={EYEBROW_CLASS}>The same question asked at ten points in the lifecycle</p>
        <div className="overflow-x-auto rounded-card border border-line bg-paper">
          <table className="w-full min-w-[920px] text-left text-[11.5px]">
            <thead>
              <tr className="border-b border-line bg-paper-2">
                <th className={HEAD_CLASS}>Stage</th>
                <th className={`${HEAD_CLASS} text-right`}>Owner</th>
                <th className={`${HEAD_CLASS} text-right`}>Metric now</th>
                <th className={`${HEAD_CLASS} text-right`}>Against its own baseline</th>
                <th className={`${HEAD_CLASS} text-right`}>Rooms</th>
                <th className={`${HEAD_CLASS} text-right`}>Recovered</th>
                <th className={HEAD_CLASS}>Instrumented</th>
              </tr>
            </thead>
            <tbody>
              {BM05_ROWS.map((row) => (
                <tr key={row.stage} className="border-b border-line last:border-0">
                  <td className="px-4 py-3 font-semibold text-ink">{row.stage}</td>
                  <td className={`px-4 py-3 text-right ${BM_TONE_CLASS[row.ownerTone]}`}>{row.owner}</td>
                  <td className={`px-4 py-3 text-right font-mono ${BM_TONE_CLASS[row.metricNowTone]}`}>{row.metricNow}</td>
                  <td className={`px-4 py-3 text-right font-mono ${BM_TONE_CLASS[row.againstBaselineTone]}`}>{row.againstBaseline}</td>
                  <td className={`px-4 py-3 text-right font-mono ${BM_TONE_CLASS[row.roomsTone]}`}>{row.rooms}</td>
                  <td className={`px-4 py-3 text-right font-mono ${BM_TONE_CLASS[row.recoveredTone]}`}>{row.recovered}</td>
                  <td className="px-4 py-3">
                    <Chip tone={BM_CHIP_TONE[row.instrumentedTone]}>{row.instrumented}</Chip>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      <Callout tone="rose" title="The three stages with no owner are the three with no rooms and no recovered money">
        Adopt, Churn and Advocate have never produced a naira, and they are the same three rows that read "nobody".
        That is not a coincidence and it is not a ranking of the stages — it is a picture of where the people are.
        Adopt holds the strongest predictor in the workspace and has never been worked on.
      </Callout>

      <Callout tone="ultra" title="This table is not a scoreboard and cannot be sorted into one">
        Support looks worst on the change column because its metric goes up when things go wrong. Retain has six
        rooms and ₦12M against ₦437M of loss. There is no composite score, no ranking column and no way to order
        this table by performance, because every stage measures something different and the arithmetic that would
        rank them does not exist.
      </Callout>

      <section className="space-y-3">
        <p className={EYEBROW_CLASS}>What the ten rows are actually measuring</p>
        <div className="max-w-2xl">
          <BenchmarksKvList rows={BM05_KV_ROWS} />
        </div>
      </section>
    </div>
  );
}
