import { Link } from "react-router-dom";
import { AlertTriangle, ArrowRight } from "lucide-react";

import { cn } from "@/lib/utils";
import { usePageBreadcrumb, type Crumb } from "@/components/breadcrumb-context";
import { Callout } from "@/components/ui/rail";
import { useGetLeakage } from "@/features/leakage/use-get-leakage";
import { isLeakagePageV2 } from "@/services/api/leakage/get-leakage";
import { CellDrawer } from "@/pages/leakage-map/drawer/cell-drawer";
import { CalculationDrawer } from "@/pages/leakage-map/drawer/calculation-drawer";
import { useCalculationParam } from "@/pages/leakage-map/drawer/use-calculation-param";
import { CoverageDrawer } from "@/pages/leakage-map/drawer/coverage-drawer";
import { useCoverageParam } from "@/pages/leakage-map/drawer/use-coverage-param";
import { DiagnosticsDrawer } from "@/pages/leakage-map/drawer/diagnostics-drawer";
import { DIAGNOSTICS_ALL, useDiagnosticsParam } from "@/pages/leakage-map/drawer/use-diagnostics-param";
import { useCellDrawerParam } from "@/pages/leakage-map/drawer/use-cell-drawer-param";
import { ByMarketSection } from "@/pages/leakage-map/by-market-section";
import { ExpectedLossSection } from "@/pages/leakage-map/expected-loss-section";
import { LeakCardsSection } from "@/pages/leakage-map/leak-cards-section";
import { MeasurementSection } from "@/pages/leakage-map/measurement-section";
import { ReadinessSection } from "@/pages/leakage-map/readiness-section";
import { KeyFindingsSection } from "@/pages/leakage-map/key-findings-section";
import { BusyRegion } from "@/pages/leakage-map/busy-region";
import { FilterBar } from "@/pages/leakage-map/filter-bar";
import { useLeakageFilters } from "@/pages/leakage-map/filters";
import { formatAsOf, marketName } from "@/pages/leakage-map/format";
import { MarketHeader, marketHasData, NothingMeasured } from "@/pages/leakage-map/market-view";
import { LeakageMapSkeleton } from "@/pages/leakage-map/page-skeleton";

/**
 * Rebuild in progress, one section at a time against the Phase 1-4 contract (see
 * docs/leakage-map/v3-rebuild-plan.md and docs/leakage-map/v3-build-tracker.md). Done so far: the
 * shell, the filter bar, the expected-loss cards, the by-market strip, key findings, the leak cards, readiness and measurement. The sections below the bar are added next, in the order the tracker lists.
 */
