import * as React from "react";
import { Outlet, useLocation } from "react-router-dom";

import { Sidebar } from "@/components/flolyt/sidebar";
import { Topbar } from "@/components/flolyt/topbar";
import { cn } from "@/lib/utils";

/**
 * Shell for every authenticated screen: sidebar + topbar + main region, per
 * files (24)/flolyt-figma-559-screens/frames/555-design-system-layout.svg.
 *
 * NOTE: the auth flow isn't built yet, so this layout is currently mounted
 * unguarded at "/". Once sign-in/session checks exist, wrap this route in a
 * protected-route component instead of changing this file's structure.
 */
export const AppLayout = () => {
  const [navOpen, setNavOpen] = React.useState(false);
  const location = useLocation();

  // Close the drawer on route change and Escape; lock body scroll while open.
  React.useEffect(() => {
    setNavOpen(false);
  }, [location.pathname]);

  React.useEffect(() => {
    if (!navOpen) return;

    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") setNavOpen(false);
    };
    document.addEventListener("keydown", onKeyDown);
    document.body.style.overflow = "hidden";

    return () => {
      document.removeEventListener("keydown", onKeyDown);
      document.body.style.overflow = "";
    };
  }, [navOpen]);

  return (
    <div className="flex min-h-dvh bg-paper">
      <Sidebar open={navOpen} onClose={() => setNavOpen(false)} />

      <div
        aria-hidden
        onClick={() => setNavOpen(false)}
        className={cn(
          "fixed inset-0 z-30 bg-ink/40 transition-opacity lg:hidden",
          navOpen ? "pointer-events-auto opacity-100" : "pointer-events-none opacity-0"
        )}
      />

      <div className="flex min-w-0 flex-1 flex-col">
        <Topbar breadcrumb="Home" onMenuClick={() => setNavOpen(true)} />
        <main className="flex-1 p-page">
          <Outlet />
        </main>
      </div>
    </div>
  );
};
