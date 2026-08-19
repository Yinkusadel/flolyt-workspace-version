import { useState } from "react";
import { createPortal } from "react-dom";

import { Button } from "@/components/ui/button";
import { WideBarRow } from "@/pages/everyday/lifecycle/stage/bar";
import { Callout } from "@/pages/everyday/lifecycle/stage/rail";
import { Chip } from "@/pages/everyday/lifecycle/stage/chip";
import { DataTable, type Column } from "@/pages/everyday/lifecycle/stage/data-table";
import { KpiCards } from "@/pages/everyday/lifecycle/stage/kpi-cards";
import { useStageContext } from "@/pages/everyday/lifecycle/stage/layout";
import { OpenARoomModal } from "@/pages/everyday/lifecycle/stage/modals/open-a-room-modal";
import { EYEBROW_CLASS } from "@/pages/everyday/lifecycle/data";
import {
  RENEW_PAUSES_CLOSING,
  RENEW_PAUSES_INSIGHT,
  RENEW_PAUSES_KPIS,
  RENEW_PAUSES_OPEN_ROOM_PRESET,
  RENEW_PAUSES_RETURN_ROWS,
  RENEW_PAUSE_REASON_ROWS,
  type RenewPauseReasonRow,
} from "@/pages/everyday/lifecycle/stage/renew/data";

const SHARE_TONE_CLASS: Record<RenewPauseReasonRow["shareTone"], string> = { teal: "text-teal", amber: "text-amber", rose: "text-rose", neutral: "text-ink-4" };
const RETURNED_TONE_CLASS: Record<RenewPauseReasonRow["returned90Tone"], string> = { teal: "text-teal", amber: "text-amber", rose: "text-rose" };
const VS_FEB_TONE_CLASS: Record<RenewPauseReasonRow["vsFebTone"], string> = { teal: "text-teal", amber: "text-amber", rose: "text-rose", neutral: "text-ink-4" };

const COLUMNS: Column<RenewPauseReasonRow>[] = [
  { key: "reason", header: "Reason", render: (row) => <span className="font-semibold text-ink-2">{row.reason}</span> },
  { key: "customers", header: "Customers", align: "right", render: (row) => <span className="font-mono text-ink">{row.customers}</span> },
  { key: "share", header: "Share", align: "right", render: (row) => <span className={SHARE_TONE_CLASS[row.shareTone]}>{row.share}</span> },
  { key: "returned90", header: "Returned in 90 days", align: "right", render: (row) => <span className={RETURNED_TONE_CLASS[row.returned90Tone]}>{row.returned90}</span> },
  { key: "vsFeb", header: "vs Feb", align: "right", render: (row) => <span className={VS_FEB_TONE_CLASS[row.vsFebTone]}>{row.vsFeb}</span> },
  { key: "reallyA", header: "Really a", align: "right", render: (row) => <Chip tone={row.reallyATone}>{row.reallyA}</Chip> },
];

/** RN05 — Renew's unique Pauses tab. */
const RenewPausesTab = () => {
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

      <KpiCards items={RENEW_PAUSES_KPIS} />

      <section className="space-y-4">
        <p className={EYEBROW_CLASS}>A pause used to be a delay. Now it is mostly an exit.</p>
        <div className="space-y-5">
          {RENEW_PAUSES_RETURN_ROWS.map((row) => (
            <WideBarRow key={row.label} label={row.label} value={row.value} percent={row.percent} tone={row.tone} />
          ))}
        </div>
      </section>

      <Callout tone="ultra" title={RENEW_PAUSES_INSIGHT.title}>
        {RENEW_PAUSES_INSIGHT.body}
      </Callout>

      <section className="space-y-3">
        <p className={EYEBROW_CLASS}>Why the 32% who did give a reason paused</p>
        <DataTable columns={COLUMNS} rows={RENEW_PAUSE_REASON_ROWS} />
      </section>

      <Callout tone="rose" title={RENEW_PAUSES_CLOSING.title}>
        {RENEW_PAUSES_CLOSING.body}
      </Callout>

      <OpenARoomModal preset={RENEW_PAUSES_OPEN_ROOM_PRESET} open={openRoom} onOpenChange={setOpenRoom} />
    </div>
  );
};

export default RenewPausesTab;
