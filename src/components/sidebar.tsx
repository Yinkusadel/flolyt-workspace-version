import { useEffect, useRef, useState } from "react";
import { NavLink, Link, useLocation, useNavigate } from "react-router-dom";
import {
  ArrowLeftRight,
  Award,
  BarChart3,
  Bot,
  BookOpen,
  ChevronDown,
  Filter,
  Fingerprint,
  FlaskConical,
  Gem,
  GitBranch,
  HeartPulse,
  Inbox,
  Library,
  LineChart,
  ListChecks,
  Map,
  Megaphone,
  MessageCircle,
  MessageCirclePlus,
  MessagesSquare,
  MoreVertical,
  Newspaper,
  PieChart,
  Reply,
  Share2,
  ShieldCheck,
  Store,
  Target,
  Trash2,
  TrendingUp,
  Users2,
  Wrench,
  type LucideIcon,
} from "lucide-react";

import { cn } from "@/lib/utils";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useGetRooms } from "@/features/rooms/use-get-rooms";
import { useGetAiConversations } from "@/features/ai-conversations/use-get-ai-conversations";
import { useArchiveAiConversation } from "@/features/ai-conversations/use-archive-ai-conversation";
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

const NAV_SECTIONS: NavSection[] = [
  {
    label: "EVERY DAY",
    items: [
      { label: "Lifecycle", href: "/lifecycle", icon: TrendingUp },
      { label: "Rooms", href: "/rooms", icon: MessagesSquare },
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
      { label: "Leakage map", href: "/leakage-map", icon: Map },
      { label: "Funnel", href: "/funnel", icon: Filter },
      { label: "Scenario", href: "/scenario", icon: GitBranch },
      { label: "Forecast", href: "/forecast", icon: LineChart },
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
  /** From GET /lifecycle/leakage-map's `revenueModel` (the only endpoint that currently surfaces
   *  it — see [[flolyt_lifecycle_endpoints]]). `null` while loading or if it errors; also `null`
   *  for a workspace that hasn't picked one yet, which are indistinguishable without a dedicated
   *  loading flag — hence `isWorkspaceModeLoading` below. */
  workspaceMode?: "Consumer" | "Accounts" | "Hybrid" | null;
  isWorkspaceModeLoading?: boolean;
  /** Who the home route's numbers/content are scoped to. Controlled from the app shell. */
  viewingAs?: ViewingAs;
  onViewingAsChange?: (value: ViewingAs) => void;
  /** Total addressable customer base for the current viewing-as scope. Omit to hide the footer stat. */
  customerBase?: string;
  isCustomerBaseLoading?: boolean;
  /** Currencies represented in that customer base. */
  currencies?: string[];
  /** Team members with visibility into the current scope. Omit/empty hides the roster row. */
  roster?: RosterEntry[];
  className?: string;
};

function Sidebar({
  open,
  onClose,
  workspaceMode = null,
  isWorkspaceModeLoading = false,
  viewingAs = "Everyone",
  onViewingAsChange,
  customerBase,
  isCustomerBaseLoading = false,
  currencies = [],
  roster = [],
  className,
}: SidebarProps) {
  const { pathname } = useLocation();
  const navigate = useNavigate();
  const [conversationsOpen, setConversationsOpen] = useState(false);
  const [openMenuId, setOpenMenuId] = useState<string | null>(null);
  const [menuOpensUp, setMenuOpensUp] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState<{ id: string; title: string } | null>(null);
  const { archiveConversation, isPending: isDeleting } = useArchiveAiConversation();
  const openMenuRef = useRef<HTMLDivElement>(null);
  const conversationListRef = useRef<HTMLDivElement>(null);

  // The row menu renders inline inside this `overflow-y-auto` list (not portaled, see the note
  // below), so a menu opened from a row near the bottom gets clipped by the list's own scroll
  // boundary instead of floating over it. Flip it to open upward when there isn't ~44px of room
  // below the trigger inside the list.
  const toggleRowMenu = (id: string, trigger: HTMLElement) => {
    if (openMenuId === id) {
      setOpenMenuId(null);
      return;
    }
    const listRect = conversationListRef.current?.getBoundingClientRect();
    const triggerRect = trigger.getBoundingClientRect();
    const MENU_HEIGHT = 44;
    setMenuOpensUp(!!listRect && listRect.bottom - triggerRect.bottom < MENU_HEIGHT);
    setOpenMenuId(id);
  };

  // The drawer only translates off-screen on close, it doesn't unmount — drop any open row menu
  // so it isn't still open (invisibly) the next time the drawer slides back in.
  useEffect(() => {
    if (!open) setOpenMenuId(null);
  }, [open]);

  // Plain document listener, not a Radix dismissable layer — this menu renders inline (no portal),
  // so it can't trip the mobile drawer's "outside click" handling the way DropdownMenu did
  // (see [[feedback_no_dropdown_menu_for_sidebar_nav]]).
  useEffect(() => {
    if (!openMenuId) return;
    const handlePointerDown = (e: MouseEvent) => {
      if (openMenuRef.current && !openMenuRef.current.contains(e.target as Node)) {
        setOpenMenuId(null);
      }
    };
    document.addEventListener("mousedown", handlePointerDown);
    return () => document.removeEventListener("mousedown", handlePointerDown);
  }, [openMenuId]);

  // Open rooms only (the default GET /rooms filter) — needsYou is what the old mock's badge counted.
  const { data: roomsData } = useGetRooms();
  const roomsNeedingApproval = roomsData?.data.rooms.filter((r) => r.needsYou).length ?? 0;

  const { data: conversationsData, isLoading: conversationsLoading } = useGetAiConversations({
    pageNumber: 1,
    pageSize: 50,
  });
  const conversations = conversationsData?.data ?? [];

  const navLinkClass = ({ isActive }: { isActive: boolean }) =>
    cn(
      "flex items-center gap-2.5 rounded-panel px-2.5 py-[7px] text-[11.5px] text-ink-3 transition-colors",
      "hover:bg-paper hover:text-ink",
      isActive && "border border-line bg-paper font-medium text-ink shadow-xs"
    );

  const handleConfirmDelete = () => {
    if (!deleteTarget) return;
    const { id } = deleteTarget;
    archiveConversation(id);
    if (pathname === `/conversations/${id}`) navigate("/new-conversation");
    setDeleteTarget(null);
  };

  return (
    <>
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
        {isWorkspaceModeLoading ? (
          <Skeleton className="ml-auto h-5 w-16 rounded-chip" />
        ) : (
          workspaceMode && (
            <span className="ml-auto rounded-chip border border-ultra-border bg-ultra-bg px-2 py-1 text-[9.5px] font-semibold text-ultra">
              {workspaceMode}
            </span>
          )
        )}
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

      {/* Nav sections */}
      <nav className="flex-1 space-y-4 overflow-y-auto px-2.5 py-4">
        {/* Sits above EVERY DAY — the entry points for starting/finding an AI conversation. */}
        <div className="space-y-0.5">
          <NavLink to="/new-conversation" onClick={onClose} className={navLinkClass}>
            <MessageCirclePlus className="size-3.75 shrink-0" />
            <span className="truncate">New conversation</span>
          </NavLink>

          <button
            type="button"
            onClick={() => setConversationsOpen((prev) => !prev)}
            aria-expanded={conversationsOpen}
            className={cn(
              "flex w-full items-center gap-2.5 rounded-panel px-2.5 py-[7px] text-[11.5px] text-ink-3 transition-colors",
              "hover:bg-paper hover:text-ink",
              conversationsOpen && "text-ink"
            )}
          >
            <MessageCircle className="size-3.75 shrink-0" />
            <span className="truncate">AI conversations</span>
            <ChevronDown
              className={cn(
                "ml-auto size-3.5 shrink-0 transition-transform",
                conversationsOpen && "rotate-180"
              )}
            />
          </button>

          {conversationsOpen && (
            <div ref={conversationListRef} className="max-h-64 space-y-0.5 overflow-y-auto py-0.5 pl-6">
              {conversationsLoading &&
                [1, 2, 3].map((key) => (
                  <Skeleton key={key} className="h-7 w-full rounded-control" />
                ))}

              {!conversationsLoading && conversations.length === 0 && (
                <p className="px-2.5 py-1 text-[11px] text-ink-4">No conversations yet.</p>
              )}

              {!conversationsLoading &&
                conversations.map((conversation) => {
                  const isMenuOpen = openMenuId === conversation.id;
                  return (
                    <div key={conversation.id} className="relative flex items-center">
                      <Link
                        to={`/conversations/${conversation.id}`}
                        onClick={onClose}
                        className={cn(
                          "block flex-1 truncate rounded-control py-[7px] pr-7 pl-2.5 text-[11.5px] text-ink-3 transition-colors",
                          "hover:bg-paper hover:text-ink",
                          pathname === `/conversations/${conversation.id}` &&
                            "bg-paper font-medium text-ink"
                        )}
                      >
                        {conversation.title || "Untitled conversation"}
                      </Link>

                      {/* Always rendered (not hover-revealed) so it's reachable by tap on touch
                          screens, not just by mouse hover — see [[flolyt_mobile_design]]. */}
                      <div ref={isMenuOpen ? openMenuRef : undefined} className="absolute right-1">
                        <button
                          type="button"
                          onClick={(e) => {
                            e.preventDefault();
                            e.stopPropagation();
                            toggleRowMenu(conversation.id, e.currentTarget);
                          }}
                          aria-label="Conversation actions"
                          aria-expanded={isMenuOpen}
                          className={cn(
                            "flex size-6 shrink-0 items-center justify-center rounded-control text-ink-4 transition-colors hover:bg-paper hover:text-ink",
                            isMenuOpen && "bg-paper text-ink"
                          )}
                        >
                          <MoreVertical className="size-3.5" />
                        </button>

                        {isMenuOpen && (
                          <div
                            className={cn(
                              "absolute right-0 z-10 w-32 overflow-hidden rounded-panel border border-line bg-paper-2 py-1 shadow-lg",
                              menuOpensUp ? "bottom-full mb-1" : "top-full mt-1"
                            )}
                          >
                            <button
                              type="button"
                              onClick={(e) => {
                                e.preventDefault();
                                e.stopPropagation();
                                setOpenMenuId(null);
                                setDeleteTarget({
                                  id: conversation.id,
                                  title: conversation.title || "Untitled conversation",
                                });
                              }}
                              className="flex w-full items-center gap-2 px-3 py-1.5 text-left text-[11.5px] text-rose hover:bg-rose-bg"
                            >
                              <Trash2 className="size-3.25" />
                              Delete
                            </button>
                          </div>
                        )}
                      </div>
                    </div>
                  );
                })}
            </div>
          )}
        </div>

        {NAV_SECTIONS.map((section) => (
          <div key={section.label}>
            <p className="px-2.5 pb-1.5 font-mono text-[8.6px] font-medium tracking-[0.85px] text-ink-4">
              {section.label}
            </p>
            <div className="space-y-0.5">
              {section.items.map((item) => {
                const badge = item.href === "/rooms" ? roomsNeedingApproval || undefined : item.badge;
                return (
                  <NavLink
                    key={item.href}
                    to={item.href}
                    onClick={onClose}
                    className={navLinkClass}
                  >
                    <item.icon className="size-3.75 shrink-0" />
                    <span className="truncate">{item.label}</span>
                    {badge ? (
                      <span className="ml-auto rounded-chip border border-amber-border bg-amber-bg px-1.5 py-0.5 font-mono text-[9px] font-semibold text-amber">
                        {badge}
                      </span>
                    ) : null}
                  </NavLink>
                );
              })}
            </div>
          </div>
        ))}
      </nav>

      {/* Customer base + roster for the current viewing-as scope */}
      {(isCustomerBaseLoading || customerBase) && (
        <div className="shrink-0 border-t border-line px-4 py-3">
          <p className="pb-1 font-mono text-[8.6px] font-medium tracking-[0.85px] text-ink-4">
            CUSTOMER BASE
          </p>
          {isCustomerBaseLoading ? (
            <Skeleton className="h-5 w-14" />
          ) : (
            <p className="text-lg font-semibold text-ink">{customerBase}</p>
          )}
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

    <Dialog open={!!deleteTarget} onOpenChange={(open) => !open && setDeleteTarget(null)}>
      <DialogContent className="max-w-sm">
        <DialogHeader>
          <DialogTitle>Delete conversation</DialogTitle>
          <DialogDescription>
            {`Delete "${deleteTarget?.title ?? ""}"? This can't be undone.`}
          </DialogDescription>
        </DialogHeader>

        <DialogFooter>
          <div className="flex items-center gap-4">
            <Button type="button" variant="destructive" onClick={handleConfirmDelete} disabled={isDeleting}>
              {isDeleting ? "Deleting…" : "Delete"}
            </Button>
            <button
              type="button"
              onClick={() => setDeleteTarget(null)}
              className="text-[12px] font-semibold text-ink-3 hover:text-ink"
            >
              Cancel
            </button>
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
    </>
  );
}

export { Sidebar };
