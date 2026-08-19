import { useState } from "react";
import { createPortal } from "react-dom";

import { Button } from "@/components/ui/button";
import { PersonAvatar } from "@/components/person-avatar";
import { Chip } from "@/pages/everyday/lifecycle/stage/chip";
import { DataTable, type Column } from "@/pages/everyday/lifecycle/stage/data-table";
import { KpiCards } from "@/pages/everyday/lifecycle/stage/kpi-cards";
import { useStageContext } from "@/pages/everyday/lifecycle/stage/layout";
import { BuildAnAudienceModal } from "@/pages/everyday/lifecycle/stage/modals/build-an-audience-modal";
import { EYEBROW_CLASS } from "@/pages/everyday/lifecycle/data";
import {
  RETAIN_BUILD_AUDIENCE_PRESET,
  RETAIN_CAMPAIGN_ROWS,
  RETAIN_REACTIVATION_CARDS,
  RETAIN_REACTIVATION_KPIS,
  type RetainCampaignRow,
  type RetainReactivationCard,
} from "@/pages/everyday/lifecycle/stage/retain/data";

const WINDOW_TONE_CLASS: Record<RetainCampaignRow["windowTone"], string> = { teal: "text-teal", amber: "text-amber" };
const OFFER_TONE_CLASS: Record<RetainCampaignRow["offerTone"], string> = { teal: "text-teal", amber: "text-amber", rose: "text-rose" };
const RECOVERED_TONE_CLASS: Record<RetainCampaignRow["recoveredTone"], string> = { teal: "text-teal", amber: "text-amber", rose: "text-rose" };
const VS_HOLDOUT_TONE_CLASS: Record<RetainCampaignRow["vsHoldoutTone"], string> = { teal: "text-teal", amber: "text-amber" };

const CARD_FOOTNOTE_CLASS: Record<RetainReactivationCard["tone"], string> = { teal: "text-teal", amber: "text-amber", ultra: "text-ultra" };

const COLUMNS: Column<RetainCampaignRow>[] = [
  { key: "campaign", header: "Campaign", render: (row) => <span className="font-semibold text-ink-2">{row.campaign}</span> },
  { key: "sent", header: "Sent", align: "right", render: (row) => <span className="font-mono text-ink">{row.sent}</span> },
  { key: "window", header: "Window", align: "right", render: (row) => <span className={WINDOW_TONE_CLASS[row.windowTone]}>{row.window}</span> },
  { key: "offer", header: "Offer", align: "right", render: (row) => <span className={OFFER_TONE_CLASS[row.offerTone]}>{row.offer}</span> },
  { key: "recovered", header: "Recovered", align: "right", render: (row) => <span className={RECOVERED_TONE_CLASS[row.recoveredTone]}>{row.recovered}</span> },
  { key: "vsHoldout", header: "vs holdout", align: "right", render: (row) => <span className={VS_HOLDOUT_TONE_CLASS[row.vsHoldoutTone]}>{row.vsHoldout}</span> },
  { key: "verdict", header: "Verdict", align: "right", render: (row) => <Chip tone={row.verdictTone}>{row.verdict}</Chip> },
];

/** RT06 — Retain's unique Reactivation tab. */
const RetainReactivationTab = () => {
  const { headerActionsEl } = useStageContext();
  const [buildOpen, setBuildOpen] = useState(false);

  return (
    <div className="space-y-8">
      {headerActionsEl &&
        createPortal(
          <Button type="button" size="sm" onClick={() => setBuildOpen(true)}>
            Build an audience
          </Button>,
          headerActionsEl
        )}

      <KpiCards items={RETAIN_REACTIVATION_KPIS} />

      <section className="space-y-3">
        <p className={EYEBROW_CLASS}>Everything that has been sent, and what it did</p>
        <DataTable columns={COLUMNS} rows={RETAIN_CAMPAIGN_ROWS} />
      </section>

      <section className="space-y-4">
        <p className={EYEBROW_CLASS}>The two results that disagree with the company&apos;s habit</p>
        <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
          {RETAIN_REACTIVATION_CARDS.map((card) => (
            <div key={card.id} className="rounded-card border border-line bg-paper">
              <div className="flex h-full flex-col gap-2.5 p-4">
                <div className="flex items-center gap-2">
                  <PersonAvatar kind="agent" initials={card.agentTag} size="sm" />
                  <p className="font-mono text-[9px] font-medium text-ink-4">{card.meta}</p>
                </div>
                <h3 className="text-[13px] font-semibold text-ink">{card.title}</h3>
                <p className="flex-1 text-[10.5px] leading-relaxed text-ink-3">{card.body}</p>
                <p className={`border-t border-dashed border-line pt-2.5 font-mono text-[10px] font-semibold ${CARD_FOOTNOTE_CLASS[card.tone]}`}>
                  {card.footnote}
                </p>
              </div>
            </div>
          ))}
        </div>
      </section>

      <BuildAnAudienceModal preset={RETAIN_BUILD_AUDIENCE_PRESET} open={buildOpen} onOpenChange={setBuildOpen} />
    </div>
  );
};

export default RetainReactivationTab;
