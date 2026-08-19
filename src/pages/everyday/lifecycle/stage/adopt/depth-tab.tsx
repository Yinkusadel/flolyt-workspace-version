import { WideBarRow } from "@/pages/everyday/lifecycle/stage/bar";
import { Callout } from "@/pages/everyday/lifecycle/stage/rail";
import { Chip } from "@/pages/everyday/lifecycle/stage/chip";
import { DataTable, type Column } from "@/pages/everyday/lifecycle/stage/data-table";
import { EYEBROW_CLASS } from "@/pages/everyday/lifecycle/data";
import { ADOPT_DEPTH_ROWS, ADOPT_SECOND_FEATURE_ROWS, type SecondFeatureRow } from "@/pages/everyday/lifecycle/stage/adopt/data";

const RETENTION_TONE_CLASS: Record<SecondFeatureRow["retentionTone"], string> = { teal: "text-teal", amber: "text-amber" };
const LIFT_TONE_CLASS: Record<SecondFeatureRow["liftTone"], string> = { teal: "text-teal", amber: "text-amber", neutral: "text-ink-4" };
const PROMPTED_CHIP_TONE: Record<SecondFeatureRow["promptedTone"], "teal" | "rose"> = { teal: "teal", rose: "rose" };

const COLUMNS: Column<SecondFeatureRow>[] = [
  { key: "firstFeature", header: "First feature", render: (row) => <span className="font-semibold text-ink-2">{row.firstFeature}</span> },
  { key: "mostCommonSecond", header: "Most common second", render: (row) => <span className="text-ink-2">{row.mostCommonSecond}</span> },
  { key: "customers", header: "Customers", align: "right", render: (row) => <span className="font-mono text-ink">{row.customers}</span> },
  { key: "retentionAt2", header: "Retention at 2 features", align: "right", render: (row) => <span className={RETENTION_TONE_CLASS[row.retentionTone]}>{row.retentionAt2}</span> },
  { key: "liftOver1", header: "Lift over 1", align: "right", render: (row) => <span className={LIFT_TONE_CLASS[row.liftTone]}>{row.liftOver1}</span> },
  { key: "prompted", header: "Prompted?", align: "right", render: (row) => <Chip tone={PROMPTED_CHIP_TONE[row.promptedTone]}>{row.prompted}</Chip> },
];

/** AD05 — Adopt's Depth tab. */
const AdoptDepthTab = () => {
  return (
    <div className="space-y-8">
      <section className="space-y-5">
        <p className={EYEBROW_CLASS}>How many features each customer uses · 1.19M who have ordered twice</p>
        <div className="space-y-5">
          {ADOPT_DEPTH_ROWS.map((row) => (
            <WideBarRow key={row.label} label={row.label} value={row.value} percent={row.percent} tone={row.tone} />
          ))}
        </div>
      </section>

      <Callout tone="ultra" title="Depth is the strongest predictor of retention in this workspace, and it is nobody's goal">
        A customer at two features retains at 61% against 18% at zero. No company goal, no team target and no
        campaign has ever been set on this number. It moves as a side effect of things done for other reasons —
        which is why it fell 0.5 features this quarter without anyone noticing.
      </Callout>

      <section className="space-y-3">
        <p className={EYEBROW_CLASS}>Which second feature matters most</p>
        <DataTable columns={COLUMNS} rows={ADOPT_SECOND_FEATURE_ROWS} />
      </section>

      <Callout tone="amber" title="The two highest-lift second features are the two nobody is prompted toward">
        Scheduled delivery and group ordering give +38 and +45 points of retention. Neither has an in-app prompt.
        Ratings gives +6 and is prompted after every single delivery. Nothing here was decided badly — the prompts
        were built before anyone could see this table.
      </Callout>
    </div>
  );
};

export default AdoptDepthTab;
