import { PersonAvatar } from "@/components/person-avatar";
import { DEPARTMENT_COLORS, EYEBROW_CLASS } from "@/pages/everyday/lifecycle/data";
import { Callout } from "@/pages/everyday/lifecycle/stage/rail";
import { KpiCards } from "@/pages/everyday/lifecycle/stage/kpi-cards";
import { RAVI } from "@/pages/everyday/rooms/data";
import { ExperimentsKvList } from "@/pages/customers/experiments/kv-list";
import { XP02_KV_ROWS, XP02_STATS, EX_KPI_TONE } from "@/pages/customers/experiments/data";

/** XP02 — the first holdout closes, 9 days in. Wired but unreachable with EXPERIMENTS_STATE's current default. */
export function FirstResultState() {
  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-[17px] font-semibold text-ink">Experiments</h1>
        <p className="mt-1 text-[11.5px] text-ink-3">First holdout closed · +45.5 points · pre-registered, and it cost ₦6.9M to learn</p>
      </div>

      <div className="rounded-card border border-teal-border bg-teal-bg p-5">
        <div className="flex items-start gap-3.5">
          <PersonAvatar kind="human" initials={RAVI.initials} style={{ backgroundColor: DEPARTMENT_COLORS[RAVI.department] }} />
          <div className="min-w-0">
            <h2 className="text-[14px] font-semibold text-ink">
              The first experiment closed and it is the only thing in the workspace nobody can argue with
            </h2>
            <p className="mt-1.5 text-[11px] leading-relaxed text-ink-2">
              19,260 customers had their card retried at 09:00 local. 2,140 stayed on the midnight retry. 70.5%
              recovered against 25.0%, over nine days, with n large enough to settle it.
            </p>
            <p className="mt-1.5 text-[11px] font-semibold text-teal">
              The failure condition — below 40% in 72 hours — was written on 24 March, before anybody knew.
            </p>
          </div>
        </div>
      </div>

      <KpiCards items={XP02_STATS.map((s) => ({ eyebrow: s.eyebrow, value: s.value, note: s.note, tone: EX_KPI_TONE[s.tone] }))} />

      <section className="space-y-3">
        <p className={EYEBROW_CLASS}>What this first result made possible, and what it did not</p>
        <ExperimentsKvList rows={XP02_KV_ROWS} />
      </section>

      <Callout tone="ultra" title="Nine days and 2,140 inconvenienced customers bought the strongest number this company has">
        Everything else in the value ledger rests on comparing a period with the period before it, through months
        in which a release was quietly costing ₦7.2M a day. This one rests on a group of people who were there the
        whole time and did not get the thing. That is the entire difference, and it cost a fortnight and a small
        amount of money.
      </Callout>
    </div>
  );
}
