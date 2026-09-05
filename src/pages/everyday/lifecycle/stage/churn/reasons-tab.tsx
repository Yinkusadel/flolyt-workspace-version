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
import { CHURN_OPEN_ROOM_PRESET } from "@/pages/everyday/lifecycle/stage/churn/data";
import { useGetChurnReasons } from "@/features/lifecycle/use-get-churn-reasons";
import type { ChurnReasonDto } from "@/services/api/lifecycle/get-churn-reasons";

const CALLOUT_TONES = new Set(["amber", "teal", "rose", "ultra", "neutral"]);
function safeCalloutTone(tone: string): "amber" | "teal" | "rose" | "ultra" | "neutral" {
  return (CALLOUT_TONES.has(tone) ? tone : "neutral") as "amber" | "teal" | "rose" | "ultra" | "neutral";
}

type ReasonRow = ChurnReasonDto & { id: string };

const COLUMNS: Column<ReasonRow>[] = [
  { key: "reason", header: "Reason", render: (row) => <span className="font-semibold text-ink-2">{row.label}</span> },
  { key: "customers", header: "Customers", align: "right", render: (row) => <span className="font-mono text-ink">{row.customers !== null ? formatCount(row.customers) : <span className="text-ink-4">Unavailable</span>}</span> },
  { key: "share", header: "Share", align: "right", render: (row) => <span className="text-ink-2">{row.share !== null ? formatPercent(row.share) : <span className="text-ink-4">Unavailable</span>}</span> },
  { key: "attribution", header: "Attribution", align: "right", render: (row) => <span className="text-ink-4">{row.attribution}</span> },
  { key: "upstreamStage", header: "Stage that owns it", align: "right", render: (row) => <span className="text-ink-2">{row.upstreamStage ?? "—"}</span> },
];

function ReasonsSkeleton() {
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

/** CH03 — Churn's own Reasons tab, wired to GET /lifecycle/churn/reasons. */
const ChurnReasonsTab = () => {
  const { headerActionsEl } = useStageContext();
  const [openRoom, setOpenRoom] = useState(false);
  const { data, isLoading, isError, refetch } = useGetChurnReasons();
  const reasons = data?.data;
  const rows: ReasonRow[] = (reasons?.reasons ?? []).map((reason) => ({ ...reason, id: reason.key }));

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
        {reasons
          ? `${formatCount(reasons.lapsedCustomers)} lapsed customers · ${formatCount(reasons.unexplainedCustomers)} unexplained, never distributed across the rows below`
          : "Why customers left, as far as imported order history can say"}
      </p>

      {isError ? (
        <div className="flex flex-wrap items-center gap-3 rounded-card border border-rose-border bg-rose-bg/40 px-4 py-3">
          <p className="text-[12px] text-rose">Couldn't load Churn's reasons.</p>
          <Button type="button" variant="outline" size="sm" onClick={() => refetch()}>
            Retry
          </Button>
        </div>
      ) : isLoading ? (
        <ReasonsSkeleton />
      ) : (
        <DataTable columns={COLUMNS} rows={rows} emptyTitle="No reasons measured yet" emptyBody="Inferred and stated reasons will appear here once enough lapsed customers exist." />
      )}

      {/* ❌ Backend does NOT provide: a "vs Feb" comparison or a per-row "send reason upstream"
          action — this endpoint has no trend field, and the old mock's upstream-escalation modal
          was seeded with a per-row preset that has no real data behind it. Dropped rather than
          fabricated. */}

      {reasons?.callouts.map((callout) => (
        <Callout key={callout.key} tone={safeCalloutTone(callout.tone)} title={callout.headline}>
          {callout.body}
        </Callout>
      ))}

      <OpenARoomModal preset={CHURN_OPEN_ROOM_PRESET} open={openRoom} onOpenChange={setOpenRoom} />
    </div>
  );
};

export default ChurnReasonsTab;
