import { Loader2 } from "lucide-react";
import { Navigate, Outlet } from "react-router-dom";

import { useAuth } from "@/utils/auth-context";

/** Layout route guarding the public auth branch — sends an already-signed-in user back to the dashboard instead of showing them sign-in/sign-up again. */
export function GuestRoute() {
  const { user, isLoading } = useAuth();

  if (isLoading) {
    return (
      <div className="flex h-dvh items-center justify-center bg-paper">
        <Loader2 className="size-5 animate-spin text-ink-3" />
      </div>
    );
  }

  if (user) {
    return <Navigate to="/" replace />;
  }

  return <Outlet />;
}
