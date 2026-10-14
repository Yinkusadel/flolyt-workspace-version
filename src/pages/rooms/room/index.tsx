import * as React from "react";
import { MessageSquare } from "lucide-react";
import { Link, useParams, useSearchParams } from "react-router-dom";

import { cn } from "@/lib/utils";
import { usePageBreadcrumb } from "@/components/breadcrumb-context";
import { useForceSidebarCollapsed } from "@/components/sidebar-override-context";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { UnderlineTabs } from "@/components/ui/underline-tabs";
import useMarkRoomOpened from "@/features/rooms/use-mark-room-opened";
import { useGetRoom } from "@/features/rooms/use-get-room";
import { useGetRoomConflicts } from "@/features/rooms/use-get-room-conflicts";
import { useGetRoomPlays } from "@/features/rooms/use-get-room-plays";
import { AgentsRunsTab } from "@/pages/rooms/room/agents-runs";
import { ConflictsTab } from "@/pages/rooms/room/conflicts";
import { DecisionTab } from "@/pages/rooms/room/decision";
import { EvidenceTab } from "@/pages/rooms/room/evidence";
import { LogTab } from "@/pages/rooms/room/log";
import { PeopleGuardrailsTab } from "@/pages/rooms/room/people-guardrails";
import { PlaysTab } from "@/pages/rooms/room/plays";
import { ThreadPanel } from "@/pages/rooms/room/thread";
import { useMediaQuery } from "@/pages/rooms/room/thread/use-media-query";
import { RoomHeader, RoomHeaderSkeleton } from "@/pages/rooms/room/room-header";

interface TabDef {
  key: string;
  label: string;
}

/**
 * Every Room gets all nine tabs, in the design's order (the handoff never hides any).
 */
const TABS: TabDef[] = [
  { key: "briefing", label: "Briefing" },
  { key: "decision", label: "Decision" },
  { key: "conflicts", label: "Conflicts" },
  { key: "plays", label: "Plays" },
  { key: "evidence", label: "Evidence" },
  { key: "agents-runs", label: "Agents & runs" },
  { key: "people-guardrails", label: "People & guardrails" },
  { key: "cohort-overlaps", label: "Cohort & overlaps" },
  { key: "log", label: "Log" },
];

/** Auto-opened Rooms (`threatConfirmationId` set) get these two IN FRONT of the nine. Not built yet. */
const THREAT_TABS: TabDef[] = [
  { key: "opening-monitoring", label: "Opening & monitoring" },
  { key: "plan-verification", label: "Plan & verification" },
];

/** Each tab is replaced by its real screen one at a time, so no tab is a dead link meanwhile. */
function TabPlaceholder({ label }: { label: string }) {
  return (
    <div className="rounded-card border border-dashed border-line bg-paper p-10 text-center">
      <p className="text-[13px] font-semibold text-ink">{label} is being built</p>
      <p className="mt-1.5 text-[11.5px] text-ink-3">This tab arrives in a later step of the Room page rebuild.</p>
    </div>
  );
}

/** A missing, foreign or inaccessible Room all answer 404 "Room not found." (they look alike on purpose). */
function RoomUnavailable({ message, onRetry }: { message: string; onRetry: () => void }) {
  return (
    <div className="rounded-card border border-dashed border-line bg-paper p-10 text-center">
      <p className="text-[13px] font-semibold text-ink">{message || "This Room couldn't be loaded"}</p>
      <p className="mt-1.5 text-[11.5px] text-ink-3">
        It may have been archived, you may not have access, or the link is out of date.
      </p>
      <div className="mt-4 flex flex-wrap items-center justify-center gap-2">
        <Button type="button" variant="outline" size="sm" onClick={onRetry}>
          Retry
        </Button>
        <Button asChild variant="outline" size="sm">
          <Link to="/rooms">Back to Rooms</Link>
        </Button>
      </div>
    </div>
  );
}

