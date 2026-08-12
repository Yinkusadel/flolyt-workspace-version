import { NavLink } from "react-router-dom";
import {
  ArrowLeftRight,
  Bot,
  Database,
  FlaskConical,
  Home,
  Inbox,
  Library,
  ListChecks,
  Map,
  Megaphone,
  MessagesSquare,
  PieChart,
  Plug,
  Route,
  Search,
  Settings,
  ShieldCheck,
  TrendingUp,
  Users,
  UsersRound,
  Waypoints,
  type LucideIcon,
} from "lucide-react";

import { cn } from "@/lib/utils";

/**
 * Layout reference: files (24)/flolyt-figma-559-screens/frames/555-design-system-layout.svg
 * Nav region is 224px (--spacing-nav / w-nav) and never contains page content or actions.
 */

type NavItem = {
  label: string;
  href: string;
  icon: LucideIcon;
  badge?: number;
};

type NavSection = {
  label: string;
  items: NavItem[];
};

const NAV_SECTIONS: NavSection[] = [
  {
    label: "WORK",
    items: [
      { label: "Rooms", href: "/rooms", icon: MessagesSquare },
      { label: "Inbox", href: "/inbox", icon: Inbox },
      { label: "My work", href: "/my-work", icon: ListChecks },
      { label: "Search", href: "/search", icon: Search },
    ],
  },
  {
    label: "REVENUE",
    items: [
      { label: "Lifecycle", href: "/lifecycle", icon: TrendingUp },
      { label: "Leakage map", href: "/leakage-map", icon: Map },
      { label: "Forecast", href: "/forecast", icon: PieChart },
      { label: "Business memory", href: "/business-memory", icon: Library },
      { label: "Customers", href: "/customers", icon: Users },
    ],
  },
  {
    label: "REACH",
    items: [
      { label: "Segments", href: "/segments", icon: PieChart },
      { label: "Audiences", href: "/audiences", icon: UsersRound },
      { label: "Campaigns", href: "/campaigns", icon: Megaphone },
      { label: "Journeys", href: "/journeys", icon: Route },
      { label: "Experiments", href: "/experiments", icon: FlaskConical },
    ],
  },
  {
    label: "TEAMS",
    items: [
      { label: "Team homes", href: "/team-homes", icon: Home },
      { label: "Handoffs", href: "/handoffs", icon: ArrowLeftRight },
      { label: "Routing", href: "/routing", icon: Waypoints },
    ],
  },
  {
    label: "SYSTEM",
    items: [
      { label: "AI teammates", href: "/ai-teammates", icon: Bot },
      { label: "Data sources", href: "/data-sources", icon: Database },
      { label: "Integrations", href: "/integrations", icon: Plug },
      { label: "Governance", href: "/governance", icon: ShieldCheck },
    ],
  },
];

const ADMIN_ITEM: NavItem = { label: "Admin", href: "/admin", icon: Settings };

export type SidebarProps = {
  /** Drawer visibility below the lg breakpoint. Ignored at lg+, where the sidebar is always visible. */
  open: boolean;
  /** Called when the drawer should close — backdrop click, Escape, or a nav item was chosen. */
  onClose: () => void;
  workspaceMode?: "Consumer" | "Accounts" | "Hybrid";
  user?: { name: string; role: string };
  /** Agents currently staffed on this workspace. Omit/empty hides the section — never show a placeholder count. */
  agentsOnCall?: { initials: string }[];
  onSearchClick?: () => void;
  className?: string;
};

