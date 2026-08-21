import { createBrowserRouter } from "react-router";
import { AuthLayout } from "@/pages/auth-layout";
import SignIn from "@/pages/sign-in";
import { AppLayout } from "@/pages/app-layout";
import Home from "@/pages/home";
import Lifecycle from "@/pages/everyday/lifecycle";
import LifecycleSettings from "@/pages/everyday/lifecycle/settings";
import StageLayout from "@/pages/everyday/lifecycle/stage/layout";
import StageTabsLayout from "@/pages/everyday/lifecycle/stage/stage-tabs-layout";
import { OverviewTab } from "@/pages/everyday/lifecycle/stage/overview/overview-tab";
import { CohortsTab } from "@/pages/everyday/lifecycle/stage/cohorts/cohorts-tab";
import { MarketsTab } from "@/pages/everyday/lifecycle/stage/markets/markets-tab";
import { ChangesTab } from "@/pages/everyday/lifecycle/stage/changes/changes-tab";
import { AgentsTab } from "@/pages/everyday/lifecycle/stage/agents/agents-tab";
import { HistoryTab } from "@/pages/everyday/lifecycle/stage/history/history-tab";
import CompareRoute from "@/pages/everyday/lifecycle/stage/compare/compare-route";
import ChainRoute from "@/pages/everyday/lifecycle/stage/chain/chain-route";
import DefinitionRoute from "@/pages/everyday/lifecycle/stage/definition/definition-route";
import AcquireFunnelTab from "@/pages/everyday/lifecycle/stage/acquire/funnel-tab";
import AcquireChannelsTab from "@/pages/everyday/lifecycle/stage/acquire/channels-tab";
import AcquireChannelDetailRoute from "@/pages/everyday/lifecycle/stage/acquire/channel-detail-route";
import AcquireUnitEconomicsTab from "@/pages/everyday/lifecycle/stage/acquire/unit-economics-tab";
import ActivateTimeToValueTab from "@/pages/everyday/lifecycle/stage/activate/time-to-value-tab";
import ActivatePathsTab from "@/pages/everyday/lifecycle/stage/activate/paths-tab";
import ActivatePathDetailRoute from "@/pages/everyday/lifecycle/stage/activate/path-detail-route";
import ActivateReleaseImpactRoute from "@/pages/everyday/lifecycle/stage/activate/release-impact-route";
import PricePlansTab from "@/pages/everyday/lifecycle/stage/price/plans-tab";
import PricePlanDetailRoute from "@/pages/everyday/lifecycle/stage/price/plan-detail-route";
import PriceMarginTab from "@/pages/everyday/lifecycle/stage/price/margin-tab";
import PriceDiscountingTab from "@/pages/everyday/lifecycle/stage/price/discounting-tab";
import AdoptFeaturesTab from "@/pages/everyday/lifecycle/stage/adopt/features-tab";
import AdoptFeatureDetailRoute from "@/pages/everyday/lifecycle/stage/adopt/feature-detail-route";
import AdoptDepthTab from "@/pages/everyday/lifecycle/stage/adopt/depth-tab";
import AdoptBlindSpotsTab from "@/pages/everyday/lifecycle/stage/adopt/blind-spots-tab";
import RetainSegmentDetailRoute from "@/pages/everyday/lifecycle/stage/retain/segment-detail-route";
import RetainRepeatCurveTab from "@/pages/everyday/lifecycle/stage/retain/repeat-curve-tab";
import RetainSegmentsTab from "@/pages/everyday/lifecycle/stage/retain/segments-tab";
import RetainReactivationTab from "@/pages/everyday/lifecycle/stage/retain/reactivation-tab";
import ExpandPathDetailRoute from "@/pages/everyday/lifecycle/stage/expand/path-detail-route";
import ExpandUpgradePathsTab from "@/pages/everyday/lifecycle/stage/expand/upgrade-paths-tab";
import ExpandBasketTab from "@/pages/everyday/lifecycle/stage/expand/basket-tab";
import ExpandAccountsTab from "@/pages/everyday/lifecycle/stage/expand/accounts-tab";
import SupportSilentFailuresRoute from "@/pages/everyday/lifecycle/stage/support/silent-failures-route";
import SupportContactDriversTab from "@/pages/everyday/lifecycle/stage/support/contact-drivers-tab";
import SupportResolutionTab from "@/pages/everyday/lifecycle/stage/support/resolution-tab";
import SupportDeflectionTab from "@/pages/everyday/lifecycle/stage/support/deflection-tab";
import RenewOneAccountRoute from "@/pages/everyday/lifecycle/stage/renew/one-account-route";
import RenewRenewalBookTab from "@/pages/everyday/lifecycle/stage/renew/renewal-book-tab";
import RenewDunningTab from "@/pages/everyday/lifecycle/stage/renew/dunning-tab";
import RenewPausesTab from "@/pages/everyday/lifecycle/stage/renew/pauses-tab";
import AdvocateOneReferrerGroupRoute from "@/pages/everyday/lifecycle/stage/advocate/one-referrer-group-route";
import AdvocateReferrersTab from "@/pages/everyday/lifecycle/stage/advocate/referrers-tab";
import AdvocateReferralQualityTab from "@/pages/everyday/lifecycle/stage/advocate/quality-tab";
import AdvocateRewardsTab from "@/pages/everyday/lifecycle/stage/advocate/rewards-tab";
import ChurnReasonsTab from "@/pages/everyday/lifecycle/stage/churn/reasons-tab";
import ChurnPredictionTab from "@/pages/everyday/lifecycle/stage/churn/prediction-tab";
import ChurnWinBackTab from "@/pages/everyday/lifecycle/stage/churn/win-back-tab";
import Rooms from "@/pages/everyday/rooms";
import NewRoom from "@/pages/everyday/rooms/new";
import RoomSubscriptions from "@/pages/everyday/rooms/subscriptions";
import PlaysAtScale from "@/pages/everyday/rooms/plays-at-scale";
import RoomLayout from "@/pages/everyday/rooms/room/room-layout";
import { RoomHomeRoute, RoomEvidenceRoute, RoomLogRoute } from "@/pages/everyday/rooms/room/room-home-route";
import { EvidenceFindingRoute } from "@/pages/everyday/rooms/room/evidence-finding-route";
import { PlaysBoardRoute } from "@/pages/everyday/rooms/room/plays/plays-board-route";
import { OneProposalRoute } from "@/pages/everyday/rooms/room/plays/one-proposal-route";
import { ConflictRoute } from "@/pages/everyday/rooms/room/conflict-route";
import { DissentRoute } from "@/pages/everyday/rooms/room/dissent-route";
import { GuardrailsRoute } from "@/pages/everyday/rooms/room/guardrails-route";
import { RunsRoute } from "@/pages/everyday/rooms/room/runs-route";
import { PeopleRoute } from "@/pages/everyday/rooms/room/people-route";
import { CollisionRoute } from "@/pages/everyday/rooms/room/collision-route";
import { CohortRoute } from "@/pages/everyday/rooms/room/cohort-route";
import { CloseOutRoute } from "@/pages/everyday/rooms/room/close-out-route";
import { MergeRoute } from "@/pages/everyday/rooms/room/merge-route";
import Goals from "@/pages/everyday/goals";
import NewGoal from "@/pages/everyday/goals/new";
import GoalLayout from "@/pages/everyday/goals/goal/layout";
import { GoalHomeRoute } from "@/pages/everyday/goals/goal/home-route";
import { GoalOffTrackRoute } from "@/pages/everyday/goals/goal/off-track-route";
import { GoalContributionsRoute } from "@/pages/everyday/goals/goal/contributions-route";
import { GoalCascadeRoute } from "@/pages/everyday/goals/cascade-route";
import { GoalsInTensionRoute } from "@/pages/everyday/goals/conflicts-route";
import { QuarterCloseRoute } from "@/pages/everyday/goals/quarter-close-route";
import WhatToDoToday from "@/pages/everyday/what-to-do-today";
import TodayRankingRoute from "@/pages/everyday/what-to-do-today/ranking-route";
import TodayItemDetailRoute from "@/pages/everyday/what-to-do-today/item-detail-route";
import TodaySnoozedRoute from "@/pages/everyday/what-to-do-today/snoozed-route";
import TodayWaitingOnDataRoute from "@/pages/everyday/what-to-do-today/waiting-on-data-route";
import TodayDoneRoute from "@/pages/everyday/what-to-do-today/done-route";
import SettingsTodayRoute from "@/pages/everyday/what-to-do-today/settings-today-route";
import Digest from "@/pages/everyday/digest";
import DigestArchiveRoute from "@/pages/everyday/digest/archive-route";
import OneDigestRoute from "@/pages/everyday/digest/one-digest-route";
import DigestWeeklyRoute from "@/pages/everyday/digest/weekly-route";
import DigestExcludedRoute from "@/pages/everyday/digest/excluded-route";
import WhatGetsInRoute from "@/pages/everyday/digest/settings/what-gets-in-route";
import ChannelsRoute from "@/pages/everyday/digest/settings/channels-route";
import QuietHoursRoute from "@/pages/everyday/digest/settings/quiet-hours-route";
import NotificationRulesRoute from "@/pages/everyday/digest/settings/notification-rules-route";
import Inbox from "@/pages/everyday/inbox";
import InboxItemDetailRoute from "@/pages/everyday/inbox/item-detail-route";
import InboxRepliesRoute from "@/pages/everyday/inbox/replies-route";
import InboxOneReplyRoute from "@/pages/everyday/inbox/one-reply-route";
import InboxRoutingRulesRoute from "@/pages/everyday/inbox/routing/routing-rules-route";
import InboxUnroutableRoute from "@/pages/everyday/inbox/routing/unroutable-route";
import InboxSnoozedRoute from "@/pages/everyday/inbox/snoozed-route";
import InboxDelegationRoute from "@/pages/everyday/inbox/delegation-route";
import InboxSystemsRoute from "@/pages/everyday/inbox/systems-route";
import AuthorityThresholdsRoute from "@/pages/everyday/inbox/settings/authority-thresholds-route";
import AuthorityStandingRoute from "@/pages/everyday/inbox/settings/authority-standing-route";
import InboxSettingsRoute from "@/pages/everyday/inbox/settings/inbox-settings-route";
import Handoff from "@/pages/everyday/handoff";
import HandoffLoadRoute from "@/pages/everyday/handoff/load-route";
import ChainLayout from "@/pages/everyday/handoff/chain/chain-layout";
import ChainHomeRoute from "@/pages/everyday/handoff/chain/chain-home-route";
import ObligationsRoute from "@/pages/everyday/handoff/chain/obligations-route";
import OneObligationRoute from "@/pages/everyday/handoff/obligation/one-obligation-route";
import HandoffEscalationRoute from "@/pages/everyday/handoff/settings/escalation-route";
import DeparturesRoute from "@/pages/everyday/handoff/settings/departures-route";
import HandoffSettingsRoute from "@/pages/everyday/handoff/settings/handoff-settings-route";
import LeakageMap from "@/pages/revenue/leakage-map";
import LeaksChangedRoute from "@/pages/revenue/leakage-map/changed-route";
import LeaksUnmeasurableRoute from "@/pages/revenue/leakage-map/unmeasurable-route";
import LeaksDetectionRoute from "@/pages/revenue/leakage-map/detection-route";
import LeaksExportRoute from "@/pages/revenue/leakage-map/export-route";
import LeakDetailRoute from "@/pages/revenue/leakage-map/leak-detail-route";
import LeaksSettingsRoute from "@/pages/revenue/leakage-map/settings/leakage-map-settings-route";
import Funnel from "@/pages/revenue/funnel";
import FunnelGapsRoute from "@/pages/revenue/funnel/gaps-route";
import FunnelCompareRoute from "@/pages/revenue/funnel/compare-route";
import FunnelHistoryRoute from "@/pages/revenue/funnel/history-route";
import FunnelStepDetailRoute from "@/pages/revenue/funnel/step-detail-route";
import NewFunnelStep from "@/pages/revenue/funnel/new-step";
import FunnelSettingsRoute from "@/pages/revenue/funnel/settings/funnel-settings-route";
import Scenario from "@/pages/revenue/scenario";
import ScenarioActualsRoute from "@/pages/revenue/scenario/actuals-route";
import ScenarioBlockedRoute from "@/pages/revenue/scenario/blocked-route";
import ScenarioHistoryRoute from "@/pages/revenue/scenario/history-route";
import ScenarioDetailRoute from "@/pages/revenue/scenario/scenario-detail-route";
import NewScenario from "@/pages/revenue/scenario/new";
import ScenarioSettingsRoute from "@/pages/revenue/scenario/settings/scenario-settings-route";
import Value from "@/pages/revenue/value";
import ValueRoomDetailRoute from "@/pages/revenue/value/room-detail-route";
import ValueCostRoute from "@/pages/revenue/value/cost-route";
import ValueUnmeasurableRoute from "@/pages/revenue/value/unmeasurable-route";
import ValueOverTimeRoute from "@/pages/revenue/value/over-time-route";
import ValueReconciliationRoute from "@/pages/revenue/value/reconciliation-route";
import ValueBoardRoute from "@/pages/revenue/value/board-route";
import ValueRatesRoute from "@/pages/revenue/value/rates-route";
import ValueSettingsRoute from "@/pages/revenue/value/settings/value-settings-route";
import Forecast from "@/pages/revenue/forecast";
import ForecastBlockedRoute from "@/pages/revenue/forecast/blocked-route";
import ForecastActualsRoute from "@/pages/revenue/forecast/actuals-route";
import ForecastHistoryRoute from "@/pages/revenue/forecast/history-route";
import ForecastStageDetailRoute from "@/pages/revenue/forecast/stage-detail-route";
import NewReForecast from "@/pages/revenue/forecast/re-forecast";
import ForecastSettingsRoute from "@/pages/revenue/forecast/settings/forecast-settings-route";
import Attribution from "@/pages/revenue/attribution";
import AttributionHoldoutsRoute from "@/pages/revenue/attribution/holdouts-route";
import AttributionOverlapRoute from "@/pages/revenue/attribution/overlap-route";
import AttributionUnattributableRoute from "@/pages/revenue/attribution/unattributable-route";
import AttributionMethodsRoute from "@/pages/revenue/attribution/methods-route";
import AttributionInterventionDetailRoute from "@/pages/revenue/attribution/intervention-detail-route";
import AttributionDisputeDetailRoute from "@/pages/revenue/attribution/dispute-detail-route";
import NewHoldout from "@/pages/revenue/attribution/new-holdout";
import AttributionSettingsRoute from "@/pages/revenue/attribution/settings/attribution-settings-route";
import Benchmarks from "@/pages/revenue/benchmarks";
import BenchmarksHoldoutsRoute from "@/pages/revenue/benchmarks/holdouts-route";
import BenchmarksRefusedRoute from "@/pages/revenue/benchmarks/refused-route";
import BenchmarksLimitsRoute from "@/pages/revenue/benchmarks/limits-route";
import BenchmarksLikeForLikeRoute from "@/pages/revenue/benchmarks/like-for-like-route";
import RepeatRateDetailRoute from "@/pages/revenue/benchmarks/repeat-rate-detail-route";
import NewComparison from "@/pages/revenue/benchmarks/new";
import BenchmarksSettingsRoute from "@/pages/revenue/benchmarks/settings/benchmarks-settings-route";
import AiTeammates from "@/pages/ai-teammates";
import BusinessMemory from "@/pages/business-memory";
import Segments from "@/pages/customers/segments";
import SegmentsReachabilityRoute from "@/pages/customers/segments/reachability-route";
import SegmentsOverlapRoute from "@/pages/customers/segments/overlap-route";
import SegmentsDriftRoute from "@/pages/customers/segments/drift-route";
import SegmentsRetiredRoute from "@/pages/customers/segments/retired-route";
import NewSegment from "@/pages/customers/segments/new";
import SegmentDetailRoute from "@/pages/customers/segments/segment-detail-route";
import SegmentsSettingsRoute from "@/pages/customers/segments/settings/segments-settings-route";
import CustomerHealth from "@/pages/customers/customer-health";
import CustomerHealthNoScoreRoute from "@/pages/customers/customer-health/no-score-route";
import CustomerHealthCohortDetailRoute from "@/pages/customers/customer-health/cohort-detail-route";
import CustomerHealthUnownedRoute from "@/pages/customers/customer-health/unowned-route";
import CustomerHealthCoverageRoute from "@/pages/customers/customer-health/coverage-route";
import CustomerHealthChangedRoute from "@/pages/customers/customer-health/changed-route";
import CustomerHealthThresholdsRoute from "@/pages/customers/customer-health/thresholds-route";
import CustomerHealthSettingsRoute from "@/pages/customers/customer-health/settings/customer-health-settings-route";
import CustomerDetailRoute from "@/pages/customers/customer-detail-route";
import Campaigns from "@/pages/customers/campaigns";
import CampaignsAudiencesRoute from "@/pages/customers/campaigns/audiences-route";
import CampaignsWaitingRoute from "@/pages/customers/campaigns/waiting-route";
import CampaignsSuppressedRoute from "@/pages/customers/campaigns/suppressed-route";
import CampaignsSentRoute from "@/pages/customers/campaigns/sent-route";
import CampaignsHistoryRoute from "@/pages/customers/campaigns/history-route";
import NewCampaign from "@/pages/customers/campaigns/new";
import CampaignDetailRoute from "@/pages/customers/campaigns/campaign-detail-route";
import CampaignIncidentDetailRoute from "@/pages/customers/campaigns/incident-detail-route";
import CampaignsSettingsRoute from "@/pages/customers/campaigns/settings/campaigns-settings-route";
import Experiments from "@/pages/customers/experiments";
import ExperimentsResultsRoute from "@/pages/customers/experiments/results-route";
import ExperimentsExcludedRoute from "@/pages/customers/experiments/excluded-route";
import ExperimentsReadabilityRoute from "@/pages/customers/experiments/readability-route";
import ExperimentsHistoryRoute from "@/pages/customers/experiments/history-route";
import ExperimentsContaminatedRoute from "@/pages/customers/experiments/contaminated-route";
import NewExperiment from "@/pages/customers/experiments/new";
import ExperimentDetailRoute from "@/pages/customers/experiments/experiment-detail-route";
import ExperimentsSettingsRoute from "@/pages/customers/experiments/settings/experiments-settings-route";
import Replies from "@/pages/customers/replies";
import RepliesThemesRoute from "@/pages/customers/replies/themes-route";
import RepliesUnansweredRoute from "@/pages/customers/replies/unanswered-route";
import RepliesRoutingRoute from "@/pages/customers/replies/routing-route";
import RepliesAnsweredRoute from "@/pages/customers/replies/answered-route";
import RepliesUseRoute from "@/pages/customers/replies/use-route";
import ConversationDetailRoute from "@/pages/customers/replies/conversation-detail-route";
import ReplyAnswerRoute from "@/pages/customers/replies/answer-route";
import RepliesSettingsRoute from "@/pages/customers/replies/settings/replies-settings-route";
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
                path: "inbox",
                children: [
                  { index: true, Component: Inbox },
                  { path: "replies", Component: InboxRepliesRoute },
                  { path: "replies/:id", Component: InboxOneReplyRoute },
                  { path: "routing", Component: InboxRoutingRulesRoute },
                  { path: "routing/unroutable", Component: InboxUnroutableRoute },
                  { path: "snoozed", Component: InboxSnoozedRoute },
                  { path: "delegation", Component: InboxDelegationRoute },
                  { path: "systems", Component: InboxSystemsRoute },
                  { path: ":id", Component: InboxItemDetailRoute },
                ],
              },
              {
                path: "settings/authority",
                children: [
                  { index: true, Component: AuthorityThresholdsRoute },
                  { path: "standing", Component: AuthorityStandingRoute },
                ],
              },
              {
                path: "settings/inbox",
                Component: InboxSettingsRoute,
              },
              {
                path: "handoff",
                children: [
                  { index: true, Component: Handoff },
                  { path: "load", Component: HandoffLoadRoute },
                  {
                    path: ":id",
                    Component: ChainLayout,
                    children: [
                      { index: true, Component: ChainHomeRoute },
                      { path: "obligations", Component: ObligationsRoute },
                      { path: "o/:oid", Component: OneObligationRoute },
                    ],
                  },
                ],
              },
              {
                path: "settings/handoff-escalation",
                Component: HandoffEscalationRoute,
              },
              {
                path: "settings/departures",
                Component: DeparturesRoute,
              },
              {
                path: "settings/handoff",
                Component: HandoffSettingsRoute,
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
                children: [
                  { index: true, Component: Value },
                  { path: "rooms/:id", Component: ValueRoomDetailRoute },
                  { path: "cost", Component: ValueCostRoute },
                  { path: "unmeasurable", Component: ValueUnmeasurableRoute },
                  { path: "over-time", Component: ValueOverTimeRoute },
                  { path: "reconciliation", Component: ValueReconciliationRoute },
                  { path: "board", Component: ValueBoardRoute },
                  { path: "rates", Component: ValueRatesRoute },
                ],
              },
              {
                path: "settings/value",
                Component: ValueSettingsRoute,
              },
              {
                path: "leakage-map",
                children: [
                  { index: true, Component: LeakageMap },
                  { path: "changed", Component: LeaksChangedRoute },
                  { path: "unmeasurable", Component: LeaksUnmeasurableRoute },
                  { path: "detection", Component: LeaksDetectionRoute },
                  { path: "export", Component: LeaksExportRoute },
                  { path: ":id", Component: LeakDetailRoute },
                ],
              },
              {
                path: "settings/leakage-map",
                Component: LeaksSettingsRoute,
              },
              {
                path: "funnel",
                children: [
                  { index: true, Component: Funnel },
                  { path: "gaps", Component: FunnelGapsRoute },
                  { path: "compare", Component: FunnelCompareRoute },
                  { path: "history", Component: FunnelHistoryRoute },
                  { path: "steps/new", Component: NewFunnelStep },
                  { path: ":step", Component: FunnelStepDetailRoute },
                ],
              },
              {
                path: "settings/funnel",
                Component: FunnelSettingsRoute,
              },
              {
                path: "scenario",
                children: [
                  { index: true, Component: Scenario },
                  { path: "new", Component: NewScenario },
                  { path: "actuals", Component: ScenarioActualsRoute },
                  { path: "blocked", Component: ScenarioBlockedRoute },
                  { path: "history", Component: ScenarioHistoryRoute },
                  { path: ":id", Component: ScenarioDetailRoute },
                ],
              },
              {
                path: "settings/scenario",
                Component: ScenarioSettingsRoute,
              },
              {
                path: "forecast",
                children: [
                  { index: true, Component: Forecast },
                  { path: "blocked", Component: ForecastBlockedRoute },
                  { path: "actuals", Component: ForecastActualsRoute },
                  { path: "history", Component: ForecastHistoryRoute },
                  { path: ":stage/re-forecast", Component: NewReForecast },
                  { path: ":stage", Component: ForecastStageDetailRoute },
                ],
              },
              {
                path: "settings/forecast",
                Component: ForecastSettingsRoute,
              },
              {
                path: "attribution",
                children: [
                  { index: true, Component: Attribution },
                  { path: "holdouts", Component: AttributionHoldoutsRoute },
                  { path: "holdouts/new", Component: NewHoldout },
                  { path: "overlap", Component: AttributionOverlapRoute },
                  { path: "unattributable", Component: AttributionUnattributableRoute },
                  { path: "methods", Component: AttributionMethodsRoute },
                  { path: "disputes/:id", Component: AttributionDisputeDetailRoute },
                  { path: ":id", Component: AttributionInterventionDetailRoute },
                ],
              },
              {
                path: "settings/attribution",
                Component: AttributionSettingsRoute,
              },
              {
                path: "benchmarks",
                children: [
                  { index: true, Component: Benchmarks },
                  { path: "holdouts", Component: BenchmarksHoldoutsRoute },
                  { path: "refused", Component: BenchmarksRefusedRoute },
                  { path: "limits", Component: BenchmarksLimitsRoute },
                  { path: "like-for-like", Component: BenchmarksLikeForLikeRoute },
                  { path: "new", Component: NewComparison },
                  { path: ":id", Component: RepeatRateDetailRoute },
                ],
              },
              {
                path: "settings/benchmarks",
                Component: BenchmarksSettingsRoute,
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
                children: [
                  { index: true, Component: Segments },
                  { path: "reachability", Component: SegmentsReachabilityRoute },
                  { path: "overlap", Component: SegmentsOverlapRoute },
                  { path: "drift", Component: SegmentsDriftRoute },
                  { path: "retired", Component: SegmentsRetiredRoute },
                  { path: "new", Component: NewSegment },
                  { path: ":id", Component: SegmentDetailRoute },
                ],
              },
              {
                path: "settings/segments",
                Component: SegmentsSettingsRoute,
              },
              {
                path: "customer-health",
                children: [
                  { index: true, Component: CustomerHealth },
                  { path: "no-score", Component: CustomerHealthNoScoreRoute },
                  { path: "unowned", Component: CustomerHealthUnownedRoute },
                  { path: "coverage", Component: CustomerHealthCoverageRoute },
                  { path: "changed", Component: CustomerHealthChangedRoute },
                  { path: "thresholds", Component: CustomerHealthThresholdsRoute },
                  { path: ":id", Component: CustomerHealthCohortDetailRoute },
                ],
              },
              {
                path: "settings/customer-health",
                Component: CustomerHealthSettingsRoute,
              },
              {
                path: "customers/:id",
                Component: CustomerDetailRoute,
              },
              {
                path: "campaigns",
                children: [
                  { index: true, Component: Campaigns },
                  { path: "audiences", Component: CampaignsAudiencesRoute },
                  { path: "waiting", Component: CampaignsWaitingRoute },
                  { path: "suppressed", Component: CampaignsSuppressedRoute },
                  { path: "sent", Component: CampaignsSentRoute },
                  { path: "history", Component: CampaignsHistoryRoute },
                  { path: "new", Component: NewCampaign },
                  { path: "incidents/:id", Component: CampaignIncidentDetailRoute },
                  { path: ":id", Component: CampaignDetailRoute },
                ],
              },
              {
                path: "settings/campaigns",
                Component: CampaignsSettingsRoute,
              },
              {
                path: "experiments",
                children: [
                  { index: true, Component: Experiments },
                  { path: "results", Component: ExperimentsResultsRoute },
                  { path: "excluded", Component: ExperimentsExcludedRoute },
                  { path: "readability", Component: ExperimentsReadabilityRoute },
                  { path: "history", Component: ExperimentsHistoryRoute },
                  { path: "contaminated", Component: ExperimentsContaminatedRoute },
                  { path: "new", Component: NewExperiment },
                  { path: ":id", Component: ExperimentDetailRoute },
                ],
              },
              {
                path: "settings/experiments",
                Component: ExperimentsSettingsRoute,
              },
              {
                path: "replies",
                children: [
                  { index: true, Component: Replies },
                  { path: "themes", Component: RepliesThemesRoute },
                  { path: "unanswered", Component: RepliesUnansweredRoute },
                  { path: "routing", Component: RepliesRoutingRoute },
                  { path: "answered", Component: RepliesAnsweredRoute },
                  { path: "use", Component: RepliesUseRoute },
                  { path: ":id/answer", Component: ReplyAnswerRoute },
                  { path: ":id", Component: ConversationDetailRoute },
                ],
              },
              {
                path: "settings/replies",
                Component: RepliesSettingsRoute,
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
