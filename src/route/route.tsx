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
import { RoomStub } from "@/pages/rooms/room-stub";
import NewConversationRoute from "@/pages/conversations/new-conversation-route";
import AiConversationDetailRoute from "@/pages/conversations/detail-route";
import PlanAndBillingRoute from "@/pages/plan-and-billing";
import NotificationsRoute from "@/pages/notifications";
import AuditLogRoute from "@/pages/audit-log";
import LeakageMap from "@/pages/leakage-map";
import MissedOpportunities from "@/pages/missed-opportunities";
import Inbox from "@/pages/inbox";
import Playbooks from "@/pages/playbooks";
import PlaybooksProposeRoute from "@/pages/playbooks/propose-route";
import PlaybooksNewRoute from "@/pages/playbooks/new-route";
import PlaybookDetailRoute from "@/pages/playbooks/detail-route";
import PlaybookRunRoute from "@/pages/playbooks/run-route";
import BusinessMemory from "@/pages/business-memory";
import BusinessMemoryEntry from "@/pages/business-memory/entry-route";
import DataSourcesRoute from "@/pages/data-sources";
import SchemaRoute from "@/pages/schema";
import MembersRoute from "@/pages/members";
import MembersDetailRoute from "@/pages/members/detail-route";
import MarketsRoute from "@/pages/markets";
import Agents from "@/pages/agents";
import AgentDetailRoute from "@/pages/agents/detail-route";
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
                  { path: ":roomId", Component: RoomStub },
                ],
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
              {
                path: "notifications",
                Component: NotificationsRoute,
              },
              {
                path: "audit-log",
                Component: AuditLogRoute,
              },
              // Leakage Map, Inbox, Playbooks and Business Memory are rebuilt.
              { path: "leakage-map", Component: LeakageMap },
              { path: "missed-opportunities", Component: MissedOpportunities },
              { path: "inbox", Component: Inbox },
              { path: "playbooks", Component: Playbooks },
              { path: "playbooks/propose", Component: PlaybooksProposeRoute },
              { path: "playbooks/new", Component: PlaybooksNewRoute },
              { path: "playbooks/:id", Component: PlaybookDetailRoute },
              { path: "playbooks/:id/runs/:runId", Component: PlaybookRunRoute },
              { path: "business-memory", Component: BusinessMemory },
              { path: "business-memory/:id", Component: BusinessMemoryEntry },
              { path: "data-sources", Component: DataSourcesRoute },
              { path: "schema", Component: SchemaRoute },
              { path: "members", Component: MembersRoute },
              { path: "members/:teamId", Component: MembersDetailRoute },
              { path: "markets", Component: MarketsRoute },
              { path: "agents", Component: Agents },
              { path: "agents/:id", Component: AgentDetailRoute },
            ],
          },
        ],
      },
    ],
  },
]);
