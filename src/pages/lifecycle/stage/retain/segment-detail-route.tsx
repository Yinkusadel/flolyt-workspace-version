import { Link, useParams } from "react-router-dom";

import { Button } from "@/components/ui/button";
import { WideBarRow } from "@/pages/lifecycle/stage/bar";
import { Callout } from "@/pages/lifecycle/stage/rail";
import { Chip } from "@/pages/lifecycle/stage/chip";
import { DataTable, type Column } from "@/pages/lifecycle/stage/data-table";
import { KpiCards } from "@/pages/lifecycle/stage/kpi-cards";
import { useStageContext } from "@/pages/lifecycle/stage/layout";
import { StageSubpageHeader } from "@/pages/lifecycle/stage/stage-subpage-header";
import { EYEBROW_CLASS } from "@/pages/lifecycle/data";
import { RETAIN_SEGMENT_DETAILS, type RetainSegmentDetailRow } from "@/pages/lifecycle/stage/retain/data";

const REACHABLE_TONE_CLASS: Record<RetainSegmentDetailRow["reachableTone"], string> = { teal: "text-teal", rose: "text-rose" };
const RESPONSE_TONE_CLASS: Record<RetainSegmentDetailRow["expectedResponseTone"], string> = { teal: "text-teal", amber: "text-amber", neutral: "text-ink-4" };
const RECOVERABLE_TONE_CLASS: Record<RetainSegmentDetailRow["recoverableValueTone"], string> = { teal: "text-teal", amber: "text-amber", rose: "text-rose" };

const COLUMNS: Column<RetainSegmentDetailRow>[] = [
  { key: "subSegment", header: "Sub-segment", render: (row) => <span className="font-semibold text-ink-2">{row.subSegment}</span> },
  { key: "customers", header: "Customers", align: "right", render: (row) => <span className="font-mono text-ink">{row.customers}</span> },
  { key: "reachable", header: "Reachable", align: "right", render: (row) => <span className={REACHABLE_TONE_CLASS[row.reachableTone]}>{row.reachable}</span> },
  { key: "expectedResponse", header: "Expected response", align: "right", render: (row) => <span className={RESPONSE_TONE_CLASS[row.expectedResponseTone]}>{row.expectedResponse}</span> },
  { key: "recoverableValue", header: "Recoverable value", align: "right", render: (row) => <span className={RECOVERABLE_TONE_CLASS[row.recoverableValueTone]}>{row.recoverableValue}</span> },
  { key: "inTheWave", header: "In the wave?", align: "right", render: (row) => <Chip tone={row.inTheWaveTone}>{row.inTheWave}</Chip> },
];

/**
 * RT05 — Retain's "one segment" drilldown, e.g. /lifecycle/retain/segments/acquired-mar-may.
 * Not the generic DetailDrilldown template: RT05 has a sub-segment
 * breakdown table and a "cost of waiting" bar-chart section instead of a
 * checked-rows table and action cards, confirmed by reading RT05 directly.
 * Reached from the Overview leak table's "Acquired Mar–May" row, not from
 * the Segments tab (RT04) — its content matches the Overview cohort, not
 * any of RT04's seven segment rows.
 */
const RetainSegmentDetailRoute = () => {
  const { stage } = useStageContext();
  const { id } = useParams();
  const detail = id ? RETAIN_SEGMENT_DETAILS[id] : undefined;

  if (!detail) {
    return (
      <div className="rounded-card border border-dashed border-line bg-paper p-10 text-center">
        <p className="text-[13px] font-semibold text-ink">Segment not found</p>
        <Link to={`/lifecycle/${stage.slug}`} className="mt-4 inline-block text-[11.5px] font-semibold text-ultra hover:underline">
          Back to Retain
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
          { label: "Segments", to: `/lifecycle/${stage.slug}/segments` },
          { label: detail.title },
        ]}
        title={detail.title}
        subtitle={detail.headline}
        action={
          <Button type="button" size="sm">
            Open the room
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
        <p className={EYEBROW_CLASS}>{detail.costEyebrow}</p>
        <div className="space-y-5">
          {detail.costRows.map((row) => (
            <WideBarRow key={row.label} label={row.label} value={row.value} percent={row.percent} tone={row.tone} />
          ))}
        </div>
      </section>

      <Callout tone="rose" title={detail.finalTitle}>
        {detail.finalBody}
      </Callout>
    </div>
  );
};

export default RetainSegmentDetailRoute;
