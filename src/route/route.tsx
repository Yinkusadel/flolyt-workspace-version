import { createBrowserRouter } from "react-router";
import { AuthLayout } from "@/pages/auth-layout";
import SignIn from "@/pages/sign-in";
import { AppLayout } from "@/pages/app-layout";
import Home from "@/pages/home";
import Lifecycle from "@/pages/lifecycle";
import StageAcquire from "@/pages/lifecycle/stage/acquire";
import StageActivate from "@/pages/lifecycle/stage/activate";
import StagePrice from "@/pages/lifecycle/stage/price";
import StageAdopt from "@/pages/lifecycle/stage/adopt";
import StageRetain from "@/pages/lifecycle/stage/retain";
import StageExpand from "@/pages/lifecycle/stage/expand";
import StageSupport from "@/pages/lifecycle/stage/support";
import StageRenew from "@/pages/lifecycle/stage/renew";
import StageAdvocate from "@/pages/lifecycle/stage/advocate";
import StageChurn from "@/pages/lifecycle/stage/churn";
import ReleaseImpact from "@/pages/lifecycle/stage/release-impact";
import Rooms from "@/pages/rooms";
import RoomLayout, {
  RoomDecisionRoute,
  RoomEvidenceRoute,
  RoomLogRoute,
  RoomPlaysRoute,
} from "@/pages/rooms/room";
import AiTeammates from "@/pages/ai-teammates";
import { RouteError } from "@/route/route-error";
import { ProtectedRoute } from "@/route/protected-route";

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
        Component: ProtectedRoute,
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
                  { path: "acquire", Component: StageAcquire },
                  { path: "activate", Component: StageActivate },
                  { path: "price", Component: StagePrice },
                  { path: "adopt", Component: StageAdopt },
                  { path: "retain", Component: StageRetain },
                  { path: "expand", Component: StageExpand },
                  { path: "support", Component: StageSupport },
                  { path: "renew", Component: StageRenew },
                  { path: "advocate", Component: StageAdvocate },
                  { path: "churn", Component: StageChurn },
                  { path: "release-impact", Component: ReleaseImpact },
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
            ],
          },
        ],
      },
    ],
  },
]);
