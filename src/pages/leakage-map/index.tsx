import * as React from "react";

import { StageRail } from "@/pages/leakage-map/stage-rail";
import { LeakageMatrix } from "@/pages/leakage-map/matrix";
import { MarketBreakdown } from "@/pages/leakage-map/market-breakdown";
import { StatusLine } from "@/pages/leakage-map/status-line";
import { ControlsBar } from "@/pages/leakage-map/controls-bar";
import { CoveragePanel } from "@/pages/leakage-map/coverage-panel";
import { PageStateBanner } from "@/pages/leakage-map/page-state-banner";
import { RecomputingToast } from "@/pages/leakage-map/recomputing-toast";
import { useGetLeakage } from "@/features/leakage/use-get-leakage";
import { isLeakagePageV2 } from "@/services/api/leakage/get-leakage";
import { LeakageV2CellGrid } from "@/pages/leakage-map/v2-cell-grid";
import { LeakageV2Rollups } from "@/pages/leakage-map/v2-rollups";
import { V2KpiStrip } from "@/pages/leakage-map/v2-kpi-strip";
import { V2CoverageCard, V2LimitationsCard } from "@/pages/leakage-map/v2-coverage-limitations";
import { V2StatusLine } from "@/pages/leakage-map/v2-status-line";
import { OpportunitiesPanel } from "@/pages/leakage-map/opportunities-panel";
import { useGetOpportunities } from "@/features/opportunities/use-get-opportunities";
import { V2FiltersMenu } from "@/pages/leakage-map/v2-filters-menu";
import { V2PageSkeleton } from "@/pages/leakage-map/v2-page-skeleton";
import {
  toGetLeakageV2Params,
  v2FilterStateFromControls,
  type LeakageV2FilterState,
} from "@/pages/leakage-map/v2-filters";
import { useGetLeakageReport } from "@/features/leakage/use-get-leakage-report";
import {
  DEFAULT_FILTERS,
  FALLBACK_HORIZON_OPTIONS,
  FALLBACK_WINDOW_OPTIONS,
  rangeSelectionLabel,
  toGetLeakageParams,
  type LeakageFilterState,
} from "@/pages/leakage-map/filters";
import type { GetLeakageStageParams } from "@/services/api/leakage/get-leakage-stage";

/**
 * Rebuilt from flolyt-figma-designs/New-pages-pattern/leakage-new/svg/01–12 — adds a live status
 * line, real filters, a fully dynamic matrix, and the coverage panel and market breakdown that
 * carry the page's honesty.
 *
 * Filters, the page shell (loading via the floating `RecomputingToast`, error/empty via
 * `PageStateBanner`, status line), the stage rail, and the matrix (grids/cells, dynamic
 * rows/columns, cell detail, "start a room") are all wired to the real `GET /leakage` — see
 * docs/leakage-map/build-plan.md Steps 1–4. Step 5 wires the coverage panel and "how is this
 * calculated" dialog to `GET /leakage`'s own `coverage`/`calculation`, and the market breakdown to
 * `GET /leakage/report`'s per-market `gross` (a second, independent fetch — that endpoint's own
 * window/horizon, not the page's severity/confidence/calculate filters, which it doesn't take).
 * The old mock's "actions triggered" panel and shared page footer are dropped entirely — no
 * leakage endpoint carries SLA/ownership-queue data, so there was nothing to wire them to.
 */
