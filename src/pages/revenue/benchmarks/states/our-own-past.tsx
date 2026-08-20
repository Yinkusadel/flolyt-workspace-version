import { Link } from "react-router-dom";

import { Button } from "@/components/ui/button";
import { EYEBROW_CLASS } from "@/pages/everyday/lifecycle/data";
import { Callout } from "@/pages/everyday/lifecycle/stage/rail";
import { Chip } from "@/pages/everyday/lifecycle/stage/chip";
import { BenchmarksTabs } from "@/pages/revenue/benchmarks/tabs";
import { BM03_ROWS, BM_CHIP_TONE, BM_TONE_CLASS } from "@/pages/revenue/benchmarks/data";

const HEAD_CLASS = "px-4 py-2.5 font-mono text-[8.5px] font-medium tracking-[0.8px] text-ink-4 uppercase";

/** BM03 (disk) — the default populated "Our own past" state, the /benchmarks index's landing tab. */
export function OurOwnPastState() {
  return (
    <div className="space-y-8">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <h1 className="text-[17px] font-semibold text-ink">Benchmarks</h1>
          <p className="mt-1 text-[11.5px] text-ink-3">Seven metrics against two reference points · one moved because the definition did</p>
        </div>
        <Button asChild type="button" size="sm">
          <Link to="/benchmarks/new">Build a comparison</Link>
        </Button>
      </div>

      <BenchmarksTabs active="Our own past" />

      <section className="space-y-3">
        <p className={EYEBROW_CLASS}>Now, against the baseline and against the week before the release</p>
        <div className="overflow-x-auto rounded-card border border-line bg-paper">
          <table className="w-full min-w-[880px] text-left text-[11.5px]">
            <thead>
              <tr className="border-b border-line bg-paper-2">
                <th className={HEAD_CLASS}>Metric</th>
                <th className={`${HEAD_CLASS} text-right`}>Now</th>
                <th className={`${HEAD_CLASS} text-right`}>Baseline · 1 Jan</th>
                <th className={`${HEAD_CLASS} text-right`}>Before 4 Mar</th>
                <th className={`${HEAD_CLASS} text-right`}>Change</th>
                <th className={HEAD_CLASS}>Same definition?</th>
              </tr>
            </thead>
            <tbody>
              {BM03_ROWS.map((row) => (
                <tr key={row.metric} className="border-b border-line last:border-0">
                  <td className="px-4 py-3 font-semibold">
                    {row.detailId ? (
                      <Link to={`/benchmarks/${row.detailId}`} className="text-ultra hover:underline">
                        {row.metric}
                      </Link>
                    ) : (
                      <span className="text-ink">{row.metric}</span>
                    )}
                  </td>
                  <td className={`px-4 py-3 text-right font-mono ${BM_TONE_CLASS[row.nowTone]}`}>{row.now}</td>
                  <td className="px-4 py-3 text-right font-mono text-ink-4">{row.baseline}</td>
                  <td className="px-4 py-3 text-right font-mono text-ink-4">{row.before}</td>
                  <td className={`px-4 py-3 text-right font-mono ${BM_TONE_CLASS[row.changeTone]}`}>{row.change}</td>
                  <td className="px-4 py-3">
                    <Chip tone={BM_CHIP_TONE[row.sameDefinitionTone]}>{row.sameDefinition}</Chip>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <Link to="/benchmarks/like-for-like" className="inline-block text-[10.5px] font-semibold text-ultra hover:underline">
          What has to match before two numbers can sit next to each other →
        </Link>
      </section>

      <Callout tone="amber" title="One row moved because the metric changed, not because the business did">
        Reached value was redefined on 11 July from two orders in sixty days to two in thirty. The baseline figure
        on this screen is the restated one — 54.1%, not the 58.0% anybody quoted in June. Both are kept and the
        column says which comparison is like for like, because a definition change is the easiest way to
        accidentally report a four-point fall that never happened.
      </Callout>

      <Callout tone="ultra" title="Six of seven rows are worse and the seventh is the only one anybody deliberately worked on">
        Involuntary churn recovery is up 45.5 points because a room was opened, a holdout was run and a change
        shipped. Everything else on this table drifted. That ratio — one deliberate improvement against six drifts
        — is a more useful summary of the last seven months than any of the individual numbers.
      </Callout>
    </div>
  );
}
