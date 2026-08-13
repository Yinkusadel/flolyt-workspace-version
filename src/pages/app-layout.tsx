import * as React from "react";
import { Outlet, useLocation } from "react-router-dom";

import { Sidebar, type ViewingAs } from "@/components/sidebar";
import { Topbar } from "@/components/topbar";
import { cn } from "@/lib/utils";

/**
 * Shell for every authenticated screen: sidebar + topbar + main region, per
 * files (24)/flolyt-figma-559-screens/frames/555-design-system-layout.svg.
 *
 * NOTE: the auth flow isn't built yet, so this layout is currently mounted
 * unguarded at "/". Once sign-in/session checks exist, wrap this route in a
 * protected-route component instead of changing this file's structure.
 */

/** Shared with every route via <Outlet context>, so a screen can scope its own content to the sidebar's "viewing as" selection. */
export type AppOutletContext = { viewingAs: ViewingAs };

const BREADCRUMBS: Record<string, string> = {
  "/": "Home",
  "/lifecycle": "Lifecycle",
};

export const AppLayout = () => {
  const [navOpen, setNavOpen] = React.useState(false);
  const [viewingAs, setViewingAs] = React.useState<ViewingAs>("Everyone");
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
    <div className="flex h-dvh overflow-hidden bg-paper">
      <Sidebar
        open={navOpen}
        onClose={() => setNavOpen(false)}
        viewingAs={viewingAs}
        onViewingAsChange={setViewingAs}
        customerBase="4.2M"
        currencies={["₦", "KES", "GHS", "£"]}
        roster={[
          { initials: "RD", team: 1 },
          { initials: "AC", team: 2 },
          { initials: "IC", team: 3 },
          { initials: "PR", team: 4 },
          { initials: "EX", team: 1 },
        ]}
      />

      <div
        aria-hidden
        onClick={() => setNavOpen(false)}
        className={cn(
          "fixed inset-0 z-30 bg-ink/40 transition-opacity lg:hidden",
          navOpen ? "pointer-events-auto opacity-100" : "pointer-events-none opacity-0"
        )}
      />

      <div className="flex min-w-0 flex-1 flex-col">
        <Topbar
          breadcrumb={BREADCRUMBS[location.pathname] ?? "Home"}
          onMenuClick={() => setNavOpen(true)}
        />
        <main className="flex-1 overflow-y-auto p-page">
          <Outlet context={{ viewingAs } satisfies AppOutletContext} />
        </main>
      </div>
    </div>
  );
};
