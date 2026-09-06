import { useState } from "react";
import { Link } from "react-router-dom";

import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Callout } from "@/pages/everyday/lifecycle/stage/rail";
import { Chip, type ChipTone } from "@/pages/everyday/lifecycle/stage/chip";
import { DataTable, type Column } from "@/pages/everyday/lifecycle/stage/data-table";
import { RootCauseSpotlight } from "@/pages/everyday/lifecycle/root-cause-spotlight";
import { StageRail } from "@/pages/everyday/lifecycle/stage-rail";
import { RequestGapInstrumentationModal } from "@/pages/everyday/lifecycle/modals/request-gap-instrumentation-modal";
import { KNOWN_DEPARTMENTS, STAGES, type Department, type RootCauseRow, type Stage } from "@/pages/everyday/lifecycle/data";
import useGetLifecycleMap from "@/features/lifecycle/use-get-lifecycle-map";
import { useGetChurnChain } from "@/features/lifecycle/use-get-churn-chain";
import { useGetInstrumentation } from "@/features/lifecycle/use-get-instrumentation";
import type { LifecycleMeasuredValueDto } from "@/services/api/lifecycle/get-lifecycle-map";
import type { InstrumentationGapDto } from "@/services/api/lifecycle/get-instrumentation";
import { formatCompactCurrency, formatHeadlineValue, formatShortDate } from "@/pages/everyday/lifecycle/format-measured-value";

const CALLOUT_TONES = new Set(["amber", "teal", "rose", "ultra", "neutral"]);
function safeCalloutTone(tone: string): "amber" | "teal" | "rose" | "ultra" | "neutral" {
  return (CALLOUT_TONES.has(tone) ? tone : "neutral") as "amber" | "teal" | "rose" | "ultra" | "neutral";
}

// `state`'s only documented value is "no-request" — everything else is an unconfirmed
// request-lifecycle state, matched defensively by keyword.
function gapStateTone(state: string): ChipTone {
  if (state === "no-request") return "neutral";
  const normalized = state.toLowerCase();
  if (normalized.includes("close") || normalized.includes("delivered") || normalized.includes("resolved")) return "teal";
  if (normalized.includes("withdraw") || normalized.includes("reject")) return "rose";
  return "amber";
}

const GAP_STATE_LABEL: Record<string, string> = { "no-request": "Not requested" };

type GapRow = InstrumentationGapDto & { id: string };

function buildGapColumns(onRequest: (row: GapRow) => void): Column<GapRow>[] {
  return [
    {
      key: "what",
      header: "What",
      render: (row) => (
        <div>
          <p className="font-semibold text-ink-2">{row.name}</p>
          <p className="mt-0.5 text-[10px] text-ink-4">{row.gap}</p>
        </div>
      ),
    },
    {
      key: "blocks",
      header: "Blocks",
      render: (row) => <span className="text-ink-2">{row.blockedStages.length > 0 ? row.blockedStages.join(", ") : <span className="text-ink-4">No stage, currently</span>}</span>,
    },
    {
      key: "wouldUnlock",
      header: "Would unlock",
      render: (row) => <span className="text-ink-2">{row.wouldUnlock ?? <span className="text-ink-4">Unavailable</span>}</span>,
    },
    {
      key: "owner",
      header: "Who could fix it",
      align: "right",
      render: (row) => (row.ownerName ? <span className="text-ink-2">{row.ownerName}</span> : <Chip tone="amber">No owner</Chip>),
    },
    {
      key: "overdue",
      header: "Overdue",
      align: "right",
      render: (row) =>
        row.daysOverdue !== null && row.daysOverdue > 0 ? (
          <span className="font-mono text-rose">{row.daysOverdue}d overdue</span>
        ) : row.neededByUtc ? (
          <span className="font-mono text-ink-4">needed by {formatShortDate(row.neededByUtc)}</span>
        ) : (
          <span className="text-ink-4">—</span>
        ),
    },
    {
      key: "state",
      header: "State",
      align: "right",
      render: (row) => <Chip tone={gapStateTone(row.state)}>{GAP_STATE_LABEL[row.state] ?? row.state}</Chip>,
    },
    {
      key: "action",
      header: "",
      align: "right",
      render: (row) =>
        row.state === "no-request" ? (
          <Button type="button" variant="outline" size="sm" onClick={() => onRequest(row)}>
            Request
          </Button>
        ) : null,
    },
  ];
}

