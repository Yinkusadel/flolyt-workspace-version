import * as React from "react";
import { Link, useParams, useSearchParams } from "react-router-dom";

import { usePageBreadcrumb } from "@/components/breadcrumb-context";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { UnderlineTabs } from "@/components/ui/underline-tabs";
import useMarkRoomOpened from "@/features/rooms/use-mark-room-opened";
import { useGetRoom } from "@/features/rooms/use-get-room";
import { useGetRoomConflicts } from "@/features/rooms/use-get-room-conflicts";
import { ConflictsTab } from "@/pages/rooms/room/conflicts";
import { DecisionTab } from "@/pages/rooms/room/decision";
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

  return (
    <div className="space-y-6">
      <RoomHeader room={data} />
      <UnderlineTabs
        active={active}
        tabs={tabs.map((tab) => ({
          key: tab.key,
          label: tab.label,
          to: tab.key === "briefing" ? `/rooms/${roomId}` : `/rooms/${roomId}?tab=${tab.key}`,
          badge: tab.key === "conflicts" ? openConflicts : null,
        }))}
      />
      {active === "decision" ? (
        <DecisionTab roomId={roomId} />
      ) : active === "conflicts" ? (
        <ConflictsTab roomId={roomId} />
      ) : (
        <TabPlaceholder label={activeLabel} />
      )}
    </div>
  );
};
