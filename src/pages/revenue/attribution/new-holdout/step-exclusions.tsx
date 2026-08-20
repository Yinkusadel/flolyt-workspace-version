import { EYEBROW_CLASS } from "@/pages/everyday/lifecycle/data";
import { Callout } from "@/pages/everyday/lifecycle/stage/rail";
import { Chip } from "@/pages/everyday/lifecycle/stage/chip";
import { AttributionKvList } from "@/pages/revenue/attribution/kv-list";
import { AT12_IMPACT_KV, AT_EXCLUDED_ROWS, AT_TONE_CLASS } from "@/pages/revenue/attribution/data";

const HEAD_CLASS = "px-4 py-2.5 font-mono text-[8.5px] font-medium tracking-[0.8px] text-ink-4 uppercase";

/** AT12 — step 2 of "Design a holdout": who cannot be held back. Reuses AT_EXCLUDED_ROWS from AT05's table, same content in the export. */
export function StepExclusions() {
  return (
    <div className="space-y-8">
      <section className="space-y-3">
        <p className={EYEBROW_CLASS}>Who cannot be held back, and it is not up to you</p>
        <div className="overflow-x-auto rounded-card border border-line bg-paper">
          <table className="w-full min-w-[780px] text-left text-[11.5px]">
            <thead>
              <tr className="border-b border-line bg-paper-2">
                <th className={HEAD_CLASS}>Excluded</th>
                <th className={`${HEAD_CLASS} text-right`}>People</th>
                <th className={HEAD_CLASS}>Why</th>
                <th className={HEAD_CLASS}>Set by</th>
                <th className={`${HEAD_CLASS} text-right`}>Overridable</th>
              </tr>
            </thead>
            <tbody>
              {AT_EXCLUDED_ROWS.map((row) => (
                <tr key={row.group} className="border-b border-line last:border-0">
                  <td className="px-4 py-3 font-semibold text-ink">{row.group}</td>
                  <td className={`px-4 py-3 text-right font-mono ${AT_TONE_CLASS[row.sizeTone]}`}>{row.size}</td>
                  <td className="px-4 py-3 text-ink-2">{row.why}</td>
                  <td className="px-4 py-3 text-ink-4">{row.setBy}</td>
                  <td className="px-4 py-3 text-right">
                    <Chip tone="rose">no</Chip>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      <section className="space-y-3">
        <p className={EYEBROW_CLASS}>What this does to your 2,400</p>
        <AttributionKvList rows={AT12_IMPACT_KV} />
      </section>

      <Callout tone="amber" title="The exclusions cost you five days and the screen does not pretend otherwise">
        Holding fewer people means a slower, blunter answer, and the honest version of that sentence is on the
        screen rather than hidden in a smaller sample size. What is not on offer is the obvious workaround —
        bumping the rate to hold the same headcount — because that quietly puts a larger share of the remaining,
        least-protected customers into the held group.
      </Callout>
    </div>
  );
}
