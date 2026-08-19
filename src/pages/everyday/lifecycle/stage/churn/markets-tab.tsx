import { useState } from "react";
import { createPortal } from "react-dom";

import { Button } from "@/components/ui/button";
import { PersonAvatar } from "@/components/person-avatar";
import { Callout } from "@/pages/everyday/lifecycle/stage/rail";
import { Chip } from "@/pages/everyday/lifecycle/stage/chip";
import { DataTable, type Column } from "@/pages/everyday/lifecycle/stage/data-table";
import { useStageContext } from "@/pages/everyday/lifecycle/stage/layout";
import { OpenARoomModal } from "@/pages/everyday/lifecycle/stage/modals/open-a-room-modal";
import { EYEBROW_CLASS } from "@/pages/everyday/lifecycle/data";
import {
  CHURN_GHANA_ACROSS_STAGES_ROWS,
  CHURN_GHANA_CLOSING,
  CHURN_MARKET_CLOSING,
  CHURN_MARKET_ROWS,
  CHURN_MARKETS_OPEN_ROOM_PRESET,
  type ChurnMarketRow,
  type GhanaStageRow,
} from "@/pages/everyday/lifecycle/stage/churn/data";

const RATE_TONE_CLASS: Record<"teal" | "rose", string> = { teal: "text-teal", rose: "text-rose" };
const REASON_TONE_CLASS: Record<"amber" | "teal" | "rose", string> = { amber: "text-amber", teal: "text-teal", rose: "text-rose" };
const REACHABLE_TONE_CLASS: Record<"teal" | "amber", string> = { teal: "text-teal", amber: "text-amber" };
const CONTACTED_TONE_CLASS: Record<"rose" | "amber" | "teal", string> = { rose: "text-rose", amber: "text-amber", teal: "text-teal" };
const STAKE_TONE_CLASS: Record<"rose" | "amber" | "neutral", string> = { rose: "text-rose", amber: "text-amber", neutral: "text-ink-4" };
const TREND_CLASS: Record<ChurnMarketRow["trend"], string> = { worsening: "text-rose", flat: "text-ink-4", improving: "text-teal" };
const RANK_TONE_CLASS: Record<GhanaStageRow["rankTone"], string> = { rose: "text-rose", amber: "text-amber", neutral: "text-ink-4" };

const COLUMNS: Column<ChurnMarketRow>[] = [
  { key: "market", header: "Market", render: (row) => <span className="font-semibold text-ink-2">{row.market}</span> },
  { key: "churnedYr", header: "Churned / yr", align: "right", render: (row) => <span className="font-mono text-ink">{row.churnedYr}</span> },
  { key: "monthlyRate", header: "Monthly rate", align: "right", render: (row) => <span className={RATE_TONE_CLASS[row.monthlyRateTone]}>{row.monthlyRate}</span> },
  { key: "reasonKnown", header: "Reason known", align: "right", render: (row) => <span className={row.reasonKnown === "Unavailable" ? "font-mono text-ink-4" : REASON_TONE_CLASS[row.reasonKnownTone]}>{row.reasonKnown}</span> },
  { key: "reachable", header: "Reachable", align: "right", render: (row) => <span className={REACHABLE_TONE_CLASS[row.reachableTone]}>{row.reachable}</span> },
  { key: "everContacted", header: "Ever contacted", align: "right", render: (row) => <span className={CONTACTED_TONE_CLASS[row.everContactedTone]}>{row.everContacted}</span> },
  { key: "atStake", header: "At stake", align: "right", render: (row) => <span className={STAKE_TONE_CLASS[row.atStakeTone]}>{row.atStake}</span> },
  { key: "trend", header: "Trend", align: "right", render: (row) => <span className={TREND_CLASS[row.trend]}>{row.trend}</span> },
];

const GHANA_COLUMNS: Column<GhanaStageRow>[] = [
  { key: "stage", header: "Stage", render: (row) => <span className="font-semibold text-ink-2">{row.stage}</span> },
  { key: "reading", header: "Ghana's reading", render: (row) => <span className="text-ink-2">{row.reading}</span> },
  { key: "rank", header: "Rank of four", align: "right", render: (row) => <span className={RANK_TONE_CLASS[row.rankTone]}>{row.rank}</span> },
  {
    key: "owner",
    header: "Owner",
    render: (row) =>
      row.owner ? (
        <span className="flex items-center gap-2 whitespace-nowrap text-ink-2">
          <PersonAvatar kind="human" initials={row.owner.initials} size="sm" style={{ backgroundColor: row.owner.color }} />
          {row.owner.name}
        </span>
      ) : row.noOwner ? (
        <Chip tone="amber">No owner</Chip>
      ) : null,
  },
];

/**
 * CH07 — Churn's Markets tab. Not the shared MarketsTab template: CH07 uses
 * churned/monthly-rate/reason-known/reachable/ever-contacted columns
 * instead of spend/CAC, and closes with a bespoke "Ghana across all ten
 * stages" cross-stage table (one row per stage, Ghana's own reading, its
 * rank of four markets, and its owner) rather than the shared 3-card
 * spotlight section — a different shape, confirmed by reading CH07
 * directly.
 */
const ChurnMarketsTab = () => {
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

      <section className="space-y-3">
        <DataTable columns={COLUMNS} rows={CHURN_MARKET_ROWS} />
      </section>

      <Callout tone="rose" title={CHURN_MARKET_CLOSING.title}>
        {CHURN_MARKET_CLOSING.body}
      </Callout>

      <section className="space-y-3">
        <p className={EYEBROW_CLASS}>Ghana across all ten stages</p>
        <DataTable columns={GHANA_COLUMNS} rows={CHURN_GHANA_ACROSS_STAGES_ROWS} />
      </section>

      <Callout tone="rose" title={CHURN_GHANA_CLOSING.title}>
        {CHURN_GHANA_CLOSING.body}
      </Callout>

      <OpenARoomModal preset={CHURN_MARKETS_OPEN_ROOM_PRESET} open={openRoom} onOpenChange={setOpenRoom} />
    </div>
  );
};

export default ChurnMarketsTab;
