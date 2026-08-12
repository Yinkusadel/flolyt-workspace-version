import { createBrowserRouter } from "react-router";
import { AuthLayout } from "@/pages/auth-layout";
import SignIn from "@/pages/sign-in";
import { AppLayout } from "@/pages/app-layout";
import Home from "@/pages/home";
import { RouteError } from "@/route/route-error";

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
        // TODO: the auth flow isn't built yet — once it is, gate this branch
        // behind a session check (redirect to /auth/sign-in when unauthenticated)
        // instead of mounting AppLayout directly at "/".
        path: "/",
        Component: AppLayout,
        children: [
          {
            index: true,
            Component: Home,
          },
        ],
      },
    ],
  },
]);
