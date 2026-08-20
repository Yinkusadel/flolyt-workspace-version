import { createBrowserRouter } from "react-router";
import { AuthLayout } from "@/pages/auth/layout";
import SignIn from "@/pages/auth/sign-in";
import SignUp from "@/pages/auth/sign-up";
import VerifyOtp from "@/pages/auth/verify-otp";
import AcceptInvitation from "@/pages/auth/accept-invitation";
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
import Value from "@/pages/value";
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
import AiTeammates from "@/pages/ai-teammates";
import BusinessMemory from "@/pages/business-memory";
import Segments from "@/pages/segments";
import Governance from "@/pages/governance";
import { RouteError } from "@/route/route-error";
// import { ProtectedRoute } from "@/route/protected-route";
import { GuestRoute } from "@/route/guest-route";

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
            Component: GuestRoute,
            children: [
              { path: "sign-in", Component: SignIn },
              { path: "sign-up", Component: SignUp },
              { path: "verify-otp/:userId", Component: VerifyOtp },
            ],
          },
          {
            path: "accept-invitation",
            Component: AcceptInvitation,
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
                Component: Value,
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
