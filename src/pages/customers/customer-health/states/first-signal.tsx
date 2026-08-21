import { PersonAvatar } from "@/components/person-avatar";
import { EYEBROW_CLASS } from "@/pages/everyday/lifecycle/data";
import { Callout } from "@/pages/everyday/lifecycle/stage/rail";
import { KpiCards } from "@/pages/everyday/lifecycle/stage/kpi-cards";
import { HL02_ROWS, HL02_STATS, HL_AGENT_RD, HL_KPI_TONE, HL_TONE_CLASS } from "@/pages/customers/customer-health/data";

const HEAD_CLASS = "px-4 py-2.5 font-mono text-[8.5px] font-medium tracking-[0.8px] text-ink-4 uppercase";

/** HL02 — the first signal read for the first time. Wired but unreachable with HEALTH_STATE's current default. */
export function FirstSignalState() {
  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-[17px] font-semibold text-ink">Customer health</h1>
        <p className="mt-1 text-[11.5px] text-ink-3">1 of 6 signals reading</p>
      </div>

      <div className="relative overflow-hidden rounded-card border border-ultra-border bg-ultra-bg p-5 pl-6">
        <span className="absolute inset-y-0 left-0 w-1 bg-ultra" aria-hidden />
        <div className="flex items-start gap-3.5">
          <PersonAvatar kind="agent" initials={HL_AGENT_RD.initials} />
          <div>
            <h2 className="text-[14px] font-semibold text-ink">
              Feature depth reads far stronger than anything anybody expected
            </h2>
            <p className="mt-1.5 text-[11px] leading-relaxed text-ink-2">
              Customers who used two features in their first week reorder at 70.2% over ninety days. Customers who
              used none reorder at 12.8%. The gap is 43 points, in every market, in every cohort tested.
            </p>
            <p className="mt-1.5 text-[11px] font-semibold text-ultra">
              It is an association. Nobody has run a test that would make it a cause, and the screen says so.
            </p>
          </div>
        </div>
      </div>

      <KpiCards items={HL02_STATS.map((s) => ({ eyebrow: s.eyebrow, value: s.value, note: s.note, tone: HL_KPI_TONE[s.tone] }))} />

      <section className="space-y-3">
        <p className={EYEBROW_CLASS}>What would turn the strongest signal in the workspace into a cause</p>
        <div className="overflow-x-auto rounded-card border border-line bg-paper">
          <table className="w-full min-w-[760px] text-left text-[11.5px]">
            <thead>
              <tr className="border-b border-line bg-paper-2">
                <th className={HEAD_CLASS}>What it would take</th>
                <th className={`${HEAD_CLASS} text-right`}>How long</th>
                <th className={`${HEAD_CLASS} text-right`}>Cost</th>
                <th className={HEAD_CLASS}>Who could start it</th>
                <th className={`${HEAD_CLASS} text-right`}>Started?</th>
              </tr>
            </thead>
            <tbody>
              {HL02_ROWS.map((row) => (
                <tr key={row.whatItWouldTake} className="border-b border-line last:border-0">
                  <td className="px-4 py-3 text-ink-2">{row.whatItWouldTake}</td>
                  <td className={`px-4 py-3 text-right ${HL_TONE_CLASS[row.howLongTone]}`}>{row.howLong}</td>
                  <td className={`px-4 py-3 text-right ${HL_TONE_CLASS[row.costTone]}`}>{row.cost}</td>
                  <td className="px-4 py-3 text-ink-4">{row.who}</td>
                  <td className={`px-4 py-3 text-right ${HL_TONE_CLASS[row.startedTone]}`}>{row.started}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      <Callout tone="rose" title="The first signal this section produced is also its longest-standing failure">
        43 points is larger than the fee change, larger than referral, larger than channel. It has been readable
        since April, it has never been tested, and the reason is on the last row: doing nothing requires nobody to
        act. This screen exists so that the third option stops being the invisible one.
      </Callout>
    </div>
  );
}