function GapsSkeleton() {
  return (
    <div className="space-y-3 rounded-card border border-line bg-paper p-4">
      {Array.from({ length: 3 }).map((_, index) => (
        <div key={index} className="flex items-center justify-between gap-4">
          <Skeleton className="h-3 w-40" />
          <Skeleton className="h-3 w-24" />
          <Skeleton className="h-4 w-16 rounded-chip" />
        </div>
      ))}
    </div>
  );
}

// GET /lifecycle/map's atStake is a measured-value wrapper, not a bare number — confirmed
// 2026-08-31 from a real response (see LifecycleMeasuredValueDto).
function formatAtStake(atStake: LifecycleMeasuredValueDto<number>): string {
  if (atStake.value === null) return "Unavailable";
  return formatCompactCurrency(atStake.value);
}

/**
 * The lifecycle map (LC02, plus LC01's first-run empty state and LC05's
 * ?market= filter — those aren't wired in yet, see docs/build-tracker.md).
 * See flolyt-figma-designs/flolyt-lifecycle/LC02-lifecycle-map.svg.
 *
 * Stage-card name/owningTeam/atStake/headline (the second metric line) are live from
 * GET /lifecycle/map — headline added 2026-09-04, wired same day. The root-cause spotlight
 * table is live from GET /lifecycle/churn/chain, called with no `changeId` so the backend
 * auto-picks the change whose effects reached the most stages — see docs/endpoints/lifecycle.md's
 * correction (that endpoint replaces the originally-guessed GET /changes/{changeId}/impact, which
 * had no narrative field and no changeId-discovery path).
 *
 * Once wired, a field never falls back to data.ts's mock value on loading/error/mismatch — see
 * feedback_no_hardcoded_fallback memory. Only `slug` (routing) and `amountLabel` (a fixed
 * "at stake"/"referred" framing tied to which of the 10 fixed stages this is, not measured data)
 * still come from the mock; everything else is live or an explicit "Unavailable".
 */
