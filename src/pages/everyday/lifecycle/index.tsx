import { Link } from "react-router-dom";

import { Button } from "@/components/ui/button";
import { RootCauseSpotlight } from "@/pages/everyday/lifecycle/root-cause-spotlight";
import { StageRail } from "@/pages/everyday/lifecycle/stage-rail";
import { KNOWN_DEPARTMENTS, STAGES, type Department, type RootCauseRow, type Stage } from "@/pages/everyday/lifecycle/data";
import useGetLifecycleMap from "@/features/lifecycle/use-get-lifecycle-map";
import { useGetChurnChain } from "@/features/lifecycle/use-get-churn-chain";
import type { LifecycleMeasuredValueDto } from "@/services/api/lifecycle/get-lifecycle-map";
import { formatCompactCurrency, formatHeadlineValue } from "@/pages/everyday/lifecycle/format-measured-value";

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

      <p className="text-[11px] text-ink-4">
        Owner, lead agent and review cadence per stage now live on{" "}
        <Link to="/lifecycle/settings" className="font-semibold text-ultra hover:underline">
          stage ownership
        </Link>
        .
      </p>
    </div>
  );
};

export default Lifecycle;
