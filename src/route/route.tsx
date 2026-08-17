import { createBrowserRouter } from "react-router";
import { AuthLayout } from "@/pages/auth-layout";
import SignIn from "@/pages/sign-in";
import { AppLayout } from "@/pages/app-layout";
import Home from "@/pages/home";
import Lifecycle from "@/pages/lifecycle";
import LifecycleSettings from "@/pages/lifecycle/settings";
import StageLayout from "@/pages/lifecycle/stage/layout";
import StageTabsLayout from "@/pages/lifecycle/stage/stage-tabs-layout";
import { OverviewTab } from "@/pages/lifecycle/stage/overview/overview-tab";
import { CohortsTab } from "@/pages/lifecycle/stage/cohorts/cohorts-tab";
import { MarketsTab } from "@/pages/lifecycle/stage/markets/markets-tab";
import { ChangesTab } from "@/pages/lifecycle/stage/changes/changes-tab";
import { AgentsTab } from "@/pages/lifecycle/stage/agents/agents-tab";
import { HistoryTab } from "@/pages/lifecycle/stage/history/history-tab";
import CompareRoute from "@/pages/lifecycle/stage/compare/compare-route";
import ChainRoute from "@/pages/lifecycle/stage/chain/chain-route";
import DefinitionRoute from "@/pages/lifecycle/stage/definition/definition-route";
import AcquireFunnelTab from "@/pages/lifecycle/stage/acquire/funnel-tab";
import AcquireChannelsTab from "@/pages/lifecycle/stage/acquire/channels-tab";
import AcquireChannelDetailRoute from "@/pages/lifecycle/stage/acquire/channel-detail-route";
import AcquireUnitEconomicsTab from "@/pages/lifecycle/stage/acquire/unit-economics-tab";
import ActivateTimeToValueTab from "@/pages/lifecycle/stage/activate/time-to-value-tab";
import ActivatePathsTab from "@/pages/lifecycle/stage/activate/paths-tab";
import ActivatePathDetailRoute from "@/pages/lifecycle/stage/activate/path-detail-route";
import ActivateReleaseImpactRoute from "@/pages/lifecycle/stage/activate/release-impact-route";
import PricePlansTab from "@/pages/lifecycle/stage/price/plans-tab";
import PricePlanDetailRoute from "@/pages/lifecycle/stage/price/plan-detail-route";
import PriceMarginTab from "@/pages/lifecycle/stage/price/margin-tab";
import PriceDiscountingTab from "@/pages/lifecycle/stage/price/discounting-tab";
import AdoptFeaturesTab from "@/pages/lifecycle/stage/adopt/features-tab";
import AdoptFeatureDetailRoute from "@/pages/lifecycle/stage/adopt/feature-detail-route";
import AdoptDepthTab from "@/pages/lifecycle/stage/adopt/depth-tab";
import AdoptBlindSpotsTab from "@/pages/lifecycle/stage/adopt/blind-spots-tab";
import RetainSegmentDetailRoute from "@/pages/lifecycle/stage/retain/segment-detail-route";
import RetainRepeatCurveTab from "@/pages/lifecycle/stage/retain/repeat-curve-tab";
import RetainSegmentsTab from "@/pages/lifecycle/stage/retain/segments-tab";
import RetainReactivationTab from "@/pages/lifecycle/stage/retain/reactivation-tab";
import Rooms from "@/pages/rooms";
import RoomLayout, {
  RoomDecisionRoute,
  RoomEvidenceRoute,
  RoomLogRoute,
  RoomPlaysRoute,
} from "@/pages/rooms/room/room-layout";
import AiTeammates from "@/pages/ai-teammates";
import BusinessMemory from "@/pages/business-memory";
import Segments from "@/pages/segments";
import Governance from "@/pages/governance";
import { RouteError } from "@/route/route-error";
// import { ProtectedRoute } from "@/route/protected-route";

export const routes = createBrowserRouter([
  {
    // Pathless wrapper so every branch (including unmatched paths) shares
    // one errorElement instead of react-router's default error page.
    id: "root",
    ErrorBoundary: RouteError,
    children: [
      {
        path: "/auth",
        Component: AuthLayout,
        children: [
          {
            path: "sign-in",
            Component: SignIn,
          },
        ],
      },
      {
        path: "/",
        // Component: ProtectedRoute,
        children: [
          {
            Component: AppLayout,
            children: [
              {
                index: true,
                Component: Home,
              },
              {
                path: "lifecycle",
                children: [
                  { index: true, Component: Lifecycle },
                  { path: "settings", Component: LifecycleSettings },
                  {
                    path: ":stage",
                    Component: StageLayout,
                    children: [
                      { path: "definition", Component: DefinitionRoute },
                      { path: "compare", Component: CompareRoute },
                      { path: "chain", Component: ChainRoute },
                      { path: "channels/:id", Component: AcquireChannelDetailRoute },
                      { path: "paths/:id", Component: ActivatePathDetailRoute },
                      { path: "changes/:id", Component: ActivateReleaseImpactRoute },
                      { path: "plans/:id", Component: PricePlanDetailRoute },
                      { path: "features/:id", Component: AdoptFeatureDetailRoute },
                      { path: "segments/:id", Component: RetainSegmentDetailRoute },
                      {
                        Component: StageTabsLayout,
                        children: [
                          { index: true, Component: OverviewTab },
                          { path: "funnel", Component: AcquireFunnelTab },
                          { path: "channels", Component: AcquireChannelsTab },
                          { path: "unit-economics", Component: AcquireUnitEconomicsTab },
                          { path: "time-to-value", Component: ActivateTimeToValueTab },
                          { path: "paths", Component: ActivatePathsTab },
                          { path: "plans", Component: PricePlansTab },
                          { path: "margin", Component: PriceMarginTab },
                          { path: "discounting", Component: PriceDiscountingTab },
                          { path: "features", Component: AdoptFeaturesTab },
                          { path: "depth", Component: AdoptDepthTab },
                          { path: "blind-spots", Component: AdoptBlindSpotsTab },
                          { path: "repeat-curve", Component: RetainRepeatCurveTab },
                          { path: "segments", Component: RetainSegmentsTab },
                          { path: "reactivation", Component: RetainReactivationTab },
                          { path: "cohorts", Component: CohortsTab },
                          { path: "markets", Component: MarketsTab },
                          { path: "changes", Component: ChangesTab },
                          { path: "agents", Component: AgentsTab },
                          { path: "history", Component: HistoryTab },
                        ],
                      },
                    ],
                  },
                ],
              },
              {
                path: "rooms",
                children: [
                  { index: true, Component: Rooms },
                  {
                    path: ":roomId",
                    Component: RoomLayout,
                    children: [
                      { index: true, Component: RoomDecisionRoute },
                      { path: "evidence", Component: RoomEvidenceRoute },
                      { path: "plays", Component: RoomPlaysRoute },
                      { path: "log", Component: RoomLogRoute },
                    ],
                  },
                ],
              },
              {
                path: "ai-teammates",
                Component: AiTeammates,
              },
              {
                path: "business-memory",
                Component: BusinessMemory,
              },
              {
                path: "segments",
                Component: Segments,
              },
              {
                path: "governance",
                Component: Governance,
              },
            ],
          },
        ],
      },
    ],
  },
]);
