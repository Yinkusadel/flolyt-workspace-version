import { Link, useParams } from "react-router-dom";

import { Button } from "@/components/ui/button";
import { WideBarRow } from "@/pages/everyday/lifecycle/stage/bar";
import { Callout } from "@/pages/everyday/lifecycle/stage/rail";
import { DataTable, type Column } from "@/pages/everyday/lifecycle/stage/data-table";
import { KpiCards } from "@/pages/everyday/lifecycle/stage/kpi-cards";
import { useStageContext } from "@/pages/everyday/lifecycle/stage/layout";
import { StageSubpageHeader } from "@/pages/everyday/lifecycle/stage/stage-subpage-header";
import { ACTIVATE_RELEASE_IMPACT, type StageImpactRow } from "@/pages/everyday/lifecycle/stage/activate/data";

const IMPACT_TONE_CLASS: Record<StageImpactRow["effectTone"], string> = { rose: "text-rose", amber: "text-amber" };

/** AC09 — Activate's "release impact" drilldown, reached from What changed at /lifecycle/activate/changes/:id. */
const ReleaseImpactRoute = () => {
  const { stage } = useStageContext();
  const { id } = useParams();
  const detail = id ? ACTIVATE_RELEASE_IMPACT[id] : undefined;

  if (!detail) {
    return (
      <div className="rounded-card border border-dashed border-line bg-paper p-10 text-center">
        <p className="text-[13px] font-semibold text-ink">Change not found</p>
        <Link
          to={`/lifecycle/${stage.slug}/changes`}
          className="mt-4 inline-block text-[11.5px] font-semibold text-ultra hover:underline"
        >
          Back to what changed
        </Link>
      </div>
    );
  }

  const columns: Column<StageImpactRow>[] = [
    { key: "stage", header: "Stage", render: (row) => <span className="font-semibold text-ink-2">{row.stage}</span> },
    { key: "symptom", header: "Symptom in that stage", render: (row) => <span className="text-ink-2">{row.symptom}</span> },
    { key: "effect", header: "Effect", align: "right", render: (row) => <span className={IMPACT_TONE_CLASS[row.effectTone]}>{row.effect}</span> },
    { key: "value", header: "Value", align: "right", render: (row) => <span className={IMPACT_TONE_CLASS[row.effectTone]}>{row.value}</span> },
    {
      key: "whoSawIt",
      header: "Who saw it",
      render: (row) => (
        <span className="flex items-center gap-1.5 whitespace-nowrap font-medium" style={{ color: row.departmentColor }}>
          <span className="size-2 shrink-0 rounded-full" style={{ backgroundColor: row.departmentColor }} aria-hidden />
          {row.department}
        </span>
      ),
    },
    {
      key: "whatTheyCalledIt",
      header: "What they called it",
      align: "right",
      render: (row) => <span className="font-mono text-ink-4">{row.whatTheyCalledIt}</span>,
    },
  ];

  return (
    <div className="space-y-8">
      <StageSubpageHeader
        crumbs={[
          { label: "Lifecycle", to: "/lifecycle" },
          { label: stage.name, to: `/lifecycle/${stage.slug}` },
          { label: "What changed", to: `/lifecycle/${stage.slug}/changes` },
          { label: detail.title },
        ]}
        title={detail.title}
        subtitle={detail.subtitle}
        action={
          <Button type="button" size="sm" asChild>
            <Link to="/lifecycle/churn/chain">See the whole chain</Link>
          </Button>
        }
      />

      <KpiCards items={detail.kpis} />

      <section className="space-y-4">
        <p className="font-mono text-[9.5px] font-medium tracking-[1.05px] text-ink-4 uppercase">{detail.windowEyebrow}</p>
        <div className="space-y-5">
          {detail.windowRows.map((row) => (
            <WideBarRow key={row.label} label={row.label} value={row.value} percent={row.percent} tone={row.tone} />
          ))}
        </div>
      </section>

      <Callout tone="ultra" title={detail.controlTitle}>
        {detail.controlBody}
      </Callout>

      <section className="space-y-3">
        <p className="font-mono text-[9.5px] font-medium tracking-[1.05px] text-ink-4 uppercase">{detail.impactEyebrow}</p>
        <DataTable columns={columns} rows={detail.impactRows} />
      </section>

      <Callout tone="rose" title={detail.summaryTitle}>
        {detail.summaryBody}
      </Callout>
    </div>
  );
};

export default ReleaseImpactRoute;
