import { Callout } from "@/pages/everyday/lifecycle/stage/rail";
import { KpiCards } from "@/pages/everyday/lifecycle/stage/kpi-cards";
import { EYEBROW_CLASS } from "@/pages/everyday/lifecycle/data";
import { PersonDot } from "@/pages/everyday/rooms/actor";
import { PlaybooksKvList } from "@/pages/knowledge/playbooks/kv-list";
import { PB02_ADDS_ROWS, PB02_HERO, PB02_NOTE, PB02_STATS, PB_KPI_TONE } from "@/pages/knowledge/playbooks/data";

/** PB02 — the first playbook, written after a second run. Wired but unreachable with PLAYBOOKS_STATE's current default. */
export function FirstPlaybookState() {
  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-[17px] font-semibold text-ink">Playbooks</h1>
        <p className="mt-1 text-[11.5px] text-ink-3">Two runs, two holdouts, 1.2 points apart · and one market it refuses</p>
      </div>

      <div className="rounded-card border border-teal-border bg-teal-bg p-5">
        <div className="flex items-start gap-3">
          <PersonDot person={PB02_HERO.person} />
          <div>
            <p className="text-[13px] font-semibold text-ink">{PB02_HERO.title}</p>
            <p className="mt-1.5 text-[11px] leading-relaxed text-ink-3">{PB02_HERO.body}</p>
            <p className="mt-2 text-[11px] font-semibold text-teal">{PB02_HERO.highlight}</p>
          </div>
        </div>
      </div>

      <KpiCards items={PB02_STATS.map((s) => ({ eyebrow: s.eyebrow, value: s.value, note: s.note, tone: PB_KPI_TONE[s.tone] }))} />

      <section className="space-y-3">
        <p className={EYEBROW_CLASS}>What being a playbook adds to being a play that worked</p>
        <PlaybooksKvList rows={PB02_ADDS_ROWS} />
      </section>

      <Callout tone="ultra" title="The first playbook is also the first thing in the workspace that says no on its own">
        {PB02_NOTE}
      </Callout>
    </div>
  );
}