const THREAD_OPEN_KEY = "flolyt-room-thread-open";
/** Slide duration of the docked thread, matching the sidebar. */
const PANEL_MS = 300;

/** Docked-panel preference, remembered per browser. Open unless the person closed it; storage may be blocked. */
function readThreadOpen(): boolean {
  try {
    return localStorage.getItem(THREAD_OPEN_KEY) !== "0";
  } catch {
    return true;
  }
}

/** `/rooms/:roomId`: the Room page. The active tab lives in the URL (`?tab=`), default Briefing. */
export const RoomPage = () => {
  const { roomId } = useParams();
  const [searchParams] = useSearchParams();
  const tabParam = searchParams.get("tab");

  const room = useGetRoom(roomId ?? "");
  const data = room.data?.data ?? null;

  // The topbar's breadcrumb carries the Room's real title once it is known.
  usePageBreadcrumb([{ label: "Rooms", to: "/rooms" }, { label: data?.title ?? "Room" }]);

  // Records that this person opened the Room: the only input to the 30-day "still wanted" check on
  // My load. Silent and idempotent (stamps at most once a day); only for a Room that actually loaded.
  const { markRoomOpened } = useMarkRoomOpened();
  React.useEffect(() => {
    if (roomId && data) markRoomOpened(roomId);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [roomId, data?.id]);

  // The Conflicts tab's count badge is the response's own `open` number. Same params as the tab itself,
  // so the badge and the tab read one cached request.
  const conflicts = useGetRoomConflicts(data ? (roomId ?? "") : "", { includeResolved: true });
  const openConflicts = conflicts.data ? conflicts.data.data.open : null;
  // The Plays badge is the response's own `pending`; same params as the tab's default, so one cached request.
  const plays = useGetRoomPlays(data ? (roomId ?? "") : "", { includeDecided: true });
  const pendingPlays = plays.data ? plays.data.data.pending : null;

  // The thread: docked on the right on wide screens (open by default, remembered), an overlay drawer below 1100px.
  const wide = useMediaQuery("(min-width: 1100px)");
  const [dockedOpen, setDockedOpen] = React.useState(readThreadOpen);
  const [drawerOpen, setDrawerOpen] = React.useState(false);
  const conversationId = data?.conversationId ?? null;
  const docked = wide && dockedOpen && !!conversationId;
  const drawer = !wide && drawerOpen && !!conversationId;
  useForceSidebarCollapsed(docked, () => setDocked(false));

  // The docked panel slides in and out (width and fade) in step with the sidebar's own transition instead of jumping. It stays mounted
  // only while visible or animating out, so a closed thread holds no feed connection.
  const [panelMounted, setPanelMounted] = React.useState(docked);
  const [panelShown, setPanelShown] = React.useState(docked);
  React.useEffect(() => {
    if (docked) {
      setPanelMounted(true);
      const frame = window.requestAnimationFrame(() => window.requestAnimationFrame(() => setPanelShown(true)));
      return () => window.cancelAnimationFrame(frame);
    }
    setPanelShown(false);
    const timer = window.setTimeout(() => setPanelMounted(false), PANEL_MS + 40);
    return () => window.clearTimeout(timer);
  }, [docked]);
  const setDocked = (open: boolean) => {
    setDockedOpen(open);
    try {
      localStorage.setItem(THREAD_OPEN_KEY, open ? "1" : "0");
    } catch {
      // Not remembered; the panel still follows this session's choice.
    }
  };
  const openThread = () => (wide ? setDocked(true) : setDrawerOpen(true));

  const tabs = React.useMemo(() => (data?.threatConfirmationId ? [...THREAT_TABS, ...TABS] : TABS), [data?.threatConfirmationId]);
  const active = tabs.some((tab) => tab.key === tabParam) ? (tabParam as string) : "briefing";
  const activeLabel = tabs.find((tab) => tab.key === active)?.label ?? "";

  if (room.isPending) {
    return (
      <div className="space-y-6">
        <RoomHeaderSkeleton />
        <Skeleton className="h-10 w-full rounded-control" />
      </div>
    );
  }
  if (room.isError || !data || !roomId) {
    return (
      <div className="space-y-6">
        <RoomUnavailable message={room.error?.message ?? ""} onRetry={() => room.refetch()} />
      </div>
    );
  }

  const content = (
    <div className="min-w-0 flex-1 space-y-6">
      <RoomHeader room={data} onOpenThread={conversationId && !docked ? openThread : undefined} />
      {/* The tab bar stays pinned under the top bar while the header above it scrolls away and the tab's content scrolls beneath it. It is
          full-bleed (the side padding is cancelled and re-applied) with the page's own background so nothing shows through. The scroll area
          has no top padding, so it sticks flush at its top edge. */}
      <div className="sticky top-0 z-20 -mx-page bg-paper px-page">
        <UnderlineTabs
          active={active}
          tabs={tabs.map((tab) => ({
            key: tab.key,
            label: tab.label,
            to: tab.key === "briefing" ? `/rooms/${roomId}` : `/rooms/${roomId}?tab=${tab.key}`,
            badge: tab.key === "conflicts" ? openConflicts : tab.key === "plays" ? pendingPlays : null,
          }))}
        />
      </div>
      {/* A container, not the viewport, decides when a tab stacks: the thread takes width from the tab area. */}
      <div className="@container">
        {active === "decision" ? (
          <DecisionTab roomId={roomId} />
        ) : active === "conflicts" ? (
          <ConflictsTab roomId={roomId} />
        ) : active === "plays" ? (
          <PlaysTab roomId={roomId} />
        ) : active === "evidence" ? (
          <EvidenceTab roomId={roomId} />
        ) : active === "log" ? (
          <LogTab roomId={roomId} />
        ) : active === "people-guardrails" ? (
          <PeopleGuardrailsTab room={data} canEdit={data.conversationPermissions.canContribute} />
        ) : active === "agents-runs" ? (
          <AgentsRunsTab roomId={roomId} canEdit={data.conversationPermissions.canContribute} />
        ) : (
          <TabPlaceholder label={activeLabel} />
        )}
      </div>
    </div>
  );

  return (
    <>
      <div className="flex items-start">
        <div className="min-w-0 flex-1">{content}</div>
        {panelMounted && conversationId && (
          <aside
            className="sticky top-0 h-[calc(100dvh-var(--spacing-topbar)-var(--spacing-page))] shrink-0 overflow-hidden transition-[width] ease-out"
            style={{ width: panelShown ? "26.5rem" : "0px", transitionDuration: `${PANEL_MS}ms` }}
          >
            {/* Fixed width inside, so the panel slides as a whole and its text never reflows while the width animates; the left padding is the gap. */}
            <div className={cn("h-full w-106 pl-6 transition-opacity ease-out", panelShown ? "opacity-100" : "opacity-0")} style={{ transitionDuration: `${PANEL_MS}ms` }}>
              <ThreadPanel room={data} conversationId={conversationId} onClose={() => setDocked(false)} />
            </div>
          </aside>
        )}
      </div>

      {drawer && conversationId && (
        <>
          <div aria-hidden onClick={() => setDrawerOpen(false)} className="fixed inset-0 z-40 bg-ink/40" />
          <aside className="fixed inset-y-0 right-0 z-40 w-[min(25rem,100vw)] p-2">
            <ThreadPanel room={data} conversationId={conversationId} onClose={() => setDrawerOpen(false)} />
          </aside>
        </>
      )}
      {!wide && !drawerOpen && conversationId && (
        <button
          type="button"
          onClick={() => setDrawerOpen(true)}
          className="fixed right-4 bottom-4 z-30 inline-flex items-center gap-2 rounded-full bg-ultra px-4 py-2.5 text-[12.5px] font-medium text-white shadow-lg"
        >
          <MessageSquare className="size-4" />
          Thread
        </button>
      )}
    </>
  );
};
