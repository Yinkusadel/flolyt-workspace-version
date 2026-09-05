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
import { CHURN_PREDICTION_OPEN_ROOM_PRESET } from "@/pages/everyday/lifecycle/stage/churn/data";
import { useGetChurnPrediction } from "@/features/lifecycle/use-get-churn-prediction";
import type { ChurnSignalDto } from "@/services/api/lifecycle/get-churn-prediction";

const CALLOUT_TONES = new Set(["amber", "teal", "rose", "ultra", "neutral"]);
function safeCalloutTone(tone: string): "amber" | "teal" | "rose" | "ultra" | "neutral" {
  if (CALLOUT_TONES.has(tone)) return tone as "amber" | "teal" | "rose" | "ultra" | "neutral";
  const normalized = tone.toLowerCase();
  if (normalized.includes("attention")) return "amber";
  if (normalized.includes("insight")) return "teal";
  return "neutral";
}

type SignalRow = ChurnSignalDto & { id: string };

const COLUMNS: Column<SignalRow>[] = [
  { key: "name", header: "Signal", render: (row) => <span className="font-semibold text-ink-2">{row.name}</span> },
  {
    key: "precededShare",
    header: "Preceded departure",
    align: "right",
    render: (row) => <span className="text-ink-2">{row.precededShare !== null ? formatPercent(row.precededShare) : <span className="text-ink-4">Unavailable</span>}</span>,
  },
  {
    key: "leadTimeDays",
    header: "Lead time",
    align: "right",
    render: (row) => <span className="font-mono text-ink-2">{row.leadTimeDays !== null ? `${row.leadTimeDays}d` : <span className="text-ink-4">Unavailable</span>}</span>,
  },
  {
    key: "customersTripping",
    header: "Customers tripping",
    align: "right",
    render: (row) => <span className="font-mono text-ink">{row.customersTripping !== null ? formatCount(row.customersTripping) : <span className="text-ink-4">Unavailable</span>}</span>,
  },
];

function PredictionSkeleton() {
  return (
    <div className="space-y-3 rounded-card border border-line bg-paper p-4">
      {Array.from({ length: 3 }).map((_, index) => (
        <div key={index} className="flex items-center justify-between gap-4">
          <Skeleton className="h-3 w-32" />
          <Skeleton className="h-3 w-16" />
          <Skeleton className="h-3 w-16" />
        </div>
      ))}
    </div>
  );
}

/** CH04 — Churn's own Prediction tab, wired to GET /lifecycle/churn/prediction. */
const ChurnPredictionTab = () => {
  const { headerActionsEl } = useStageContext();
  const [openRoom, setOpenRoom] = useState(false);
  const { data, isLoading, isError, refetch } = useGetChurnPrediction();
  const prediction = data?.data;
  const rows: SignalRow[] = (prediction?.signals ?? []).map((signal) => ({ ...signal, id: signal.key }));

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
        {prediction ? `${formatCount(prediction.lapsedCustomers)} lapsed customers · no fused risk score, signals named individually` : "Leading churn signals, never fused into a score"}
      </p>

      {isError ? (
        <div className="flex flex-wrap items-center gap-3 rounded-card border border-rose-border bg-rose-bg/40 px-4 py-3">
          <p className="text-[12px] text-rose">Couldn't load Churn's prediction signals.</p>
          <Button type="button" variant="outline" size="sm" onClick={() => refetch()}>
            Retry
          </Button>
        </div>
      ) : isLoading ? (
        <PredictionSkeleton />
      ) : (
        <DataTable columns={COLUMNS} rows={rows} emptyTitle="No signals measured yet" emptyBody="Leading indicators will appear here once enough order history exists to read them." />
      )}

      <p className="text-[10.5px] text-ink-4">
        `Preceded departure` is prevalence among past departures, not a fitted weight — read it as "how often this showed up before someone left," not a model coefficient.
      </p>

      {/* ❌ Backend does NOT provide: a "weight", an "available?" chip, or the stage each signal
          comes from — this endpoint only names each signal with its prevalence, lead time and
          trip count. Dropped rather than fabricated. */}

      {prediction?.callouts.map((callout) => (
        <Callout key={callout.key} tone={safeCalloutTone(callout.tone)} title={callout.headline}>
          {callout.body}
        </Callout>
      ))}

      <OpenARoomModal preset={CHURN_PREDICTION_OPEN_ROOM_PRESET} open={openRoom} onOpenChange={setOpenRoom} />
    </div>
  );
};

export default ChurnPredictionTab;
