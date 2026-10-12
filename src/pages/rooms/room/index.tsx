import * as React from "react";
import { useParams, useSearchParams } from "react-router-dom";

import { UnderlineTabs } from "@/components/ui/underline-tabs";
import useMarkRoomOpened from "@/features/rooms/use-mark-room-opened";
import { useGetRoomConflicts } from "@/features/rooms/use-get-room-conflicts";
import { ConflictsTab } from "@/pages/rooms/room/conflicts";
import { DecisionTab } from "@/pages/rooms/room/decision";

type RoomTab =
  | "briefing"
  | "decision"
  | "conflicts"
  | "plays"
  | "evidence"
  | "agents-runs"
  | "people-guardrails"
  | "cohort-overlaps"
  | "log";

/**
 * Every Room gets all nine tabs, in the design's order (the handoff never hides any). Two threat
 * tabs (Opening & monitoring, Plan & verification) join the front for auto-opened Rooms once the
 * single-Room endpoint tells us `threatConfirmationId`. Count badges ("Conflicts 1", "Plays 2") are
 * added when those tabs are built.
 */
const TABS: { key: RoomTab; label: string }[] = [
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

const isTab = (value: string | null): value is RoomTab => TABS.some((tab) => tab.key === value);

/**
 * The header is a placeholder: the title, owner, stage, people and at-risk figures, the chips and
 * the header buttons (Watching, Restrict, Close room, or Open thread on an auto-opened Room) all
 * come from `GET /api/v3/rooms/{roomId}`, which the backend has not shipped yet.
 */
function HeaderPlaceholder({ roomId }: { roomId: string | undefined }) {
  return (
    <div className="rounded-card border border-dashed border-line bg-paper p-5">
      <h1 className="text-[17px] font-semibold text-ink">Room</h1>
      <p className="mt-1 text-[11.5px] text-ink-3">
        Waiting for <span className="font-mono">GET /api/v3/rooms/{"{roomId}"}</span>. The title, owner, figures and
        header actions arrive with it.
      </p>
      {roomId && <p className="mt-2 font-mono text-[10.5px] break-all text-ink-4">{roomId}</p>}
    </div>
  );
}

/** Each tab is replaced by its real screen one at a time, so no tab is a dead link meanwhile. */
function TabPlaceholder({ label }: { label: string }) {
  return (
    <div className="rounded-card border border-dashed border-line bg-paper p-10 text-center">
      <p className="text-[13px] font-semibold text-ink">{label} is being built</p>
      <p className="mt-1.5 text-[11.5px] text-ink-3">This tab arrives in a later step of the Room page rebuild.</p>
    </div>
  );
}

/** `/rooms/:roomId`: the Room page shell. The active tab lives in the URL (`?tab=`), default Briefing. */
export const RoomPage = () => {
  const { roomId } = useParams();
  const [searchParams] = useSearchParams();
  const tabParam = searchParams.get("tab");
  const active: RoomTab = isTab(tabParam) ? tabParam : "briefing";

  // Records that this person opened the Room: the only input to the 30-day "still wanted" check on
  // My load. Silent and idempotent (stamps at most once a day).
  const { markRoomOpened } = useMarkRoomOpened();
  React.useEffect(() => {
    if (roomId) markRoomOpened(roomId);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [roomId]);

  // The Conflicts tab's count badge is the response's own `open` number. Same params as the tab itself,
  // so the badge and the tab read one cached request.
  const conflicts = useGetRoomConflicts(roomId ?? "", { includeResolved: true });
  const openConflicts = conflicts.data ? conflicts.data.data.open : null;

  const activeLabel = TABS.find((tab) => tab.key === active)?.label ?? "";

  return (
    <div className="space-y-6">
      <HeaderPlaceholder roomId={roomId} />
      <UnderlineTabs
        active={active}
        tabs={TABS.map((tab) => ({
          key: tab.key,
          label: tab.label,
          to: tab.key === "briefing" ? `/rooms/${roomId}` : `/rooms/${roomId}?tab=${tab.key}`,
          badge: tab.key === "conflicts" ? openConflicts : null,
        }))}
      />
      {active === "decision" && roomId ? (
        <DecisionTab roomId={roomId} />
      ) : active === "conflicts" && roomId ? (
        <ConflictsTab roomId={roomId} />
      ) : (
        <TabPlaceholder label={activeLabel} />
      )}
    </div>
  );
};
