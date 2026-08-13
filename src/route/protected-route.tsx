import { Loader2 } from "lucide-react";
import { Navigate, Outlet } from "react-router";

import { useAuth } from "@/utils/auth-context";

/** Layout route guarding every authenticated branch — redirects to sign-in once the session check resolves with no user. */
export function ProtectedRoute() {
  const { user, isLoading } = useAuth();

  if (isLoading) {
    return (
      <div className="flex h-dvh items-center justify-center bg-paper">
        <Loader2 className="size-5 animate-spin text-ink-3" />
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/auth/sign-in" replace />;
  }

  return <Outlet />;
}
