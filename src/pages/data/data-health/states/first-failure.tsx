import { PersonAvatar } from "@/components/person-avatar";
import { EYEBROW_CLASS } from "@/pages/everyday/lifecycle/data";
import { Callout } from "@/pages/everyday/lifecycle/stage/rail";
import { KpiCards } from "@/pages/everyday/lifecycle/stage/kpi-cards";
import { DataHealthKvList } from "@/pages/data/data-health/kv-list";
import { DH02_KV, DH02_STATS, DH_KPI_TONE } from "@/pages/data/data-health/data";

/** DH02 — the first failure this workspace ever had. Wired but unreachable with DATA_HEALTH_STATE's current default. */
export function FirstFailureState() {
  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-[17px] font-semibold text-ink">Data health</h1>
        <p className="mt-1 text-[11.5px] text-ink-3">
          Detected in a day, acted on in six weeks, unfixed after 219 · everything worked except the ending
        </p>
      </div>

      <div className="flex items-start gap-4 rounded-card border border-rose-border bg-rose-bg p-5">
        <PersonAvatar kind="agent" initials="DI" />
        <div className="min-w-0">
          <h2 className="text-[14px] font-semibold text-ink">Cost of goods stopped delivering and nobody noticed for six weeks</h2>
          <p className="mt-1.5 text-[11px] text-ink-2">
            The last file arrived on 12 January. Data Integrity flagged it on 13 January, routed it to Sam, and
            nothing happened until Ravi asked why margin was blank in late February.
          </p>
          <p className="mt-1.5 text-[11px] font-semibold text-rose">
            The alert worked. The routing worked. The person had forty-one other things.
          </p>
        </div>
      </div>

      <KpiCards items={DH02_STATS.map((s) => ({ eyebrow: s.eyebrow, value: s.value, note: s.note, tone: DH_KPI_TONE[s.tone] }))} />

      <section className="space-y-3">
        <p className={EYEBROW_CLASS}>What went right and what did not</p>
        <DataHealthKvList rows={DH02_KV} />
      </section>

      <Callout tone="rose" title="The first data failure in this workspace is still the current one">
        Everything the product is supposed to do, it did — within a day, with a name attached and an honest
        Unavailable everywhere the figure would have been. It has been outstanding for seven months, because
        detection and routing are engineering problems and this one is a queue problem, and no health screen has
        ever solved a queue.
      </Callout>
    </div>
  );
}
