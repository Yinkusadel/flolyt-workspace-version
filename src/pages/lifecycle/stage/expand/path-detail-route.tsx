import { Link, useParams } from "react-router-dom";

import { Button } from "@/components/ui/button";
import { Callout } from "@/pages/lifecycle/stage/rail";
import { Chip } from "@/pages/lifecycle/stage/chip";
import { DataTable, type Column } from "@/pages/lifecycle/stage/data-table";
import { KpiCards } from "@/pages/lifecycle/stage/kpi-cards";
import { InsightCards } from "@/pages/lifecycle/stage/activate/insight-cards";
import { useStageContext } from "@/pages/lifecycle/stage/layout";
import { StageSubpageHeader } from "@/pages/lifecycle/stage/stage-subpage-header";
import { EYEBROW_CLASS } from "@/pages/lifecycle/data";
import { EXPAND_UPGRADE_PATH_DETAILS, type UpgradePathDetailRow } from "@/pages/lifecycle/stage/expand/data";

const WOULD_PAY_TONE_CLASS: Record<UpgradePathDetailRow["wouldPayTone"], string> = { teal: "text-teal", rose: "text-rose" };
const SAVES_TONE_CLASS: Record<UpgradePathDetailRow["savesTone"], string> = { teal: "text-teal", neutral: "text-ink-4" };
const UPGRADED_TONE_CLASS: Record<UpgradePathDetailRow["upgradedTone"], string> = { teal: "text-teal", amber: "text-amber", rose: "text-rose", neutral: "text-ink-4" };

const COLUMNS: Column<UpgradePathDetailRow>[] = [
  { key: "ordersPerMonth", header: "Orders per month", render: (row) => <span className="font-semibold text-ink-2">{row.ordersPerMonth}</span> },
  { key: "customers", header: "Customers", align: "right", render: (row) => <span className="font-mono text-ink">{row.customers}</span> },
  { key: "paysNow", header: "Pays now", align: "right", render: (row) => <span className="font-mono text-ink">{row.paysNow}</span> },
  { key: "wouldPay", header: "Would pay", align: "right", render: (row) => <span className={WOULD_PAY_TONE_CLASS[row.wouldPayTone]}>{row.wouldPay}</span> },
  { key: "saves", header: "Saves", align: "right", render: (row) => <span className={SAVES_TONE_CLASS[row.savesTone]}>{row.saves}</span> },
  { key: "upgraded", header: "Upgraded?", align: "right", render: (row) => <span className={UPGRADED_TONE_CLASS[row.upgradedTone]}>{row.upgraded}</span> },
  { key: "everPrompted", header: "Ever prompted?", align: "right", render: (row) => <Chip tone={row.everPromptedTone}>{row.everPrompted}</Chip> },
];

/**
 * EX04 — Expand's "one upgrade path" drilldown, e.g.
 * /lifecycle/expand/upgrade-paths/pay-as-you-go-lagos-plus. Not the generic
 * DetailDrilldown template: EX04 has an orders-per-month breakdown table
 * and a 3-card "what a prompt would be worth" section instead of a
 * checked-rows table and action cards, confirmed by reading EX04 directly.
 */
const ExpandPathDetailRoute = () => {
  const { stage } = useStageContext();
  const { id } = useParams();
  const detail = id ? EXPAND_UPGRADE_PATH_DETAILS[id] : undefined;

  if (!detail) {
    return (
      <div className="rounded-card border border-dashed border-line bg-paper p-10 text-center">
        <p className="text-[13px] font-semibold text-ink">Upgrade path not found</p>
        <Link
          to={`/lifecycle/${stage.slug}/upgrade-paths`}
          className="mt-4 inline-block text-[11.5px] font-semibold text-ultra hover:underline"
        >
          Back to upgrade paths
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
          { label: "Upgrade paths", to: `/lifecycle/${stage.slug}/upgrade-paths` },
          { label: detail.fromTo },
        ]}
        title={detail.fromTo}
        subtitle={detail.headline}
        action={
          <Button type="button" size="sm">
            Open a war room
          </Button>
        }
      />

      <KpiCards items={detail.kpis} />

      <section className="space-y-3">
        <p className={EYEBROW_CLASS}>{detail.tableEyebrow}</p>
        <DataTable columns={COLUMNS} rows={detail.rows} />
      </section>

      <Callout tone="rose" title={detail.closingTitle}>
        {detail.closingBody}
      </Callout>

      <section className="space-y-4">
        <p className={EYEBROW_CLASS}>{detail.cardsEyebrow}</p>
        <InsightCards cards={detail.cards} />
      </section>
    </div>
  );
};

export default ExpandPathDetailRoute;
