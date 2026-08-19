import { Link, Outlet, useOutletContext, useParams } from "react-router-dom";

import { getRoom } from "@/pages/everyday/rooms/room/data";
import type { RoomDetail } from "@/pages/everyday/rooms/room/types";

export type RoomOutletContext = { room: RoomDetail };

/** Resolves `:roomId` to a `RoomDetail` and provides it via context — mirrors lifecycle's `StageLayout`. */
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

  return <Outlet context={{ room } satisfies RoomOutletContext} />;
};

export default RoomLayout;

export function useRoomContext() {
  return useOutletContext<RoomOutletContext>();
}
