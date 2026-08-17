import type { ReactNode } from "react";

import { Button } from "@/components/ui/button";
import { Callout } from "@/pages/lifecycle/stage/rail";
import { Chip, type ChipTone } from "@/pages/lifecycle/stage/chip";
import { KpiCards, type Kpi } from "@/pages/lifecycle/stage/kpi-cards";
import type { Crumb } from "@/pages/lifecycle/stage/stage-subpage-header";
import { StageSubpageHeader } from "@/pages/lifecycle/stage/stage-subpage-header";

export type CheckedRow = { id: string; question: string; finding: string; verdict: string; verdictTone: ChipTone };

export type ActionCard = { id: string; eyebrow: string; tone: "teal" | "amber" | "neutral"; title: string; body: string; footnote: string };

const ACTION_ACCENT_CLASS: Record<ActionCard["tone"], string> = { teal: "bg-teal", amber: "bg-amber", neutral: "bg-ink-4" };
const ACTION_EYEBROW_CLASS: Record<ActionCard["tone"], string> = { teal: "text-teal", amber: "text-amber", neutral: "text-ink-4" };

/**
 * Generic template for every stage's "one item" drilldown (channels/:id,
 * paths/:id, features/:id, ...) — own header (no tab bar), a KPI row, a
 * "what we checked" table, a root-cause callout, and a set of action cards.
 * Individual stages resolve their own :id → data lookup and pass the
 * result in as props (see acquire/channel-detail-route.tsx).
 */
export function DetailDrilldown({
  crumbs,
  title,
  subtitle,
  eyebrow,
  kpis,
  checkedRows,
  causeTone = "rose",
  causeTitle,
  causeBody,
  actionsEyebrow,
  actionCards,
}: {
  crumbs: Crumb[];
  title: string;
  subtitle: string;
  eyebrow: string;
  kpis: Kpi[];
  checkedRows: CheckedRow[];
  causeTone?: "rose" | "amber";
  causeTitle: string;
  causeBody: ReactNode;
  actionsEyebrow: string;
  actionCards: ActionCard[];
}) {
  return (
    <div className="space-y-8">
      <StageSubpageHeader
        crumbs={crumbs}
        title={title}
        subtitle={subtitle}
        action={
          <Button type="button" size="sm">
            Open a war room
          </Button>
        }
      />

      <KpiCards items={kpis} />

      <section className="space-y-3">
        <p className="font-mono text-[9.5px] font-medium tracking-[1.05px] text-ink-4 uppercase">{eyebrow}</p>
        <div className="divide-y divide-line overflow-hidden rounded-card border border-line bg-paper">
          {checkedRows.map((row) => (
            <div key={row.id} className="flex flex-col gap-2 p-4 sm:flex-row sm:items-center sm:justify-between sm:gap-4">
              <div className="min-w-0">
                <p className="text-[11.5px] font-semibold text-ink-2">{row.question}</p>
                <p className="mt-0.5 text-[11px] text-ink-3">{row.finding}</p>
              </div>
              <Chip tone={row.verdictTone}>{row.verdict}</Chip>
            </div>
          ))}
        </div>
      </section>

      <Callout tone={causeTone} title={causeTitle}>
        {causeBody}
      </Callout>

      <section className="space-y-3">
        <p className="font-mono text-[9.5px] font-medium tracking-[1.05px] text-ink-4 uppercase">{actionsEyebrow}</p>
        <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
          {actionCards.map((card) => (
            <div key={card.id} className="relative overflow-hidden rounded-card border border-line bg-paper pl-4">
              <span className={`absolute inset-y-0 left-0 w-[3px] ${ACTION_ACCENT_CLASS[card.tone]}`} aria-hidden />
              <div className="flex h-full flex-col gap-2.5 p-4 pl-1">
                <p className={`font-mono text-[9px] font-medium tracking-[0.85px] uppercase ${ACTION_EYEBROW_CLASS[card.tone]}`}>
                  {card.eyebrow}
                </p>
                <h3 className="text-[13px] font-semibold text-ink">{card.title}</h3>
                <p className="flex-1 text-[10.5px] leading-relaxed text-ink-3">{card.body}</p>
                <p className={`border-t border-dashed border-line pt-2.5 font-mono text-[10px] font-semibold ${ACTION_EYEBROW_CLASS[card.tone]}`}>
                  {card.footnote}
                </p>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