function Sidebar({
  open,
  onClose,
  workspaceMode = "Consumer",
  user,
  agentsOnCall = [],
  onSearchClick,
  className,
}: SidebarProps) {
  const navLinkClass = ({ isActive }: { isActive: boolean }) =>
    cn(
      "flex items-center gap-2.5 rounded-panel px-2.5 py-[7px] text-[11.5px] text-ink-3 transition-colors",
      "hover:bg-paper hover:text-ink",
      isActive && "border border-line bg-paper font-medium text-ink shadow-xs"
    );

  return (
    <aside
      data-slot="sidebar"
      data-state={open ? "open" : "closed"}
      className={cn(
        "fixed inset-y-0 left-0 z-40 flex w-nav -translate-x-full flex-col border-r border-line bg-paper-2 transition-transform duration-200 ease-out",
        "lg:static lg:translate-x-0",
        open && "translate-x-0 shadow-2xl",
        className
      )}
    >
      {/* Brand + workspace mode */}
      <div className="flex h-topbar shrink-0 items-center gap-2 border-b border-line px-4">
        <span className="flex size-page shrink-0 items-center justify-center rounded-md bg-ultra text-xs font-bold text-white">
          F
        </span>
        <span className="text-sm font-semibold text-ink">Flolyt</span>
        <span className="ml-auto rounded-chip border border-ultra-border bg-ultra-bg px-2 py-1 text-[9.5px] font-semibold text-ultra">
          {workspaceMode}
        </span>
      </div>

      {/* Command bar entry */}
      <div className="shrink-0 px-4 pt-4">
        <button
          type="button"
          onClick={onSearchClick}
          className="flex w-full items-center justify-between rounded-panel border border-line bg-paper px-2.5 py-1.75 text-left text-[11px] text-ink-4 transition-colors hover:border-ink-4"
        >
          <span>Ask anything…</span>
          <kbd className="rounded-control border border-line bg-paper-2 px-1.5 py-0.5 font-mono text-[8.5px] text-ink-3">
            ⌘K
          </kbd>
        </button>
      </div>

      {/* Nav sections */}
      <nav className="flex-1 space-y-4 overflow-y-auto px-2.5 py-4">
        {NAV_SECTIONS.map((section) => (
          <div key={section.label}>
            <p className="px-2.5 pb-1.5 font-mono text-[8.6px] font-medium tracking-[0.85px] text-ink-4">
              {section.label}
            </p>
            <div className="space-y-0.5">
              {section.items.map((item) => (
                <NavLink
                  key={item.href}
                  to={item.href}
                  onClick={onClose}
                  className={navLinkClass}
                >
                  <item.icon className="size-3.75 shrink-0" />
                  <span className="truncate">{item.label}</span>
                  {item.badge ? (
                    <span className="ml-auto rounded-chip border border-amber-border bg-amber-bg px-1.5 py-0.5 font-mono text-[9px] font-semibold text-amber">
                      {item.badge}
                    </span>
                  ) : null}
                </NavLink>
              ))}
            </div>
          </div>
        ))}

        <div className="border-t border-line pt-2">
          <NavLink to={ADMIN_ITEM.href} onClick={onClose} className={navLinkClass}>
            <ADMIN_ITEM.icon className="size-3.75 shrink-0" />
            <span className="truncate">{ADMIN_ITEM.label}</span>
          </NavLink>
        </div>
      </nav>

      {/* Agents on call */}
      {agentsOnCall.length > 0 && (
        <div className="shrink-0 border-t border-line px-4 py-3">
          <p className="pb-2 font-mono text-[9px] font-medium tracking-[0.85px] text-ultra">
            {agentsOnCall.length} AGENT{agentsOnCall.length === 1 ? "" : "S"} ON CALL
          </p>
          <div className="flex -space-x-1.5">
            {agentsOnCall.map((agent, i) => (
              <div
                key={`${agent.initials}-${i}`}
                className="flex size-4.5 items-center justify-center rounded-full border-[1.5px] border-dashed border-ultra-border bg-paper-2 font-mono text-[6.5px] font-semibold text-ultra"
              >
                {agent.initials}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Signed-in user */}
      {user && (
        <div className="shrink-0 border-t border-line px-4 py-3 text-[10px] text-ink-3">
          {user.name} · {user.role}
        </div>
      )}
    </aside>
  );
}

export { Sidebar };
