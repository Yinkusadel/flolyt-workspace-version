import { useState } from "react";
import { Link } from "react-router-dom";

import { Button } from "@/components/ui/button";
import { EYEBROW_CLASS } from "@/pages/everyday/lifecycle/data";
import { Callout } from "@/pages/everyday/lifecycle/stage/rail";
import { AddAnExternalBenchmarkModal } from "@/pages/revenue/benchmarks/modals/add-an-external-benchmark-modal";
import { BenchmarksKvList } from "@/pages/revenue/benchmarks/kv-list";
import { BenchmarksTabs } from "@/pages/revenue/benchmarks/tabs";
import { BM08_KV_ROWS, BM08_ROWS, BM_TONE_CLASS } from "@/pages/revenue/benchmarks/data";

const HEAD_CLASS = "px-4 py-2.5 font-mono text-[8.5px] font-medium tracking-[0.8px] text-ink-4 uppercase";

/** BM08 (disk) — /benchmarks/refused, the "Not compared" tab landing. */
const BenchmarksRefusedRoute = () => {
  const [addOpen, setAddOpen] = useState(false);

  return (
    <div className="space-y-8">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <h1 className="text-[17px] font-semibold text-ink">Benchmarks</h1>
          <p className="mt-1 text-[11.5px] text-ink-3">Five requests, five refusals, four of them with a better answer attached</p>
        </div>
        <Button type="button" variant="outline" onClick={() => setAddOpen(true)}>
          Add an external benchmark
        </Button>
      </div>

      <BenchmarksTabs active="Not compared" />

      <section className="space-y-3">
        <p className={EYEBROW_CLASS}>Things this section has been asked for and does not do</p>
        <div className="overflow-x-auto rounded-card border border-line bg-paper">
          <table className="w-full min-w-[900px] text-left text-[11.5px]">
            <thead>
              <tr className="border-b border-line bg-paper-2">
                <th className={HEAD_CLASS}>Asked for</th>
                <th className={`${HEAD_CLASS} text-right`}>By</th>
                <th className={`${HEAD_CLASS} text-right`}>When</th>
                <th className={HEAD_CLASS}>Why not</th>
                <th className={HEAD_CLASS}>Offered instead</th>
              </tr>
            </thead>
            <tbody>
              {BM08_ROWS.map((row) => (
                <tr key={row.askedFor} className="border-b border-line last:border-0">
                  <td className="px-4 py-3 font-semibold text-ink">{row.askedFor}</td>
                  <td className="px-4 py-3 text-right text-ink-4">{row.by}</td>
                  <td className="px-4 py-3 text-right text-ink-4">{row.when}</td>
                  <td className="px-4 py-3 text-ink-2">{row.whyNot}</td>
                  <td className={`px-4 py-3 ${BM_TONE_CLASS[row.insteadTone]}`}>{row.insteadOffered}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <Link to="/benchmarks/limits" className="inline-block text-[10.5px] font-semibold text-ultra hover:underline">
          See where comparison breaks, even when it isn't refused →
        </Link>
      </section>

      <Callout tone="teal" title="Every one of these was a reasonable request and four of them have a real answer">
        Nobody asking for an industry benchmark is trying to mislead anyone; they want to know whether 27.2% is
        bad. The honest answer is that it is 10.2 points below what this company was doing in February and 11.7
        below a market of its own that did not receive a change — which is more useful than a percentile against
        companies nobody can name.
      </Callout>

      <section className="space-y-3">
        <p className={EYEBROW_CLASS}>What an external benchmark would actually do here</p>
        <div className="max-w-2xl">
          <BenchmarksKvList rows={BM08_KV_ROWS} />
        </div>
      </section>

      <AddAnExternalBenchmarkModal open={addOpen} onOpenChange={setAddOpen} />
    </div>
  );
};

export default BenchmarksRefusedRoute;
