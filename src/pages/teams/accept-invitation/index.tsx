import { LeftSection } from "@/pages/teams/accept-invitation/left-section";
import { AuthRightSection } from "@/pages/auth/shared/right-section";

/**
 * /teams/accept-invitation?token=... — the real URL Flolyt's team-invite emails link to
 * (confirmed by the user against a live email, e.g. test.flolyt.com/teams/accept-invitation?
 * token=...). Replaces the old /auth/accept-invitation, which was built against a guessed URL
 * before this shape was known and never matched a real email link. Unauthenticated and outside
 * both GuestRoute and ProtectedRoute — an invitee may or may not have a session when they open
 * this link, same reasoning as sign-in/sign-up.
 */
export default function AcceptTeamInvitationRoute() {
  return (
    <div className="grid min-h-dvh grid-cols-1 md:grid-cols-2">
      <LeftSection />
      <div className="hidden md:block">
        <AuthRightSection />
      </div>
    </div>
  );
}
