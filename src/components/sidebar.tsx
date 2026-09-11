import { useEffect, useRef, useState } from "react";
import { NavLink, Link, useLocation, useNavigate } from "react-router-dom";
import {
  BookOpen,
  ChevronDown,
  Home,
  Inbox,
  Library,
  Map,
  MessageCircle,
  MessagesSquare,
  MoreVertical,
  Trash2,
  type LucideIcon,
} from "lucide-react";

import { cn } from "@/lib/utils";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";
import { Chip } from "@/components/ui/chip";
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
import flolytLogo from "../../assets/logo.png";

/**
 * Layout reference: files (24)/flolyt-figma-559-screens/frames/555-design-system-layout.svg
 * Nav region is 224px (--spacing-nav / w-nav) and never contains page content or actions.
 */

type NavItem = {
  label: string;
  href: string;
  icon: LucideIcon;
  beta?: boolean;
};

// Placeholders (Leakage Map, Inbox, Playbooks, Business Memory) are linked here on purpose —
// they route to an empty page under src/pages until their content gets rebuilt or restored
// from src/oldpages.
const NAV_ITEMS: NavItem[] = [
  { label: "Leakage Map", href: "/leakage-map", icon: Map },
  { label: "Inbox", href: "/inbox", icon: Inbox },
  { label: "Playbooks", href: "/playbooks", icon: BookOpen, beta: true },
  { label: "Business Memory", href: "/business-memory", icon: Library },
];

export type SidebarProps = {
  /** Drawer visibility below the lg breakpoint. Ignored at lg+, where the sidebar is always visible. */
  open: boolean;
  /** Called when the drawer should close — backdrop click, Escape, or a nav item was chosen. */
  onClose: () => void;
  className?: string;
};

function Sidebar({ open, onClose, className }: SidebarProps) {
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
  // below), so it gets clipped by the list's own scroll boundary whichever edge it opens toward.
  // A row near the bottom needs it to open up; a row near the top (a short list — even the first
  // row of just two — has just as little room above as a last row has below) needs it to open
  // down. Pick whichever side actually has more room, rather than only checking one direction.
  const toggleRowMenu = (id: string, trigger: HTMLElement) => {
    if (openMenuId === id) {
      setOpenMenuId(null);
      return;
    }
    const listRect = conversationListRef.current?.getBoundingClientRect();
    const triggerRect = trigger.getBoundingClientRect();
    const spaceBelow = listRect ? listRect.bottom - triggerRect.bottom : Infinity;
    const spaceAbove = listRect ? triggerRect.top - listRect.top : 0;
    setMenuOpensUp(spaceAbove > spaceBelow);
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
    if (pathname === `/conversations/${id}`) navigate("/");
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
      {/* Brand */}
      <div className="flex h-topbar shrink-0 items-center gap-2 border-b border-line px-4">
        <img src={flolytLogo} alt="Flolyt" className="size-page shrink-0 object-contain" />
        <span className="text-sm font-semibold text-ink">Flolyt</span>
      </div>

      {/* Nav */}
      <nav className="flex-1 space-y-0.5 overflow-y-auto px-2.5 py-4">
        <NavLink to="/" end onClick={onClose} className={navLinkClass}>
          <Home className="size-3.75 shrink-0" />
          <span className="truncate">Home</span>
        </NavLink>

        <NavLink to="/rooms" onClick={onClose} className={navLinkClass}>
          <MessagesSquare className="size-3.75 shrink-0" />
          <span className="truncate">Rooms</span>
          {roomsNeedingApproval ? (
            <span className="ml-auto rounded-chip border border-amber-border bg-amber-bg px-1.5 py-0.5 font-mono text-[9px] font-semibold text-amber">
              {roomsNeedingApproval}
            </span>
          ) : null}
        </NavLink>

        {NAV_ITEMS.map((item) => (
          <NavLink key={item.href} to={item.href} onClick={onClose} className={navLinkClass}>
            <item.icon className="size-3.75 shrink-0" />
            <span className="truncate">{item.label}</span>
            {item.beta ? (
              <Chip tone="ultra" className="ml-auto">
                BETA
              </Chip>
            ) : null}
          </NavLink>
        ))}

        <div>
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
            <span className="truncate">Conversations</span>
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
      </nav>
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
