import { EYEBROW_CLASS } from "@/pages/everyday/lifecycle/data";
import { Callout } from "@/pages/everyday/lifecycle/stage/rail";
import { KpiCards } from "@/pages/everyday/lifecycle/stage/kpi-cards";
import { GovernanceTabs } from "@/pages/agents/governance/tabs";
import { GovernanceKvList } from "@/pages/agents/governance/kv-list";
import { GV02_ENTRY, GV02_KV, GV02_STATS, GV_KPI_TONE } from "@/pages/agents/governance/data";

/** GV02 — the log's first entry. Wired but unreachable with GOVERNANCE_STATE's current default. */
export function FirstEntryState() {
  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-[17px] font-semibold text-ink">Governance</h1>
        <p className="mt-1 text-[11.5px] text-ink-3">1 entry · written 12 December, 22:04</p>
      </div>

      <GovernanceTabs active="The log" />

      <div className="relative overflow-hidden rounded-card border border-line bg-paper-2 p-5">
        <p className="font-mono text-[8.5px] font-medium tracking-[0.9px] text-ink-4 uppercase">{GV02_ENTRY.meta}</p>
        <p className="mt-2.5 font-mono text-[12px] font-semibold text-ink">{GV02_ENTRY.line1}</p>
        <p className="mt-1.5 font-mono text-[10px] text-ink-4">{GV02_ENTRY.line2}</p>
      </div>

      <KpiCards items={GV02_STATS.map((s) => ({ eyebrow: s.eyebrow, value: s.value, note: s.note, tone: GV_KPI_TONE[s.tone] }))} />

      <section className="space-y-3">
        <p className={EYEBROW_CLASS}>What the first entry establishes about every one after it</p>
        <GovernanceKvList rows={GV02_KV} />
      </section>

      <Callout tone="ultra" title="The log is sequential so that a missing entry is louder than a bad one">
        Entries are numbered without gaps. Removing one leaves a hole, and a hole in a numbered sequence is the
        single easiest thing in the world to notice. That is a cheaper guarantee than any amount of
        tamper-proofing and it is the reason the numbers are on the screen rather than hidden behind the timestamp.
      </Callout>
    </div>
  );
}
