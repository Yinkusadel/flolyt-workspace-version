import * as React from "react";
import { Link, Outlet, useLocation } from "react-router-dom";

import { Sidebar, type ViewingAs } from "@/components/sidebar";
import { Topbar } from "@/components/topbar";
import { cn } from "@/lib/utils";
import { getRoom } from "@/pages/rooms/room/data";
import { TODAY_ITEMS } from "@/pages/what-to-do-today/data";

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

const STAGE_LABELS: Record<string, string> = {
  acquire: "Acquire",
  activate: "Activate",
  price: "Price",
  adopt: "Adopt",
  retain: "Retain",
  expand: "Expand",
  support: "Support",
  renew: "Renew",
  advocate: "Advocate",
  churn: "Churn",
};

function getBreadcrumb(pathname: string): React.ReactNode {
  if (pathname === "/lifecycle") return "Lifecycle";
  if (pathname === "/lifecycle/settings") return "Lifecycle / Settings";

  // Matches the bare stage route and every sub-route under it (tabs,
  // compare, definition, :id drilldowns) — the stage-level layouts render
  // their own more specific breadcrumb/tab bar below this topbar one.
  const stageMatch = /^\/lifecycle\/([a-z-]+)(?:\/|$)/.exec(pathname);
  const stageLabel = stageMatch ? STAGE_LABELS[stageMatch[1]] : undefined;
  if (stageLabel) {
    return (
      <span className="flex items-center gap-1.5">
        <Link to="/lifecycle" className="hover:text-ink">
          Lifecycle
        </Link>
        <span className="text-ink-4">/</span>
        <span className="text-ink">{stageLabel}</span>
      </span>
    );
  }

  if (pathname === "/rooms") return "Rooms";
  if (pathname === "/rooms/new") return "Rooms / New room";
  if (pathname === "/rooms/subscriptions") return "Rooms / What you watch";
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

  if (pathname === "/what-to-do-today") return "What to do today";
  if (pathname === "/what-to-do-today/ranking") return "What to do today / How this is ranked";
  if (pathname === "/what-to-do-today/snoozed") return "What to do today / Snoozed";
  if (pathname === "/what-to-do-today/waiting-on-data") return "What to do today / Waiting on data";
  if (pathname === "/what-to-do-today/done") return "What to do today / Done";
  if (pathname === "/settings/today") return "What to do today / Settings";

  if (pathname === "/digest") return "Digest";
  if (pathname === "/digest/archive") return "Digest / Archive";
  if (pathname === "/digest/weekly") return "Digest / Weekly roll-up";
  if (pathname === "/digest/excluded") return "Digest / Not in this digest";
  if (pathname === "/settings/digest") return "Digest / Settings";
  if (pathname === "/settings/digest/channels") return "Digest / Settings / Channels";
  if (pathname === "/settings/digest/quiet-hours") return "Digest / Settings / Quiet hours";
  if (pathname === "/settings/notifications") return "Digest / Settings / Notification rules";

  const digestDateMatch = /^\/digest\/([^/]+)/.exec(pathname);
  if (digestDateMatch) {
    return (
      <span className="flex items-center gap-1.5">
        <Link to="/digest" className="hover:text-ink">
          Digest
        </Link>
        <span className="text-ink-4">/</span>
        <span className="text-ink">{digestDateMatch[1]}</span>
      </span>
    );
  }

  const todayItemMatch = /^\/what-to-do-today\/([^/]+)/.exec(pathname);
  if (todayItemMatch) {
    const item = TODAY_ITEMS.find((i) => i.id === todayItemMatch[1]);
    return (
      <span className="flex items-center gap-1.5">
        <Link to="/what-to-do-today" className="hover:text-ink">
          What to do today
        </Link>
        <span className="text-ink-4">/</span>
        <span className="text-ink">{item?.title ?? todayItemMatch[1]}</span>
      </span>
    );
  }

  if (pathname === "/ai-teammates") return "AI teammates";

  if (pathname === "/business-memory") return "Business memory";

  if (pathname === "/governance") return "Governance";

  return "Home";
}

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
          breadcrumb={getBreadcrumb(location.pathname)}
          onMenuClick={() => setNavOpen(true)}
        />
        <main className="flex-1 overflow-y-auto p-page">
          <Outlet context={{ viewingAs } satisfies AppOutletContext} />
        </main>
      </div>
    </div>
  );
};
