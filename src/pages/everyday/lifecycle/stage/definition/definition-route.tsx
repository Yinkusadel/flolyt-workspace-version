import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { Callout } from "@/pages/everyday/lifecycle/stage/rail";
import { Chip, type ChipTone } from "@/pages/everyday/lifecycle/stage/chip";
import { DataTable, type Column } from "@/pages/everyday/lifecycle/stage/data-table";
import { useStageContext } from "@/pages/everyday/lifecycle/stage/layout";
import { StageSubpageHeader } from "@/pages/everyday/lifecycle/stage/stage-subpage-header";
import { ACTIVATE_DEFINITION } from "@/pages/everyday/lifecycle/stage/activate/data";
import PriceDefinitionRoute from "@/pages/everyday/lifecycle/stage/price/definition-route";
import AdoptDefinitionRoute from "@/pages/everyday/lifecycle/stage/adopt/definition-route";
import RetainDefinitionRoute from "@/pages/everyday/lifecycle/stage/retain/definition-route";
import ExpandDefinitionRoute from "@/pages/everyday/lifecycle/stage/expand/definition-route";
import SupportDefinitionRoute from "@/pages/everyday/lifecycle/stage/support/definition-route";
import RenewDefinitionRoute from "@/pages/everyday/lifecycle/stage/renew/definition-route";
import AdvocateDefinitionRoute from "@/pages/everyday/lifecycle/stage/advocate/definition-route";
import ChurnDefinitionRoute from "@/pages/everyday/lifecycle/stage/churn/definition-route";

export type DefinitionCandidate = {
  id: string;
  label: string;
  description: string;
  field: string;
  selected?: boolean;
};

export type DefinitionVerdictRow = {
  id: string;
  signal: string;
  customers: string;
  reach: string;
  reachTone: "ink" | "teal" | "neutral";
  predictive: string;
  predictiveTone: "amber" | "teal" | "rose";
  verdict: string;
  verdictTone: ChipTone;
};

export type DefinitionData = {
  title: string;
  subtitle: string;
  insightTitle: string;
  insightBody: string;
  candidatesEyebrow: string;
  candidates: DefinitionCandidate[];
  verdictEyebrow: string;
  verdictRows: DefinitionVerdictRow[];
  mistakeTitle: string;
  mistakeBody: string;
};

const DEFINITION_DATA: Record<string, DefinitionData> = {
  activate: ACTIVATE_DEFINITION,
};

const PREDICTIVE_TONE_CLASS: Record<DefinitionVerdictRow["predictiveTone"], string> = {
  amber: "text-amber",
  teal: "text-teal",
  rose: "text-rose",
};

const REACH_TONE_CLASS: Record<DefinitionVerdictRow["reachTone"], string> = {
  ink: "text-ink",
  teal: "text-teal",
  neutral: "text-ink-4",
};

/** Screen AC01 (and the shared Definition template — /lifecycle/:stage/definition) — own header, never shows the tab bar. */
const DefinitionRoute = () => {
  const { stage } = useStageContext();

  // Price's PR01 replaces the shared verdict-comparison table with a
  // needs-vs-has checklist — a different structure, not just different
  // copy — so it gets its own component rather than forcing this
  // template's shape onto it. See price/definition-route.tsx.
  if (stage.slug === "price") return <PriceDefinitionRoute />;
  // Adopt's AD01 verdict table breaks down retention by feature count
  // (0-4+), not a candidate-signal comparison — a different table shape.
  if (stage.slug === "adopt") return <AdoptDefinitionRoute />;
  // Retain's RT01 replaces the shared verdict-comparison table with a
  // reachability-by-window table (0-30/31-60/.../121+ days) — a different
  // table shape, not a candidate-signal comparison.
  if (stage.slug === "retain") return <RetainDefinitionRoute />;
  // Expand's EX01 replaces the shared verdict-comparison table with a
  // basket/plan/account/category breakdown (value added, median lift,
  // reversibility, owner) — a different table shape.
  if (stage.slug === "expand") return <ExpandDefinitionRoute />;
  // Support's SU01 replaces the shared verdict-comparison table with a
  // silent-failure outcome breakdown (contacted us vs stayed silent, by
  // what happened) — a different table shape.
  if (stage.slug === "support") return <SupportDefinitionRoute />;
  // Renew's RN01 replaces the shared verdict-comparison table with an
  // outcome breakdown (renewed/cancelled/paused/card failed/lapsed
  // silently) by whether the customer chose it and how recoverable it is —
  // a different table shape.
  if (stage.slug === "renew") return <RenewDefinitionRoute />;
  // Advocate's AV01 replaces the shared verdict-comparison table with a
  // "what this stage is worth, conservatively" MEASURE/FIGURE/AGAINST/
  // VERDICT breakdown — a different table shape, and it also needs its own
  // "Assign an owner" header CTA (this is the one unowned stage).
  if (stage.slug === "advocate") return <AdvocateDefinitionRoute />;
  // Churn's CH01 replaces the shared verdict-comparison table with a
  // definition-window comparison (30/60/90/120/180 days no order, each
  // scored on churned/yr, monthly rate, return-unaided and win-back
  // response) — a different table shape, and it also needs its own
  // "Assign an owner" header CTA (the second unowned stage, alongside
  // Advocate).
  if (stage.slug === "churn") return <ChurnDefinitionRoute />;

  const data = DEFINITION_DATA[stage.slug];
  if (!data) return null;

  const columns: Column<DefinitionVerdictRow>[] = [
    { key: "signal", header: "Candidate signal", render: (row) => <span className="font-semibold text-ink-2">{row.signal}</span> },
    { key: "customers", header: "Customers", align: "right", render: (row) => <span className="font-mono text-ink">{row.customers}</span> },
    {
      key: "reach",
      header: "Reach a second order",
      align: "right",
      render: (row) => <span className={REACH_TONE_CLASS[row.reachTone]}>{row.reach}</span>,
    },
    {
      key: "predictive",
      header: "Predictive?",
      align: "right",
      render: (row) => <span className={PREDICTIVE_TONE_CLASS[row.predictiveTone]}>{row.predictive}</span>,
    },
    { key: "verdict", header: "Verdict", align: "right", render: (row) => <Chip tone={row.verdictTone}>{row.verdict}</Chip> },
  ];

  return (
    <div className="space-y-8">
      <StageSubpageHeader
        crumbs={[{ label: "Lifecycle", to: "/lifecycle" }, { label: stage.name, to: `/lifecycle/${stage.slug}` }, { label: "Definition" }]}
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
        <p className="font-mono text-[9.5px] font-medium tracking-[1.05px] text-ink-4 uppercase">{data.candidatesEyebrow}</p>
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
        <p className="font-mono text-[9.5px] font-medium tracking-[1.05px] text-ink-4 uppercase">{data.verdictEyebrow}</p>
        <DataTable columns={columns} rows={data.verdictRows} />
      </section>

      <Callout tone="amber" title={data.mistakeTitle}>
        {data.mistakeBody}
      </Callout>
    </div>
  );
};

export default DefinitionRoute;
