import { OverlapsSection } from "@/pages/rooms/room/cohort-overlaps/overlaps-section";
import { PeopleSection } from "@/pages/rooms/room/cohort-overlaps/people-section";
import type { RoomDetailDto } from "@/services/api/rooms/get-room";

/** The Cohort & overlaps tab (Room · Cohort & overlaps.png): the people behind the Room, then the other Rooms working on the same people. */
export const CohortOverlapsTab = ({ room, canEdit }: { room: RoomDetailDto; canEdit: boolean }) => (
  <div className="space-y-10">
    <PeopleSection roomId={room.id} />
    <OverlapsSection room={room} canEdit={canEdit} />
  </div>
);
