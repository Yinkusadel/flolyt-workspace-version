import { createBrowserRouter } from "react-router";
import { AuthLayout } from "@/pages/auth/layout";
import SignIn from "@/pages/auth/sign-in";
import SignUp from "@/pages/auth/sign-up";
import VerifyOtp from "@/pages/auth/verify-otp";
import AcceptTeamInvitationRoute from "@/pages/teams/accept-invitation";
import { AppLayout } from "@/pages/app-layout";
import { OnboardingLayout } from "@/pages/onboarding/layout";
import OnboardingStartRoute from "@/pages/onboarding/start";
import OnboardingWorkspaceRoute from "@/pages/onboarding/workspace";
import OnboardingBusinessModelRoute from "@/pages/onboarding/business-model";
import OnboardingDataRoute from "@/pages/onboarding/data";
import OnboardingAgentsRoute from "@/pages/onboarding/agents";
import OnboardingTeamRoute from "@/pages/onboarding/team";
import OnboardingTeamDetailRoute from "@/pages/onboarding/team/team-detail-route";
import OnboardingFinishingUpRoute from "@/pages/onboarding/finishing-up";
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
import NewConversationRoute from "@/pages/conversations/new-conversation-route";
import AiConversationDetailRoute from "@/pages/conversations/detail-route";
import PlanAndBillingRoute from "@/pages/plan-and-billing";
import { RouteError } from "@/route/route-error";
import { ProtectedRoute } from "@/route/protected-route";
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
        ],
      },
      {
        path: "/teams/accept-invitation",
        Component: AcceptTeamInvitationRoute,
      },
      {
        path: "/",
        Component: ProtectedRoute,
        children: [
          {
            path: "onboarding",
            Component: OnboardingLayout,
            children: [
              { path: "start", Component: OnboardingStartRoute },
              { path: "workspace", Component: OnboardingWorkspaceRoute },
              { path: "business-model", Component: OnboardingBusinessModelRoute },
              { path: "data", Component: OnboardingDataRoute },
              { path: "agents", Component: OnboardingAgentsRoute },
              { path: "team", Component: OnboardingTeamRoute },
              { path: "team/:teamId", Component: OnboardingTeamDetailRoute },
              { path: "finishing-up", Component: OnboardingFinishingUpRoute },
            ],
          },
          {
            Component: AppLayout,
            children: [
              {
                // Home is the conversation starter — see src/oldpages/README.md for what used
                // to live here and everywhere else this redesign parked.
                index: true,
                Component: NewConversationRoute,
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
              // Sidebar entry points, not part of any one section — the sidebar's "New
              // conversation" link and "AI conversations" dropdown both live above ROOMS.
              {
                path: "new-conversation",
                Component: NewConversationRoute,
              },
              {
                path: "conversations/:id",
                Component: AiConversationDetailRoute,
              },
              {
                path: "plan-and-billing",
                Component: PlanAndBillingRoute,
              },
            ],
          },
        ],
      },
    ],
  },
]);
