import * as React from "react";

import { StageRail } from "@/pages/leakage-map/stage-rail";
import { CoverageGapNote } from "@/pages/leakage-map/coverage-gap-note";
import { LeakageMatrix } from "@/pages/leakage-map/matrix";
import { MarketBreakdown } from "@/pages/leakage-map/market-breakdown";
import { StatusLine } from "@/pages/leakage-map/status-line";
import { ControlsBar } from "@/pages/leakage-map/controls-bar";
import { CoveragePanel } from "@/pages/leakage-map/coverage-panel";
import { ActionsPanel } from "@/pages/leakage-map/actions-panel";
import { PageFooter } from "@/pages/leakage-map/page-footer";
import { PageStateBanner } from "@/pages/leakage-map/page-state-banner";
import { useGetLeakage } from "@/features/leakage/use-get-leakage";
import {
  DEFAULT_FILTERS,
  FALLBACK_HORIZON_OPTIONS,
  FALLBACK_WINDOW_OPTIONS,
  toGetLeakageParams,
  type LeakageFilterState,
} from "@/pages/leakage-map/filters";
import { filteredOutPercent, type ConfidenceLevel, type PageState, type SeverityLevel } from "@/pages/leakage-map/data";

/**
 * There is no live source behind this page yet (see data.ts) and so no real fetch lifecycle to
 * drive loading/empty/error — flip this to reach those states for review, same convention as
 * other rebuilds' mock-state flags. "partial" is the default and only reachable state in normal
 * use, since 78% coverage is the page's own steady state, not an exception.
 *
 * The filters above this banner (Calc/Window/Horizon/Market/Severity/Confidence) are wired to the
 * real `GET /leakage` — see filters.ts — but the page shell below it (this flag, the stage rail,
 * the matrix) is still mock and lands in the later steps of docs/leakage-map/build-plan.md.
 */
const LEAKAGE_MAP_STATE: PageState = "partial";

// The matrix and status line still render the page's original mock cell data (Step 4 replaces it
// with the real `grids[]`), which ranks severity as a 1–5 number and reads "low"/"medium"/"high"
// confidence directly. The real filter state now sends the API's own "s1"–"s5" strings — these
// adapters bridge the two conventions until the matrix itself is wired.
function legacySeverityRank(minSeverity: string | null): SeverityLevel {
  const level = minSeverity ? Number(minSeverity.slice(1)) : 5;
  return (level >= 1 && level <= 5 ? level : 5) as SeverityLevel;
}

function legacyConfidenceLevel(minConfidence: string | null): ConfidenceLevel {
  return (minConfidence ?? "low") as ConfidenceLevel;
}

/**
 * Rebuilt from flolyt-figma-designs/New-pages-pattern/leakage-new/svg/01–12 — adds a live status
 * line, five cell states instead of two, Severity/Confidence as real filters (not shading
 * choices), and the coverage/actions panels that carry the page's honesty.
 */
export default function LeakageMap() {
  const [filters, setFilters] = React.useState<LeakageFilterState>(DEFAULT_FILTERS);
  const handleFiltersChange = (patch: Partial<LeakageFilterState>) =>
    setFilters((prev) => ({ ...prev, ...patch }));

  const { data: leakageResponse } = useGetLeakage(toGetLeakageParams(filters));
  const leakage = leakageResponse?.data;

  const legacySeverityFilter = legacySeverityRank(filters.minSeverity);
  const legacyConfidenceFilter = legacyConfidenceLevel(filters.minConfidence);
  const hiddenPercent = filteredOutPercent(legacySeverityFilter, legacyConfidenceFilter);

  const clearFilters = () => setFilters((prev) => ({ ...prev, minSeverity: null, minConfidence: null }));
  const setLegacySeverityFilter = (level: SeverityLevel) =>
    handleFiltersChange({ minSeverity: level === 5 ? null : `s${level}` });

  if (LEAKAGE_MAP_STATE === "empty") {
    return (
      <div className="space-y-6">
        <h1 className="text-[17px] font-semibold text-ink">Revenue leakage map</h1>
        <PageStateBanner state="empty" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {LEAKAGE_MAP_STATE !== "partial" && <PageStateBanner state={LEAKAGE_MAP_STATE} />}

      <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <h1 className="text-[17px] font-semibold text-ink">Revenue leakage map</h1>
          <StatusLine
            calcMode={filters.calculate}
            windowLabel={leakage?.window.label ?? "Last 90 days"}
            horizonLabel={leakage?.horizon.label ?? "Next 90 days"}
            hiddenPercent={hiddenPercent}
            minSeverity={filters.minSeverity}
            minConfidence={filters.minConfidence}
          />
        </div>

        <ControlsBar
          filters={filters}
          onFiltersChange={handleFiltersChange}
          windowOptions={leakage?.window.options ?? FALLBACK_WINDOW_OPTIONS}
          horizonOptions={leakage?.horizon.options ?? FALLBACK_HORIZON_OPTIONS}
          markets={leakage?.markets ?? []}
          currentWindowLabel={leakage?.window.label}
          currentHorizonLabel={leakage?.horizon.label}
        />
      </div>

      <StageRail />
      <CoverageGapNote />

      <LeakageMatrix
        shadingCaptionLabel={`${(leakage?.horizon.label ?? "next 90 days").toLowerCase()} exposure`}
        severityFilter={legacySeverityFilter}
        confidenceFilter={legacyConfidenceFilter}
        onClearFilter={clearFilters}
        onSetSeverityFilter={setLegacySeverityFilter}
      />

      <CoveragePanel />
      <ActionsPanel />
      <PageFooter />

      <MarketBreakdown />
    </div>
  );
}
