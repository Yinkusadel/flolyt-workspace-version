import { EYEBROW_CLASS } from "@/pages/everyday/lifecycle/data";
import { Callout } from "@/pages/everyday/lifecycle/stage/rail";
import { Chip } from "@/pages/everyday/lifecycle/stage/chip";
import { BenchmarksKvList } from "@/pages/revenue/benchmarks/kv-list";
import { BM12_CHECK_ROWS, BM12_SUMMARY_KV, BM_CHIP_TONE, BM_TONE_CLASS } from "@/pages/revenue/benchmarks/data";

const HEAD_CLASS = "px-4 py-2.5 font-mono text-[8.5px] font-medium tracking-[0.8px] text-ink-4 uppercase";

/** BM12 — step 2 of "Build a comparison": six checks, five pass, one carries a caveat. */
export function StepMatching() {
  return (
    <div className="space-y-8">
      <section className="space-y-3">
        <p className={EYEBROW_CLASS}>Six checks · five pass, one does not</p>
        <div className="overflow-x-auto rounded-card border border-line bg-paper">
          <table className="w-full min-w-[820px] text-left text-[11.5px]">
            <thead>
              <tr className="border-b border-line bg-paper-2">
                <th className={HEAD_CLASS}>Check</th>
                <th className={HEAD_CLASS}>Nigeria</th>
                <th className={HEAD_CLASS}>United Kingdom</th>
                <th className={`${HEAD_CLASS} text-right`}>Match?</th>
                <th className={HEAD_CLASS}>Effect</th>
              </tr>
            </thead>
            <tbody>
              {BM12_CHECK_ROWS.map((row) => (
                <tr key={row.check} className="border-b border-line last:border-0">
                  <td className="px-4 py-3 font-semibold text-ink">{row.check}</td>
                  <td className="px-4 py-3 font-mono text-ink-2">{row.nigeria}</td>
                  <td className="px-4 py-3 font-mono text-ink-2">{row.uk}</td>
                  <td className="px-4 py-3 text-right">
                    <Chip tone={BM_CHIP_TONE[row.matchTone]}>{row.match}</Chip>
                  </td>
                  <td className={`px-4 py-3 ${BM_TONE_CLASS[row.effectTone]}`}>{row.effect}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      <Callout tone="amber" title="The comparison is allowed and it will carry the sample warning wherever it goes">
        2,100 British customers against 831,000 Nigerian ones is a real asymmetry, and it does not invalidate the
        finding — a flat UK line is still a flat UK line. What it does is widen the interval, so the claim is "the
        UK did not move" rather than "the UK is 11.7 points better", and the export carries both sample sizes in
        the same row as the difference.
      </Callout>

      <section className="space-y-3">
        <p className={EYEBROW_CLASS}>What this comparison will say when it is saved</p>
        <div className="max-w-2xl">
          <BenchmarksKvList rows={BM12_SUMMARY_KV} />
        </div>
      </section>
    </div>
  );
}
