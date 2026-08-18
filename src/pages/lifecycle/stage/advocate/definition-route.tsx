import { useState } from "react";

import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { Callout } from "@/pages/lifecycle/stage/rail";
import { Chip } from "@/pages/lifecycle/stage/chip";
import { DataTable, type Column } from "@/pages/lifecycle/stage/data-table";
import { StageSubpageHeader } from "@/pages/lifecycle/stage/stage-subpage-header";
import { AssignAnOwnerModal } from "@/pages/lifecycle/stage/modals/assign-an-owner-modal";
import { EYEBROW_CLASS } from "@/pages/lifecycle/data";
import { ADVOCATE_ASSIGN_OWNER_PRESET, ADVOCATE_DEFINITION, type AdvocateWorthRow } from "@/pages/lifecycle/stage/advocate/data";

const FIGURE_TONE_CLASS: Record<AdvocateWorthRow["figureTone"], string> = { ink: "text-ink", teal: "text-teal", amber: "text-amber", rose: "text-rose" };
const AGAINST_TONE_CLASS: Record<AdvocateWorthRow["againstTone"], string> = { teal: "text-teal", neutral: "text-ink-4", rose: "text-rose" };

const COLUMNS: Column<AdvocateWorthRow>[] = [
  { key: "measure", header: "Measure", render: (row) => <span className="font-semibold text-ink-2">{row.measure}</span> },
  { key: "figure", header: "Figure", align: "right", render: (row) => <span className={`font-mono ${FIGURE_TONE_CLASS[row.figureTone]}`}>{row.figure}</span> },
  { key: "against", header: "Against", align: "right", render: (row) => <span className={AGAINST_TONE_CLASS[row.againstTone]}>{row.against}</span> },
  { key: "verdict", header: "Verdict", align: "right", render: (row) => <Chip tone={row.verdictTone}>{row.verdict}</Chip> },
];

/**
 * AV01 — Advocate's Definition screen. Not the shared DefinitionRoute
 * template: where Activate's AC01 verdict table compares candidate signals,
 * AV01's second table instead breaks down what the stage is worth
 * (customers referred, CAC, reward paid, effective CAC, repeat rate, owner)
 * against a MEASURE/FIGURE/AGAINST/VERDICT header — a different table shape,
 * confirmed by reading AV01 directly. Also the only Definition screen with
 * an "Assign an owner" header CTA, since Advocate is the one unowned stage.
 */
const AdvocateDefinitionRoute = () => {
  const data = ADVOCATE_DEFINITION;
  const [assignOwnerOpen, setAssignOwnerOpen] = useState(false);

  return (
    <div className="space-y-8">
      <StageSubpageHeader
        crumbs={[{ label: "Lifecycle", to: "/lifecycle" }, { label: "Advocate", to: "/lifecycle/advocate" }, { label: "Definition" }]}
        title={data.title}
        subtitle={data.subtitle}
        action={
          <Button type="button" size="sm" onClick={() => setAssignOwnerOpen(true)}>
            Assign an owner
          </Button>
        }
      />

      <Callout tone="amber" title={data.insightTitle}>
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

      <Callout tone="amber" title={data.mistakeTitle}>
        {data.mistakeBody}
      </Callout>

      <section className="space-y-3">
        <p className={EYEBROW_CLASS}>{data.tableEyebrow}</p>
        <DataTable columns={COLUMNS} rows={data.rows} />
      </section>

      <AssignAnOwnerModal preset={ADVOCATE_ASSIGN_OWNER_PRESET} open={assignOwnerOpen} onOpenChange={setAssignOwnerOpen} />
    </div>
  );
};

export default AdvocateDefinitionRoute;
