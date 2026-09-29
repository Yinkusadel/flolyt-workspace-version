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

  const params = toGetLeakageParams(filters);
  const { data: leakageResponse, isFetching, isError, error, refetch } = useGetLeakage(params);
  const leakage = leakageResponse?.data;
  // Independent of the page's own severity/confidence/calculate filters — GET /leakage/report only
  // takes window/horizon. Powers the market breakdown only; not on the loading/error critical path.
  const { data: reportResponse } = useGetLeakageReport({ window: params.window, horizon: params.horizon });
  const report = reportResponse?.data;
  // GET /leakage/stages/{key} and GET /leakage/cells/{...} only take window/market/horizon — not
  // `calculate`/severity/confidence, which `params` also carries for the page-level GET /leakage.
  const stageParams: GetLeakageStageParams = { window: params.window, horizon: params.horizon, market: params.market };
  const cellParams = { window: params.window, horizon: params.horizon };

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
