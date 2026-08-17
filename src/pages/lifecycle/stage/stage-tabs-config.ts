import type { ComponentType } from "react";

import AcquireFunnelTab from "@/pages/lifecycle/stage/acquire/funnel-tab";
import AcquireChannelsTab from "@/pages/lifecycle/stage/acquire/channels-tab";
import AcquireUnitEconomicsTab from "@/pages/lifecycle/stage/acquire/unit-economics-tab";
import { CohortsTab } from "@/pages/lifecycle/stage/cohorts/cohorts-tab";
import { MarketsTab } from "@/pages/lifecycle/stage/markets/markets-tab";
import { ChangesTab } from "@/pages/lifecycle/stage/changes/changes-tab";
import { AgentsTab } from "@/pages/lifecycle/stage/agents/agents-tab";
import { HistoryTab } from "@/pages/lifecycle/stage/history/history-tab";
import ActivateTimeToValueTab from "@/pages/lifecycle/stage/activate/time-to-value-tab";
import ActivatePathsTab from "@/pages/lifecycle/stage/activate/paths-tab";
import PricePlansTab from "@/pages/lifecycle/stage/price/plans-tab";
import PriceMarginTab from "@/pages/lifecycle/stage/price/margin-tab";
import PriceDiscountingTab from "@/pages/lifecycle/stage/price/discounting-tab";
import AdoptFeaturesTab from "@/pages/lifecycle/stage/adopt/features-tab";
import AdoptDepthTab from "@/pages/lifecycle/stage/adopt/depth-tab";
import AdoptBlindSpotsTab from "@/pages/lifecycle/stage/adopt/blind-spots-tab";
import RetainRepeatCurveTab from "@/pages/lifecycle/stage/retain/repeat-curve-tab";
import RetainSegmentsTab from "@/pages/lifecycle/stage/retain/segments-tab";
import RetainReactivationTab from "@/pages/lifecycle/stage/retain/reactivation-tab";
import ExpandUpgradePathsTab from "@/pages/lifecycle/stage/expand/upgrade-paths-tab";
import ExpandBasketTab from "@/pages/lifecycle/stage/expand/basket-tab";
import ExpandAccountsTab from "@/pages/lifecycle/stage/expand/accounts-tab";

export type StageTab = {
  /** Path segment appended to /lifecycle/:stage/ */
  path: string;
  label: string;
  Component: ComponentType;
};

/**
 * Per-stage tab list, in display order, for the tab bar that sits under the
 * stage header (Overview is always first and implicit — it's the index
 * route, not listed here). Order confirmed from A11's dimmed background:
 * Overview, Funnel, Channels, Cohorts, Unit economics, Markets, What
 * changed, Agents, History — the stage-specific tabs sit before the five
 * shared ones (Cohorts/Markets/Changes/Agents/History), not after.
 *
 * Only stages that have been fully built get an entry here — a stage with
 * no entry (or isDefined: false, see lifecycle/data.ts) renders the tab-less
 * empty state instead. See docs/build-tracker.md for what's left.
 */
export const STAGE_TABS: Partial<Record<string, StageTab[]>> = {
  acquire: [
    { path: "funnel", label: "Funnel", Component: AcquireFunnelTab },
    { path: "channels", label: "Channels", Component: AcquireChannelsTab },
    { path: "cohorts", label: "Cohorts", Component: CohortsTab },
    { path: "unit-economics", label: "Unit economics", Component: AcquireUnitEconomicsTab },
    { path: "markets", label: "Markets", Component: MarketsTab },
    { path: "changes", label: "What changed", Component: ChangesTab },
    { path: "agents", label: "Agents", Component: AgentsTab },
    { path: "history", label: "History", Component: HistoryTab },
  ],
  activate: [
    { path: "time-to-value", label: "Time to value", Component: ActivateTimeToValueTab },
    { path: "paths", label: "Paths", Component: ActivatePathsTab },
    { path: "cohorts", label: "Cohorts", Component: CohortsTab },
    { path: "markets", label: "Markets", Component: MarketsTab },
    { path: "changes", label: "What changed", Component: ChangesTab },
    { path: "agents", label: "Agents", Component: AgentsTab },
    { path: "history", label: "History", Component: HistoryTab },
  ],
  price: [
    { path: "plans", label: "Plans", Component: PricePlansTab },
    { path: "margin", label: "Margin", Component: PriceMarginTab },
    { path: "discounting", label: "Discounting", Component: PriceDiscountingTab },
    { path: "cohorts", label: "Cohorts", Component: CohortsTab },
    { path: "markets", label: "Markets", Component: MarketsTab },
    { path: "changes", label: "What changed", Component: ChangesTab },
    { path: "agents", label: "Agents", Component: AgentsTab },
    { path: "history", label: "History", Component: HistoryTab },
  ],
  adopt: [
    { path: "features", label: "Features", Component: AdoptFeaturesTab },
    { path: "depth", label: "Depth", Component: AdoptDepthTab },
    { path: "blind-spots", label: "Not instrumented", Component: AdoptBlindSpotsTab },
    { path: "cohorts", label: "Cohorts", Component: CohortsTab },
    { path: "markets", label: "Markets", Component: MarketsTab },
    { path: "changes", label: "What changed", Component: ChangesTab },
    { path: "agents", label: "Agents", Component: AgentsTab },
    { path: "history", label: "History", Component: HistoryTab },
  ],
  retain: [
    { path: "repeat-curve", label: "Repeat curve", Component: RetainRepeatCurveTab },
    { path: "segments", label: "Segments", Component: RetainSegmentsTab },
    { path: "reactivation", label: "Reactivation", Component: RetainReactivationTab },
    { path: "cohorts", label: "Cohorts", Component: CohortsTab },
    { path: "markets", label: "Markets", Component: MarketsTab },
    { path: "changes", label: "What changed", Component: ChangesTab },
    { path: "agents", label: "Agents", Component: AgentsTab },
    { path: "history", label: "History", Component: HistoryTab },
  ],
  expand: [
    { path: "upgrade-paths", label: "Upgrade paths", Component: ExpandUpgradePathsTab },
    { path: "basket", label: "Basket", Component: ExpandBasketTab },
    { path: "accounts", label: "Accounts", Component: ExpandAccountsTab },
    { path: "cohorts", label: "Cohorts", Component: CohortsTab },
    { path: "markets", label: "Markets", Component: MarketsTab },
    { path: "changes", label: "What changed", Component: ChangesTab },
    { path: "agents", label: "Agents", Component: AgentsTab },
    { path: "history", label: "History", Component: HistoryTab },
  ],
};