export default function LeakageMap() {
  const { filters, params, setMarket, setCurrency, setLocalFilters, clearMoreFilters } = useLeakageFilters();
  const { data, error, isLoading, isFetching, isPlaceholderData, refetch } = useGetLeakage(params);
  // A changed filter shows the previous figures while the new ones load; until they land, nothing is clickable.
  // A quiet background refresh of the same figures (the tab regaining focus) does not lock the page.
  const isSwitching = isFetching && isPlaceholderData;
  const drawer = useCellDrawerParam();
  const diagnostics = useDiagnosticsParam();
  const coverageSheet = useCoverageParam();
  const calculation = useCalculationParam();

  const crumbs: Crumb[] = filters.market
    ? [
        { label: "Leakage Map", to: "/leakage-map" },
        { label: "All markets", to: "/leakage-map" },
        { label: marketName(filters.market) },
      ]
    : [{ label: "Leakage Map" }];
  usePageBreadcrumb(crumbs);

  if (isLoading && !data) return <LeakageMapSkeleton />;

  if (!data) {
    return (
      <FullPageError
        message={error?.message ?? "Something went wrong loading the leakage map."}
        onRetry={() => void refetch()}
      />
    );
  }

  if (!data.succeeded) {
    return (
      <FullPageError
        message={data.messages[0] ?? "The leakage map could not be loaded for this workspace."}
        onRetry={() => void refetch()}
      />
    );
  }

  const page = data.data;

  if (!isLeakagePageV2(page)) {
    return (
      <div className="space-y-4">
        <Header title="Revenue leakage map" description="Where revenue is leaking, and what to do about it." />
        <Callout tone="amber" title="This workspace is on the legacy leakage map">
          The redesigned map reads the V2 leakage publication, which has not been enabled for this workspace yet.
        </Callout>
      </div>
    );
  }

  const recommendedMode = page.executive?.recommendedMode ?? null;
  // A selected market nothing is attributed to: show why, not empty sections.
  const showNothingMeasured = !!filters.market && !!page.executive && !marketHasData(page.executive, filters.market);

  return (
    <div className="space-y-5">
      {filters.market ? (
        <MarketHeader
          market={filters.market}
          executive={page.executive}
          controls={page.controls}
          coverage={page.coverage}
          asOf={page.publication.asOfUtc}
          onClear={() => setMarket(null)}
          onOpenCoverage={() => coverageSheet.openCoverage()}
        />
      ) : (
        <Header
          title="Revenue leakage map"
          description="Where revenue is leaking across the customer journey, each currency on its own."
          asOf={page.publication.asOfUtc}
        />
      )}

      {/* A failed refetch keeps the last good projection on screen and offers a retry, per the contract. */}
      {error && (
        <div
          role="alert"
          className="flex items-center gap-2 rounded-panel border border-rose-border bg-rose-bg px-3 py-2 text-[11.5px] text-ink-2"
        >
          <AlertTriangle className="size-3.5 shrink-0 text-rose" />
          <span className="flex-1">{error.message} Showing the last loaded figures.</span>
          <button type="button" onClick={() => void refetch()} className="font-medium text-ink hover:underline">
            Retry
          </button>
        </div>
      )}

      <BusyRegion busy={isSwitching} className="space-y-5">
      <FilterBar
        controls={page.controls}
        filters={filters}
        recommendedMode={recommendedMode}
        isRefreshing={isFetching}
        onMarketChange={setMarket}
        onCurrencyChange={setCurrency}
        onChange={setLocalFilters}
        onClearMore={clearMoreFilters}
      />

      <div className={cn("space-y-5 transition-opacity", isSwitching && "opacity-60")}>
        {showNothingMeasured && filters.market && page.executive ? (
          <NothingMeasured market={filters.market} executive={page.executive} onSelectMarket={setMarket} />
        ) : (
          <>
        <ExpectedLossSection
          executive={page.executive}
          summary={page.summary}
          controls={page.controls}
          filters={filters}
          coverageExplanation={page.coverageExplanation}
        />
        {/* The all-markets view only: a single market's own view replaces this overview strip. */}
        {!filters.market && (
          <ByMarketSection
            executive={page.executive}
            controls={page.controls}
            selectedMarket={filters.market}
            onSelectMarket={setMarket}
          />
        )}
        <KeyFindingsSection
          executive={page.executive}
          cells={page.cells}
          controls={page.controls}
          selectedMarket={filters.market}
        />
        <LeakCardsSection
          cells={page.cells}
          executive={page.executive}
          controls={page.controls}
          onOpenDetails={drawer.openCell}
          onOpenCalculation={(reference) => calculation.openCalculation(reference)}
        />
          </>
        )}
        <div className="grid items-start gap-5 lg:grid-cols-2">
          <ReadinessSection
            readiness={page.readiness}
            diagnosticCodes={page.limitationSummary.items.map((item) => item.code)}
            onOpenDiagnostics={diagnostics.openDiagnostics}
          />
          <MeasurementSection
            summary={page.summary}
            coverage={page.coverage}
            coverageExplanation={page.coverageExplanation}
            limitationSummary={page.limitationSummary}
            onOpenDiagnostics={() => diagnostics.openDiagnostics(DIAGNOSTICS_ALL)}
            onOpenCoverage={() => coverageSheet.openCoverage()}
          />
        </div>
        {/* Remaining sections land here, one at a time. */}
      </div>
      </BusyRegion>

      <CalculationDrawer
        reference={calculation.reference}
        cells={page.cells}
        fromCell={calculation.fromCellId ? page.cells.find((c) => c.id === calculation.fromCellId) : undefined}
        onBack={() => calculation.fromCellId && drawer.showCell(calculation.fromCellId)}
        onClose={calculation.closeCalculation}
      />

      <CoverageDrawer
        tab={coverageSheet.tab}
        onTabChange={coverageSheet.setCoverageTab}
        onClose={coverageSheet.closeCoverage}
        coverage={page.coverage}
        coverageExplanation={page.coverageExplanation}
      />

      <DiagnosticsDrawer
        summary={page.limitationSummary}
        filter={diagnostics.diagnostics}
        onFilterChange={diagnostics.setDiagnosticsFilter}
        onClose={diagnostics.closeDiagnostics}
      />

      <CellDrawer
        cells={page.cells}
        controls={page.controls}
        filters={filters}
        currentSnapshotId={page.publication.snapshotId}
        cellId={drawer.cellId}
        panel={drawer.panel}
        onClose={drawer.close}
        onShowCase={drawer.showCase}
        onShowCell={drawer.showCell}
        onOpenCalculation={calculation.openCalculation}
      />
    </div>
  );
}

function Header({ title, description, asOf }: { title: string; description: string; asOf?: string }) {
  return (
    <div className="flex flex-wrap items-start justify-between gap-x-4 gap-y-2">
      <div>
        <h1 className="text-[17px] font-semibold text-ink">{title}</h1>
        <p className="mt-1 text-[11.5px] text-ink-3">
          {description}
          {asOf && (
            <>
              {" "}
              <span className="font-mono text-[10.5px] text-ink-4">As of {formatAsOf(asOf)}</span>
            </>
          )}
        </p>
      </div>
      {/* The only in-app way into /missed-opportunities: a separate, positive-polarity read kept out of the map. */}
      <Link
        to="/missed-opportunities"
        className="flex shrink-0 items-center gap-1 text-[11.5px] font-medium text-ultra hover:underline"
      >
        Missed opportunities
        <ArrowRight className="size-3" />
      </Link>
    </div>
  );
}

function FullPageError({ message, onRetry }: { message: string; onRetry: () => void }) {
  return (
    <div className="mx-auto flex max-w-md flex-col items-center gap-3 rounded-card border border-line bg-paper px-6 py-12 text-center">
      <AlertTriangle className="size-5 text-rose" />
      <div>
        <h2 className="text-[13px] font-semibold text-ink">The leakage map could not be loaded</h2>
        <p className="mt-1 text-[11.5px] text-ink-3">{message}</p>
      </div>
      <button
        type="button"
        onClick={onRetry}
        className="rounded-control border border-line bg-paper px-3 py-1.5 text-[12px] font-medium text-ink hover:border-ink-4"
      >
        Try again
      </button>
    </div>
  );
}
