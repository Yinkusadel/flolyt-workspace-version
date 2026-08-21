import { EYEBROW_CLASS } from "@/pages/everyday/lifecycle/data";
import { Callout } from "@/pages/everyday/lifecycle/stage/rail";
import { KpiCards } from "@/pages/everyday/lifecycle/stage/kpi-cards";
import { WideBarRow } from "@/pages/everyday/lifecycle/stage/bar";
import { LeaksTabs } from "@/pages/revenue/leakage-map/tabs";
import { LeaksKvList } from "@/pages/revenue/leakage-map/kv-list";
import { LK13_STAGE_BARS, LK13_WOULD_HELP_ROWS } from "@/pages/revenue/leakage-map/data";

/** LK13 — /leakage-map/detection. */
const DetectionRoute = () => {
  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-[17px] font-semibold text-ink">Leakage map</h1>
        <p className="mt-1 text-[11.5px] text-ink-3">
          How fast the workspace saw it vs how fast it acted · 151 days cause to connection, 4 hours connection to decision
        </p>
      </div>

      <LeaksTabs active="Detection" />

      <KpiCards
        items={[
          { eyebrow: "Cause to first symptom", value: "3 days", tone: "teal", note: "Support, 7 March" },
          { eyebrow: "Cause to correct naming", value: "17 days", tone: "amber", note: "Support only" },
          { eyebrow: "Cause to connection", value: "151 days", tone: "rose", note: "2 August" },
          { eyebrow: "Connection to decision", value: "4 hours", tone: "teal", note: "once in one room" },
        ]}
      />

      <section className="space-y-3">
        <p className={EYEBROW_CLASS}>How long each stage took to see it, and how long to name it</p>
        <div className="space-y-4 rounded-card border border-line bg-paper p-4">
          {LK13_STAGE_BARS.map((row) => (
            <WideBarRow key={row.label} label={row.label} value={row.sub} percent={row.percent} tone={row.tone} />
          ))}
        </div>
      </section>

      <Callout tone="rose" title="Nobody was slow to notice · everybody was slow to connect">
        The longest any desk took to see something wrong was fifteen days. The gap is entirely between seeing and
        joining, and joining took four hours once it happened in one room. This chart is the argument for the whole
        product, and it is also the most damning thing in the workspace, because Flolyt was running for all 151
        days.
      </Callout>

      <section className="space-y-3">
        <p className={EYEBROW_CLASS}>What would have shortened it, in the order it would have helped</p>
        <LeaksKvList rows={LK13_WOULD_HELP_ROWS} />
      </section>
    </div>
  );
};

export default DetectionRoute;
