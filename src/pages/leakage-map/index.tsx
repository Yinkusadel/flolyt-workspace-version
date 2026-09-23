import * as React from "react";

import { StageRail } from "@/pages/leakage-map/stage-rail";
import { LeakageMatrix } from "@/pages/leakage-map/matrix";
import { MarketBreakdown } from "@/pages/leakage-map/market-breakdown";
import { StatusLine } from "@/pages/leakage-map/status-line";
import { ControlsBar } from "@/pages/leakage-map/controls-bar";
import { CoveragePanel } from "@/pages/leakage-map/coverage-panel";
import { ActionsPanel } from "@/pages/leakage-map/actions-panel";
import { PageFooter } from "@/pages/leakage-map/page-footer";
import { PageStateBanner } from "@/pages/leakage-map/page-state-banner";
import { RecomputingToast } from "@/pages/leakage-map/recomputing-toast";
import { useGetLeakage } from "@/features/leakage/use-get-leakage";
import {
  DEFAULT_FILTERS,
  FALLBACK_HORIZON_OPTIONS,
  FALLBACK_WINDOW_OPTIONS,
  rangeSelectionLabel,
  toGetLeakageParams,
  type LeakageFilterState,
} from "@/pages/leakage-map/filters";
import { filteredOutPercent, type ConfidenceLevel, type SeverityLevel } from "@/pages/leakage-map/data";

// The matrix and status line's hidden-percent math still run on the page's original mock cell data
// (Step 4 replaces it with the real `grids[]`), which ranks severity as a 1–5 number and reads
// "low"/"medium"/"high" confidence directly. The real filter state now sends the API's own
// "s1"–"s5" strings — these adapters bridge the two conventions until the matrix itself is wired.
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
 *
 * Filters (Calc/Window/Horizon/Market/Severity/Confidence) and the page shell (loading via the
 * floating `RecomputingToast`, error/empty via `PageStateBanner`, status line, stage rail) are
 * wired to the real `GET /leakage` — see docs/leakage-map/build-plan.md Steps 1–2. The matrix,
 * coverage panel, actions panel and market breakdown are still mock, landing in Steps 3–5.
 */
export default function LeakageMap() {
  const [filters, setFilters] = React.useState<LeakageFilterState>(DEFAULT_FILTERS);
  const handleFiltersChange = (patch: Partial<LeakageFilterState>) =>
    setFilters((prev) => ({ ...prev, ...patch }));

  const {
    data: leakageResponse,
    isFetching,
    isError,
    error,
    refetch,
  } = useGetLeakage(toGetLeakageParams(filters));
  const leakage = leakageResponse?.data;

  const legacySeverityFilter = legacySeverityRank(filters.minSeverity);
  const legacyConfidenceFilter = legacyConfidenceLevel(filters.minConfidence);
  const hiddenPercent = filteredOutPercent(legacySeverityFilter, legacyConfidenceFilter);

  const clearFilters = () => setFilters((prev) => ({ ...prev, minSeverity: null, minConfidence: null }));
  const setLegacySeverityFilter = (level: SeverityLevel) =>
    handleFiltersChange({ minSeverity: level === 5 ? null : `s${level}` });

  const fallbackWindowLabel = rangeSelectionLabel(filters.window, "window");
  const fallbackHorizonLabel = rangeSelectionLabel(filters.horizon, "horizon");

  // Unconfirmed live (every real pull so far had customers) — flagged in
  // docs/leakage-map/build-plan.md Step 2.
  const isEmpty = !isFetching && !isError && !!leakage && leakage.customerCount === 0;

  if (isEmpty) {
    return (
      <div className="space-y-6">
        <h1 className="text-[17px] font-semibold text-ink">Revenue leakage map</h1>
        <PageStateBanner state="empty" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <RecomputingToast
        visible={!isError && isFetching}
        horizonLabel={leakage?.horizon.label ?? fallbackHorizonLabel}
      />
      {isError && <PageStateBanner state="error" errorMessage={error?.message} onRetry={() => refetch()} />}

      <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <h1 className="text-[17px] font-semibold text-ink">Revenue leakage map</h1>
          <StatusLine
            calcMode={filters.calculate}
            windowLabel={leakage?.window.label ?? fallbackWindowLabel}
            horizonLabel={leakage?.horizon.label ?? fallbackHorizonLabel}
            customerCount={leakage?.customerCount}
            refreshedAtUtc={leakage?.refreshedAtUtc}
            coveragePercent={leakage?.coverage.percent}
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

      <StageRail stages={leakage?.stages} callouts={leakage?.callouts} />

      <LeakageMatrix
        shadingCaptionLabel={`${(leakage?.horizon.label ?? fallbackHorizonLabel).toLowerCase()} exposure`}
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
