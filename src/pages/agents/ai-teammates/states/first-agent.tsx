import { PersonAvatar } from "@/components/person-avatar";
import { EYEBROW_CLASS } from "@/pages/everyday/lifecycle/data";
import { Callout } from "@/pages/everyday/lifecycle/stage/rail";
import { KpiCards } from "@/pages/everyday/lifecycle/stage/kpi-cards";
import { TeammatesKvList } from "@/pages/agents/ai-teammates/kv-list";
import { RD, TM02_KV, TM02_STATS, TM_KPI_TONE } from "@/pages/agents/ai-teammates/data";

/** TM02 — the first agent's first read, holding a pattern with no baseline yet. Wired but unreachable with TEAMMATES_STATE's current default. */
export function FirstAgentState() {
  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-[17px] font-semibold text-ink">AI Teammates</h1>
        <p className="mt-1 text-[11.5px] text-ink-3">4.2M rows read · zero findings · the first thing it says is that it cannot tell yet</p>
      </div>

      <div className="relative overflow-hidden rounded-card border border-ultra-border bg-ultra-bg p-5">
        <div className="flex items-start gap-3.5">
          <PersonAvatar kind="agent" initials={RD.initials} />
          <div className="min-w-0">
            <p className="text-[14px] font-semibold text-ink">
              Repeat & Decay has read eighteen months of orders and will not say anything yet
            </p>
            <p className="mt-1.5 text-[11px] text-ink-2">
              1.24M orders, 4.2M rows, three hours of reading. It has found a pattern in the second-order curve and
              is holding it, because there is no baseline to compare against until 1 January.
            </p>
            <p className="mt-1.5 text-[11px] font-semibold text-ultra">
              Its first message in this workspace is that it cannot tell you anything yet.
            </p>
          </div>
        </div>
      </div>

      <KpiCards items={TM02_STATS.map((s) => ({ eyebrow: s.eyebrow, value: s.value, note: s.note, tone: TM_KPI_TONE[s.tone] }))} />

      <section className="space-y-3">
        <p className={EYEBROW_CLASS}>What it is holding, and why</p>
        <TeammatesKvList rows={TM02_KV} />
      </section>

      <Callout tone="ultra" title="An agent's first useful act in this workspace is refusing to produce a finding">
        It has a pattern, three hours of reading behind it, and nobody watching would have questioned a confident
        sentence about the ninety-day curve. It is holding because a finding without a baseline is a number with no
        denominator, and the whole workspace would have started with one.
      </Callout>
    </div>
  );
}
