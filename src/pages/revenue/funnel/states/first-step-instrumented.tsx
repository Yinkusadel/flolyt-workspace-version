import { PersonAvatar } from "@/components/person-avatar";
import { DEPARTMENT_COLORS, EYEBROW_CLASS } from "@/pages/everyday/lifecycle/data";
import { Callout } from "@/pages/everyday/lifecycle/stage/rail";
import { KpiCards } from "@/pages/everyday/lifecycle/stage/kpi-cards";
import { FunnelKvList } from "@/pages/revenue/funnel/kv-list";
import { FN02_KV_ROWS, FN02_STATS, FN_KPI_TONE, SAM_REF } from "@/pages/revenue/funnel/data";

/** FN02 — the first-run state, one step arrived overnight. Wired but unreachable with FUNNEL_STATE's current default. */
export function FirstStepState() {
  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-[17px] font-semibold text-ink">Funnel</h1>
        <p className="mt-1 text-[11.5px] text-ink-3">4 of 8 steps instrumented · one step arrived overnight</p>
      </div>

      <div className="flex items-start gap-3 rounded-card border border-teal-border bg-teal-bg p-4">
        <PersonAvatar kind="human" initials={SAM_REF.initials} style={{ backgroundColor: DEPARTMENT_COLORS[SAM_REF.department] }} />
        <div>
          <p className="text-[14px] font-semibold text-ink">`signup.started` fired for the first time at 04:20 this morning</p>
          <p className="mt-1.5 text-[11px] text-ink-2">
            Sam shipped it overnight. The funnel now has four of eight steps and, for the first time, a number for
            how many people begin signing up and never finish.
          </p>
          <p className="mt-1.5 text-[11px] font-semibold text-teal">
            84,000 a quarter start and stop. Nobody knew the figure yesterday and nobody had estimated it.
          </p>
        </div>
      </div>

      <KpiCards items={FN02_STATS.map((s) => ({ eyebrow: s.eyebrow, value: s.value, note: s.note, tone: FN_KPI_TONE[s.tone] }))} />

      <section className="space-y-3">
        <p className={EYEBROW_CLASS}>What the new step does and does not tell anyone</p>
        <FunnelKvList rows={FN02_KV_ROWS} />
      </section>

      <Callout tone="ultra" title="A first step arriving is worth less than it feels, and the screen says so on the day">
        Four dark steps remain and they are the four the ₦1.08B argument runs through. This one is genuinely useful
        and it is also the easiest of the five to build, which is why it came first. The temptation on a day like
        this is to treat coverage as momentum; the honest reading is four of eight, with the hard half outstanding.
      </Callout>
    </div>
  );
}
