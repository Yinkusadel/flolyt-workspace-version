import { Link, useParams } from "react-router-dom";

import { DetailDrilldown } from "@/pages/lifecycle/stage/detail/detail-drilldown";
import { useStageContext } from "@/pages/lifecycle/stage/layout";
import { PRICE_PLAN_DETAILS } from "@/pages/lifecycle/stage/price/data";

/** PR04 — Price's "one plan" drilldown, e.g. /lifecycle/price/plans/legacy-unlimited. */
const PricePlanDetailRoute = () => {
  const { stage } = useStageContext();
  const { id } = useParams();
  const detail = id ? PRICE_PLAN_DETAILS[id] : undefined;

  if (!detail) {
    return (
      <div className="rounded-card border border-dashed border-line bg-paper p-10 text-center">
        <p className="text-[13px] font-semibold text-ink">Plan not found</p>
        <Link
          to={`/lifecycle/${stage.slug}/plans`}
          className="mt-4 inline-block text-[11.5px] font-semibold text-ultra hover:underline"
        >
          Back to plans
        </Link>
      </div>
    );
  }

  return (
    <DetailDrilldown
      crumbs={[
        { label: "Lifecycle", to: "/lifecycle" },
        { label: stage.name, to: `/lifecycle/${stage.slug}` },
        { label: "Plans", to: `/lifecycle/${stage.slug}/plans` },
        { label: detail.plan },
      ]}
      title={detail.plan}
      subtitle={detail.headline}
      eyebrow={detail.eyebrow}
      kpis={detail.kpis}
      checkedRows={detail.checkedRows}
      causeTitle={detail.causeTitle}
      causeBody={detail.causeBody}
      actionsEyebrow="Why this has not been decided"
      actionCards={detail.actionCards}
    />
  );
};

export default PricePlanDetailRoute;
