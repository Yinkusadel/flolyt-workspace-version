import { createBrowserRouter } from "react-router";
import { AuthLayout } from "../pages/auth-layout";
import SignIn from "../pages/sign-in";

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

]);
