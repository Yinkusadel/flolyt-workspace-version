import { createBrowserRouter } from "react-router";
import { AuthLayout } from "@/pages/auth-layout";
import SignIn from "@/pages/sign-in";
import { AppLayout } from "@/pages/app-layout";
import Home from "@/pages/home";

export const routes = createBrowserRouter([
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
]);
