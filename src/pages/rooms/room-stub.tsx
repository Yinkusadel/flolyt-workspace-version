import { Link, useParams } from "react-router-dom";

import { Button } from "@/components/ui/button";

/**
 * `/rooms/:roomId` stub. The Room page is rebuilt after the backend adds a single-Room endpoint
 * (see docs/rooms/revenue-threat-room-build-plan.md). The previous build is in src/oldpages/rooms.
 */
export const RoomStub = () => {
  const { roomId } = useParams();
  return (
    <div className="space-y-4">
      <h1 className="text-[17px] font-semibold text-ink">Room</h1>
      <div className="rounded-card border border-dashed border-line bg-paper p-10 text-center">
        <p className="text-[13px] font-semibold text-ink">This Room page is being rebuilt</p>
        <p className="mt-1.5 text-[11.5px] text-ink-3">
          {roomId ? `Room ${roomId} will open here` : "This Room will open here"} once the new Room page is
          built.
        </p>
        <Button asChild variant="outline" size="sm" className="mt-4">
          <Link to="/rooms">Back to Rooms</Link>
        </Button>
      </div>
    </div>
  );
};