const Lifecycle = () => {
  const { stages: liveStages, callouts, isLoading, isError, refetch } = useGetLifecycleMap();
  const churnChainQuery = useGetChurnChain();
  const instrumentationQuery = useGetInstrumentation();
  const [gapToRequest, setGapToRequest] = useState<GapRow | null>(null);

  const liveByKey = new Map(liveStages.map((stage) => [stage.key, stage]));

  const stages: Stage[] = STAGES.map((mock) => {
    const live = liveByKey.get(mock.slug);

    return {
      slug: mock.slug,
      amountLabel: mock.amountLabel,
      isDefined: mock.isDefined,
      name: live?.name ?? "Unavailable",
      department: live?.owningTeam && KNOWN_DEPARTMENTS.has(live.owningTeam) ? (live.owningTeam as Department) : null,
      metricValue: live ? formatHeadlineValue(live.headline) : undefined,
      metricLabel: live?.headline.label,
      metricCaveat: live?.headline.value === null ? (live.headline.missingSource ?? undefined) : undefined,
      metricWouldUnlock: live?.headline.value === null ? (live.headline.wouldUnlock ?? undefined) : undefined,
      amount: live ? formatAtStake(live.atStake) : "Unavailable",
      amountCaveat: live?.atStake.value === null ? live.atStake.missingSource : undefined,
      amountWouldUnlock: live?.atStake.value === null ? live.atStake.wouldUnlock : undefined,
    };
  });

  // Advocacy-loop callout key isn't documented — matched by content until a live response
  // confirms the real key. No match found → the banner just doesn't render, never a fallback to
  // mock copy.
  const advocacyNote = callouts.find((callout) => /advoc/i.test(callout.headline) || /advoc/i.test(callout.body))?.body;

  const churnChain = churnChainQuery.data?.data;
  // Only stages with an actual symptom sentence are shown — churn/chain always returns all 10
  // stages (including the ones that didn't move), and `symptom` is null for those.
  const rootCauseRows: RootCauseRow[] =
    churnChain?.stages.flatMap((stage) => {
      if (stage.symptom === null) return [];
      return [
        {
          stage: stage.stageName,
          department: stage.owningTeam && KNOWN_DEPARTMENTS.has(stage.owningTeam) ? (stage.owningTeam as Department) : null,
          detail: stage.symptom,
        },
      ];
    }) ?? [];

  const instrumentation = instrumentationQuery.data?.data;
  const gapRows: GapRow[] = (instrumentation?.gaps ?? []).map((gap) => ({ ...gap, id: gap.gapKey }));
  const gapColumns = buildGapColumns(setGapToRequest);

  return (
    <div className="space-y-8">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <h1 className="text-[17px] font-semibold text-ink">The customer lifecycle</h1>
          <p className="mt-1 text-[11.5px] text-ink-3">
            Ten stages, one revenue story · every stage has an owning team and a live number
          </p>
        </div>
        <Button type="button" className="shrink-0">
          Open a war room
        </Button>
      </div>

      <StageRail
        stages={stages}
        advocacyNote={advocacyNote}
        isLoading={isLoading}
        isError={isError}
        onRetry={() => refetch()}
      />
      <RootCauseSpotlight
        title={churnChain?.title ?? ""}
        rows={rootCauseRows}
        stagesThatMoved={churnChain?.stagesThatMoved ?? 0}
        callouts={churnChain?.callouts ?? []}
        isLoading={churnChainQuery.isLoading}
        isError={churnChainQuery.isError}
        errorMessage={churnChainQuery.error?.message}
        onRetry={() => churnChainQuery.refetch()}
      />

      <section className="space-y-3">
        <p className="font-mono text-[9.5px] font-medium tracking-[1.05px] text-ink-4 uppercase">
          What Flolyt can't see, workspace-wide
          {instrumentation ? ` · ${gapRows.length}` : ""}
          {instrumentation && instrumentation.unrequestedCount > 0 ? ` · ${instrumentation.unrequestedCount} unrequested` : ""}
          {instrumentation && instrumentation.overdueCount > 0 ? ` · ${instrumentation.overdueCount} overdue` : ""}
        </p>

        {instrumentationQuery.isError ? (
          <div className="flex flex-wrap items-center gap-3 rounded-card border border-rose-border bg-rose-bg/40 px-4 py-3">
            <p className="text-[12px] text-rose">Couldn't load instrumentation gaps.</p>
            <Button type="button" variant="outline" size="sm" onClick={() => instrumentationQuery.refetch()}>
              Retry
            </Button>
          </div>
        ) : instrumentationQuery.isLoading ? (
          <GapsSkeleton />
        ) : (
          <DataTable
            columns={gapColumns}
            rows={gapRows}
            emptyTitle="Nothing Flolyt can't see"
            emptyBody="Every gap the agent roster has flagged has already been instrumented."
          />
        )}

        {instrumentation?.callouts.map((callout) => (
          <Callout key={callout.key} tone={safeCalloutTone(callout.tone)} title={callout.headline}>
            {callout.body}
          </Callout>
        ))}
      </section>

      <p className="text-[11px] text-ink-4">
        Owner, lead agent and review cadence per stage now live on{" "}
        <Link to="/lifecycle/settings" className="font-semibold text-ultra hover:underline">
          stage ownership
        </Link>
        .
      </p>

      <RequestGapInstrumentationModal gap={gapToRequest} open={!!gapToRequest} onOpenChange={(next) => !next && setGapToRequest(null)} />
    </div>
  );
};

export default Lifecycle;
