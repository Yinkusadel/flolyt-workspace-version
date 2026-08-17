import { Button } from "@/components/ui/button";
import { Callout } from "@/pages/lifecycle/stage/rail";
import { DataTable, type Column } from "@/pages/lifecycle/stage/data-table";
import { KpiCards } from "@/pages/lifecycle/stage/kpi-cards";
import { useStageContext } from "@/pages/lifecycle/stage/layout";
import { StageSubpageHeader } from "@/pages/lifecycle/stage/stage-subpage-header";
import { EYEBROW_CLASS } from "@/pages/lifecycle/data";
import {
  SUPPORT_OVERVIEW_KPIS,
  SUPPORT_SILENT_CLOSING_CARDS,
  SUPPORT_SILENT_FAILURE_ROWS,
  type SilentFailureRow,
} from "@/pages/lifecycle/stage/support/data";

const TONE_CLASS: Record<"teal" | "amber" | "rose", string> = { teal: "text-teal", amber: "text-amber", rose: "text-rose" };
const CARD_ACCENT_CLASS: Record<"teal" | "amber" | "neutral" | "rose", string> = { teal: "bg-teal", amber: "bg-amber", neutral: "bg-ink-4", rose: "bg-rose" };
const CARD_EYEBROW_CLASS: Record<"teal" | "amber" | "neutral" | "rose", string> = { teal: "text-teal", amber: "text-amber", neutral: "text-ink-4", rose: "text-rose" };

const COLUMNS: Column<SilentFailureRow>[] = [
  { key: "whatHappened", header: "What happened", render: (row) => <span className="font-semibold text-ink-2">{row.whatHappened}</span> },
  { key: "totalPerMo", header: "Total / mo", align: "right", render: (row) => <span className="font-mono text-ink">{row.totalPerMo}</span> },
  { key: "toldUs", header: "Told us", align: "right", render: (row) => <span className="font-mono text-ink">{row.toldUs}</span> },
  { key: "stayedSilent", header: "Stayed silent", align: "right", render: (row) => <span className={TONE_CLASS[row.stayedSilentTone]}>{row.stayedSilent}</span> },
  { key: "repeatVocal", header: "Repeat · vocal", align: "right", render: (row) => <span className={TONE_CLASS[row.repeatVocalTone]}>{row.repeatVocal}</span> },
  { key: "repeatSilent", header: "Repeat · silent", align: "right", render: (row) => <span className={TONE_CLASS[row.repeatSilentTone]}>{row.repeatSilent}</span> },
  { key: "gap", header: "Gap", align: "right", render: (row) => <span className={TONE_CLASS[row.gapTone]}>{row.gap}</span> },
];

/**
 * SU13 — "Silent failures", reached from the Overview's "Revenue behind
 * silent failures" KPI card (via the shared KpiCards' new optional `href`
 * field), not from a tab or a leak-table row — its own KPIs and numbers
 * match the Overview's 4th card exactly, confirmed by reading SU13
 * directly. Own header, no tab bar, same shape as Retain's segment-detail
 * and Adopt's feature-detail routes.
 */
const SupportSilentFailuresRoute = () => {
  const { stage } = useStageContext();

  return (
    <div className="space-y-8">
      <StageSubpageHeader
        crumbs={[
          { label: "Lifecycle", to: "/lifecycle" },
          { label: stage.name, to: `/lifecycle/${stage.slug}` },
          { label: "Silent failures" },
        ]}
        title="Silent failures"
        subtitle="39,600 a month have a problem and say nothing · ₦38M · on no support dashboard"
        action={
          <Button type="button" size="sm">
            Open a war room
          </Button>
        }
      />

      <KpiCards items={SUPPORT_OVERVIEW_KPIS} />

      <section className="space-y-3">
        <p className={EYEBROW_CLASS}>What went wrong, and whether they told us</p>
        <DataTable columns={COLUMNS} rows={SUPPORT_SILENT_FAILURE_ROWS} />
      </section>

      <Callout tone="rose" title="A failed delivery you hear about is worth 31.4%. The same failure in silence is worth 0.4%.">
        That is a 78-fold difference in outcome from the same underlying event. The only variable is whether we found
        out and did something. 8,200 customers a month have a delivery fail completely, say nothing, and never
        return — and there is no reason at all to wait for them to complain, because the delivery feed already knows.
      </Callout>

      <section className="space-y-4">
        <p className={EYEBROW_CLASS}>The intervention that already exists and is only pointed at one row</p>
        <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
          {SUPPORT_SILENT_CLOSING_CARDS.map((card) => (
            <div key={card.id} className="relative overflow-hidden rounded-card border border-line bg-paper pl-4">
              <span className={`absolute inset-y-0 left-0 w-[3px] ${CARD_ACCENT_CLASS[card.tone]}`} aria-hidden />
              <div className="flex h-full flex-col gap-2.5 p-4 pl-1">
                <p className={`font-mono text-[9px] font-medium tracking-[0.85px] uppercase ${CARD_EYEBROW_CLASS[card.tone]}`}>
                  {card.eyebrow}
                </p>
                <h3 className="text-[13px] font-semibold text-ink">{card.title}</h3>
                <p className="flex-1 text-[10.5px] leading-relaxed text-ink-3">{card.body}</p>
                <p className={`border-t border-dashed border-line pt-2.5 font-mono text-[10px] font-semibold ${CARD_EYEBROW_CLASS[card.tone]}`}>
                  {card.footnote}
                </p>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
};

export default SupportSilentFailuresRoute;
