import { useState } from "react";
import { createPortal } from "react-dom";

import { Button } from "@/components/ui/button";
import { Callout } from "@/pages/lifecycle/stage/rail";
import { DataTable, type Column } from "@/pages/lifecycle/stage/data-table";
import { useStageContext } from "@/pages/lifecycle/stage/layout";
import { OpenARoomModal } from "@/pages/lifecycle/stage/modals/open-a-room-modal";
import { EYEBROW_CLASS } from "@/pages/lifecycle/data";
import {
  ADVOCATE_MARKETS_OPEN_ROOM_PRESET,
  ADVOCATE_MARKET_CLOSING,
  ADVOCATE_MARKET_GHANA_ROWS,
  ADVOCATE_MARKET_ROWS,
  type AdvocateMarketRow,
} from "@/pages/lifecycle/stage/advocate/data";

const RATE_TONE_CLASS: Record<"teal" | "amber" | "rose", string> = { teal: "text-teal", amber: "text-amber", rose: "text-rose" };
const SHARE_TONE_CLASS: Record<AdvocateMarketRow["shareOfAcquisitionTone"], string> = { teal: "text-teal", rose: "text-rose" };
const TREND_CLASS: Record<AdvocateMarketRow["trend"], string> = { worsening: "text-rose", flat: "text-ink-4", improving: "text-teal" };

const COLUMNS: Column<AdvocateMarketRow>[] = [
  { key: "market", header: "Market", render: (row) => <span className="font-semibold text-ink-2">{row.market}</span> },
  { key: "referrers", header: "Referrers", align: "right", render: (row) => <span className="font-mono text-ink">{row.referrers}</span> },
  { key: "referralRate", header: "Referral rate", align: "right", render: (row) => <span className={RATE_TONE_CLASS[row.referralRateTone]}>{row.referralRate}</span> },
  { key: "referredCustomers", header: "Referred customers", align: "right", render: (row) => <span className="font-mono text-ink">{row.referredCustomers}</span> },
  { key: "shareOfAcquisition", header: "Share of acquisition", align: "right", render: (row) => <span className={SHARE_TONE_CLASS[row.shareOfAcquisitionTone]}>{row.shareOfAcquisition}</span> },
  { key: "reward", header: "Reward", align: "right", render: (row) => <span className="font-mono text-ink">{row.reward}</span> },
  { key: "trend", header: "Trend", align: "right", render: (row) => <span className={TREND_CLASS[row.trend]}>{row.trend}</span> },
];

/**
 * AV07 — Advocate's Markets tab (stage-specific layout, not the shared
 * MarketsTab template — AV07's columns are referrers/referral rate/share of
 * acquisition/reward, not Acquire's spend/CAC, confirmed by reading AV07
 * directly).
 */
const AdvocateMarketsTab = () => {
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

      <DataTable columns={COLUMNS} rows={ADVOCATE_MARKET_ROWS} />

      <Callout tone="teal" title={ADVOCATE_MARKET_CLOSING.title}>
        {ADVOCATE_MARKET_CLOSING.body}
      </Callout>

      <section className="space-y-1">
        <p className={`pb-2 ${EYEBROW_CLASS}`}>Ninth consecutive stage</p>
        <div className="divide-y divide-line rounded-card border border-line bg-paper">
          {ADVOCATE_MARKET_GHANA_ROWS.map((row) => (
            <div key={row.label} className="flex flex-col gap-1 px-4 py-3 sm:flex-row sm:items-baseline sm:justify-between sm:gap-4">
              <span className="text-[11.5px] text-ink-2">{row.label}</span>
              <span className="font-mono text-[11px] text-rose">{row.value}</span>
            </div>
          ))}
        </div>
      </section>

      <OpenARoomModal preset={ADVOCATE_MARKETS_OPEN_ROOM_PRESET} open={openRoom} onOpenChange={setOpenRoom} />
    </div>
  );
};

export default AdvocateMarketsTab;
