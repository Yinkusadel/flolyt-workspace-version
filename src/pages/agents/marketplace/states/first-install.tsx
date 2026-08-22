import { PersonAvatar } from "@/components/person-avatar";
import { EYEBROW_CLASS } from "@/pages/everyday/lifecycle/data";
import { Callout } from "@/pages/everyday/lifecycle/stage/rail";
import { KpiCards } from "@/pages/everyday/lifecycle/stage/kpi-cards";
import { MK02_ROWS, MK02_STATS, MK_KPI_TONE, MK_TONE_CLASS } from "@/pages/agents/marketplace/data";

/** MK02 — the first marketplace install's first days. Wired but unreachable with MARKETPLACE_STATE's current default. */
export function FirstInstallState() {
  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-[17px] font-semibold text-ink">Marketplace</h1>
        <p className="mt-1 text-[11.5px] text-ink-3">One installed · nine nights of silence, then the contaminated holdout</p>
      </div>

      <div className="relative overflow-hidden rounded-card border border-teal-border bg-teal-bg p-5">
        <div className="flex items-start gap-3.5">
          <PersonAvatar kind="agent" initials="AS" />
          <div className="min-w-0">
            <p className="text-[14px] font-semibold text-ink">
              Attribution Signal arrived from a partner and found nothing for nine days
            </p>
            <p className="mt-1.5 text-[11px] text-ink-2">
              It checks every send against every hold list, nightly. For nine nights it read the lists and said
              nothing, because nothing was wrong.
            </p>
            <p className="mt-1.5 text-[11px] font-semibold text-teal">
              On the tenth night it found 1,204 held customers who had been sent to anyway.
            </p>
          </div>
        </div>
      </div>

      <KpiCards items={MK02_STATS.map((s) => ({ eyebrow: s.eyebrow, value: s.value, note: s.note, tone: MK_KPI_TONE[s.tone] }))} />

      <section className="space-y-3">
        <p className={EYEBROW_CLASS}>What was known about it before installing, and what was not</p>
        <div className="overflow-x-auto rounded-card border border-line bg-paper">
          <table className="w-full min-w-[720px] text-left text-[11.5px]">
            <thead>
              <tr className="border-b border-line bg-paper-2">
                <th className="px-4 py-2.5 font-mono text-[8.5px] font-medium tracking-[0.8px] text-ink-4 uppercase">Known</th>
                <th className="px-4 py-2.5 font-mono text-[8.5px] font-medium tracking-[0.8px] text-ink-4 uppercase">Not known</th>
                <th className="px-4 py-2.5 text-right font-mono text-[8.5px] font-medium tracking-[0.8px] text-ink-4 uppercase">Why not</th>
              </tr>
            </thead>
            <tbody>
              {MK02_ROWS.map((row) => (
                <tr key={row.known} className="border-b border-line last:border-0">
                  <td className="px-4 py-3 text-ink-2">{row.known}</td>
                  <td className="px-4 py-3 text-ink-2">{row.notKnown}</td>
                  <td className={`px-4 py-3 text-right ${MK_TONE_CLASS[row.whyNotTone]}`}>{row.whyNot}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      <Callout tone="ultra" title="Fourteen days and one finding, and the finding was worth the install on its own">
        It caught the resend that contaminated the reactivation holdout, fourteen hours after it happened, by
        comparing lists nobody had thought to compare. Nine nights of silence before it is the shape of a working
        agent — and none of that could have been known in advance from a marketplace listing, which is why the
        listing does not pretend.
      </Callout>
    </div>
  );
}
