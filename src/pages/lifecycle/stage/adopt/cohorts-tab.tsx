import { Callout } from "@/pages/lifecycle/stage/rail";
import { DataTable, type Column } from "@/pages/lifecycle/stage/data-table";
import { InsightCards } from "@/pages/lifecycle/stage/activate/insight-cards";
import { EYEBROW_CLASS } from "@/pages/lifecycle/data";
import { ADOPT_COHORT_CAUSE_CARDS, ADOPT_COHORT_ROWS, type AdoptCohortRow } from "@/pages/lifecycle/stage/adopt/data";

const TONE_CLASS: Record<"teal" | "rose" | "neutral", string> = { teal: "text-teal", rose: "text-rose", neutral: "text-ink-4" };

const COLUMNS: Column<AdoptCohortRow>[] = [
  { key: "cohort", header: "Cohort", render: (row) => <span className="font-semibold text-ink-2">{row.cohort}</span> },
  { key: "eligible", header: "Eligible", align: "right", render: (row) => <span className="font-mono text-ink">{row.eligible}</span> },
  { key: "twoPlusFeatures", header: "2+ features", align: "right", render: (row) => <span className="font-mono text-ink">{row.twoPlusFeatures}</span> },
  { key: "rate", header: "Rate", align: "right", render: (row) => <span className={TONE_CLASS[row.rateTone]}>{row.rate}</span> },
  { key: "avgFeatures", header: "Avg features", align: "right", render: (row) => <span className={TONE_CLASS[row.avgFeaturesTone]}>{row.avgFeatures}</span> },
  { key: "scheduledDelivery", header: "Scheduled delivery", align: "right", render: (row) => <span className={TONE_CLASS[row.scheduledTone]}>{row.scheduledDelivery}</span> },
  { key: "vsFeb", header: "vs Feb", align: "right", render: (row) => <span className={TONE_CLASS[row.vsFebTone]}>{row.vsFeb}</span> },
];

/**
 * AD07 — Adopt's Cohorts tab (stage-specific layout, not the shared
 * CohortsTab template — AD07's columns are eligible/2+features/scheduled
 * delivery, not Acquire's CAC/day30-90, confirmed by reading AD07 directly).
 */
const AdoptCohortsTab = () => {
  return (
    <div className="space-y-8">
      <section className="space-y-3">
        <p className={EYEBROW_CLASS}>Feature adoption by acquisition cohort · measured at 90 days</p>
        <DataTable columns={COLUMNS} rows={ADOPT_COHORT_ROWS} />
      </section>

      <Callout tone="ultra" title="Scheduled delivery adoption halved and the overall rate only fell 6.7 points">
        Because the other five features held. This stage lost one feature, not all of them — and it happens to be
        the feature most correlated with staying. An average of 2.1 hides that the composition changed, not just
        the count.
      </Callout>

      <section className="space-y-4">
        <p className={EYEBROW_CLASS}>Where the −6.7 comes from</p>
        <InsightCards cards={ADOPT_COHORT_CAUSE_CARDS} />
      </section>
    </div>
  );
};

export default AdoptCohortsTab;
