import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { Callout } from "@/pages/everyday/lifecycle/stage/rail";
import { Chip } from "@/pages/everyday/lifecycle/stage/chip";
import { DataTable, type Column } from "@/pages/everyday/lifecycle/stage/data-table";
import { StageSubpageHeader } from "@/pages/everyday/lifecycle/stage/stage-subpage-header";
import { EYEBROW_CLASS } from "@/pages/everyday/lifecycle/data";
import { RETAIN_DEFINITION, type RetainWindowRow } from "@/pages/everyday/lifecycle/stage/retain/data";

const STILL_REACHABLE_TONE_CLASS: Record<RetainWindowRow["stillReachableTone"], string> = { teal: "text-teal", amber: "text-amber" };
const RESPONSE_TONE_CLASS: Record<RetainWindowRow["reactivationResponseTone"], string> = { teal: "text-teal", amber: "text-amber", rose: "text-rose" };

const COLUMNS: Column<RetainWindowRow>[] = [
  { key: "window", header: "Days since first order", render: (row) => <span className="font-semibold text-ink-2">{row.window}</span> },
  { key: "stillReachable", header: "Still reachable", align: "right", render: (row) => <span className={STILL_REACHABLE_TONE_CLASS[row.stillReachableTone]}>{row.stillReachable}</span> },
  { key: "reactivationResponse", header: "Reactivation response", align: "right", render: (row) => <span className={RESPONSE_TONE_CLASS[row.reactivationResponseTone]}>{row.reactivationResponse}</span> },
  { key: "costPerRecovery", header: "Cost per recovery", align: "right", render: (row) => <span className={RESPONSE_TONE_CLASS[row.costPerRecoveryTone]}>{row.costPerRecovery}</span> },
  { key: "verdict", header: "Verdict", align: "right", render: (row) => <Chip tone={row.verdictTone}>{row.verdict}</Chip> },
];

/**
 * RT01 — Retain's Definition screen. Not the shared DefinitionRoute
 * template: where Activate's AC01 verdict table compares candidate
 * signals, RT01's verdict table instead breaks reachability and response
 * down by day-window (0-30 through 121+) — a different table shape,
 * confirmed by reading RT01 directly.
 */
const RetainDefinitionRoute = () => {
  const data = RETAIN_DEFINITION;

  return (
    <div className="space-y-8">
      <StageSubpageHeader
        crumbs={[{ label: "Lifecycle", to: "/lifecycle" }, { label: "Retain", to: "/lifecycle/retain" }, { label: "Definition" }]}
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
        <p className={EYEBROW_CLASS}>{data.windowEyebrow}</p>
        <DataTable columns={COLUMNS} rows={data.windowRows} />
      </section>

      <Callout tone="rose" title={data.closingTitle}>
        {data.closingBody}
      </Callout>
    </div>
  );
};

export default RetainDefinitionRoute;
