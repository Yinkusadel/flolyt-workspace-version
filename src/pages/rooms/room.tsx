import { Link, Outlet, useOutletContext, useParams } from "react-router-dom";

import { getRoom } from "@/pages/rooms/data";
import { RoomHeader } from "@/pages/rooms/room-header";
import { DecisionTab } from "@/pages/rooms/decision-tab";
import { EvidenceTab } from "@/pages/rooms/evidence-tab";
import { LogTab } from "@/pages/rooms/log-tab";
import { PlaysTab } from "@/pages/rooms/plays-tab";
import type { RoomDetail } from "@/pages/rooms/types";

type RoomOutletContext = { room: RoomDetail };

/**
 * Layout for a single room (screens 27-32) — header + tabs stay mounted,
 * only the tab body swaps via the nested routes below. See
 * flolyt-kit-122/27-room-cohort-war-room.svg through
 * 32-room-empty-recovering-archived.svg.
 */
const RoomLayout = () => {
  const { roomId } = useParams();
  const room = roomId ? getRoom(roomId) : undefined;

  if (!room) {
    return (
      <div className="rounded-card border border-dashed border-line bg-paper p-10 text-center">
        <p className="text-[13px] font-semibold text-ink">Room not found</p>
        <p className="mt-1.5 text-[11.5px] text-ink-3">It may have been archived or the link is out of date.</p>
        <Link to="/rooms" className="mt-4 inline-block text-[11.5px] font-semibold text-ultra hover:underline">
          Back to Rooms
        </Link>
      </div>
    );
  }

  return (
    <div className="flex h-[calc(100dvh-var(--spacing-topbar)-var(--spacing-page)*2)] flex-col overflow-hidden rounded-surface border border-line bg-paper">
      <RoomHeader room={room} />
      <div className="min-h-0 flex-1">
        <Outlet context={{ room } satisfies RoomOutletContext} />
      </div>
    </div>
  );
};

export default RoomLayout;

export function useRoomContext() {
  return useOutletContext<RoomOutletContext>();
}

export const RoomDecisionRoute = () => {
  const { room } = useRoomContext();
  return <DecisionTab room={room} />;
};

export const RoomEvidenceRoute = () => {
  const { room } = useRoomContext();
  return <EvidenceTab room={room} />;
};

export const RoomPlaysRoute = () => {
  const { room } = useRoomContext();
  return <PlaysTab room={room} />;
};

export const RoomLogRoute = () => {
  const { room } = useRoomContext();
  return <LogTab room={room} />;
};
