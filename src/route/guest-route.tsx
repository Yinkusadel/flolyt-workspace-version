import { Navigate, Outlet } from "react-router-dom";

import { AppLoader } from "@/components/app-loader";
import { useAuth } from "@/utils/auth-context";

/** Layout route guarding the public auth branch — sends an already-signed-in user back to the dashboard instead of showing them sign-in/sign-up again. */
export function GuestRoute() {
  const { user, isLoading } = useAuth();

  if (isLoading) {
    return <AppLoader />;
  }

  if (user) {
    return <Navigate to="/" replace />;
  }

  return <Outlet />;
}
