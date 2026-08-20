import { PersonAvatar } from "@/components/person-avatar";
import { EYEBROW_CLASS } from "@/pages/everyday/lifecycle/data";
import { Callout } from "@/pages/everyday/lifecycle/stage/rail";
import { KpiCards } from "@/pages/everyday/lifecycle/stage/kpi-cards";
import { ADA } from "@/pages/everyday/rooms/data";
import { ScenarioKvList } from "@/pages/revenue/scenario/kv-list";
import { SC02_KV_ROWS, SC02_STATS, SC_KPI_TONE } from "@/pages/revenue/scenario/data";

/** SC02 — the first scenario ever modelled, 40 minutes after saving. Wired but unreachable with SCENARIO_STATE's current default. */
export function TheFirstScenarioState() {
  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-[17px] font-semibold text-ink">Scenario</h1>
        <p className="mt-1 text-[11.5px] text-ink-3">One modelled · ₦188M – ₦512M · a mid-point declined twice</p>
      </div>

      <div className="relative overflow-hidden rounded-card border border-ultra-border bg-ultra-bg p-5">
        <div className="flex items-start gap-3.5">
          <PersonAvatar kind="human" initials={ADA.initials} team={1} />
          <div className="min-w-0">
            <p className="text-[14px] font-semibold text-ink">
              Ada modelled the first scenario and it came back as a range she did not like
            </p>
            <p className="mt-1.5 text-[11px] text-ink-2">
              Reversing the 4 March release in Nigeria and Kenya returns ₦188M to ₦512M over ninety days. The spread
              is ₦324M and two thirds of it comes from one assumption marked 2 of 5.
            </p>
            <p className="mt-1.5 text-[11px] font-semibold text-ultra">
              She asked for a mid-point twice. The screen declined twice, in the same words.
            </p>
          </div>
        </div>
      </div>

      <KpiCards items={SC02_STATS.map((s) => ({ eyebrow: s.eyebrow, value: s.value, note: s.note, tone: SC_KPI_TONE[s.tone] }))} />

      <section className="space-y-3">
        <p className={EYEBROW_CLASS}>What the first scenario established for every one after it</p>
        <ScenarioKvList rows={SC02_KV_ROWS} />
      </section>

      <Callout tone="amber" title="The first thing this tool did was disappoint the person who opened it">
        Ada wanted a figure to take into a meeting on Thursday and got a spread wider than most quarters. That is the
        correct behaviour and it is also the moment a scenario tool is most likely to be abandoned — which is why
        the range is accompanied by what would narrow it, rather than by an apology.
      </Callout>
    </div>
  );
}
