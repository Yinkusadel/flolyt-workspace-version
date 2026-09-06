import { useState } from "react";
import { NavLink, Outlet } from "react-router-dom";

import { cn } from "@/lib/utils";
import { useStageContext, type StageOutletContext } from "@/pages/everyday/lifecycle/stage/layout";
import { STAGE_TABS } from "@/pages/everyday/lifecycle/stage/stage-tabs-config";
// Skeleton / InfoTooltip / formatCompactCurrency / formatHeadlineValue / useGetLifecycleMap were
// only used by the commented-out StageHeadlineSubtitle below — re-import all five if it's ever
// reinstated.

const TAB_CLASS = ({ isActive }: { isActive: boolean }) =>
  cn(
    "shrink-0 rounded-t-panel border-b-2 px-3 py-2.5 text-[11px] whitespace-nowrap",
    isActive ? "border-ink font-semibold text-ink" : "border-transparent font-normal text-ink-3 hover:text-ink-2"
  );

// The header subtitle under the stage name was wired to GET /lifecycle/map's per-stage entry
// (headline/atStake/owningTeam — the same fields stage-rail.tsx's cards already use), then
// commented out for now: atStake is only real for activate/retain/churn today, so most stages'
// subtitles read as a string of gated icons rather than the settled sentence the design calls
// for. Left here rather than reverting to the old hand-authored `Stage.headline` mock (which was
// already deleted from data.ts, along with the `headline` field on `Stage`) — see
// [[feedback_no_hardcoded_fallback]]. Re-enable once more of these fields are live.
//
// function StageHeadlineSubtitle({ slug }: { slug: string }) {
//   const { stages, isLoading, isError } = useGetLifecycleMap();
//   const live = stages.find((stage) => stage.key === slug);
//
//   if (isError) return <p className="mt-1 text-[11.5px] text-rose">Couldn't load this stage's summary.</p>;
//   if (isLoading || !live) return <Skeleton className="mt-1.5 h-3 w-64" />;
//
//   const metricText = formatHeadlineValue(live.headline);
//
//   return (
//     <p className="mt-1 flex flex-wrap items-center gap-x-1.5 gap-y-1 text-[11.5px] text-ink-3">
//       {metricText !== undefined ? (
//         <span>
//           {metricText} {live.headline.label}
//         </span>
//       ) : (
//         <span className="inline-flex items-center gap-1">
//           {live.headline.label}
//           <InfoTooltip missingSource={live.headline.missingSource ?? undefined} wouldUnlock={live.headline.wouldUnlock ?? undefined} />
//         </span>
//       )}
//       <span aria-hidden>·</span>
//       {live.atStake.value !== null ? (
//         <span>{formatCompactCurrency(live.atStake.value)} at stake</span>
//       ) : (
//         <span className="inline-flex items-center gap-1">
//           at stake
//           <InfoTooltip missingSource={live.atStake.missingSource} wouldUnlock={live.atStake.wouldUnlock} />
//         </span>
//       )}
//       <span aria-hidden>·</span>
//       <span>{live.owningTeam ? `owned by ${live.owningTeam}` : "unowned"}</span>
//     </p>
//   );
// }

/**
 * Shared shell for a stage's Overview + tab screens (A02/A03/.../A10/A14 —
 * every screen that shows the persistent tab bar). Definition, Compare and
 * :id drilldowns are siblings under stage/layout.tsx instead — they have
 * their own header and never show this tab bar, confirmed by reading
 * A16/AC01/A05 directly (see the lifecycle rebuild plan).
 */
const StageTabsLayout = () => {
  const { stage } = useStageContext();
  const tabs = STAGE_TABS[stage.slug] ?? [];
  const [headerActionsEl, setHeaderActionsEl] = useState<HTMLDivElement | null>(null);

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
        <div className="min-w-0">
          <h1 className="text-[17px] font-semibold text-ink">{stage.name}</h1>
          {/* <StageHeadlineSubtitle slug={stage.slug} /> */}
        </div>
        {/* Portal target for a tab's header-right actions — e.g. Overview's Share or export row. */}
        <div ref={setHeaderActionsEl} className="flex shrink-0 flex-wrap items-center gap-4" />
      </div>

      {stage.isDefined && tabs.length > 0 && (
        <nav className="flex items-center gap-1 overflow-x-auto border-b border-line">
          <NavLink to={`/lifecycle/${stage.slug}`} end className={TAB_CLASS}>
            Overview
          </NavLink>
          {tabs.map((tab) => (
            <NavLink key={tab.path} to={`/lifecycle/${stage.slug}/${tab.path}`} className={TAB_CLASS}>
              {tab.label}
            </NavLink>
          ))}
        </nav>
      )}

      <Outlet context={{ stage, headerActionsEl } satisfies StageOutletContext} />
    </div>
  );
};

export default StageTabsLayout;
