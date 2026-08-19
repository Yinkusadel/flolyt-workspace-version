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
import ExpandPathDetailRoute from "@/pages/lifecycle/stage/expand/path-detail-route";
import ExpandUpgradePathsTab from "@/pages/lifecycle/stage/expand/upgrade-paths-tab";
import ExpandBasketTab from "@/pages/lifecycle/stage/expand/basket-tab";
import ExpandAccountsTab from "@/pages/lifecycle/stage/expand/accounts-tab";
import SupportSilentFailuresRoute from "@/pages/lifecycle/stage/support/silent-failures-route";
import SupportContactDriversTab from "@/pages/lifecycle/stage/support/contact-drivers-tab";
import SupportResolutionTab from "@/pages/lifecycle/stage/support/resolution-tab";
import SupportDeflectionTab from "@/pages/lifecycle/stage/support/deflection-tab";
import RenewOneAccountRoute from "@/pages/lifecycle/stage/renew/one-account-route";
import RenewRenewalBookTab from "@/pages/lifecycle/stage/renew/renewal-book-tab";
import RenewDunningTab from "@/pages/lifecycle/stage/renew/dunning-tab";
import RenewPausesTab from "@/pages/lifecycle/stage/renew/pauses-tab";
import AdvocateOneReferrerGroupRoute from "@/pages/lifecycle/stage/advocate/one-referrer-group-route";
import AdvocateReferrersTab from "@/pages/lifecycle/stage/advocate/referrers-tab";
import AdvocateReferralQualityTab from "@/pages/lifecycle/stage/advocate/quality-tab";
import AdvocateRewardsTab from "@/pages/lifecycle/stage/advocate/rewards-tab";
import ChurnReasonsTab from "@/pages/lifecycle/stage/churn/reasons-tab";
import ChurnPredictionTab from "@/pages/lifecycle/stage/churn/prediction-tab";
import ChurnWinBackTab from "@/pages/lifecycle/stage/churn/win-back-tab";
import Rooms from "@/pages/rooms";
import NewRoom from "@/pages/rooms/new";
import RoomSubscriptions from "@/pages/rooms/subscriptions";
import PlaysAtScale from "@/pages/rooms/plays-at-scale";
import RoomLayout from "@/pages/rooms/room/room-layout";
import { RoomHomeRoute, RoomEvidenceRoute, RoomLogRoute } from "@/pages/rooms/room/room-home-route";
import { EvidenceFindingRoute } from "@/pages/rooms/room/evidence-finding-route";
import { PlaysBoardRoute } from "@/pages/rooms/room/plays/plays-board-route";
import { OneProposalRoute } from "@/pages/rooms/room/plays/one-proposal-route";
import { ConflictRoute } from "@/pages/rooms/room/conflict-route";
import { DissentRoute } from "@/pages/rooms/room/dissent-route";
import { GuardrailsRoute } from "@/pages/rooms/room/guardrails-route";
import { RunsRoute } from "@/pages/rooms/room/runs-route";
import { PeopleRoute } from "@/pages/rooms/room/people-route";
import { CollisionRoute } from "@/pages/rooms/room/collision-route";
import { CohortRoute } from "@/pages/rooms/room/cohort-route";
import { CloseOutRoute } from "@/pages/rooms/room/close-out-route";
import { MergeRoute } from "@/pages/rooms/room/merge-route";
import Goals from "@/pages/goals";
import NewGoal from "@/pages/goals/new";
import GoalLayout from "@/pages/goals/goal/layout";
import { GoalHomeRoute } from "@/pages/goals/goal/home-route";
import { GoalOffTrackRoute } from "@/pages/goals/goal/off-track-route";
import { GoalContributionsRoute } from "@/pages/goals/goal/contributions-route";
import { GoalCascadeRoute } from "@/pages/goals/cascade-route";
import { GoalsInTensionRoute } from "@/pages/goals/conflicts-route";
import { QuarterCloseRoute } from "@/pages/goals/quarter-close-route";
import Value from "@/pages/value";
import WhatToDoToday from "@/pages/what-to-do-today";
import TodayRankingRoute from "@/pages/what-to-do-today/ranking-route";
import TodayItemDetailRoute from "@/pages/what-to-do-today/item-detail-route";
import TodaySnoozedRoute from "@/pages/what-to-do-today/snoozed-route";
import TodayWaitingOnDataRoute from "@/pages/what-to-do-today/waiting-on-data-route";
import TodayDoneRoute from "@/pages/what-to-do-today/done-route";
import SettingsTodayRoute from "@/pages/what-to-do-today/settings-today-route";
import Digest from "@/pages/digest";
import DigestArchiveRoute from "@/pages/digest/archive-route";
import OneDigestRoute from "@/pages/digest/one-digest-route";
import DigestWeeklyRoute from "@/pages/digest/weekly-route";
import DigestExcludedRoute from "@/pages/digest/excluded-route";
import WhatGetsInRoute from "@/pages/digest/settings/what-gets-in-route";
import ChannelsRoute from "@/pages/digest/settings/channels-route";
import QuietHoursRoute from "@/pages/digest/settings/quiet-hours-route";
import NotificationRulesRoute from "@/pages/digest/settings/notification-rules-route";
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
                      { path: "upgrade-paths/:id", Component: ExpandPathDetailRoute },
                      { path: "silent", Component: SupportSilentFailuresRoute },
                      { path: "book/:id", Component: RenewOneAccountRoute },
                      { path: "referrers/:id", Component: AdvocateOneReferrerGroupRoute },
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
                          { path: "upgrade-paths", Component: ExpandUpgradePathsTab },
                          { path: "basket", Component: ExpandBasketTab },
                          { path: "accounts", Component: ExpandAccountsTab },
                          { path: "drivers", Component: SupportContactDriversTab },
                          { path: "resolution", Component: SupportResolutionTab },
                          { path: "deflection", Component: SupportDeflectionTab },
                          { path: "book", Component: RenewRenewalBookTab },
                          { path: "dunning", Component: RenewDunningTab },
                          { path: "pauses", Component: RenewPausesTab },
                          { path: "referrers", Component: AdvocateReferrersTab },
                          { path: "quality", Component: AdvocateReferralQualityTab },
                          { path: "rewards", Component: AdvocateRewardsTab },
                          { path: "reasons", Component: ChurnReasonsTab },
                          { path: "prediction", Component: ChurnPredictionTab },
                          { path: "win-back", Component: ChurnWinBackTab },
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
                  { path: "new", Component: NewRoom },
                  { path: "subscriptions", Component: RoomSubscriptions },
                  {
                    path: ":roomId",
                    Component: RoomLayout,
                    children: [
                      { index: true, Component: RoomHomeRoute },
                      { path: "evidence", Component: RoomEvidenceRoute },
                      { path: "evidence/:findingId", Component: EvidenceFindingRoute },
                      { path: "log", Component: RoomLogRoute },
                      { path: "plays", Component: PlaysBoardRoute },
                      { path: "plays/:playId", Component: OneProposalRoute },
                      { path: "conflict/:conflictId", Component: ConflictRoute },
                      { path: "decision/dissent", Component: DissentRoute },
                      { path: "guardrails", Component: GuardrailsRoute },
                      { path: "runs", Component: RunsRoute },
                      { path: "people", Component: PeopleRoute },
                      { path: "collision", Component: CollisionRoute },
                      { path: "cohort", Component: CohortRoute },
                      { path: "close", Component: CloseOutRoute },
                      { path: "merge", Component: MergeRoute },
                    ],
                  },
                ],
              },
              {
                path: "plays",
                Component: PlaysAtScale,
              },
              {
                path: "what-to-do-today",
                children: [
                  { index: true, Component: WhatToDoToday },
                  { path: "ranking", Component: TodayRankingRoute },
                  { path: "snoozed", Component: TodaySnoozedRoute },
                  { path: "waiting-on-data", Component: TodayWaitingOnDataRoute },
                  { path: "done", Component: TodayDoneRoute },
                  { path: ":id", Component: TodayItemDetailRoute },
                ],
              },
              {
                path: "settings/today",
                Component: SettingsTodayRoute,
              },
              {
                path: "digest",
                children: [
                  { index: true, Component: Digest },
                  { path: "archive", Component: DigestArchiveRoute },
                  { path: "weekly", Component: DigestWeeklyRoute },
                  { path: "excluded", Component: DigestExcludedRoute },
                  { path: ":date", Component: OneDigestRoute },
                ],
              },
              {
                path: "settings/digest",
                children: [
                  { index: true, Component: WhatGetsInRoute },
                  { path: "channels", Component: ChannelsRoute },
                  { path: "quiet-hours", Component: QuietHoursRoute },
                ],
              },
              {
                path: "settings/notifications",
                Component: NotificationRulesRoute,
              },
              {
                path: "goals",
                children: [
                  { index: true, Component: Goals },
                  { path: "new", Component: NewGoal },
                  { path: "tree", Component: GoalCascadeRoute },
                  { path: "conflicts", Component: GoalsInTensionRoute },
                  { path: ":quarter/close", Component: QuarterCloseRoute },
                  {
                    path: ":goalId",
                    Component: GoalLayout,
                    children: [
                      { index: true, Component: GoalHomeRoute },
                      { path: "off-track", Component: GoalOffTrackRoute },
                      { path: "contributions", Component: GoalContributionsRoute },
                    ],
                  },
                ],
              },
              {
                path: "value",
                Component: Value,
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
