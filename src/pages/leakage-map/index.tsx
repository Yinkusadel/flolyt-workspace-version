import * as React from "react";

import { StageRail } from "@/pages/leakage-map/stage-rail";
import { LeakageMatrix } from "@/pages/leakage-map/matrix";
import { MarketBreakdown } from "@/pages/leakage-map/market-breakdown";
import { StatusLine } from "@/pages/leakage-map/status-line";
import { ControlsBar } from "@/pages/leakage-map/controls-bar";
import { horizonLabel, type HorizonState } from "@/pages/leakage-map/horizon-picker";
import { CoveragePanel } from "@/pages/leakage-map/coverage-panel";
import { ActionsPanel } from "@/pages/leakage-map/actions-panel";
import { PageFooter } from "@/pages/leakage-map/page-footer";
import { PageStateBanner } from "@/pages/leakage-map/page-state-banner";
import {
  DEFAULT_CALC_MODE,
  DEFAULT_CONFIDENCE_FILTER,
  DEFAULT_HORIZON,
  DEFAULT_HORIZON_DIRECTION,
  DEFAULT_SEVERITY_FILTER,
  filteredOutPercent,
  type CalcMode,
  type ConfidenceLevel,
  type PageState,
  type SeverityLevel,
} from "@/pages/leakage-map/data";

/**
 * There is no live source behind this page yet (see data.ts) and so no real fetch lifecycle to
 * drive loading/empty/error — flip this to reach those states for review, same convention as
 * other rebuilds' mock-state flags. "partial" is the default and only reachable state in normal
 * use, since 78% coverage is the page's own steady state, not an exception.
 */
const LEAKAGE_MAP_STATE: PageState = "partial";

/**
 * Rebuilt from flolyt-figma-designs/New-pages-pattern/leakage-new/svg/01–12 — adds a live status
 * line, five cell states instead of two, Severity/Confidence as real filters (not shading
 * choices), and the coverage/actions panels that carry the page's honesty. The prior build's
 * backward-looking window and its from/to range picker survive inside the Horizon control's
 * "Looking back" group — see data.ts's header note and horizon-picker.tsx.
 */
export default function LeakageMap() {
  const [calcMode, setCalcMode] = React.useState<CalcMode>(DEFAULT_CALC_MODE);
  const [horizon, setHorizon] = React.useState<HorizonState>({
    kind: "preset",
    value: DEFAULT_HORIZON,
    direction: DEFAULT_HORIZON_DIRECTION,
  });
  const [severityFilter, setSeverityFilter] = React.useState<SeverityLevel>(DEFAULT_SEVERITY_FILTER);
  const [confidenceFilter, setConfidenceFilter] = React.useState<ConfidenceLevel>(DEFAULT_CONFIDENCE_FILTER);

  const clearFilters = () => {
    setSeverityFilter(5);
    setConfidenceFilter("low");
  };

  const currentHorizonLabel = horizonLabel(horizon);
  const hiddenPercent = filteredOutPercent(severityFilter, confidenceFilter);

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
            calcMode={calcMode}
            horizonLabel={currentHorizonLabel}
            hiddenPercent={hiddenPercent}
            severityFilter={severityFilter}
            confidenceFilter={confidenceFilter}
            onClearFilters={clearFilters}
          />
        </div>

        <ControlsBar
          calcMode={calcMode}
          onCalcModeChange={setCalcMode}
          horizon={horizon}
          onHorizonChange={setHorizon}
          severityFilter={severityFilter}
          onSeverityFilterChange={setSeverityFilter}
          confidenceFilter={confidenceFilter}
          onConfidenceFilterChange={setConfidenceFilter}
        />
      </div>

      <StageRail />

      <LeakageMatrix
        shadingCaptionLabel={`${currentHorizonLabel.toLowerCase()} exposure`}
        severityFilter={severityFilter}
        confidenceFilter={confidenceFilter}
        onClearFilter={clearFilters}
        onSetSeverityFilter={setSeverityFilter}
      />

      <CoveragePanel />
      <ActionsPanel />
      <PageFooter />

      <MarketBreakdown />
    </div>
  );
}
