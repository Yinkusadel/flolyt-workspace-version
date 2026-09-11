import * as React from "react";
import { Link, Outlet, useLocation } from "react-router-dom";

import { Sidebar } from "@/components/sidebar";
import { Topbar } from "@/components/topbar";
import { BreadcrumbContext, type Crumb } from "@/components/breadcrumb-context";
import { cn } from "@/lib/utils";
import { getRoom } from "@/pages/rooms/room/data";

/**
 * Shell for every authenticated screen: sidebar + topbar + main region, per
 * files (24)/flolyt-figma-559-screens/frames/555-design-system-layout.svg.
 *
 * NOTE: the auth flow isn't built yet, so this layout is currently mounted
 * unguarded at "/". Once sign-in/session checks exist, wrap this route in a
 * protected-route component instead of changing this file's structure.
 */

function getBreadcrumb(pathname: string): React.ReactNode {
  if (pathname === "/" || pathname === "/new-conversation") return "Home";

  if (pathname === "/rooms") return "Rooms";
  if (pathname === "/rooms/new")
    return renderCrumbs([{ label: "Rooms", to: "/rooms" }, { label: "New room" }]);
  if (pathname === "/rooms/subscriptions")
    return renderCrumbs([{ label: "Rooms", to: "/rooms" }, { label: "What you watch" }]);
  if (pathname === "/plays") return "Plays";

  const roomMatch = /^\/rooms\/([^/]+)/.exec(pathname);
  if (roomMatch) {
    const room = getRoom(roomMatch[1]);
    return (
      <span className="flex items-center gap-1.5">
        <Link to="/rooms" className="hover:text-ink">
          Rooms
        </Link>
        <span className="text-ink-4">/</span>
        <span className="text-ink">{room?.title ?? roomMatch[1]}</span>
      </span>
    );
  }

  if (pathname === "/plan-and-billing") return "Plan and billing";

  if (pathname === "/leakage-map") return "Leakage Map";
  if (pathname === "/inbox") return "Inbox";
  if (pathname === "/playbooks") return "Playbooks";
  if (pathname === "/business-memory") return "Business Memory";

  return "Home";
}

/** Renders a page-supplied crumb trail in the same style as `getBreadcrumb`'s own JSX branches. */
function renderCrumbs(crumbs: Crumb[]): React.ReactNode {
  return (
    <span className="flex flex-wrap items-center gap-1.5">
      {crumbs.map((crumb, i) => (
        <span key={`${crumb.label}-${i}`} className="flex items-center gap-1.5">
          {i > 0 && <span className="text-ink-4">/</span>}
          {crumb.to ? (
            <Link to={crumb.to} className="hover:text-ink">
              {crumb.label}
            </Link>
          ) : (
            <span className="text-ink">{crumb.label}</span>
          )}
        </span>
      ))}
    </span>
  );
}

export const AppLayout = () => {
  const [navOpen, setNavOpen] = React.useState(false);
  const [breadcrumbOverride, setBreadcrumbOverride] = React.useState<Crumb[] | null>(null);
  const location = useLocation();
  const breadcrumbContextValue = React.useMemo(
    () => ({ setOverride: setBreadcrumbOverride }),
    []
  );

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
        <Topbar
          breadcrumb={breadcrumbOverride ? renderCrumbs(breadcrumbOverride) : getBreadcrumb(location.pathname)}
          onMenuClick={() => setNavOpen(true)}
        />
        <main className="flex-1 overflow-y-auto p-page">
          <BreadcrumbContext.Provider value={breadcrumbContextValue}>
            <Outlet />
          </BreadcrumbContext.Provider>
        </main>
      </div>
    </div>
  );
};
