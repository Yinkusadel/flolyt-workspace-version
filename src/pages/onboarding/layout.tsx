import { Outlet } from "react-router-dom";
import { LogOut } from "lucide-react";

import { Button } from "@/components/ui/button";
import useLogout from "@/features/auth/use-logout";

import flolytLogo from "../../../assets/logo.png";

/** Shared chrome for the post-sign-in setup flow — header only, matches every onboarding SVG's own top bar. Each step renders its own content below via Outlet. */
export function OnboardingLayout() {
  const { logout, isPending } = useLogout();

  return (
    <div className="min-h-dvh bg-paper">
      <header className="sticky top-0 z-20 flex h-15.5 shrink-0 items-center border-b border-line bg-paper px-6">
        <img src={flolytLogo} alt="Flolyt" className="size-5.5 shrink-0 object-contain" />
        <span className="ml-2 text-[14px] font-semibold text-ink">Setting up Flolyt</span>
        <Button
          type="button"
          variant="destructive"
          onClick={logout}
          disabled={isPending}
          className="ml-auto h-8 gap-1.5 px-2.5 text-[12.5px]"
        >
          <LogOut className="size-4" />
          {isPending ? "Signing out..." : "Log out"}
        </Button>
      </header>

      <Outlet />
    </div>
  );
}
