import { Link, useParams } from "react-router-dom";

import { Button } from "@/components/ui/button";
import { WideBarRow } from "@/pages/everyday/lifecycle/stage/bar";
import { Callout } from "@/pages/everyday/lifecycle/stage/rail";
import { DataTable, type Column } from "@/pages/everyday/lifecycle/stage/data-table";
import { KpiCards } from "@/pages/everyday/lifecycle/stage/kpi-cards";
import { useStageContext } from "@/pages/everyday/lifecycle/stage/layout";
import { StageSubpageHeader } from "@/pages/everyday/lifecycle/stage/stage-subpage-header";
import { EYEBROW_CLASS } from "@/pages/everyday/lifecycle/data";
import { ADOPT_FEATURE_DETAILS, type AdoptOutcomeRow } from "@/pages/everyday/lifecycle/stage/adopt/data";

const ORDERS_NOW_TONE_CLASS: Record<AdoptOutcomeRow["ordersNowTone"], string> = { ink: "text-ink-4", teal: "text-teal", amber: "text-amber", rose: "text-rose" };
const STILL_CUSTOMER_TONE_CLASS: Record<AdoptOutcomeRow["stillCustomerTone"], string> = { ink: "text-ink-4", teal: "text-teal", amber: "text-amber", rose: "text-rose" };

const COLUMNS: Column<AdoptOutcomeRow>[] = [
  { key: "whatTheyDidInstead", header: "What they did instead", render: (row) => <span className="font-semibold text-ink-2">{row.whatTheyDidInstead}</span> },
  { key: "customers", header: "Customers", align: "right", render: (row) => <span className="font-mono text-ink">{row.customers}</span> },
  { key: "ordersPerMonthNow", header: "Orders / month now", align: "right", render: (row) => <span className={`font-mono ${ORDERS_NOW_TONE_CLASS[row.ordersNowTone]}`}>{row.ordersPerMonthNow}</span> },
  { key: "was", header: "Was", align: "right", render: (row) => <span className="font-mono text-ink">{row.was}</span> },
  { key: "stillCustomer90d", header: "Still a customer at 90 days", align: "right", render: (row) => <span className={STILL_CUSTOMER_TONE_CLASS[row.stillCustomerTone]}>{row.stillCustomer90d}</span> },
];

/**
 * AD04 — Adopt's "one feature" drilldown, e.g. /lifecycle/adopt/features/scheduled-delivery.
 * Not the generic DetailDrilldown template: AD04 has a friction bar-chart
 * section and an outcomes table instead of a checked-rows table and action
 * cards, confirmed by reading AD04 directly.
 */
const AdoptFeatureDetailRoute = () => {
  const { stage } = useStageContext();
  const { id } = useParams();
  const detail = id ? ADOPT_FEATURE_DETAILS[id] : undefined;

  if (!detail) {
    return (
      <div className="rounded-card border border-dashed border-line bg-paper p-10 text-center">
        <p className="text-[13px] font-semibold text-ink">Feature not found</p>
        <Link
          to={`/lifecycle/${stage.slug}/features`}
          className="mt-4 inline-block text-[11.5px] font-semibold text-ultra hover:underline"
        >
          Back to features
        </Link>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <StageSubpageHeader
        crumbs={[
          { label: "Lifecycle", to: "/lifecycle" },
          { label: stage.name, to: `/lifecycle/${stage.slug}` },
          { label: "Features", to: `/lifecycle/${stage.slug}/features` },
          { label: detail.feature },
        ]}
        title={detail.feature}
        subtitle={detail.headline}
        action={
          <Button type="button" size="sm">
            Open a war room
          </Button>
        }
      />

      <KpiCards items={detail.kpis} />

      <section className="space-y-4">
        <p className={EYEBROW_CLASS}>{detail.frictionEyebrow}</p>
        <div className="space-y-5">
          {detail.frictionRows.map((row) => (
            <WideBarRow key={row.label} label={row.label} value={row.value} percent={row.percent} tone={row.tone} />
          ))}
        </div>
      </section>

      <Callout tone="rose" title={detail.frictionCauseTitle}>
        {detail.frictionCauseBody}
      </Callout>

      <section className="space-y-3">
        <p className={EYEBROW_CLASS}>{detail.outcomeEyebrow}</p>
        <DataTable columns={COLUMNS} rows={detail.outcomeRows} />
      </section>

      <Callout tone="rose" title={detail.closingTitle}>
        {detail.closingBody}
      </Callout>
    </div>
  );
};

export default AdoptFeatureDetailRoute;
