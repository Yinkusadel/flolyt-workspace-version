import { useState } from "react";

import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { OwnershipTable, type OwnershipRow } from "@/pages/everyday/lifecycle/settings/ownership-table";
import { AssignStageOwnerModal } from "@/pages/everyday/lifecycle/stage/modals/assign-stage-owner-modal";
import useGetLifecycleMap from "@/features/lifecycle/use-get-lifecycle-map";

function OwnershipSkeleton() {
  return (
    <div className="space-y-3 rounded-card border border-line bg-paper p-4">
      {Array.from({ length: 6 }).map((_, index) => (
        <div key={index} className="flex items-center justify-between gap-4">
          <Skeleton className="h-3 w-20" />
          <Skeleton className="h-3 w-24" />
          <Skeleton className="h-3 w-28" />
          <Skeleton className="h-3 w-28" />
          <Skeleton className="h-3 w-12" />
        </div>
      ))}
    </div>
  );
}

/**
 * LC04 (stage ownership) — relocated off the lifecycle map itself, which no
 * longer carries a combined ownership table. See
 * flolyt-figma-designs/flolyt-lifecycle/LC04-stage-ownership.svg.
 *
 * Wired to GET /lifecycle/map (same endpoint the map page's stage-rail cards already use) —
 * owningTeam/owner/leadAgentName/openRoomCount/reviewCadence are all real fields there. The old
 * mock's "Trend" column had no equivalent field anywhere in this domain and is dropped, not
 * reproduced — see [[flolyt_lifecycle_endpoints]].
 */
const LifecycleSettings = () => {
  const { stages, isLoading, isError, refetch } = useGetLifecycleMap();
  const [rowForOwner, setRowForOwner] = useState<OwnershipRow | null>(null);
  const rows: OwnershipRow[] = stages.map((stage) => ({
    id: stage.key,
    stage: stage.name,
    owningTeam: stage.owningTeam,
    ownerId: stage.owner?.ownerUserId ?? null,
    ownerName: stage.owner?.displayName ?? null,
    leadAgentName: stage.leadAgentName,
    openRooms: stage.openRoomCount,
    reviewCadence: stage.reviewCadence,
  }));

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-[17px] font-semibold text-ink">Stage ownership</h1>
        <p className="mt-1 text-[11.5px] text-ink-3">
          Every stage's owning team, owner, lead agent, review cadence and open rooms
        </p>
      </div>

      {isError ? (
        <div className="flex flex-wrap items-center gap-3 rounded-card border border-rose-border bg-rose-bg/40 px-4 py-3">
          <p className="text-[12px] text-rose">Couldn't load stage ownership.</p>
          <Button type="button" variant="outline" size="sm" onClick={() => refetch()}>
            Retry
          </Button>
        </div>
      ) : isLoading ? (
        <OwnershipSkeleton />
      ) : (
        <OwnershipTable rows={rows} onManageOwner={setRowForOwner} />
      )}

      <AssignStageOwnerModal
        stageKey={rowForOwner?.id ?? ""}
        stageName={rowForOwner?.stage ?? ""}
        currentOwnerId={rowForOwner?.ownerId ?? null}
        currentOwnerName={rowForOwner?.ownerName ?? null}
        open={!!rowForOwner}
        onOpenChange={(next) => !next && setRowForOwner(null)}
      />
    </div>
  );
};

export default LifecycleSettings;
