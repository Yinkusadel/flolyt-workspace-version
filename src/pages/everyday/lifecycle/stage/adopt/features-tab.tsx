import { Link } from "react-router-dom";

import { Chip } from "@/pages/everyday/lifecycle/stage/chip";
import { DataTable, type Column } from "@/pages/everyday/lifecycle/stage/data-table";
import { InsightCards } from "@/pages/everyday/lifecycle/stage/activate/insight-cards";
import { EYEBROW_CLASS } from "@/pages/everyday/lifecycle/data";
import { ADOPT_FEATURE_DETAILS, ADOPT_FEATURE_INSIGHT_CARDS, ADOPT_FEATURE_ROWS, type FeatureRow } from "@/pages/everyday/lifecycle/stage/adopt/data";

const USED_TWICE_TONE_CLASS: Record<FeatureRow["usedTwiceTone"], string> = { teal: "text-teal", amber: "text-amber", rose: "text-rose" };
const STILL_USING_TONE_CLASS: Record<FeatureRow["stillUsingTone"], string> = { teal: "text-teal", amber: "text-amber", rose: "text-rose" };
const ORDERS_TONE_CLASS: Record<FeatureRow["ordersTone"], string> = { ink: "text-ink", teal: "text-teal" };

const COLUMNS: Column<FeatureRow>[] = [
  {
    key: "feature",
    header: "Feature",
    render: (row) =>
      ADOPT_FEATURE_DETAILS[row.id] ? (
        <Link to={`/lifecycle/adopt/features/${row.id}`} className="font-semibold text-ultra hover:underline">
          {row.feature}
        </Link>
      ) : (
        <span className="font-semibold text-ink-2">{row.feature}</span>
      ),
  },
  { key: "everUsed", header: "Ever used", align: "right", render: (row) => <span className="font-mono text-ink">{row.everUsed}</span> },
  { key: "usedTwice", header: "Used twice", align: "right", render: (row) => <span className={USED_TWICE_TONE_CLASS[row.usedTwiceTone]}>{row.usedTwice}</span> },
  { key: "stillUsing", header: "Still using", align: "right", render: (row) => <span className={STILL_USING_TONE_CLASS[row.stillUsingTone]}>{row.stillUsing}</span> },
  { key: "ordersPerMonthAfter", header: "Orders / month after", align: "right", render: (row) => <span className={`font-mono ${ORDERS_TONE_CLASS[row.ordersTone]}`}>{row.ordersPerMonthAfter}</span> },
  { key: "shipped", header: "Shipped", align: "right", render: (row) => <span className="font-mono text-ink-4">{row.shipped}</span> },
  { key: "verdict", header: "Verdict", align: "right", render: (row) => <Chip tone={row.verdictTone}>{row.verdict}</Chip> },
];

/** AD03 — Adopt's Features tab, and the list side of the features/:id drilldown (AD04). */
const AdoptFeaturesTab = () => {
  return (
    <div className="space-y-8">
      <DataTable columns={COLUMNS} rows={ADOPT_FEATURE_ROWS} />

      <section className="space-y-3">
        <p className={EYEBROW_CLASS}>The two that are worth an hour each</p>
        <InsightCards cards={ADOPT_FEATURE_INSIGHT_CARDS} />
      </section>
    </div>
  );
};

export default AdoptFeaturesTab;
