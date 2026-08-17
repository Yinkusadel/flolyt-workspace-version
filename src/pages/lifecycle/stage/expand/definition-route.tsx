import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { Callout } from "@/pages/lifecycle/stage/rail";
import { Chip } from "@/pages/lifecycle/stage/chip";
import { DataTable, type Column } from "@/pages/lifecycle/stage/data-table";
import { StageSubpageHeader } from "@/pages/lifecycle/stage/stage-subpage-header";
import { EYEBROW_CLASS } from "@/pages/lifecycle/data";
import { EXPAND_DEFINITION, type ExpandKindRow } from "@/pages/lifecycle/stage/expand/data";

const VALUE_ADDED_TONE_CLASS: Record<ExpandKindRow["valueAddedTone"], string> = { teal: "text-teal", amber: "text-amber", neutral: "text-ink-4" };
const MEDIAN_LIFT_TONE_CLASS: Record<ExpandKindRow["medianLiftTone"], string> = { teal: "text-teal", neutral: "text-ink-4" };

const COLUMNS: Column<ExpandKindRow>[] = [
  { key: "kind", header: "Kind", render: (row) => <span className="font-semibold text-ink-2">{row.kind}</span> },
  { key: "customers", header: "Customers", align: "right", render: (row) => <span className="font-mono text-ink">{row.customers}</span> },
  { key: "valueAdded", header: "Value added", align: "right", render: (row) => <span className={VALUE_ADDED_TONE_CLASS[row.valueAddedTone]}>{row.valueAdded}</span> },
  { key: "medianLift", header: "Median lift", align: "right", render: (row) => <span className={MEDIAN_LIFT_TONE_CLASS[row.medianLiftTone]}>{row.medianLift}</span> },
  { key: "reversible", header: "Reversible?", align: "right", render: (row) => <Chip tone={row.reversibleTone}>{row.reversible}</Chip> },
  {
    key: "ownedBy",
    header: "Owned by",
    render: (row) => (
      <span className="flex items-center gap-2 whitespace-nowrap text-ink-2">
        <span className="size-2 shrink-0 rounded-full" style={{ backgroundColor: row.ownedByColor }} aria-hidden />
        {row.ownedBy}
      </span>
    ),
  },
];

/**
 * EX01 — Expand's Definition screen. Not the shared DefinitionRoute
 * template: where Activate's AC01 verdict table compares candidate
 * signals, EX01's table instead breaks down the four kinds of expansion
 * (basket/plan/account/category) by value, lift, reversibility and owner
 * — a different table shape, confirmed by reading EX01 directly.
 */
const ExpandDefinitionRoute = () => {
  const data = EXPAND_DEFINITION;

  return (
    <div className="space-y-8">
      <StageSubpageHeader
        crumbs={[{ label: "Lifecycle", to: "/lifecycle" }, { label: "Expand", to: "/lifecycle/expand" }, { label: "Definition" }]}
        title={data.title}
        subtitle={data.subtitle}
        action={
          <Button type="button" size="sm">
            Preview the change
          </Button>
        }
      />

      <Callout tone="ultra" title={data.insightTitle}>
        {data.insightBody}
      </Callout>

      <section className="space-y-3">
        <p className={EYEBROW_CLASS}>{data.candidatesEyebrow}</p>
        <div className="space-y-2.5">
          {data.candidates.map((candidate) => (
            <div
              key={candidate.id}
              className={cn(
                "flex flex-col gap-1 rounded-card border px-4 py-3 sm:flex-row sm:items-center sm:justify-between sm:gap-4",
                candidate.selected ? "border-2 border-ultra-border bg-ultra-bg" : "border-line bg-paper"
              )}
            >
              <div className="flex items-start gap-3">
                <span
                  className={cn(
                    "mt-0.5 size-3.5 shrink-0 rounded-full border",
                    candidate.selected ? "border-ultra bg-ultra" : "border-line bg-paper"
                  )}
                  aria-hidden
                />
                <div>
                  <p className="text-[12.5px] font-semibold text-ink">{candidate.label}</p>
                  <p className="mt-0.5 text-[10px] text-ink-4">{candidate.description}</p>
                </div>
              </div>
              <span className={cn("shrink-0 font-mono text-[10px] sm:pl-6", candidate.selected ? "text-ultra" : "text-ink-4")}>
                {candidate.field}
              </span>
            </div>
          ))}
        </div>
      </section>

      <section className="space-y-3">
        <p className={EYEBROW_CLASS}>{data.tableEyebrow}</p>
        <DataTable columns={COLUMNS} rows={data.rows} />
      </section>

      <Callout tone="amber" title={data.closingTitle}>
        {data.closingBody}
      </Callout>
    </div>
  );
};

export default ExpandDefinitionRoute;