export default function LeakageMap() {
  const [filters, setFilters] = React.useState<LeakageFilterState>(DEFAULT_FILTERS);
  const handleFiltersChange = (patch: Partial<LeakageFilterState>) =>
    setFilters((prev) => ({ ...prev, ...patch }));

  // V2's filter state is `null` until a V2 response has been seen once — the very first request on
  // page load always goes out V1-shaped (`v1Params` below), since there's no way to know yet which
  // contract a workspace is on. Once a V2 response arrives, it's seeded from the server's own
  // currently-active `controls` (not a hardcoded default) and takes over building the main query's
  // params from then on — see docs/leakage-map/v2-build-plan.md Step 3.
  const [v2Filters, setV2Filters] = React.useState<LeakageV2FilterState | null>(null);
  const handleV2FiltersChange = (patch: Partial<LeakageV2FilterState>) =>
    setV2Filters((prev) => (prev ? { ...prev, ...patch } : prev));

  // Always V1-shaped — used for the initial probe request and for the V1-only auxiliary endpoints
  // (report/stage/cell) regardless of which branch ends up rendering.
  const v1Params = toGetLeakageParams(filters);
  const params = v2Filters ? toGetLeakageV2Params(v2Filters) : v1Params;
  const { data: leakageResponse, isLoading, isFetching, isError, error, refetch } = useGetLeakage(params);
  const leakageData = leakageResponse?.data;
  // `GET /leakage` is dual-contract — a workspace flagged into Revenue Leakage V2 gets a
  // differently-shaped `contractVersion: "2.0"` response from the same endpoint. Never read V1
  // fields (stages, grids, markets, …) without this narrowing — they don't exist on the V2 shape.
  const isV2Response = !!leakageData && isLeakagePageV2(leakageData);
  const leakage = leakageData && !isV2Response ? leakageData : undefined;
  const leakageV2 = leakageData && isV2Response ? leakageData : undefined;

  React.useEffect(() => {
    if (leakageV2 && !v2Filters) setV2Filters(v2FilterStateFromControls(leakageV2.controls));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [leakageV2]);

  // Separate rollout flag from LeakageV2 — only requested once we're already on a confirmed V2
  // workspace, per docs/leakage-map/v2-build-plan.md Step 5. Errors stay silent (see the hook) so
  // an unflagged workspace just doesn't show the panel rather than surfacing a scary error.
  const { data: opportunitiesResponse } = useGetOpportunities(!!leakageV2);
  const opportunities = opportunitiesResponse?.data;

  // Independent of the page's own severity/confidence/calculate filters — GET /leakage/report only
  // takes window/horizon. Powers the market breakdown only; not on the loading/error critical path.
  const { data: reportResponse } = useGetLeakageReport({ window: v1Params.window, horizon: v1Params.horizon });
  const report = reportResponse?.data;
  // GET /leakage/stages/{key} and GET /leakage/cells/{...} only take window/market/horizon — not
  // `calculate`/severity/confidence, which `v1Params` also carries for the page-level GET /leakage.
  const stageParams: GetLeakageStageParams = { window: v1Params.window, horizon: v1Params.horizon, market: v1Params.market };
  const cellParams = { window: v1Params.window, horizon: v1Params.horizon };

  // The active market's currency scopes which of a (possibly multi-currency) grid's cells render
  // — unconfirmed live, since every `markets[]` pulled so far was empty. Falls back through the
  // primary market, then any market, then any other top-level field that carries a real currency
  // (`bySeverity`/`ladders` are workspace-wide, not grid/cell-dependent, so they can be populated
  // even when `markets`/`cells` are both empty, as seen live). `undefined` here is a genuine "we
  // don't know yet" — matrix.tsx must not fall back to an invented currency for the cell-detail
  // fetch, since a wrong path segment there is worse than a disabled cell.
  const activeCurrency =
    (filters.market ? leakage?.markets.find((m) => m.countryCode === filters.market)?.currency : undefined) ??
    leakage?.markets.find((m) => m.isPrimary)?.currency ??
    leakage?.markets[0]?.currency ??
    leakage?.bySeverity[0]?.currency ??
    leakage?.ladders[0]?.currency;

  const fallbackWindowLabel = rangeSelectionLabel(filters.window, "window");
  const fallbackHorizonLabel = rangeSelectionLabel(filters.horizon, "horizon");

  // True first paint only — `isLoading` is `status === "pending"` (no data yet at all), never true
  // again on a filter-driven refetch since `placeholderData` keeps the previous response around
  // (see `use-get-leakage.ts`), which is what lets `RecomputingToast` handle those instead. The
  // page's dual contract (V1 vs V2) isn't knowable yet at this point — see `v2-page-skeleton.tsx`'s
  // own comment for why it commits to the V2 shape anyway.
  if (isLoading && !isError) {
    return <V2PageSkeleton />;
  }

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

  // The very first load failed, so there's no response to lay out. Rendering the normal page here
  // would just leave its skeleton placeholders on screen forever next to an error that has already
  // finished failing, so show only the title and the banner instead.
  if (isError && !leakageData) {
    return (
      <div className="space-y-6">
        <h1 className="text-[17px] font-semibold text-ink">Revenue leakage map</h1>
        <PageStateBanner state="error" errorMessage={error?.message} retrying={isFetching} onRetry={() => refetch()} />
      </div>
    );
  }

  // V2 branch — restyled 2026-10-01 to match V1's visual language (cascading Filters menu, the
  // shared KpiCards stat-tile component, one legible status line) instead of the first pass's raw
  // <select> row and chip-per-fact cell layout. See docs/leakage-map/v2-build-plan.md Steps 2–4.
  if (leakageV2) {
    // Covers the one-frame gap between a V2 response first arriving and the seeding effect above
    // committing — keeps the Filters menu always rendering a valid, server-sourced selection
    // rather than flashing empty.
    const effectiveV2Filters = v2Filters ?? v2FilterStateFromControls(leakageV2.controls);
    const hiddenCellCount = leakageV2.cells.filter((cell) => cell.state.display === "HIDDEN_BY_FILTER").length;
    // Same selection the page itself is rendering under — a cell's evidence sheet should never show
    // a different mode/horizon than the tile it was opened from.
    const cellEvidenceParams = {
      mode: effectiveV2Filters.mode,
      horizon: effectiveV2Filters.horizon,
      horizonDays: effectiveV2Filters.horizon === "custom" ? effectiveV2Filters.horizonDays : undefined,
      lifecycleClass: effectiveV2Filters.lifecycleClass ?? undefined,
    };

    return (
      <div className="space-y-6">
        <RecomputingToast visible={!isError && isFetching} horizonLabel="this view" />
        {isError && (
          <PageStateBanner state="error" hasData errorMessage={error?.message} retrying={isFetching} onRetry={() => refetch()} />
        )}

        <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
          <div>
            <h1 className="text-[17px] font-semibold text-ink">Revenue leakage map</h1>
            <V2StatusLine controls={leakageV2.controls} publication={leakageV2.publication} hiddenCount={hiddenCellCount} />
          </div>
          <V2FiltersMenu controls={leakageV2.controls} filters={effectiveV2Filters} onFiltersChange={handleV2FiltersChange} />
        </div>

        <V2KpiStrip cells={leakageV2.cells} rollups={leakageV2.rollups} coverage={leakageV2.coverage} controls={leakageV2.controls} />
        <LeakageV2CellGrid cells={leakageV2.cells} params={cellEvidenceParams} />
        <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
          <V2CoverageCard coverage={leakageV2.coverage} />
          <V2LimitationsCard limitations={leakageV2.limitations} cells={leakageV2.cells} />
        </div>
        <LeakageV2Rollups rollups={leakageV2.rollups} />
        {opportunities && <OpportunitiesPanel cells={opportunities.cells} limitations={opportunities.limitations} />}
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <RecomputingToast
        visible={!isError && isFetching}
        horizonLabel={leakage?.horizon.label ?? fallbackHorizonLabel}
      />
      {isError && (
        <PageStateBanner state="error" hasData errorMessage={error?.message} retrying={isFetching} onRetry={() => refetch()} />
      )}

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
            cellsHidden={leakage?.filter.cellsHidden ?? 0}
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
          calculation={leakage?.calculation}
        />
      </div>

      <StageRail stages={leakage?.stages} callouts={leakage?.callouts} stageParams={stageParams} />

      <LeakageMatrix
        grids={leakage?.grids}
        currency={activeCurrency}
        cellParams={cellParams}
        shadingCaptionLabel={`${(leakage?.horizon.label ?? fallbackHorizonLabel).toLowerCase()} exposure`}
        cellsHidden={leakage?.filter.cellsHidden ?? 0}
      />

      <CoveragePanel coverage={leakage?.coverage} />

      <MarketBreakdown markets={report?.markets} />
    </div>
  );
}
