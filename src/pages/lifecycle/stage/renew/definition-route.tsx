import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { Callout } from "@/pages/lifecycle/stage/rail";
import { Chip } from "@/pages/lifecycle/stage/chip";
import { DataTable, type Column } from "@/pages/lifecycle/stage/data-table";
import { StageSubpageHeader } from "@/pages/lifecycle/stage/stage-subpage-header";
import { EYEBROW_CLASS } from "@/pages/lifecycle/data";
import { RENEW_DEFINITION, type RenewOutcomeRow } from "@/pages/lifecycle/stage/renew/data";

const VALUE_TONE_CLASS: Record<RenewOutcomeRow["valueTone"], string> = { teal: "text-teal", amber: "text-amber", rose: "text-rose" };
const RECOVERABLE_TONE_CLASS: Record<RenewOutcomeRow["recoverableTone"], string> = { teal: "text-teal", amber: "text-amber", neutral: "text-ink-4" };

const COLUMNS: Column<RenewOutcomeRow>[] = [
  { key: "outcome", header: "Outcome", render: (row) => <span className="font-semibold text-ink-2">{row.outcome}</span> },
  { key: "customersPerYr", header: "Customers / yr", align: "right", render: (row) => <span className="font-mono text-ink">{row.customersPerYr}</span> },
  { key: "value", header: "Value", align: "right", render: (row) => <span className={VALUE_TONE_CLASS[row.valueTone]}>{row.value}</span> },
  { key: "choseIt", header: "Chose it?", align: "right", render: (row) => <Chip tone={row.choseItTone}>{row.choseIt}</Chip> },
  { key: "recoverable", header: "Recoverable", align: "right", render: (row) => <span className={RECOVERABLE_TONE_CLASS[row.recoverableTone]}>{row.recoverable}</span> },
  {
    key: "owner",
    header: "Owned by",
    render: (row) =>
      row.owner ? (
        <span className="flex items-center gap-2 whitespace-nowrap text-ink-2">
          <span className="size-2 shrink-0 rounded-full" style={{ backgroundColor: row.owner.color }} aria-hidden />
          {row.owner.name}
        </span>
      ) : row.noOwner ? (
        <Chip tone="amber">No owner</Chip>
      ) : null,
  },
];

/**
 * RN01 — Renew's Definition screen. Not the shared DefinitionRoute template:
 * where Activate's AC01 verdict table compares candidate signals, RN01's
 * verdict table instead breaks the outcome down by whether the customer
 * chose it and how recoverable it is (Renewed/Cancelled/Paused/Card
 * failed/Lapsed silently) — a different table shape, confirmed by reading
 * RN01 directly.
 */
const RenewDefinitionRoute = () => {
  const data = RENEW_DEFINITION;

  return (
    <div className="space-y-8">
      <StageSubpageHeader
        crumbs={[{ label: "Lifecycle", to: "/lifecycle" }, { label: "Renew", to: "/lifecycle/renew" }, { label: "Definition" }]}
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

export default RenewDefinitionRoute;
