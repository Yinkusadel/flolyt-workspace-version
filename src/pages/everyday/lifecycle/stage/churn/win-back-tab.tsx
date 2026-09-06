import { useState } from "react";
import { createPortal } from "react-dom";

import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Callout } from "@/pages/everyday/lifecycle/stage/rail";
import { Chip, type ChipTone } from "@/pages/everyday/lifecycle/stage/chip";
import { DataTable, type Column } from "@/pages/everyday/lifecycle/stage/data-table";
import { useStageContext } from "@/pages/everyday/lifecycle/stage/layout";
import { OpenARoomModal } from "@/pages/everyday/lifecycle/stage/modals/open-a-room-modal";
import { EYEBROW_CLASS } from "@/pages/everyday/lifecycle/data";
import { formatCount, formatPercent } from "@/pages/everyday/lifecycle/format-measured-value";
import { CHURN_WINBACK_OPEN_ROOM_PRESET } from "@/pages/everyday/lifecycle/stage/churn/data";
import { useGetChurnWinBack } from "@/features/lifecycle/use-get-churn-win-back";
import type { WinBackWaveDto } from "@/services/api/lifecycle/get-churn-win-back";

const CALLOUT_TONES = new Set(["amber", "teal", "rose", "ultra", "neutral"]);
function safeCalloutTone(tone: string): "amber" | "teal" | "rose" | "ultra" | "neutral" {
  if (CALLOUT_TONES.has(tone)) return tone as "amber" | "teal" | "rose" | "ultra" | "neutral";
  const normalized = tone.toLowerCase();
  if (normalized.includes("attention")) return "amber";
  if (normalized.includes("insight")) return "teal";
  return "neutral";
}

// `state`'s real enum values aren't confirmed by any live response — matched defensively by
// keyword, same pattern as Retain's reactivation-tab.tsx (the closest sibling endpoint).
function stateTone(state: string): ChipTone {
  const normalized = state.toLowerCase();
  if (normalized.includes("run") || normalized.includes("active")) return "teal";
  if (normalized.includes("complet") || normalized.includes("end")) return "neutral";
  if (normalized.includes("pause") || normalized.includes("draft")) return "amber";
  return "neutral";
}

type WaveRow = WinBackWaveDto & { id: string };

const COLUMNS: Column<WaveRow>[] = [
  {
    key: "campaign",
    header: "Campaign",
    render: (row) => (
      <div>
        <p className="font-semibold text-ink-2">{row.name}</p>
        <Chip tone={stateTone(row.state)} className="mt-1">
          {row.state}
        </Chip>
      </div>
    ),
  },
  {
    key: "audience",
    header: "Audience",
    align: "right",
    render: (row) => (
      <span className="font-mono text-ink">
        {formatCount(row.audience)} <span className="text-ink-4">· {formatCount(row.targetedPastBoundary)} past boundary</span>
      </span>
    ),
  },
  {
    key: "treatment",
    header: "Recovered",
    align: "right",
    render: (row) => <span className="text-ink-2">{row.treatmentRecoveryShare !== null ? formatPercent(row.treatmentRecoveryShare) : <span className="text-ink-4">Unavailable</span>}</span>,
  },
  {
    key: "holdout",
    header: "Holdout recovered",
    align: "right",
    render: (row) => <span className="text-ink-4">{row.holdoutRecoveryShare !== null ? formatPercent(row.holdoutRecoveryShare) : "—"}</span>,
  },
  {
    key: "lift",
    header: "Lift",
    align: "right",
    render: (row) =>
      row.attribution === "holdout" && row.liftPoints !== null ? (
        <span className={row.liftPoints >= 0 ? "text-teal" : "text-rose"}>
          {row.liftPoints >= 0 ? "+" : ""}
          {row.liftPoints.toFixed(1)} pts
        </span>
      ) : (
        <span className="text-ink-4" title={row.unattributableBecause ?? undefined}>
          Unattributable
        </span>
      ),
  },
];

function WinBackSkeleton() {
  return (
    <div className="space-y-3 rounded-card border border-line bg-paper p-4">
      {Array.from({ length: 3 }).map((_, index) => (
        <div key={index} className="flex items-center justify-between gap-4">
          <Skeleton className="h-3 w-32" />
          <Skeleton className="h-3 w-20" />
          <Skeleton className="h-3 w-16" />
        </div>
      ))}
    </div>
  );
}

/** CH05 — Churn's own Win-back tab, wired to GET /lifecycle/churn/win-back. */
const ChurnWinBackTab = () => {
  const { headerActionsEl } = useStageContext();
  const [openRoom, setOpenRoom] = useState(false);
  const { data, isLoading, isError, refetch } = useGetChurnWinBack();
  const winBack = data?.data;
  const rows: WaveRow[] = (winBack?.waves ?? []).map((wave) => ({ ...wave, id: wave.campaignId }));

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
        {winBack
          ? `${formatCount(winBack.lapsedCustomers)} lapsed · ${formatCount(winBack.reachableNeverContacted)} reachable, never contacted · ${formatCount(winBack.unreachable)} unreachable`
          : "What's being aimed at customers already gone"}
      </p>

      {isError ? (
        <div className="flex flex-wrap items-center gap-3 rounded-card border border-rose-border bg-rose-bg/40 px-4 py-3">
          <p className="text-[12px] text-rose">Couldn't load Churn's win-back waves.</p>
          <Button type="button" variant="outline" size="sm" onClick={() => refetch()}>
            Retry
          </Button>
        </div>
      ) : isLoading ? (
        <WinBackSkeleton />
      ) : (
        <DataTable columns={COLUMNS} rows={rows} emptyTitle="No win-back waves yet" emptyBody="Campaigns aimed at lapsed customers will appear here once at least one has run." />
      )}

      {/* ❌ Backend does NOT provide: days-since-last-order, an offer description, or a per-wave
          cost-per-recovery/verdict — this endpoint only carries audience/recovery-share/lift per
          wave, recognised by who it reached (mostly past the lapse boundary at enrolment), not by
          offer or campaign metadata. Dropped rather than fabricated. */}

      {winBack?.callouts.map((callout) => (
        <Callout key={callout.key} tone={safeCalloutTone(callout.tone)} title={callout.headline}>
          {callout.body}
        </Callout>
      ))}

      <OpenARoomModal preset={CHURN_WINBACK_OPEN_ROOM_PRESET} open={openRoom} onOpenChange={setOpenRoom} />
    </div>
  );
};

export default ChurnWinBackTab;
