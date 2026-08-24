import { EYEBROW_CLASS } from "@/pages/everyday/lifecycle/data";
import { Callout } from "@/pages/everyday/lifecycle/stage/rail";
import { DataSourcesHero } from "@/pages/data/data-sources/hero-banner";
import { DS10_CHANGE_ROWS, DS_TONE_CLASS } from "@/pages/data/data-sources/data";

const HEAD_CLASS = "px-4 py-2.5 font-mono text-[8.5px] font-medium tracking-[0.8px] text-ink-4 uppercase";

/** DS10 — step 4, "Review". */
export function StepReview() {
  return (
    <div className="space-y-8">
      <DataSourcesHero
        tone="amber"
        kicker="would unblock"
        value="11 figures"
        desc="Margin across four stages, one paused agent, two scenarios and one blocked playbook. Read-only, four fields, nightly."
        statLabel="would need"
        statValue="Finance"
        statSub="somebody there has to agree"
      />

      <section className="space-y-3">
        <p className={EYEBROW_CLASS}>What connecting this would change, the day after it lands</p>
        <div className="overflow-x-auto rounded-card border border-line bg-paper">
          <table className="w-full min-w-[780px] text-left text-[11.5px]">
            <thead>
              <tr className="border-b border-line bg-paper-2">
                <th className={HEAD_CLASS}>What</th>
                <th className="px-4 py-2.5 text-right font-mono text-[8.5px] font-medium tracking-[0.8px] text-ink-4 uppercase">Now</th>
                <th className="px-4 py-2.5 text-right font-mono text-[8.5px] font-medium tracking-[0.8px] text-ink-4 uppercase">After</th>
                <th className={HEAD_CLASS}>Caveat it carries</th>
              </tr>
            </thead>
            <tbody>
              {DS10_CHANGE_ROWS.map((row) => (
                <tr key={row.what} className="border-b border-line last:border-0">
                  <td className="px-4 py-3 font-semibold text-ink-2">{row.what}</td>
                  <td className={`px-4 py-3 text-right ${DS_TONE_CLASS[row.nowTone]}`}>{row.now}</td>
                  <td className={`px-4 py-3 text-right ${DS_TONE_CLASS[row.afterTone]}`}>{row.after}</td>
                  <td className={`px-4 py-3 ${DS_TONE_CLASS[row.caveatTone]}`}>{row.caveat}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      <Callout tone="rose" title="The last row is the one people are surprised by">
        Cost of goods does not produce a net figure. Engineering time and support cost are still unmeasured, so the
        value ledger will keep refusing to subtract anything from anything. Connecting this unblocks margin and
        does not unblock profit, and saying so now is cheaper than saying it in October.
      </Callout>

      <Callout tone="amber" title="Everything here waits on a conversation rather than on work">
        The wiring is an afternoon. What it needs is somebody at Finance agreeing that Flolyt may read four columns
        of a nightly export, which has been the actual blocker for twenty-one days and is not visible anywhere in a
        queue of engineering tickets.
      </Callout>
    </div>
  );
}
