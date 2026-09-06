import { useState } from "react";
import { createPortal } from "react-dom";

import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Callout } from "@/pages/everyday/lifecycle/stage/rail";
import { DataTable, type Column } from "@/pages/everyday/lifecycle/stage/data-table";
import { useStageContext } from "@/pages/everyday/lifecycle/stage/layout";
import { OpenARoomModal } from "@/pages/everyday/lifecycle/stage/modals/open-a-room-modal";
import { EYEBROW_CLASS } from "@/pages/everyday/lifecycle/data";
import { formatCount, formatPercent } from "@/pages/everyday/lifecycle/format-measured-value";
import { ADVOCATE_REFERRERS_OPEN_ROOM_PRESET } from "@/pages/everyday/lifecycle/stage/advocate/data";
import { useGetAdvocateReferrers } from "@/features/lifecycle/use-get-advocate-referrers";
import type { AdvocateReferrerBandDto } from "@/services/api/lifecycle/get-advocate-referrers";

const CALLOUT_TONES = new Set(["amber", "teal", "rose", "ultra", "neutral"]);
function safeCalloutTone(tone: string): "amber" | "teal" | "rose" | "ultra" | "neutral" {
  return (CALLOUT_TONES.has(tone) ? tone : "neutral") as "amber" | "teal" | "rose" | "ultra" | "neutral";
}

type BandRow = AdvocateReferrerBandDto & { id: string };

const COLUMNS: Column<BandRow>[] = [
  { key: "referrals", header: "Referrals", render: (row) => <span className="font-semibold text-ink-2">{row.referrals}+</span> },
  { key: "referrers", header: "Advocates", align: "right", render: (row) => <span className="font-mono text-ink">{formatCount(row.referrers)}</span> },
  { key: "lapsed", header: "Lapsed", align: "right", render: (row) => <span className="font-mono text-rose">{formatCount(row.lapsed)}</span> },
  {
    key: "lapsedShare",
    header: "Lapsed share",
    align: "right",
    render: (row) => <span className="text-ink-2">{row.lapsedShare !== null ? formatPercent(row.lapsedShare) : <span className="text-ink-4">No share reported</span>}</span>,
  },
];

function ReferrersSkeleton() {
  return (
    <div className="space-y-3 rounded-card border border-line bg-paper p-4">
      {Array.from({ length: 4 }).map((_, index) => (
        <div key={index} className="flex items-center justify-between gap-4">
          <Skeleton className="h-3 w-24" />
          <Skeleton className="h-3 w-16" />
          <Skeleton className="h-3 w-16" />
        </div>
      ))}
    </div>
  );
}

/** AV03 — Advocate's own Referrers tab, wired to GET /lifecycle/advocate/referrers. */
const AdvocateReferrersTab = () => {
  const { headerActionsEl } = useStageContext();
  const [openRoom, setOpenRoom] = useState(false);
  const { data, isLoading, isError, refetch } = useGetAdvocateReferrers();
  const referrers = data?.data;
  const rows: BandRow[] = (referrers?.bands ?? []).map((band) => ({ ...band, id: String(band.referrals) }));

  return (
    <div className="space-y-8">
      {headerActionsEl &&
        createPortal(
          <Button type="button" size="sm" onClick={() => setOpenRoom(true)}>
            Open a war room
          </Button>,
          headerActionsEl
        )}

      <p className={EYEBROW_CLASS}>
        {referrers
          ? `${referrers.referrers !== null ? formatCount(referrers.referrers) : "?"} advocates · ${referrers.referred !== null ? formatCount(referrers.referred) : "?"} referred · ${referrers.concentration !== null ? formatPercent(referrers.concentration) : "unavailable"} of referrals from the busiest decile · silent ${referrers.lapsedAfterDays}+ days counts as lapsed`
          : "Who refers, how concentrated it is, who's stopped"}
      </p>

      {isError ? (
        <div className="flex flex-wrap items-center gap-3 rounded-card border border-rose-border bg-rose-bg/40 px-4 py-3">
          <p className="text-[12px] text-rose">Couldn't load Advocate's referrers.</p>
          <Button type="button" variant="outline" size="sm" onClick={() => refetch()}>
            Retry
          </Button>
        </div>
      ) : isLoading ? (
        <ReferrersSkeleton />
      ) : (
        <DataTable columns={COLUMNS} rows={rows} emptyTitle="No referrers measured yet" emptyBody="Advocates will be banded by referral count here once at least one exists." />
      )}

      {/* ❌ Backend does NOT provide: per-band customer/repeat-rate/verdict columns, or a per-group
          drilldown — this endpoint only bands advocates by referral count with a lapsed share.
          Dropped rather than fabricated. The old per-row drilldown link is also dropped —
          it was keyed to one specific mock group, not a general per-band endpoint; see
          [[flag_unreachable_routes]], one-referrer-group-route.tsx is now unreachable. */}

      {referrers?.callouts.map((callout) => (
        <Callout key={callout.key} tone={safeCalloutTone(callout.tone)} title={callout.headline}>
          {callout.body}
        </Callout>
      ))}

      <OpenARoomModal preset={ADVOCATE_REFERRERS_OPEN_ROOM_PRESET} open={openRoom} onOpenChange={setOpenRoom} />
    </div>
  );
};

export default AdvocateReferrersTab;
