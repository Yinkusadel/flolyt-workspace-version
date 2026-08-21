import { Link, useParams } from "react-router-dom";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { EYEBROW_CLASS } from "@/pages/everyday/lifecycle/data";
import { Callout } from "@/pages/everyday/lifecycle/stage/rail";
import { Chip } from "@/pages/everyday/lifecycle/stage/chip";
import { StageSubpageHeader } from "@/pages/everyday/lifecycle/stage/stage-subpage-header";
import { BenchmarksKvList } from "@/pages/revenue/benchmarks/kv-list";
import { BM07_HERO, BM07_KV_ROWS, BM07_ROWS, BM_CHIP_TONE, BM_DETAIL_TITLES, BM_TONE_CLASS } from "@/pages/revenue/benchmarks/data";

const HEAD_CLASS = "px-4 py-2.5 font-mono text-[8.5px] font-medium tracking-[0.8px] text-ink-4 uppercase";

function RepeatRateDetail() {
  return (
    <div className="space-y-8">
      <StageSubpageHeader
        crumbs={[{ label: "Benchmarks", to: "/benchmarks" }, { label: BM_DETAIL_TITLES["repeat-rate"] }]}
        title={BM_DETAIL_TITLES["repeat-rate"]}
        subtitle="Nigeria · held against four reference points, three of which agree and one of which is the accident"
        action={
          <Button type="button" variant="outline" onClick={() => toast.info("Opening the room for this metric")}>
            Open the room
          </Button>
        }
      />

      <div className="relative overflow-hidden rounded-card border border-rose-border bg-rose-bg p-5">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div>
            <p className="font-mono text-[8.5px] font-medium tracking-[0.9px] text-ink-4 uppercase">{BM07_HERO.label}</p>
            <p className="mt-2 text-[26px] font-semibold text-ink">{BM07_HERO.big}</p>
            <p className="mt-1.5 max-w-md text-[11px] text-ink-3">{BM07_HERO.sub}</p>
          </div>
          <div className="text-right">
            <p className="font-mono text-[8.5px] font-medium tracking-[0.9px] text-ink-4 uppercase">{BM07_HERO.rightLab}</p>
            <p className="mt-2 text-[20px] font-semibold text-ink">{BM07_HERO.rightBig}</p>
            <p className="mt-1.5 font-mono text-[10px] font-semibold text-rose">{BM07_HERO.rightSub}</p>
          </div>
        </div>
      </div>

      <section className="space-y-3">
        <p className={EYEBROW_CLASS}>Every reference point, and what each one is worth</p>
        <div className="overflow-x-auto rounded-card border border-line bg-paper">
          <table className="w-full min-w-[900px] text-left text-[11.5px]">
            <thead>
              <tr className="border-b border-line bg-paper-2">
                <th className={HEAD_CLASS}>Compared to</th>
                <th className={`${HEAD_CLASS} text-right`}>Figure</th>
                <th className={`${HEAD_CLASS} text-right`}>Difference</th>
                <th className={HEAD_CLASS}>What it tells you</th>
                <th className={`${HEAD_CLASS} text-right`}>Strength</th>
              </tr>
            </thead>
            <tbody>
              {BM07_ROWS.map((row) => (
                <tr key={row.comparedTo} className="border-b border-line last:border-0">
                  <td className="px-4 py-3 font-semibold text-ink">{row.comparedTo}</td>
                  <td className="px-4 py-3 text-right font-mono text-ink-4">{row.figure}</td>
                  <td className={`px-4 py-3 text-right font-mono ${BM_TONE_CLASS[row.differenceTone]}`}>{row.difference}</td>
                  <td className="px-4 py-3 text-ink-2">{row.tells}</td>
                  <td className="px-4 py-3 text-right">
                    <Chip tone={BM_CHIP_TONE[row.strengthTone]}>{row.strength}</Chip>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      <Callout tone="ultra" title="The third row is the whole finding and the fourth row is the trap">
        The UK sitting flat at 38.9% is the single strongest piece of evidence that the release caused this. Ghana
        at 22.1% is worse than Nigeria and tells you nothing at all, because Ghana is eleven months old,
        differently instrumented and has never had the change. The two rows look almost identical in a table,
        which is exactly why the strength column is not optional.
      </Callout>

      <section className="space-y-3">
        <p className={EYEBROW_CLASS}>What would make this a stronger claim than it is</p>
        <div className="max-w-2xl">
          <BenchmarksKvList rows={BM07_KV_ROWS} />
        </div>
      </section>
    </div>
  );
}

function BenchmarkNotFound() {
  return (
    <div className="rounded-card border border-dashed border-line bg-paper p-10 text-center">
      <p className="text-[13px] font-semibold text-ink">Comparison not found</p>
      <Link to="/benchmarks" className="mt-4 inline-block text-[11.5px] font-semibold text-ultra hover:underline">
        Back to benchmarks
      </Link>
    </div>
  );
}

/** BM07 (disk, `repeat-rate`) — the section's only built `:id` reference row, same "one/two reference rows" pattern as every prior section. */
const RepeatRateDetailRoute = () => {
  const { id } = useParams();

  if (id === "repeat-rate") return <RepeatRateDetail />;
  return <BenchmarkNotFound />;
};

export default RepeatRateDetailRoute;
