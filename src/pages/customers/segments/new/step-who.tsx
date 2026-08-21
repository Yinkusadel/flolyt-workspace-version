import { EYEBROW_CLASS } from "@/pages/everyday/lifecycle/data";
import { Callout } from "@/pages/everyday/lifecycle/stage/rail";
import { KpiCards } from "@/pages/everyday/lifecycle/stage/kpi-cards";
import { SegmentsKvList } from "@/pages/customers/segments/kv-list";
import { SG09_KV_ROWS, SG09_STATS, SG_KPI_TONE } from "@/pages/customers/segments/data";

/** SG09 — step 1, "Who is in it". */
export function StepWho() {
  return (
    <div className="space-y-8">
      <section className="space-y-3">
        <p className={EYEBROW_CLASS}>Who is in it</p>
        <div className="rounded-card border border-line bg-white p-4">
          <p className="text-[12.5px] font-semibold text-ink">Used one feature or none, thirty days after signing up</p>
          <p className="mt-2 font-mono text-[10px] text-ink-4">
            `customers` · signup_at, feature_events · all four markets
          </p>
        </div>
      </section>

      <KpiCards items={SG09_STATS.map((s) => ({ eyebrow: s.eyebrow, value: s.value, note: s.note, tone: SG_KPI_TONE[s.tone] }))} />

      <section className="space-y-3">
        <p className={EYEBROW_CLASS}>What this segment would be worth knowing about</p>
        <SegmentsKvList rows={SG09_KV_ROWS} />
      </section>

      <Callout tone="amber" title="You are about to define the largest actionable group nobody owns">
        162,000 people, the strongest behavioural signal in the workspace, and no stage owner to hand it to.
        Defining it is still worth doing — an unused segment with a name is easier to argue about in a meeting than
        a finding sitting inside an agent. The next step will ask you to say what it is for, and “nothing yet” is an
        accepted answer.
      </Callout>
    </div>
  );
}
