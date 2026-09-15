import flolytLogo from "../../assets/logo.png";

/** Full-page loading state for the auth/onboarding gates — the same logo badge as the
 * conversation starter's empty state (src/pages/conversations/new-conversation-route.tsx),
 * breathing in place of a bare spinner. */
export function AppLoader() {
  return (
    <div className="flex h-dvh items-center justify-center bg-paper">
      <span
        className="flex size-12 items-center justify-center rounded-full border border-ultra-border bg-ultra-bg"
        style={{ animation: "breathe 1.8s ease-in-out infinite" }}
      >
        <img src={flolytLogo} alt="" className="size-7 object-contain" />
      </span>
    </div>
  );
}
