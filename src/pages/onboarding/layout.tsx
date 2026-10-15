import { Outlet } from "react-router-dom";

import flolytLogo from "../../../assets/logo.png";

/** Shared chrome for the post-sign-in setup flow — header only, matches every onboarding SVG's own top bar. Each step renders its own content below via Outlet. */
export function OnboardingLayout() {
  return (
    <div className="min-h-dvh bg-paper">
      <header className="sticky top-0 z-20 flex h-15.5 shrink-0 items-center border-b border-line bg-paper px-6">
        <img src={flolytLogo} alt="Flolyt" className="size-5.5 shrink-0 object-contain" />
        <span className="ml-2 text-[14px] font-semibold text-ink">Setting up Flolyt</span>
      </header>

      <Outlet />
    </div>
  );
}
