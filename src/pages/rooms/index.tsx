import { Link, useParams } from "react-router-dom";

import { Button } from "@/components/ui/button";

/**
 * Stub while the Rooms section is rebuilt from the new design, one section at a time. The
 * previous build (mock Room pages, wired index) is archived in src/oldpages/rooms. See
 * docs/rooms/revenue-threat-room-build-plan.md.
 */
const RebuildingCard = ({ title, body, back }: { title: string; body: string; back?: boolean }) => (
  <div className="rounded-card border border-dashed border-line bg-paper p-10 text-center">
    <p className="text-[13px] font-semibold text-ink">{title}</p>
    <p className="mt-1.5 text-[11.5px] text-ink-3">{body}</p>
    {back && (
      <Button asChild variant="outline" size="sm" className="mt-4">
        <Link to="/rooms">Back to Rooms</Link>
      </Button>
    )}
  </div>
);

const Rooms = () => (
  <div className="space-y-4">
    <h1 className="text-[17px] font-semibold text-ink">Rooms</h1>
    <RebuildingCard
      title="Rooms are being rebuilt"
      body="The new Rooms list is the first piece to land."
    />
  </div>
);

export const RoomStub = () => {
  const { roomId } = useParams();
  return (
    <div className="space-y-4">
      <h1 className="text-[17px] font-semibold text-ink">Room</h1>
      <RebuildingCard
        title="This Room page is being rebuilt"
        body={`Room ${roomId ?? ""} will open here once the new Room page is built.`}
        back
      />
    </div>
  );
};

export default Rooms;
