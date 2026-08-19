import { NavLink } from "react-router-dom";
import {
  Activity,
  ArrowLeftRight,
  Award,
  BarChart3,
  Bell,
  Bot,
  BookOpen,
  Boxes,
  Code2,
  CreditCard,
  Database,
  Eye,
  Filter,
  Fingerprint,
  FlaskConical,
  Frame,
  Gem,
  GitBranch,
  Globe,
  HeartPulse,
  IdCard,
  Inbox,
  Languages,
  Library,
  ListChecks,
  Lock,
  Map,
  Megaphone,
  MessagesSquare,
  Newspaper,
  PieChart,
  Plug,
  Reply,
  ScrollText,
  Share2,
  ShieldCheck,
  Store,
  Target,
  TrendingUp,
  Users,
  Users2,
  Wrench,
  type LucideIcon,
} from "lucide-react";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { getRoomsNeedingApproval } from "@/pages/everyday/rooms/data";
import { INBOX_PENDING_COUNT } from "@/pages/everyday/inbox/data";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import flolytLogo from "../../assets/logo.png";

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

const ROOMS_NEEDING_APPROVAL = getRoomsNeedingApproval();

const NAV_SECTIONS: NavSection[] = [
  {
    label: "EVERY DAY",
    items: [
      { label: "Lifecycle", href: "/lifecycle", icon: TrendingUp },
      { label: "Rooms", href: "/rooms", icon: MessagesSquare, badge: ROOMS_NEEDING_APPROVAL || undefined },
      { label: "What to do today", href: "/what-to-do-today", icon: ListChecks },
      { label: "Goals", href: "/goals", icon: Target },
      { label: "Digest", href: "/digest", icon: Newspaper },
      { label: "Inbox", href: "/inbox", icon: Inbox, badge: INBOX_PENDING_COUNT || undefined },
      { label: "Handoff", href: "/handoff", icon: ArrowLeftRight },
    ],
  },
  {
    label: "REVENUE",
    items: [
      { label: "Leakage map", href: "/revenue/leaks", icon: Map },
      { label: "Funnel", href: "/funnel", icon: Filter },
      { label: "Scenario", href: "/scenario", icon: GitBranch },
      { label: "Attribution", href: "/attribution", icon: Share2 },
      { label: "Value", href: "/value", icon: Gem },
      { label: "Benchmarks", href: "/benchmarks", icon: BarChart3 },
    ],
  },
  {
    label: "CUSTOMERS",
    items: [
      { label: "Segments", href: "/segments", icon: PieChart },
      { label: "Customer health", href: "/customer-health", icon: HeartPulse },
      { label: "Campaigns", href: "/campaigns", icon: Megaphone },
      { label: "Experiments", href: "/experiments", icon: FlaskConical },
      { label: "Replies", href: "/replies", icon: Reply },
    ],
  },
  {
    label: "KNOWLEDGE",
    items: [
      { label: "Business memory", href: "/business-memory", icon: Library },
      { label: "Playbooks", href: "/playbooks", icon: BookOpen },
      { label: "Community", href: "/community", icon: Users2 },
      { label: "Recognition", href: "/recognition", icon: Award },
    ],
  },
  {
    label: "AGENTS",
    items: [
      { label: "AI teammates", href: "/ai-teammates", icon: Bot },
      { label: "Agent detail", href: "/agent-detail", icon: Fingerprint },
      { label: "Agent builder", href: "/agent-builder", icon: Wrench },
      { label: "Marketplace", href: "/marketplace", icon: Store },
      { label: "Governance", href: "/governance", icon: ShieldCheck },
    ],
  },
  {
    label: "DATA",
    items: [
      { label: "Data sources", href: "/data-sources", icon: Database },
      { label: "Data health", href: "/data-health", icon: Activity },
      { label: "Schema", href: "/schema", icon: Boxes },
      { label: "Identity", href: "/identity", icon: IdCard },
    ],
  },
  {
    label: "SETTINGS",
    items: [
      { label: "Members", href: "/members", icon: Users },
      { label: "Security", href: "/security", icon: Lock },
      { label: "Audit log", href: "/audit-log", icon: ScrollText },
      { label: "Data and residency", href: "/data-and-residency", icon: Globe },
      { label: "Notifications", href: "/notifications", icon: Bell },
      { label: "Integrations", href: "/integrations", icon: Plug },
      { label: "Plan and billing", href: "/plan-and-billing", icon: CreditCard },
      { label: "Developers", href: "/developers", icon: Code2 },
      { label: "Embedding", href: "/embedding", icon: Frame },
      { label: "Your view", href: "/your-view", icon: Eye },
      { label: "Language", href: "/language", icon: Languages },
    ],
  },
];

