import * as React from "react";
import { AlertCircle } from "lucide-react";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { useGetRoomPlays } from "@/features/rooms/use-get-room-plays";
import { CitedPanels } from "@/pages/rooms/room/plays/cited-panels";
import { CollisionCard } from "@/pages/rooms/room/plays/collision-card";
import { ObligationsTable } from "@/pages/rooms/room/plays/obligations-table";
import { PlaysTable } from "@/pages/rooms/room/plays/plays-table";

const LAYOUT = "grid items-start gap-6 @5xl:grid-cols-[minmax(0,1fr)_380px]";

function PlaysSkeleton() {
  return (
    <div className="space-y-6" aria-busy="true" aria-label="Loading the plays">
      <Skeleton className="h-6 w-96 max-w-full" />
      <Skeleton className="h-64 rounded-card" />
      <div className={LAYOUT}>
        <Skeleton className="h-72 rounded-card" />
        <Skeleton className="h-72 rounded-card" />
      </div>
    </div>
  );
}

/**
 * The Plays tab (Room · Plays & collisions.png), on `GET /rooms/{roomId}/plays`: the counters, the plays, the collision check and
 * what was argued before for the selected play, and the obligations that came back. Left out on purpose: the design's "About this
 * leak" caption, a "Hand off obligations" action (it belongs to the Decision tab and has no endpoint) and the campaign link on a done play.
 * Built from the documented response plus the backend's sample (`basis`, `decisionOwnerName`); no real play has been seen yet.
 */
export const PlaysTab = ({ roomId }: { roomId: string }) => {
  const [includeDecided, setIncludeDecided] = React.useState(true);
  const query = useGetRoomPlays(roomId, { includeDecided });
  const [selectedId, setSelectedId] = React.useState<string | null>(null);

  const data = query.data?.data;
  // The other list is loading while the current one stays on screen: dim it, never replace the tab.
  const switching = query.isFetching && query.isPlaceholderData;
  const plays = React.useMemo(() => data?.plays ?? [], [data]);
  // The first pending play is the one waiting on someone, so it is the default; else the first row.
  const selected = plays.find((play) => play.proposalId === selectedId) ?? plays.find((play) => play.state === "pending") ?? plays[0] ?? null;

  if (query.isPending) return <PlaysSkeleton />;
  if (query.isError || !data) {
    return (
      <div className="flex flex-wrap items-center gap-3 rounded-card border border-rose-border bg-rose-bg/40 px-4 py-3">
        <p className="text-[12px] text-rose">{query.error?.message || "Couldn't load the plays."}</p>
        <Button type="button" variant="outline" size="sm" onClick={() => query.refetch()}>
          Retry
        </Button>
      </div>
    );
  }

  const counters = [
    { label: "pending", value: data.pending, tone: "text-ultra" },
    { label: "done", value: data.done, tone: "text-ink-3" },
    { label: "rejected", value: data.rejected, tone: "text-ink-3" },
    { label: "deferred", value: data.deferred, tone: "text-amber" },
  ];

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex flex-wrap items-center gap-x-4 gap-y-2 text-[12.5px]">
          {counters.map((counter) => (
            <span key={counter.label} className={cn("font-medium", counter.tone)}>
              {counter.value} {counter.label}
            </span>
          ))}
          <span className="rounded-chip bg-ink px-2.5 py-1 text-[11.5px] font-semibold text-paper">{data.waitingOnPeople} waiting on people</span>
        </div>
        <label className="flex cursor-pointer items-center gap-2 text-[12.5px] text-ink">
          <input type="checkbox" checked={includeDecided} aria-busy={switching} onChange={(event) => setIncludeDecided(event.currentTarget.checked)} className="size-4 accent-ultra" />
          Include decided
        </label>
      </div>

      <div className={cn("space-y-6 transition-opacity", switching && "pointer-events-none opacity-60")} aria-busy={switching}>
        {plays.length === 0 ? (
          <div className="rounded-card border border-dashed border-line bg-paper p-10 text-center">
            <p className="text-[13px] font-semibold text-ink">{includeDecided ? "No play has been proposed on this Room yet" : "No play is waiting on a decision"}</p>
            <p className="mt-1.5 text-[11.5px] text-ink-3">
              {includeDecided ? "When an agent proposes an action, it will show here with who decides it." : "Tick “Include decided” to see plays that were already decided."}
            </p>
          </div>
        ) : (
          <>
            {selected?.figuresAreStated && (
              <p className="flex items-start gap-2.5 rounded-card border border-amber-border bg-amber-bg px-4 py-3 text-[12.5px] leading-relaxed text-ink">
                <AlertCircle className="mt-0.5 size-4 shrink-0 text-amber" />
                <span>
                  Reach and value are stated by whoever proposed the play. Nothing has checked them.
                  {selected.reach !== null && ` Treat a stated reach of ${selected.reach.toLocaleString("en-US")} as a claim until the cohort and collision check agree.`}
                </span>
              </p>
            )}

            <PlaysTable plays={plays} selectedId={selected?.proposalId ?? null} onSelect={setSelectedId} />

            {selected && (
              <div className={LAYOUT}>
                <CollisionCard key={selected.proposalId} roomId={roomId} play={selected} />
                <CitedPanels roomId={roomId} proposalId={selected.proposalId} />
              </div>
            )}
          </>
        )}

        <ObligationsTable obligations={data.returnedObligations} />
      </div>
    </div>
  );
};
