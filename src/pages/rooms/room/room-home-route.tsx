import { useRoomContext } from "@/pages/rooms/room/room-layout";
import { RestrictedRoom } from "@/pages/rooms/room/states/restricted";
import { ClosedRoom } from "@/pages/rooms/room/states/closed";
import { ReopenedRoom } from "@/pages/rooms/room/states/reopened";
import { Workspace } from "@/pages/rooms/room/workspace/workspace";

/** `/rooms/:roomId` — branches on the room's own status (R12–R16 open, R31 restricted, R35–R37 closed, R38 recovering). */
export const RoomHomeRoute = () => {
  const { room } = useRoomContext();
  if (room.status === "restricted") return <RestrictedRoom room={room} />;
  if (room.status === "closed") return <ClosedRoom room={room} />;
  if (room.status === "recovering") return <ReopenedRoom room={room} />;
  return <Workspace room={room} activeTab="decision" />;
};

export const RoomEvidenceRoute = () => {
  const { room } = useRoomContext();
  return <Workspace room={room} activeTab="evidence" />;
};

export const RoomLogRoute = () => {
  const { room } = useRoomContext();
  return <Workspace room={room} activeTab="log" />;
};