export const VIEWING_AS_OPTIONS = ["Everyone", "Marketing", "Sales", "Products"] as const;
export type ViewingAs = (typeof VIEWING_AS_OPTIONS)[number];

export type RosterEntry = { initials: string; team: 1 | 2 | 3 | 4 };

const TEAM_BORDER_CLASSES = {
  1: "border-team-1 text-team-1",
  2: "border-team-2 text-team-2",
  3: "border-team-3 text-team-3",
  4: "border-team-4 text-team-4",
} as const;

export type SidebarProps = {
  /** Drawer visibility below the lg breakpoint. Ignored at lg+, where the sidebar is always visible. */
  open: boolean;
  /** Called when the drawer should close — backdrop click, Escape, or a nav item was chosen. */
  onClose: () => void;
  workspaceMode?: "Consumer" | "Accounts" | "Hybrid";
  /** Who the home route's numbers/content are scoped to. Controlled from the app shell. */
  viewingAs?: ViewingAs;
  onViewingAsChange?: (value: ViewingAs) => void;
  onSearchClick?: () => void;
  /** Total addressable customer base for the current viewing-as scope. Omit to hide the footer stat. */
  customerBase?: string;
  /** Currencies represented in that customer base. */
  currencies?: string[];
  /** Team members with visibility into the current scope. Omit/empty hides the roster row. */
  roster?: RosterEntry[];
  className?: string;
};

function Sidebar({
  open,
  onClose,
  workspaceMode = "Consumer",
  viewingAs = "Everyone",
  onViewingAsChange,
  onSearchClick,
  customerBase,
  currencies = [],
  roster = [],
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
        <img src={flolytLogo} alt="Flolyt" className="size-page shrink-0 object-contain" />
        <span className="text-sm font-semibold text-ink">Flolyt</span>
        <span className="ml-auto rounded-chip border border-ultra-border bg-ultra-bg px-2 py-1 text-[9.5px] font-semibold text-ultra">
          {workspaceMode}
        </span>
      </div>

      {/* Viewing-as scope */}
      <div className="shrink-0 space-y-1.5 px-4 pt-4">
        <p className="font-mono text-[8.6px] font-medium tracking-[0.85px] text-ink-4">
          VIEWING AS
        </p>
        <Select
          value={viewingAs}
          onValueChange={(value) => onViewingAsChange?.(value as ViewingAs)}
        >
          <SelectTrigger>
            <span className="flex items-center gap-2">
              <span className="size-1.5 shrink-0 rounded-full bg-ink-3" aria-hidden />
              <SelectValue />
            </span>
          </SelectTrigger>
          <SelectContent>
            {VIEWING_AS_OPTIONS.map((option) => (
              <SelectItem key={option} value={option}>
                {option}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Command bar entry */}
      <div className="shrink-0 px-4 pt-3">
        <Button
          type="button"
          variant="outline"
          onClick={onSearchClick}
          className="h-auto w-full justify-between rounded-panel px-2.5 py-1.75 text-left font-normal text-ink-4 hover:border-ink-4 hover:bg-paper hover:text-ink-4"
        >
          <span className="text-[11px]">Ask anything…</span>
          <kbd className="rounded-control border border-line bg-paper-2 px-1.5 py-0.5 font-mono text-[8.5px] text-ink-3">
            ⌘K
          </kbd>
        </Button>
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
      </nav>

      {/* Customer base + roster for the current viewing-as scope */}
      {customerBase && (
        <div className="shrink-0 border-t border-line px-4 py-3">
          <p className="pb-1 font-mono text-[8.6px] font-medium tracking-[0.85px] text-ink-4">
            CUSTOMER BASE
          </p>
          <p className="text-lg font-semibold text-ink">{customerBase}</p>
          {currencies.length > 0 && (
            <p className="pt-0.5 font-mono text-[9px] text-ink-3">{currencies.join(" · ")}</p>
          )}
          {roster.length > 0 && (
            <div className="flex -space-x-1.5 pt-2">
              {roster.map((person, i) => (
                <div
                  key={`${person.initials}-${i}`}
                  className={cn(
                    "flex size-4.5 items-center justify-center rounded-full border-[1.5px] bg-paper-2 font-mono text-[6.5px] font-semibold ring-2 ring-paper-2",
                    TEAM_BORDER_CLASSES[person.team]
                  )}
                >
                  {person.initials}
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </aside>
  );
}

export { Sidebar };
