import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { Callout } from "@/pages/everyday/lifecycle/stage/rail";
import { Chip } from "@/pages/everyday/lifecycle/stage/chip";
import { DataTable, type Column } from "@/pages/everyday/lifecycle/stage/data-table";
import { StageSubpageHeader } from "@/pages/everyday/lifecycle/stage/stage-subpage-header";
import { EYEBROW_CLASS } from "@/pages/everyday/lifecycle/data";
import { ADOPT_DEFINITION, type AdoptDefinitionVerdictRow } from "@/pages/everyday/lifecycle/stage/adopt/data";

const STILL_ORDERING_TONE_CLASS: Record<AdoptDefinitionVerdictRow["stillOrderingTone"], string> = {
  rose: "text-rose",
  amber: "text-amber",
  teal: "text-teal",
};

const COLUMNS: Column<AdoptDefinitionVerdictRow>[] = [
  { key: "featuresUsed", header: "Features used", render: (row) => <span className="font-semibold text-ink-2">{row.featuresUsed}</span> },
  { key: "customers", header: "Customers", align: "right", render: (row) => <span className="font-mono text-ink">{row.customers}</span> },
  { key: "stillOrdering90d", header: "Still ordering at 90 days", align: "right", render: (row) => <span className={STILL_ORDERING_TONE_CLASS[row.stillOrderingTone]}>{row.stillOrdering90d}</span> },
  { key: "ordersPerMonth", header: "Orders / month", align: "right", render: (row) => <span className="font-mono text-ink">{row.ordersPerMonth}</span> },
  { key: "verdict", header: "Verdict", align: "right", render: (row) => <Chip tone={row.verdictTone}>{row.verdict}</Chip> },
];

/**
 * AD01 — Adopt's Definition screen. Not the shared DefinitionRoute template:
 * where Activate's AC01 verdict table compares candidate signals, AD01's
 * verdict table instead breaks down retention by feature count (0 through
 * 4+) — a different table shape, confirmed by reading AD01 directly.
 */
const AdoptDefinitionRoute = () => {
  const data = ADOPT_DEFINITION;

  return (
    <div className="space-y-8">
      <StageSubpageHeader
        crumbs={[{ label: "Lifecycle", to: "/lifecycle" }, { label: "Adopt", to: "/lifecycle/adopt" }, { label: "Definition" }]}
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
        <p className={EYEBROW_CLASS}>{data.verdictEyebrow}</p>
        <DataTable columns={COLUMNS} rows={data.verdictRows} />
      </section>

      <Callout tone="ultra" title={data.closingTitle}>
        {data.closingBody}
      </Callout>
    </div>
  );
};

export default AdoptDefinitionRoute;
