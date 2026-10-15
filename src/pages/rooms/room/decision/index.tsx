import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { useGetRoomDecision } from "@/features/rooms/use-get-room-decision";
import { DecisionCard } from "@/pages/rooms/room/decision/decision-card";
import { FalsifiersPanel } from "@/pages/rooms/room/decision/falsifiers-panel";
import { ObjectionsPanel } from "@/pages/rooms/room/decision/objections-panel";
import { Revisions } from "@/pages/rooms/room/decision/revisions";

const LAYOUT = "grid items-start gap-6 @5xl:grid-cols-[minmax(0,1fr)_380px]";

function DecisionSkeleton() {
  return (
    <div className={LAYOUT} aria-busy="true" aria-label="Loading the decision">
      <div className="space-y-6">
        <Skeleton className="h-72 rounded-card" />
        <Skeleton className="h-44 rounded-card" />
      </div>
      <div className="space-y-6">
        <Skeleton className="h-80 rounded-card" />
        <Skeleton className="h-72 rounded-card" />
      </div>
    </div>
  );
}

/** The Decision tab (Room · Decision & dissent.png), on GET /rooms/{roomId}/decision. */
export const DecisionTab = ({ roomId }: { roomId: string }) => {
  const query = useGetRoomDecision(roomId);

  if (query.isPending) return <DecisionSkeleton />;
  if (query.isError) {
    return (
      <div className="flex flex-wrap items-center gap-3 rounded-card border border-rose-border bg-rose-bg/40 px-4 py-3">
        <p className="text-[12px] text-rose">{query.error?.message || "Couldn't load the decision."}</p>
        <Button type="button" variant="outline" size="sm" onClick={() => query.refetch()}>
          Retry
        </Button>
      </div>
    );
  }

  const decision = query.data.data;

  return (
    <div className={LAYOUT}>
      <div className="space-y-6">
        <DecisionCard roomId={roomId} decision={decision} />
        <Revisions revisions={decision.revisions} />
      </div>
      <div className="space-y-6">
        <ObjectionsPanel roomId={roomId} dissent={decision.dissent} />
        <FalsifiersPanel roomId={roomId} falsifiers={decision.whatWouldChangeThis} />
      </div>
    </div>
  );
};
