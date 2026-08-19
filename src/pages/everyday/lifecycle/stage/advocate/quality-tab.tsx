import { useState } from "react";
import { createPortal } from "react-dom";

import { Button } from "@/components/ui/button";
import { Callout } from "@/pages/everyday/lifecycle/stage/rail";
import { DataTable, type Column } from "@/pages/everyday/lifecycle/stage/data-table";
import { KpiCards } from "@/pages/everyday/lifecycle/stage/kpi-cards";
import { useStageContext } from "@/pages/everyday/lifecycle/stage/layout";
import { OpenARoomModal } from "@/pages/everyday/lifecycle/stage/modals/open-a-room-modal";
import { EYEBROW_CLASS } from "@/pages/everyday/lifecycle/data";
import {
  ADVOCATE_QUALITY_CHANNEL_ROWS,
  ADVOCATE_QUALITY_INSIGHT,
  ADVOCATE_QUALITY_KPIS,
  ADVOCATE_QUALITY_OPEN_ROOM_PRESET,
  ADVOCATE_QUALITY_WHY_ROWS,
  type AdvocateQualityChannelRow,
} from "@/pages/everyday/lifecycle/stage/advocate/data";

const TONE_CLASS: Record<"teal" | "amber" | "rose" | "ink", string> = { teal: "text-teal", amber: "text-amber", rose: "text-rose", ink: "text-ink" };

const COLUMNS: Column<AdvocateQualityChannelRow>[] = [
  { key: "channel", header: "Channel", render: (row) => <span className="font-semibold text-ink-2">{row.channel}</span> },
  { key: "acquired", header: "Acquired", align: "right", render: (row) => <span className="font-mono text-ink">{row.acquired}</span> },
  { key: "cac", header: "CAC", align: "right", render: (row) => <span className={TONE_CLASS[row.cacTone]}>{row.cac}</span> },
  { key: "repeatRate", header: "Repeat rate", align: "right", render: (row) => <span className={TONE_CLASS[row.repeatRateTone]}>{row.repeatRate}</span> },
  { key: "valuePerCustomer", header: "Value per customer", align: "right", render: (row) => <span className={TONE_CLASS[row.valuePerCustomerTone]}>{row.valuePerCustomer}</span> },
  { key: "featuresUsed", header: "Features used", align: "right", render: (row) => <span className={TONE_CLASS[row.featuresUsedTone]}>{row.featuresUsed}</span> },
  { key: "ratio", header: "Ratio", align: "right", render: (row) => <span className={TONE_CLASS[row.ratioTone]}>{row.ratio}</span> },
];

/** AV04 — Advocate's unique Referral quality tab (route path "quality" per its own footer, tab label "Referral quality"). */
const AdvocateReferralQualityTab = () => {
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

      <KpiCards items={ADVOCATE_QUALITY_KPIS} />

      <section className="space-y-3">
        <p className={EYEBROW_CLASS}>Referred customers against every other channel</p>
        <DataTable columns={COLUMNS} rows={ADVOCATE_QUALITY_CHANNEL_ROWS} />
      </section>

      <Callout tone="rose" title={ADVOCATE_QUALITY_INSIGHT.title}>
        {ADVOCATE_QUALITY_INSIGHT.body}
      </Callout>

      <section className="space-y-1">
        <p className={`pb-2 ${EYEBROW_CLASS}`}>Why referred customers behave better</p>
        <div className="divide-y divide-line rounded-card border border-line bg-paper">
          {ADVOCATE_QUALITY_WHY_ROWS.map((row) => (
            <div key={row.label} className="flex flex-col gap-1 px-4 py-3 sm:flex-row sm:items-baseline sm:justify-between sm:gap-4">
              <span className="text-[11.5px] text-ink-2">{row.label}</span>
              <span className={`font-mono text-[11px] ${TONE_CLASS[row.tone]}`}>{row.value}</span>
            </div>
          ))}
        </div>
      </section>

      <OpenARoomModal preset={ADVOCATE_QUALITY_OPEN_ROOM_PRESET} open={openRoom} onOpenChange={setOpenRoom} />
    </div>
  );
};

export default AdvocateReferralQualityTab;
