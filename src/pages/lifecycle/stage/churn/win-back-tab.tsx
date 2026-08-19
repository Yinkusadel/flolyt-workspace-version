import { useState } from "react";
import { createPortal } from "react-dom";

import { Button } from "@/components/ui/button";
import { Callout } from "@/pages/lifecycle/stage/rail";
import { Chip } from "@/pages/lifecycle/stage/chip";
import { DataTable, type Column } from "@/pages/lifecycle/stage/data-table";
import { KpiCards } from "@/pages/lifecycle/stage/kpi-cards";
import { useStageContext } from "@/pages/lifecycle/stage/layout";
import { OpenARoomModal } from "@/pages/lifecycle/stage/modals/open-a-room-modal";
import { EYEBROW_CLASS } from "@/pages/lifecycle/data";
import {
  CHURN_WINBACK_CLOSING,
  CHURN_WINBACK_COST_INSIGHT,
  CHURN_WINBACK_KPIS,
  CHURN_WINBACK_OPEN_ROOM_PRESET,
  CHURN_WINBACK_ROWS,
  type ChurnWinbackRow,
} from "@/pages/lifecycle/stage/churn/data";

const DAYS_SINCE_TONE_CLASS: Record<ChurnWinbackRow["daysSinceTone"], string> = { rose: "text-rose", amber: "text-amber", neutral: "text-ink-4" };
const OFFER_TONE_CLASS: Record<ChurnWinbackRow["offerTone"], string> = { rose: "text-rose", teal: "text-teal", neutral: "text-ink-4" };
const WON_BACK_TONE_CLASS: Record<ChurnWinbackRow["wonBackTone"], string> = { rose: "text-rose", teal: "text-teal", amber: "text-amber", neutral: "text-ink-4" };
const COST_TONE_CLASS: Record<ChurnWinbackRow["costPerRecoveryTone"], string> = { rose: "text-rose", teal: "text-teal", neutral: "text-ink-4" };

const COLUMNS: Column<ChurnWinbackRow>[] = [
  { key: "campaign", header: "Campaign", render: (row) => <span className="font-semibold text-ink-2">{row.campaign}</span> },
  { key: "sent", header: "Sent", align: "right", render: (row) => <span className="font-mono text-ink">{row.sent}</span> },
  { key: "daysSince", header: "Days since last order", align: "right", render: (row) => <span className={row.daysSince === "any" ? "font-mono text-ink-4" : DAYS_SINCE_TONE_CLASS[row.daysSinceTone]}>{row.daysSince}</span> },
  { key: "offer", header: "Offer", align: "right", render: (row) => <span className={OFFER_TONE_CLASS[row.offerTone]}>{row.offer}</span> },
  { key: "wonBack", header: "Won back", align: "right", render: (row) => <span className={row.wonBack === "—" ? "font-mono text-ink-4" : WON_BACK_TONE_CLASS[row.wonBackTone]}>{row.wonBack}</span> },
  { key: "costPerRecovery", header: "Cost per recovery", align: "right", render: (row) => <span className={row.costPerRecovery === "—" ? "font-mono text-ink-4" : COST_TONE_CLASS[row.costPerRecoveryTone]}>{row.costPerRecovery}</span> },
  { key: "verdict", header: "Verdict", align: "right", render: (row) => <Chip tone={row.verdictTone}>{row.verdict}</Chip> },
];

/** CH05 — Churn's unique Win-back tab (route path "win-back", matches its tab label). */
const ChurnWinBackTab = () => {
  const { headerActionsEl } = useStageContext();
  const [openRoom, setOpenRoom] = useState(false);

  return (
    <div className="space-y-8">
      {headerActionsEl &&
        createPortal(
          <Button type="button" size="sm" onClick={() => setOpenRoom(true)}>
            Open a war room
          </Button>,
          headerActionsEl
        )}

      <KpiCards items={CHURN_WINBACK_KPIS} />

      <Callout tone="amber" title={CHURN_WINBACK_COST_INSIGHT.title}>
        {CHURN_WINBACK_COST_INSIGHT.body}
      </Callout>

      <section className="space-y-3">
        <p className={EYEBROW_CLASS}>Every win-back attempt, and what it returned</p>
        <DataTable columns={COLUMNS} rows={CHURN_WINBACK_ROWS} />
      </section>

      <Callout tone="ultra" title={CHURN_WINBACK_CLOSING.title}>
        {CHURN_WINBACK_CLOSING.body}
      </Callout>

      <OpenARoomModal preset={CHURN_WINBACK_OPEN_ROOM_PRESET} open={openRoom} onOpenChange={setOpenRoom} />
    </div>
  );
};

export default ChurnWinBackTab;
