import { Link } from "react-router-dom";

import { Button } from "@/components/ui/button";
import { RootCauseSpotlight } from "@/pages/everyday/lifecycle/root-cause-spotlight";
import { StageRail } from "@/pages/everyday/lifecycle/stage-rail";
import { DEPARTMENT_COLORS, ROOT_CAUSE_ROWS, STAGES, type Department, type Stage } from "@/pages/everyday/lifecycle/data";
import useGetLifecycleMap from "@/features/lifecycle/use-get-lifecycle-map";
import type { LifecycleMeasuredValueDto } from "@/services/api/lifecycle/get-lifecycle-map";

const KNOWN_DEPARTMENTS = new Set(Object.keys(DEPARTMENT_COLORS));

// GET /lifecycle/map's atStake is a measured-value wrapper, not a bare number — confirmed
// 2026-08-31 from a real response (see LifecycleMeasuredValueDto). No compact-currency helper
// exists yet elsewhere in the app, so this is scoped to this card only rather than a shared
// utility.
function formatAtStake(atStake: LifecycleMeasuredValueDto<number>): string {
  if (atStake.value === null) return "Unavailable";
  const abs = Math.abs(atStake.value);
  if (abs >= 1_000_000) return `₦${Math.round(atStake.value / 1_000_000)}M`;
  if (abs >= 1_000) return `₦${Math.round(atStake.value / 1_000)}k`;
  return `₦${atStake.value}`;
}

/**
 * The lifecycle map (LC02, plus LC01's first-run empty state and LC05's
 * ?market= filter — those aren't wired in yet, see docs/build-tracker.md).
 * See flolyt-figma-designs/flolyt-lifecycle/LC02-lifecycle-map.svg.
 *
 * Stage-card name/owningTeam/atStake are live from GET /lifecycle/map; the second metric
 * line has no backend field at all (see the ❌ comment in stage-rail.tsx — commented out, not
 * faked) and the root-cause spotlight table (blocked on changeId discovery — see
 * docs/endpoints/lifecycle.md) stays on mock data until backend answers those questions.
 *
 * Once wired, a field never falls back to data.ts's mock value on loading/error/mismatch — see
 * feedback_no_hardcoded_fallback memory. Only `slug` (routing) and `amountLabel` (a fixed
 * "at stake"/"referred" framing tied to which of the 10 fixed stages this is, not measured data)
 * still come from the mock; everything else is live or an explicit "Unavailable".
 */
const Lifecycle = () => {
  const { stages: liveStages, callouts, isLoading, isError, refetch } = useGetLifecycleMap();

  const liveByKey = new Map(liveStages.map((stage) => [stage.key, stage]));

  const stages: Stage[] = STAGES.map((mock) => {
    const live = liveByKey.get(mock.slug);

    return {
      slug: mock.slug,
      amountLabel: mock.amountLabel,
      isDefined: mock.isDefined,
      headline: mock.headline,
      name: live?.name ?? "Unavailable",
      department: live?.owningTeam && KNOWN_DEPARTMENTS.has(live.owningTeam) ? (live.owningTeam as Department) : null,
      // ❌ Backend does NOT provide: metric (e.g. "894k/yr", "6 plans") — see
      // docs/endpoints/lifecycle.md's open question, still unanswered. Omitted, not faked.
      amount: live ? formatAtStake(live.atStake) : "Unavailable",
      amountCaveat: live?.atStake.value === null ? live.atStake.missingSource : undefined,
      amountWouldUnlock: live?.atStake.value === null ? live.atStake.wouldUnlock : undefined,
    };
  });

  // Advocacy-loop callout key isn't documented — matched by content until a live response
  // confirms the real key. No match found → the banner just doesn't render, never a fallback to
  // mock copy.
  const advocacyNote = callouts.find((callout) => /advoc/i.test(callout.headline) || /advoc/i.test(callout.body))?.body;

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
      <RootCauseSpotlight rows={ROOT_CAUSE_ROWS} />

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
