import * as React from "react";
import { Link, Outlet, useLocation } from "react-router-dom";

import { Sidebar, type ViewingAs } from "@/components/sidebar";
import { Topbar } from "@/components/topbar";
import { BreadcrumbContext, type Crumb } from "@/components/breadcrumb-context";
import { cn } from "@/lib/utils";
import { getRoom } from "@/pages/everyday/rooms/room/data";
import { TODAY_ITEMS } from "@/pages/everyday/what-to-do-today/data";
import { INBOX_ITEM_DETAILS } from "@/pages/everyday/inbox/data";
import { FUNNEL_STEP_TITLES } from "@/pages/revenue/funnel/data";
import { SC_DETAIL_TITLES } from "@/pages/revenue/scenario/data";
import { ATTRIBUTION_DETAIL_TITLES } from "@/pages/revenue/attribution/data";

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

const LEAK_DETAIL_TITLES: Record<string, string> = {
  "delivery-fee-checkout": "The delivery fee moved to checkout",
  "adopt-depth": "Adopt · feature depth",
};

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
  if (pathname === "/lifecycle/settings")
    return renderCrumbs([{ label: "Lifecycle", to: "/lifecycle" }, { label: "Settings" }]);

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

  if (pathname === "/what-to-do-today") return "What to do today";
  if (pathname === "/what-to-do-today/ranking")
    return renderCrumbs([{ label: "What to do today", to: "/what-to-do-today" }, { label: "How this is ranked" }]);
  if (pathname === "/what-to-do-today/snoozed")
    return renderCrumbs([{ label: "What to do today", to: "/what-to-do-today" }, { label: "Snoozed" }]);
  if (pathname === "/what-to-do-today/waiting-on-data")
    return renderCrumbs([{ label: "What to do today", to: "/what-to-do-today" }, { label: "Waiting on data" }]);
  if (pathname === "/what-to-do-today/done")
    return renderCrumbs([{ label: "What to do today", to: "/what-to-do-today" }, { label: "Done" }]);
  if (pathname === "/settings/today")
    return renderCrumbs([{ label: "What to do today", to: "/what-to-do-today" }, { label: "Settings" }]);

  if (pathname === "/digest") return "Digest";
  if (pathname === "/digest/archive")
    return renderCrumbs([{ label: "Digest", to: "/digest" }, { label: "Archive" }]);
  if (pathname === "/digest/weekly")
    return renderCrumbs([{ label: "Digest", to: "/digest" }, { label: "Weekly roll-up" }]);
  if (pathname === "/digest/excluded")
    return renderCrumbs([{ label: "Digest", to: "/digest" }, { label: "Not in this digest" }]);
  if (pathname === "/settings/digest")
    return renderCrumbs([{ label: "Digest", to: "/digest" }, { label: "Settings" }]);
  if (pathname === "/settings/digest/channels")
    return renderCrumbs([
      { label: "Digest", to: "/digest" },
      { label: "Settings", to: "/settings/digest" },
      { label: "Channels" },
    ]);
  if (pathname === "/settings/digest/quiet-hours")
    return renderCrumbs([
      { label: "Digest", to: "/digest" },
      { label: "Settings", to: "/settings/digest" },
      { label: "Quiet hours" },
    ]);
  if (pathname === "/settings/notifications")
    return renderCrumbs([
      { label: "Digest", to: "/digest" },
      { label: "Settings", to: "/settings/digest" },
      { label: "Notification rules" },
    ]);

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

  if (pathname === "/inbox") return "Inbox";
  if (pathname === "/inbox/replies")
    return renderCrumbs([{ label: "Inbox", to: "/inbox" }, { label: "Replies" }]);
  if (pathname === "/inbox/routing")
    return renderCrumbs([{ label: "Inbox", to: "/inbox" }, { label: "Routing" }]);
  if (pathname === "/inbox/routing/unroutable")
    return renderCrumbs([
      { label: "Inbox", to: "/inbox" },
      { label: "Routing", to: "/inbox/routing" },
      { label: "Unroutable" },
    ]);
  if (pathname === "/inbox/snoozed")
    return renderCrumbs([{ label: "Inbox", to: "/inbox" }, { label: "Snoozed" }]);
  if (pathname === "/inbox/delegation")
    return renderCrumbs([{ label: "Inbox", to: "/inbox" }, { label: "Delegation" }]);
  if (pathname === "/inbox/systems")
    return renderCrumbs([{ label: "Inbox", to: "/inbox" }, { label: "Systems" }]);
  if (pathname === "/settings/authority")
    return renderCrumbs([{ label: "Inbox", to: "/inbox" }, { label: "Approval authority" }]);
  if (pathname === "/settings/authority/standing")
    return renderCrumbs([
      { label: "Inbox", to: "/inbox" },
      { label: "Approval authority", to: "/settings/authority" },
      { label: "Standing authority" },
    ]);
  if (pathname === "/settings/inbox")
    return renderCrumbs([{ label: "Inbox", to: "/inbox" }, { label: "Settings" }]);

  const inboxReplyMatch = /^\/inbox\/replies\/([^/]+)/.exec(pathname);
  if (inboxReplyMatch) {
    return (
      <span className="flex items-center gap-1.5">
        <Link to="/inbox/replies" className="hover:text-ink">
          Replies
        </Link>
        <span className="text-ink-4">/</span>
        <span className="text-ink">{inboxReplyMatch[1]}</span>
      </span>
    );
  }

  const inboxItemMatch = /^\/inbox\/([^/]+)$/.exec(pathname);
  if (inboxItemMatch) {
    const detail = INBOX_ITEM_DETAILS[inboxItemMatch[1]];
    return (
      <span className="flex items-center gap-1.5">
        <Link to="/inbox" className="hover:text-ink">
          Inbox
        </Link>
        <span className="text-ink-4">/</span>
        <span className="text-ink">{detail?.title ?? inboxItemMatch[1]}</span>
      </span>
    );
  }

  if (pathname === "/handoff") return "Handoff";

  if (pathname === "/goals") return "Goals";

  if (pathname === "/leakage-map") return "Leakage map";
  if (pathname === "/leakage-map/changed")
    return renderCrumbs([{ label: "Leakage map", to: "/leakage-map" }, { label: "What changed" }]);
  if (pathname === "/leakage-map/unmeasurable")
    return renderCrumbs([{ label: "Leakage map", to: "/leakage-map" }, { label: "Unmeasurable" }]);
  if (pathname === "/leakage-map/detection")
    return renderCrumbs([{ label: "Leakage map", to: "/leakage-map" }, { label: "Detection" }]);
  if (pathname === "/leakage-map/export")
    return renderCrumbs([{ label: "Leakage map", to: "/leakage-map" }, { label: "Export" }]);
  if (pathname === "/settings/leakage-map")
    return renderCrumbs([{ label: "Leakage map", to: "/leakage-map" }, { label: "Settings" }]);

  const leakDetailMatch = /^\/leakage-map\/([^/]+)$/.exec(pathname);
  if (leakDetailMatch) {
    const title = LEAK_DETAIL_TITLES[leakDetailMatch[1]] ?? leakDetailMatch[1];
    return (
      <span className="flex items-center gap-1.5">
        <Link to="/leakage-map" className="hover:text-ink">
          Leakage map
        </Link>
        <span className="text-ink-4">/</span>
        <span className="text-ink">{title}</span>
      </span>
    );
  }

  if (pathname === "/funnel") return "Funnel";
  if (pathname === "/funnel/gaps")
    return renderCrumbs([{ label: "Funnel", to: "/funnel" }, { label: "Not instrumented" }]);
  if (pathname === "/funnel/compare")
    return renderCrumbs([{ label: "Funnel", to: "/funnel" }, { label: "Compare" }]);
  if (pathname === "/funnel/history")
    return renderCrumbs([{ label: "Funnel", to: "/funnel" }, { label: "History" }]);
  if (pathname === "/settings/funnel")
    return renderCrumbs([{ label: "Funnel", to: "/funnel" }, { label: "Settings" }]);

  const funnelStepMatch = /^\/funnel\/([^/]+)$/.exec(pathname);
  if (funnelStepMatch) {
    const title = FUNNEL_STEP_TITLES[funnelStepMatch[1]] ?? funnelStepMatch[1];
    return (
      <span className="flex items-center gap-1.5">
        <Link to="/funnel" className="hover:text-ink">
          Funnel
        </Link>
        <span className="text-ink-4">/</span>
        <span className="text-ink">{title}</span>
      </span>
    );
  }

  if (pathname === "/scenario") return "Scenario";
  if (pathname === "/scenario/new")
    return renderCrumbs([{ label: "Scenario", to: "/scenario" }, { label: "New" }]);
  if (pathname === "/scenario/actuals")
    return renderCrumbs([{ label: "Scenario", to: "/scenario" }, { label: "Against what happened" }]);
  if (pathname === "/scenario/blocked")
    return renderCrumbs([{ label: "Scenario", to: "/scenario" }, { label: "Blocked" }]);
  if (pathname === "/scenario/history")
    return renderCrumbs([{ label: "Scenario", to: "/scenario" }, { label: "History" }]);
  if (pathname === "/settings/scenario")
    return renderCrumbs([{ label: "Scenario", to: "/scenario" }, { label: "Settings" }]);

  const scenarioDetailMatch = /^\/scenario\/([^/]+)$/.exec(pathname);
  if (scenarioDetailMatch) {
    const title = SC_DETAIL_TITLES[scenarioDetailMatch[1]] ?? scenarioDetailMatch[1];
    return (
      <span className="flex items-center gap-1.5">
        <Link to="/scenario" className="hover:text-ink">
          Scenario
        </Link>
        <span className="text-ink-4">/</span>
        <span className="text-ink">{title}</span>
      </span>
    );
  }

  if (pathname === "/attribution") return "Attribution";
  if (pathname === "/attribution/holdouts")
    return renderCrumbs([{ label: "Attribution", to: "/attribution" }, { label: "Holdouts" }]);
  if (pathname === "/attribution/overlap")
    return renderCrumbs([{ label: "Attribution", to: "/attribution" }, { label: "Overlap" }]);
  if (pathname === "/attribution/unattributable")
    return renderCrumbs([{ label: "Attribution", to: "/attribution" }, { label: "Unattributable" }]);
  if (pathname === "/attribution/methods")
    return renderCrumbs([{ label: "Attribution", to: "/attribution" }, { label: "Methods" }]);
  if (pathname === "/settings/attribution")
    return renderCrumbs([{ label: "Attribution", to: "/attribution" }, { label: "Settings" }]);

  const attributionDetailMatch = /^\/attribution\/([^/]+)$/.exec(pathname);
  if (attributionDetailMatch) {
    const title = ATTRIBUTION_DETAIL_TITLES[attributionDetailMatch[1]] ?? attributionDetailMatch[1];
    return (
      <span className="flex items-center gap-1.5">
        <Link to="/attribution" className="hover:text-ink">
          Attribution
        </Link>
        <span className="text-ink-4">/</span>
        <span className="text-ink">{title}</span>
      </span>
    );
  }

  if (pathname === "/ai-teammates") return "AI teammates";

  if (pathname === "/business-memory") return "Business memory";

  if (pathname === "/governance") return "Governance";

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
  const [viewingAs, setViewingAs] = React.useState<ViewingAs>("Everyone");
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
          breadcrumb={breadcrumbOverride ? renderCrumbs(breadcrumbOverride) : getBreadcrumb(location.pathname)}
          onMenuClick={() => setNavOpen(true)}
        />
        <main className="flex-1 overflow-y-auto p-page">
          <BreadcrumbContext.Provider value={breadcrumbContextValue}>
            <Outlet context={{ viewingAs } satisfies AppOutletContext} />
          </BreadcrumbContext.Provider>
        </main>
      </div>
    </div>
  );
};
