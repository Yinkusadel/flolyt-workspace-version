import { createBrowserRouter } from "react-router";
import { AuthLayout } from "@/pages/auth-layout";
import SignIn from "@/pages/sign-in";
import { AppLayout } from "@/pages/app-layout";
import Home from "@/pages/home";
import Lifecycle from "@/pages/lifecycle";
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
                Component: Lifecycle,
              },
            ],
          },
        ],
      },
    ],
  },
]);
