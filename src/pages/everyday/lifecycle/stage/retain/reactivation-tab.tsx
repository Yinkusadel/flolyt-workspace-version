import { useState } from "react";
import { createPortal } from "react-dom";

import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Callout } from "@/pages/everyday/lifecycle/stage/rail";
import { Chip, type ChipTone } from "@/pages/everyday/lifecycle/stage/chip";
import { DataTable, type Column } from "@/pages/everyday/lifecycle/stage/data-table";
import { useStageContext } from "@/pages/everyday/lifecycle/stage/layout";
import { BuildAnAudienceModal } from "@/pages/everyday/lifecycle/stage/modals/build-an-audience-modal";
import { EYEBROW_CLASS } from "@/pages/everyday/lifecycle/data";
import { formatCount, formatPercent } from "@/pages/everyday/lifecycle/format-measured-value";
import { RETAIN_BUILD_AUDIENCE_PRESET } from "@/pages/everyday/lifecycle/stage/retain/data";
import { useGetRetainReactivation } from "@/features/lifecycle/use-get-retain-reactivation";
import type { ReactivationWaveDto } from "@/services/api/lifecycle/get-retain-reactivation";

const CALLOUT_TONES = new Set(["amber", "teal", "rose", "ultra", "neutral"]);
function safeCalloutTone(tone: string): "amber" | "teal" | "rose" | "ultra" | "neutral" {
  return (CALLOUT_TONES.has(tone) ? tone : "neutral") as "amber" | "teal" | "rose" | "ultra" | "neutral";
}

// `state`'s real enum values aren't confirmed by any live response — matched defensively by
// keyword, same pattern as claimTone/safeCalloutTone elsewhere in this domain.
function stateTone(state: string): ChipTone {
  const normalized = state.toLowerCase();
  if (normalized.includes("run") || normalized.includes("active")) return "teal";
  if (normalized.includes("complet") || normalized.includes("end")) return "neutral";
  if (normalized.includes("pause") || normalized.includes("draft")) return "amber";
  return "neutral";
}

type WaveRow = ReactivationWaveDto & { id: string };

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
        {formatCount(row.audience)} <span className="text-ink-4">· {formatCount(row.dormantAtEnrolment)} dormant</span>
      </span>
    ),
  },
  {
    key: "treatment",
    header: "Reactivated",
    align: "right",
    render: (row) => <span className="text-ink-2">{row.treatmentReactivationShare !== null ? formatPercent(row.treatmentReactivationShare) : <span className="text-ink-4">Unavailable</span>}</span>,
  },
  {
    key: "holdout",
    header: "Holdout reactivated",
    align: "right",
    render: (row) => <span className="text-ink-4">{row.holdoutReactivationShare !== null ? formatPercent(row.holdoutReactivationShare) : "—"}</span>,
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
  {
    key: "medianDays",
    header: "Median days since last order",
    align: "right",
    render: (row) => <span className="font-mono text-ink-4">{row.medianDaysSinceLastOrderAtEnrolment !== null ? `${row.medianDaysSinceLastOrderAtEnrolment}d` : "Unavailable"}</span>,
  },
];

function ReactivationSkeleton() {
  return (
    <div className="space-y-3 rounded-card border border-line bg-paper p-4">
      {Array.from({ length: 3 }).map((_, index) => (
        <div key={index} className="flex items-center justify-between gap-4">
          <Skeleton className="h-3 w-32" />
          <Skeleton className="h-3 w-20" />
          <Skeleton className="h-3 w-20" />
          <Skeleton className="h-3 w-16" />
        </div>
      ))}
    </div>
  );
}

/** RT06 — Retain's own Reactivation tab, wired to GET /lifecycle/retain/reactivation. */
const RetainReactivationTab = () => {
  const { headerActionsEl } = useStageContext();
  const [buildOpen, setBuildOpen] = useState(false);
  const { data, isLoading, isError, refetch } = useGetRetainReactivation();
  const reactivation = data?.data;
  const rows: WaveRow[] = (reactivation?.waves ?? []).map((wave) => ({ ...wave, id: wave.campaignId }));

  return (
    <div className="space-y-8">
      {headerActionsEl &&
        createPortal(
          <Button type="button" size="sm" onClick={() => setBuildOpen(true)}>
            Build an audience
          </Button>,
          headerActionsEl
        )}

      <p className={EYEBROW_CLASS}>
        {reactivation
          ? `${reactivation.campaignsConsidered} campaigns considered · dormant means no order in ${reactivation.dormancyDays} days`
          : "Campaigns whose enrolled audience was mostly dormant at signup"}
      </p>

      {isError ? (
        <div className="flex flex-wrap items-center gap-3 rounded-card border border-rose-border bg-rose-bg/40 px-4 py-3">
          <p className="text-[12px] text-rose">Couldn't load Retain's reactivation waves.</p>
          <Button type="button" variant="outline" size="sm" onClick={() => refetch()}>
            Retry
          </Button>
        </div>
      ) : isLoading ? (
        <ReactivationSkeleton />
      ) : (
        <section className="space-y-3">
          <p className={EYEBROW_CLASS}>Everything that has been sent, and what it did</p>
          <DataTable
            columns={COLUMNS}
            rows={rows}
            emptyTitle="No reactivation waves yet"
            emptyBody="Campaigns aimed at dormant customers will appear here once at least one has run."
          />
        </section>
      )}

      {/* ❌ Backend does NOT provide: the three narrative "results that disagree with the
          company's habit" agent cards — no field on this endpoint carries that framing or an
          agentTag; dropped rather than shown against fabricated commentary. */}

      {reactivation?.callouts.map((callout) => (
        <Callout key={callout.key} tone={safeCalloutTone(callout.tone)} title={callout.headline}>
          {callout.body}
        </Callout>
      ))}

      <BuildAnAudienceModal preset={RETAIN_BUILD_AUDIENCE_PRESET} open={buildOpen} onOpenChange={setBuildOpen} />
    </div>
  );
};

export default RetainReactivationTab;
