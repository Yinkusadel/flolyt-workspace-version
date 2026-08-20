import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { PersonAvatar } from "@/components/person-avatar";
import { EYEBROW_CLASS } from "@/pages/everyday/lifecycle/data";
import { Callout } from "@/pages/everyday/lifecycle/stage/rail";
import { KpiCards } from "@/pages/everyday/lifecycle/stage/kpi-cards";
import { BenchmarksKvList } from "@/pages/revenue/benchmarks/kv-list";
import { BM02_KV_ROWS, BM02_STATS, BM_KPI_TONE, REPEAT_DECAY_AGENT } from "@/pages/revenue/benchmarks/data";

/** BM02 (disk) — the baseline locks overnight and produces its first, unreadable, comparison. Wired but unreachable with BENCHMARK_STATE's current default. */
export function TheFirstComparisonState() {
  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-[17px] font-semibold text-ink">Benchmarks</h1>
        <p className="mt-1 text-[11.5px] text-ink-3">Baseline locked overnight · the first comparison is a zero, and it is drawn</p>
      </div>

      <div className="relative overflow-hidden rounded-card border border-ultra-border bg-ultra-bg p-5">
        <div className="flex items-start gap-3.5">
          <PersonAvatar kind="agent" initials={REPEAT_DECAY_AGENT.initials} />
          <div className="min-w-0">
            <p className="text-[14px] font-semibold text-ink">
              The baseline locked overnight and the first comparison is one day wide
            </p>
            <p className="mt-1.5 text-[11px] text-ink-2">
              Repeat rate today against repeat rate at the 1 January lock: 37.1% against 37.1%. The difference is
              zero and the interval is far wider than any difference could be.
            </p>
            <p className="mt-1.5 text-[11px] font-semibold text-ultra">
              It is drawn anyway, marked unreadable, so the shape of the section is honest from the first row.
            </p>
          </div>
        </div>
      </div>

      <KpiCards items={BM02_STATS.map((s) => ({ eyebrow: s.eyebrow, value: s.value, note: s.note, tone: s.tone ? BM_KPI_TONE[s.tone] : "ink" }))} />

      <section className="space-y-3">
        <p className={EYEBROW_CLASS}>What this section will and will not do, established on the first row</p>
        <div className="max-w-2xl">
          <BenchmarksKvList rows={BM02_KV_ROWS} />
        </div>
      </section>

      <Callout tone="ultra" title="The first benchmark in the workspace is a zero and it took a decision to show it">
        The alternative was an empty state for a fortnight, which would have been calmer and would have taught
        everyone that this section only speaks when it has news. Drawing the flat line on day one sets the opposite
        expectation: the section always answers, and sometimes the answer is that fourteen more days are needed.
      </Callout>

      <Button type="button" variant="outline" onClick={() => toast.info("Scroll down · the table below is what will be compared")}>
        See what will be compared
      </Button>
    </div>
  );
}
