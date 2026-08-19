import { useState } from "react";
import { Link, useParams } from "react-router-dom";

import { Button } from "@/components/ui/button";
import { Callout } from "@/pages/everyday/lifecycle/stage/rail";
import { DataTable, type Column } from "@/pages/everyday/lifecycle/stage/data-table";
import { KpiCards } from "@/pages/everyday/lifecycle/stage/kpi-cards";
import { OpenARoomModal } from "@/pages/everyday/lifecycle/stage/modals/open-a-room-modal";
import { useStageContext } from "@/pages/everyday/lifecycle/stage/layout";
import { StageSubpageHeader } from "@/pages/everyday/lifecycle/stage/stage-subpage-header";
import { EYEBROW_CLASS } from "@/pages/everyday/lifecycle/data";
import {
  ADVOCATE_REFERRER_GROUP_DETAILS,
  ADVOCATE_REFERRER_GROUP_OPEN_ROOM_PRESET,
  type AdvocateTradeRow,
} from "@/pages/everyday/lifecycle/stage/advocate/data";

const WHO_RIGHT_TONE_CLASS: Record<AdvocateTradeRow["whoRightTone"], string> = { amber: "text-amber", teal: "text-teal", rose: "text-rose" };

const COLUMNS: Column<AdvocateTradeRow>[] = [
  { key: "label", header: "", render: (row) => <span className="font-semibold text-ink-2">{row.label}</span> },
  { key: "priceReading", header: "Price's reading", align: "right", render: (row) => <span className={row.priceReading === "Unavailable" ? "font-mono text-ink-4" : "text-ink-2"}>{row.priceReading}</span> },
  { key: "advocateReading", header: "Advocate's reading", align: "right", render: (row) => <span className={row.advocateReading === "Unavailable" ? "font-mono text-ink-4" : "text-ink-2"}>{row.advocateReading}</span> },
  { key: "whoRight", header: "Who is right", align: "right", render: (row) => <span className={WHO_RIGHT_TONE_CLASS[row.whoRightTone]}>{row.whoRight}</span> },
];

/**
 * AV13 — Advocate's "one referrer group" drilldown, e.g.
 * /lifecycle/advocate/referrers/legacy-unlimited-holders. Not the generic
 * DetailDrilldown template: AV13 is a two-column "Price's reading vs
 * Advocate's reading" comparison table rather than a checked-rows table +
 * action cards, confirmed by reading AV13 directly. Reached from the
 * Referrers tab's "Legacy Unlimited holders" row and the Overview leak
 * table's matching row.
 */
const AdvocateOneReferrerGroupRoute = () => {
  const { stage } = useStageContext();
  const { id } = useParams();
  const detail = id ? ADVOCATE_REFERRER_GROUP_DETAILS[id] : undefined;
  const [openRoom, setOpenRoom] = useState(false);

  if (!detail) {
    return (
      <div className="rounded-card border border-dashed border-line bg-paper p-10 text-center">
        <p className="text-[13px] font-semibold text-ink">Referrer group not found</p>
        <Link to={`/lifecycle/${stage.slug}/referrers`} className="mt-4 inline-block text-[11.5px] font-semibold text-ultra hover:underline">
          Back to referrers
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
          { label: "Referrers", to: `/lifecycle/${stage.slug}/referrers` },
          { label: detail.title },
        ]}
        title={detail.title}
        subtitle={detail.subtitle}
        action={
          <Button type="button" size="sm" onClick={() => setOpenRoom(true)}>
            Open a war room
          </Button>
        }
      />

      <KpiCards items={detail.kpis} />

      <Callout tone="amber" title={detail.warningTitle}>
        {detail.warningBody}
      </Callout>

      <section className="space-y-3">
        <p className={EYEBROW_CLASS}>{detail.tradeEyebrow}</p>
        <DataTable columns={COLUMNS} rows={detail.tradeRows} />
      </section>

      <Callout tone="rose" title={detail.closingTitle}>
        {detail.closingBody}
      </Callout>

      <OpenARoomModal preset={ADVOCATE_REFERRER_GROUP_OPEN_ROOM_PRESET} open={openRoom} onOpenChange={setOpenRoom} />
    </div>
  );
};

export default AdvocateOneReferrerGroupRoute;
