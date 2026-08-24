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
import { FC_DETAIL_TITLES } from "@/pages/revenue/forecast/data";
import { ATTRIBUTION_DETAIL_TITLES } from "@/pages/revenue/attribution/data";
import { BM_DETAIL_TITLES } from "@/pages/revenue/benchmarks/data";
import { MARKETPLACE_LISTING_TITLES } from "@/pages/agents/marketplace/data";
import { GOVERNANCE_ACCESS_TITLES, GOVERNANCE_ENTRY_TITLES } from "@/pages/agents/governance/data";
import { AGENT_BUILDER_DETAIL_TITLES } from "@/pages/agents/agent-builder/data";
import { AN_FINDING_TITLES, AN_RUN_TITLES } from "@/pages/agents/agent-detail/data";
import { DS_DETAIL_TITLES } from "@/pages/data/data-sources/data";
import { SM_FIELD_TITLES } from "@/pages/data/schema/data";

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

  if (pathname === "/forecast") return "Forecast";
  if (pathname === "/forecast/blocked")
    return renderCrumbs([{ label: "Forecast", to: "/forecast" }, { label: "Blocked" }]);
  if (pathname === "/forecast/actuals")
    return renderCrumbs([{ label: "Forecast", to: "/forecast" }, { label: "Against actuals" }]);
  if (pathname === "/forecast/history")
    return renderCrumbs([{ label: "Forecast", to: "/forecast" }, { label: "History" }]);

  const forecastDetailMatch = /^\/forecast\/([^/]+)$/.exec(pathname);
  if (forecastDetailMatch) {
    const title = FC_DETAIL_TITLES[forecastDetailMatch[1]] ?? forecastDetailMatch[1];
    return (
      <span className="flex items-center gap-1.5">
        <Link to="/forecast" className="hover:text-ink">
          Forecast
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

  if (pathname === "/benchmarks") return "Benchmarks";
  if (pathname === "/benchmarks/holdouts")
    return renderCrumbs([{ label: "Benchmarks", to: "/benchmarks" }, { label: "Against a holdout" }]);
  if (pathname === "/benchmarks/refused")
    return renderCrumbs([{ label: "Benchmarks", to: "/benchmarks" }, { label: "Not compared" }]);
  if (pathname === "/benchmarks/limits")
    return renderCrumbs([{ label: "Benchmarks", to: "/benchmarks" }, { label: "Where comparison breaks" }]);
  if (pathname === "/benchmarks/like-for-like")
    return renderCrumbs([{ label: "Benchmarks", to: "/benchmarks" }, { label: "Like for like" }]);
  if (pathname === "/settings/benchmarks")
    return renderCrumbs([{ label: "Benchmarks", to: "/benchmarks" }, { label: "Settings" }]);

  const benchmarkDetailMatch = /^\/benchmarks\/([^/]+)$/.exec(pathname);
  if (benchmarkDetailMatch) {
    const title = BM_DETAIL_TITLES[benchmarkDetailMatch[1]] ?? benchmarkDetailMatch[1];
    return (
      <span className="flex items-center gap-1.5">
        <Link to="/benchmarks" className="hover:text-ink">
          Benchmarks
        </Link>
        <span className="text-ink-4">/</span>
        <span className="text-ink">{title}</span>
      </span>
    );
  }

  if (pathname === "/ai-teammates") return "AI teammates";
  if (pathname === "/ai-teammates/coverage")
    return renderCrumbs([{ label: "AI teammates", to: "/ai-teammates" }, { label: "Coverage" }]);
  if (pathname === "/ai-teammates/runs")
    return renderCrumbs([{ label: "AI teammates", to: "/ai-teammates" }, { label: "Reading now" }]);
  if (pathname === "/ai-teammates/conflicts")
    return renderCrumbs([{ label: "AI teammates", to: "/ai-teammates" }, { label: "Disagreements" }]);
  if (pathname === "/ai-teammates/paused")
    return renderCrumbs([{ label: "AI teammates", to: "/ai-teammates" }, { label: "Paused" }]);
  if (pathname === "/ai-teammates/cost")
    return renderCrumbs([{ label: "AI teammates", to: "/ai-teammates" }, { label: "What they cost" }]);
  if (pathname === "/settings/ai-teammates")
    return renderCrumbs([{ label: "AI teammates", to: "/ai-teammates" }, { label: "Settings" }]);

  if (pathname === "/marketplace") return "Marketplace";
  if (pathname === "/marketplace/installed")
    return renderCrumbs([{ label: "Marketplace", to: "/marketplace" }, { label: "Installed" }]);
  if (pathname === "/marketplace/publishers")
    return renderCrumbs([{ label: "Marketplace", to: "/marketplace" }, { label: "Publishers" }]);
  if (pathname === "/marketplace/what-arrives")
    return renderCrumbs([{ label: "Marketplace", to: "/marketplace" }, { label: "What arrives" }]);
  if (pathname === "/marketplace/requested")
    return renderCrumbs([{ label: "Marketplace", to: "/marketplace" }, { label: "Requested" }]);

  const marketplaceListingMatch = /^\/marketplace\/([^/]+)$/.exec(pathname);
  if (marketplaceListingMatch) {
    const title = MARKETPLACE_LISTING_TITLES[marketplaceListingMatch[1]] ?? marketplaceListingMatch[1];
    return (
      <span className="flex items-center gap-1.5">
        <Link to="/marketplace" className="hover:text-ink">
          Marketplace
        </Link>
        <span className="text-ink-4">/</span>
        <span className="text-ink">{title}</span>
      </span>
    );
  }

  if (pathname === "/business-memory") return "Business memory";

  if (pathname === "/community") return "Community";

  if (pathname === "/recognition") return "Recognition";

  if (pathname === "/governance") return "Governance";
  if (pathname === "/governance/access")
    return renderCrumbs([{ label: "Governance", to: "/governance" }, { label: "Data access" }]);
  if (pathname === "/governance/permissions")
    return renderCrumbs([{ label: "Governance", to: "/governance" }, { label: "Permissions" }]);
  if (pathname === "/governance/spend")
    return renderCrumbs([{ label: "Governance", to: "/governance" }, { label: "Spend" }]);
  if (pathname === "/governance/reviews")
    return renderCrumbs([{ label: "Governance", to: "/governance" }, { label: "Reviews" }]);

  const governanceIncidentMatch = /^\/governance\/incidents\/([^/]+)$/.exec(pathname);
  if (governanceIncidentMatch) {
    return renderCrumbs([{ label: "Governance", to: "/governance" }, { label: "Incidents" }]);
  }

  const governanceAccessMatch = /^\/governance\/access\/([^/]+)$/.exec(pathname);
  if (governanceAccessMatch) {
    const title = GOVERNANCE_ACCESS_TITLES[governanceAccessMatch[1]] ?? governanceAccessMatch[1];
    return (
      <span className="flex items-center gap-1.5">
        <Link to="/governance/access" className="hover:text-ink">
          Data access
        </Link>
        <span className="text-ink-4">/</span>
        <span className="text-ink">{title}</span>
      </span>
    );
  }

  const governanceEntryMatch = /^\/governance\/([^/]+)$/.exec(pathname);
  if (governanceEntryMatch) {
    const title = GOVERNANCE_ENTRY_TITLES[governanceEntryMatch[1]] ?? governanceEntryMatch[1];
    return (
      <span className="flex items-center gap-1.5">
        <Link to="/governance" className="hover:text-ink">
          Governance
        </Link>
        <span className="text-ink-4">/</span>
        <span className="text-ink">{title}</span>
      </span>
    );
  }

  if (pathname === "/agent-builder") return "Agent Builder";
  if (pathname === "/agent-builder/waiting-for-approval")
    return renderCrumbs([{ label: "Agent Builder", to: "/agent-builder" }, { label: "Waiting for approval" }]);
  if (pathname === "/agent-builder/test-runs")
    return renderCrumbs([{ label: "Agent Builder", to: "/agent-builder" }, { label: "Test runs" }]);
  if (pathname === "/agent-builder/retired")
    return renderCrumbs([{ label: "Agent Builder", to: "/agent-builder" }, { label: "Retired" }]);

  const agentBuilderDetailMatch = /^\/agent-builder\/([^/]+)$/.exec(pathname);
  if (agentBuilderDetailMatch) {
    const title = AGENT_BUILDER_DETAIL_TITLES[agentBuilderDetailMatch[1]] ?? agentBuilderDetailMatch[1];
    return (
      <span className="flex items-center gap-1.5">
        <Link to="/agent-builder" className="hover:text-ink">
          Agent Builder
        </Link>
        <span className="text-ink-4">/</span>
        <span className="text-ink">{title}</span>
      </span>
    );
  }

  if (pathname === "/agent-detail") return "Repeat & Decay";
  if (pathname === "/agent-detail/conditions")
    return renderCrumbs([{ label: "Repeat & Decay", to: "/agent-detail" }, { label: "What it watches" }]);
  if (pathname === "/agent-detail/sources")
    return renderCrumbs([{ label: "Repeat & Decay", to: "/agent-detail" }, { label: "What it reads" }]);
  if (pathname === "/agent-detail/findings")
    return renderCrumbs([{ label: "Repeat & Decay", to: "/agent-detail" }, { label: "Findings" }]);
  if (pathname === "/agent-detail/runs")
    return renderCrumbs([{ label: "Repeat & Decay", to: "/agent-detail" }, { label: "Runs" }]);
  if (pathname === "/agent-detail/record")
    return renderCrumbs([{ label: "Repeat & Decay", to: "/agent-detail" }, { label: "Record" }]);

  const agentDetailFindingMatch = /^\/agent-detail\/findings\/([^/]+)$/.exec(pathname);
  if (agentDetailFindingMatch) {
    const title = AN_FINDING_TITLES[agentDetailFindingMatch[1]] ?? agentDetailFindingMatch[1];
    return (
      <span className="flex items-center gap-1.5">
        <Link to="/agent-detail/findings" className="hover:text-ink">
          Findings
        </Link>
        <span className="text-ink-4">/</span>
        <span className="text-ink">{title}</span>
      </span>
    );
  }

  const agentDetailRunMatch = /^\/agent-detail\/runs\/([^/]+)$/.exec(pathname);
  if (agentDetailRunMatch) {
    const title = AN_RUN_TITLES[agentDetailRunMatch[1]] ?? agentDetailRunMatch[1];
    return (
      <span className="flex items-center gap-1.5">
        <Link to="/agent-detail/runs" className="hover:text-ink">
          Runs
        </Link>
        <span className="text-ink-4">/</span>
        <span className="text-ink">{title}</span>
      </span>
    );
  }

  if (pathname === "/data-sources") return "Data sources";
  if (pathname === "/data-sources/new")
    return renderCrumbs([{ label: "Data sources", to: "/data-sources" }, { label: "Connect" }]);
  if (pathname === "/data-sources/missing")
    return renderCrumbs([{ label: "Data sources", to: "/data-sources" }, { label: "Not connected" }]);
  if (pathname === "/data-sources/dependencies")
    return renderCrumbs([{ label: "Data sources", to: "/data-sources" }, { label: "What depends on it" }]);
  if (pathname === "/data-sources/credentials")
    return renderCrumbs([{ label: "Data sources", to: "/data-sources" }, { label: "Credentials" }]);
  if (pathname === "/data-sources/history")
    return renderCrumbs([{ label: "Data sources", to: "/data-sources" }, { label: "History" }]);
  if (pathname === "/data-sources/what-we-read")
    return renderCrumbs([{ label: "Data sources", to: "/data-sources" }, { label: "What Flolyt reads" }]);
  if (pathname === "/settings/data-sources")
    return renderCrumbs([{ label: "Data sources", to: "/data-sources" }, { label: "Settings" }]);

  const dataSourceDetailMatch = /^\/data-sources\/([^/]+)$/.exec(pathname);
  if (dataSourceDetailMatch) {
    const title = DS_DETAIL_TITLES[dataSourceDetailMatch[1]] ?? dataSourceDetailMatch[1];
    return (
      <span className="flex items-center gap-1.5">
        <Link to="/data-sources" className="hover:text-ink">
          Data sources
        </Link>
        <span className="text-ink-4">/</span>
        <span className="text-ink">{title}</span>
      </span>
    );
  }

  if (pathname === "/data-health") return "Data health";
  if (pathname === "/data-health/freshness")
    return renderCrumbs([{ label: "Data health", to: "/data-health" }, { label: "Freshness" }]);
  if (pathname === "/data-health/completeness")
    return renderCrumbs([{ label: "Data health", to: "/data-health" }, { label: "Completeness" }]);
  if (pathname === "/data-health/unavailable")
    return renderCrumbs([{ label: "Data health", to: "/data-health" }, { label: "What it broke" }]);
  if (pathname === "/data-health/incidents")
    return renderCrumbs([{ label: "Data health", to: "/data-health" }, { label: "Incidents" }]);
  if (pathname === "/data-health/backfill")
    return renderCrumbs([{ label: "Data health", to: "/data-health" }, { label: "Backfill" }]);
  if (pathname === "/data-health/shape")
    return renderCrumbs([{ label: "Data health", to: "/data-health" }, { label: "Shape" }]);
  if (pathname === "/data-health/notifications")
    return renderCrumbs([{ label: "Data health", to: "/data-health" }, { label: "Who is told" }]);
  if (pathname === "/data-health/limits")
    return renderCrumbs([{ label: "Data health", to: "/data-health" }, { label: "Limits" }]);
  if (pathname === "/settings/data-health")
    return renderCrumbs([{ label: "Data health", to: "/data-health" }, { label: "Settings" }]);

  const dataHealthIncidentMatch = /^\/data-health\/incidents\/([^/]+)$/.exec(pathname);
  if (dataHealthIncidentMatch) {
    return renderCrumbs([{ label: "Data health", to: "/data-health" }, { label: "Incidents", to: "/data-health/incidents" }, { label: "checkout_events · 18 August" }]);
  }

  if (pathname === "/schema") return "Schema";
  if (pathname === "/schema/events")
    return renderCrumbs([{ label: "Schema", to: "/schema" }, { label: "Events" }]);
  if (pathname === "/schema/changes")
    return renderCrumbs([{ label: "Schema", to: "/schema" }, { label: "Changes" }]);
  if (pathname === "/schema/requested")
    return renderCrumbs([{ label: "Schema", to: "/schema" }, { label: "Requested" }]);
  if (pathname === "/schema/definitions")
    return renderCrumbs([{ label: "Schema", to: "/schema" }, { label: "Definitions" }]);
  if (pathname === "/schema/unused")
    return renderCrumbs([{ label: "Schema", to: "/schema" }, { label: "Unused" }]);
  if (pathname === "/schema/change-costs")
    return renderCrumbs([{ label: "Schema", to: "/schema" }, { label: "What a change costs" }]);
  if (pathname === "/settings/schema")
    return renderCrumbs([{ label: "Schema", to: "/schema" }, { label: "Settings" }]);

  const schemaFieldMatch = /^\/schema\/([^/]+)$/.exec(pathname);
  if (schemaFieldMatch) {
    const title = SM_FIELD_TITLES[schemaFieldMatch[1]] ?? schemaFieldMatch[1];
    return (
      <span className="flex items-center gap-1.5">
        <Link to="/schema" className="hover:text-ink">
          Schema
        </Link>
        <span className="text-ink-4">/</span>
        <span className="text-ink">{title}</span>
      </span>
    );
  }

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
