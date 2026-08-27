import { Loader2 } from "lucide-react";
import { Navigate, Outlet, useLocation } from "react-router";

import { useAuth } from "@/utils/auth-context";
import useGetOnboardingStatus from "@/features/workspace/use-get-onboarding-status";

const Loader = () => (
  <div className="flex h-dvh items-center justify-center bg-paper">
    <Loader2 className="size-5 animate-spin text-ink-3" />
  </div>
);

// GET /workspace/onboarding's resumeAt → the route for that step, for whichever
// steps actually have a screen built. "data"/"agents"/"team" aren't in this map
// yet — resolveResumeRoute below falls back to the last built step for those.
const RESUME_STEP_ROUTES: Record<string, string> = {
  workspace: "/onboarding/workspace",
  business_model: "/onboarding/business-model",
};

// The furthest step that's actually built — keep this in sync with
// RESUME_STEP_ROUTES as more steps land, it's also the fallback for any
// resumeAt this app can't show a screen for yet.
const LAST_BUILT_STEP_ROUTE = "/onboarding/business-model";

function resolveResumeRoute(resumeAt: string): string {
  return RESUME_STEP_ROUTES[resumeAt] ?? LAST_BUILT_STEP_ROUTE;
}

/**
 * Layout route guarding every authenticated branch. Beyond "is there a valid
 * session" (redirect to sign-in if not), this also re-checks onboarding on every
 * load, not just once at login — a user who already has a session cookie can
 * otherwise refresh or deep-link straight past onboarding.
 *
 * Two-layer check, since `GET /workspace/onboarding` can't be asked about a
 * workspace that doesn't exist yet:
 * - No workspace (`user.companyId` unset) → trust the login-time flag, send to
 *   `/onboarding/start`. The JWT itself doesn't refresh mid-session, so
 *   `companyId` is kept current locally instead — see `/onboarding/start`'s
 *   success handler, which updates it the moment `POST /workspace` succeeds.
 * - Workspace exists → ask the live endpoint, since the cached
 *   `hasCompletedOnboarding` flag goes stale the instant a step is finished
 *   mid-session.
 *
 * Routes already under `/onboarding` are exempt — this guard only redirects
 * INTO onboarding, it never blocks movement within the wizard itself.
 */
export function ProtectedRoute() {
  const { user, isLoading } = useAuth();
  const location = useLocation();

  const hasWorkspace = Boolean(user?.companyId);
  const {
    onboarding,
    isLoading: isOnboardingLoading,
    isError: isOnboardingError,
  } = useGetOnboardingStatus({ enabled: hasWorkspace });

  if (isLoading) {
    return <Loader />;
  }

  if (!user) {
    return <Navigate to="/auth/sign-in" replace />;
  }

  const isOnboardingRoute = location.pathname.startsWith("/onboarding");
  if (isOnboardingRoute) {
    return <Outlet />;
  }

  if (!hasWorkspace) {
    return <Navigate to="/onboarding/start" replace />;
  }

  if (isOnboardingLoading) {
    return <Loader />;
  }

  if (isOnboardingError) {
    // Fail open rather than trap a user in a redirect loop over a transient
    // network error — the check just runs again next load.
    console.warn("Could not verify onboarding status; letting the request through.");
    return <Outlet />;
  }

  if (onboarding && !onboarding.finished) {
    return <Navigate to={resolveResumeRoute(onboarding.resumeAt)} replace />;
  }

  return <Outlet />;
}
