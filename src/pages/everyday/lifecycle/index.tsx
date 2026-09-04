import { Link } from "react-router-dom";

import { Button } from "@/components/ui/button";
import { RootCauseSpotlight } from "@/pages/everyday/lifecycle/root-cause-spotlight";
import { StageRail } from "@/pages/everyday/lifecycle/stage-rail";
import { DEPARTMENT_COLORS, ROOT_CAUSE_ROWS, STAGES, type Department, type Stage } from "@/pages/everyday/lifecycle/data";
import useGetLifecycleMap from "@/features/lifecycle/use-get-lifecycle-map";
import type { LifecycleHeadlineDto, LifecycleMeasuredValueDto } from "@/services/api/lifecycle/get-lifecycle-map";

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

function round(value: number, decimals: number): number {
  const factor = 10 ** decimals;
  return Math.round(value * factor) / factor;
}

// headline is new as of the 2026-09-04 spec paste, replacing the old commented-out "metric"
// line — a single always-present figure per card (6 of 10 stages compute one today; the other 4
// are declared but gated, same missingSource/wouldUnlock shape as atStake). This only formats the
// number; the card pairs it with headline.label as a separate caption (stage-rail.tsx), the same
// stat-tile shape atStake already used, rather than concatenating everything into one truncated
// string. unit decides the numeric formatting, never renders as a literal suffix: "percent"/"%"
// and "share"/"ratio"/"rate" (confirmed live: retain's repeat share, 0.9567) both render as a
// percentage; anything else (confirmed live: "count", "average") rounds to 1-2dp / compacts past
// 1000 — adopt's raw 10.0748175182481... needed the rounding.
function formatHeadlineValue(headline: LifecycleHeadlineDto): string | undefined {
  if (headline.value === null) return undefined;
  const { value } = headline;
  const normalizedUnit = headline.unit.trim().toLowerCase();
  if (normalizedUnit === "percent" || normalizedUnit === "%") return `${round(value, 1)}%`;
  if (normalizedUnit === "share" || normalizedUnit === "ratio" || normalizedUnit === "rate") return `${round(value * 100, 1)}%`;

  const abs = Math.abs(value);
  if (abs >= 1_000_000) return `${round(value / 1_000_000, 1)}M`;
  if (abs >= 1_000) return `${round(value / 1_000, 1)}k`;
  return `${round(value, 2)}`;
}

/**
 * The lifecycle map (LC02, plus LC01's first-run empty state and LC05's
 * ?market= filter — those aren't wired in yet, see docs/build-tracker.md).
 * See flolyt-figma-designs/flolyt-lifecycle/LC02-lifecycle-map.svg.
 *
 * Stage-card name/owningTeam/atStake/headline (the second metric line) are live from
 * GET /lifecycle/map — headline added 2026-09-04, wired same day. The root-cause spotlight
 * table (blocked on changeId discovery — see docs/endpoints/lifecycle.md) stays on mock data
 * until backend answers those questions.
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
