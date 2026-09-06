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
import { RENEW_DUNNING_OPEN_ROOM_PRESET } from "@/pages/everyday/lifecycle/stage/renew/data";
import { useGetRenewDunning } from "@/features/lifecycle/use-get-renew-dunning";
import type { DunningBandDto } from "@/services/api/lifecycle/get-renew-dunning";

const CALLOUT_TONES = new Set(["amber", "teal", "rose", "ultra", "neutral"]);
function safeCalloutTone(tone: string): "amber" | "teal" | "rose" | "ultra" | "neutral" {
  return (CALLOUT_TONES.has(tone) ? tone : "neutral") as "amber" | "teal" | "rose" | "ultra" | "neutral";
}

const BAND_LABEL: Record<string, string> = {
  "within-a-day": "Cleared within a day",
  "within-a-week": "Cleared within a week",
  later: "Cleared later",
  never: "Never cleared",
};

type BandRow = DunningBandDto & { id: string };

const COLUMNS: Column<BandRow>[] = [
  { key: "band", header: "Outcome", render: (row) => <span className="font-semibold text-ink-2">{BAND_LABEL[row.band] ?? row.band}</span> },
  { key: "customers", header: "Customers", align: "right", render: (row) => <span className="font-mono text-ink">{formatCount(row.customers)}</span> },
  {
    key: "share",
    header: "Share",
    align: "right",
    render: (row) => <span className={row.band === "never" ? "text-rose" : "text-teal"}>{row.share !== null ? formatPercent(row.share) : <span className="text-ink-4">No share reported</span>}</span>,
  },
];

function DunningSkeleton() {
  return (
    <div className="space-y-3 rounded-card border border-line bg-paper p-4">
      {Array.from({ length: 4 }).map((_, index) => (
        <div key={index} className="flex items-center justify-between gap-4">
          <Skeleton className="h-3 w-32" />
          <Skeleton className="h-3 w-16" />
          <Skeleton className="h-3 w-16" />
        </div>
      ))}
    </div>
  );
}

/** RN04 — Renew's own Dunning tab, wired to GET /lifecycle/renew/dunning. */
const RenewDunningTab = () => {
  const { headerActionsEl } = useStageContext();
  const [openRoom, setOpenRoom] = useState(false);
  const { data, isLoading, isError, refetch } = useGetRenewDunning();
  const dunning = data?.data;
  const rows: BandRow[] = (dunning?.bands ?? []).map((band) => ({ ...band, id: band.band }));

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
        {dunning
          ? `${dunning.failed !== null ? formatCount(dunning.failed) : "?"} failed payments · ${dunning.recovered !== null ? formatCount(dunning.recovered) : "?"} eventually recovered`
          : "Whether a failed payment ever clears, and how long it took"}
      </p>

      {isError ? (
        <div className="flex flex-wrap items-center gap-3 rounded-card border border-rose-border bg-rose-bg/40 px-4 py-3">
          <p className="text-[12px] text-rose">Couldn't load Renew's dunning.</p>
          <Button type="button" variant="outline" size="sm" onClick={() => refetch()}>
            Retry
          </Button>
        </div>
      ) : isLoading ? (
        <DunningSkeleton />
      ) : (
        <DataTable columns={COLUMNS} rows={rows} emptyTitle="No failed payments measured yet" emptyBody="Failed-payment outcomes will be banded here once the order stream carries at least one." />
      )}

      {/* ❌ Backend does NOT provide: a per-retry-window attempts/cleared/rate table or "what the
          closed room recovered" breakdown — this endpoint only bands failed payments by how long
          they took to clear (or never), not by retry attempt. Dropped rather than fabricated. */}

      {dunning?.callouts.map((callout) => (
        <Callout key={callout.key} tone={safeCalloutTone(callout.tone)} title={callout.headline}>
          {callout.body}
        </Callout>
      ))}

      <OpenARoomModal preset={RENEW_DUNNING_OPEN_ROOM_PRESET} open={openRoom} onOpenChange={setOpenRoom} />
    </div>
  );
};

export default RenewDunningTab;
