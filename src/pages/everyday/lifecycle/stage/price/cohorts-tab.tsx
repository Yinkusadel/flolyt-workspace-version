import { Callout } from "@/pages/everyday/lifecycle/stage/rail";
import { DataTable, type Column } from "@/pages/everyday/lifecycle/stage/data-table";
import { InsightCards } from "@/pages/everyday/lifecycle/stage/activate/insight-cards";
import { EYEBROW_CLASS } from "@/pages/everyday/lifecycle/data";
import { PRICE_COHORT_CAUSE_CARDS, PRICE_COHORT_ROWS, type PriceCohortRow } from "@/pages/everyday/lifecycle/stage/price/data";

const TONE_CLASS: Record<"teal" | "rose" | "neutral", string> = { teal: "text-teal", rose: "text-rose", neutral: "text-ink-4" };

const COLUMNS: Column<PriceCohortRow>[] = [
  { key: "cohort", header: "Cohort", render: (row) => <span className="font-semibold text-ink-2">{row.cohort}</span> },
  { key: "customers", header: "Customers", align: "right", render: (row) => <span className="font-mono text-ink">{row.customers}</span> },
  { key: "revenuePerCustomer", header: "Revenue per customer", align: "right", render: (row) => <span className={TONE_CLASS[row.revenueTone]}>{row.revenuePerCustomer}</span> },
  { key: "discountedShare", header: "Discounted share", align: "right", render: (row) => <span className={TONE_CLASS[row.discountedTone]}>{row.discountedShare}</span> },
  { key: "onPaidPlan", header: "On a paid plan", align: "right", render: (row) => <span className={TONE_CLASS[row.onPaidPlanTone]}>{row.onPaidPlan}</span> },
  { key: "vsFeb", header: "vs Feb", align: "right", render: (row) => <span className={TONE_CLASS[row.vsFebTone]}>{row.vsFeb}</span> },
];

/**
 * PR07 — Price's Cohorts tab (stage-specific layout, not the shared
 * CohortsTab template — PR07's columns are revenue/discount/plan-mix, not
 * Acquire's CAC/day30-90, confirmed by reading PR07 directly).
 */
const PriceCohortsTab = () => {
  return (
    <div className="space-y-8">
      <section className="space-y-3">
        <p className={EYEBROW_CLASS}>Revenue per customer by acquisition cohort · 90 days after acquisition</p>
        <DataTable columns={COLUMNS} rows={PRICE_COHORT_ROWS} />
      </section>

      <section className="space-y-4">
        <p className={EYEBROW_CLASS}>Two things moved together and only one of them is about price</p>
        <InsightCards cards={PRICE_COHORT_CAUSE_CARDS} />
      </section>

      <Callout tone="ultra" title="Discounting harder was a reasonable response and it made one number worse">
        Nobody made a mistake here. Volume fell, Marketing had a lever, and the lever worked on volume. The cost
        showed up in a different stage, on a different team&apos;s screen, one quarter later — which is the whole
        reason these ten stages sit on one page.
      </Callout>
    </div>
  );
};

export default PriceCohortsTab;
