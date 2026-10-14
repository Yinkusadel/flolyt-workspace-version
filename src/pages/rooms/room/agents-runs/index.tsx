import * as React from "react";

import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { useGetRoomPeople } from "@/features/rooms/use-get-room-people";
import { useGetRoomRuns } from "@/features/rooms/use-get-room-runs";
import { AddToRoomDialog } from "@/pages/rooms/room/thread/add-to-room-dialog";
import { InvestigationCard } from "@/pages/rooms/room/agents-runs/investigation-card";
import { Roster, type RosterCardAgent } from "@/pages/rooms/room/agents-runs/roster";
import { RunsTable } from "@/pages/rooms/room/agents-runs/runs-table";

const LAYOUT = "grid items-start gap-6 @5xl:grid-cols-[minmax(0,1fr)_380px]";
/** `limit` for the runs read; a full page means older runs exist that are not shown. */
const RUNS_LIMIT = 50;

function AgentsRunsSkeleton() {
  return (
    <div className="space-y-6" aria-busy="true" aria-label="Loading the agents and runs">
      <Skeleton className="h-6 w-28" />
      <div className="grid gap-4 sm:grid-cols-2 @5xl:grid-cols-3">
        {[0, 1, 2].map((i) => (
          <Skeleton key={i} className="h-44 rounded-card" />
        ))}
      </div>
      <div className={LAYOUT}>
        <Skeleton className="h-80 rounded-card" />
        <Skeleton className="h-80 rounded-card" />
      </div>
    </div>
  );
}

/**
 * The Agents & runs tab (Room · Agents & runs.png): the roster, the runs and the investigation, with the add form as a button that opens
 * the same dialog as the thread. Roster states and runs come from `GET /rooms/{roomId}/runs`; what each agent will do and what it reads
 * come from `GET /rooms/{roomId}/people`. Built from the real runs and investigation responses of 2026-10-13, which held only successful
 * runs: the failed, cancelled, awaiting-approval and running rows are built from the docs and still to confirm against real data.
 */
export const AgentsRunsTab = ({ roomId, canEdit }: { roomId: string; canEdit: boolean }) => {
  const runs = useGetRoomRuns(roomId, { limit: RUNS_LIMIT });
  const people = useGetRoomPeople(roomId);
  const [addOpen, setAddOpen] = React.useState(false);

  const data = runs.data?.data;
  const detailByKey = React.useMemo(() => new Map((people.data?.data.agents ?? []).map((agent) => [agent.key, agent] as const)), [people.data]);
  const nameForUser = React.useCallback(
    (userId: string) => (people.data?.data.people ?? []).find((person) => person.userId === userId)?.displayName ?? null,
    [people.data]
  );

  const roster = React.useMemo<RosterCardAgent[]>(
    () =>
      (data?.agents ?? []).map((agent) => {
        const detail = detailByKey.get(agent.key);
        return {
          key: agent.key,
          displayName: agent.displayName,
          role: agent.role,
          state: agent.state,
          whatItWillDo: detail?.whatItWillDo ?? null,
          reads: detail?.reads ?? null,
        };
      }),
    [data?.agents, detailByKey]
  );
  const nameForAgent = React.useCallback((agentKey: string) => (data?.agents ?? []).find((agent) => agent.key === agentKey)?.displayName ?? null, [data?.agents]);

  if (runs.isPending) return <AgentsRunsSkeleton />;
  if (runs.isError || !data) {
    return (
      <div className="flex flex-wrap items-center gap-3 rounded-card border border-rose-border bg-rose-bg/40 px-4 py-3">
        <p className="text-[12px] text-rose">{runs.error?.message || "Couldn't load the agents and runs."}</p>
        <Button type="button" variant="outline" size="sm" onClick={() => runs.refetch()}>
          Retry
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {canEdit && (
        <section className="flex flex-wrap items-center justify-between gap-x-6 gap-y-3 rounded-card border border-line bg-paper px-5 py-4">
          <div className="min-w-0">
            <h3 className="text-[15px] font-semibold text-ink">Add an agent</h3>
            <p className="mt-0.5 text-[12px] leading-relaxed text-ink-3">
              Pick an agent that is ready, give it a role and say in one sentence what it will do here.
            </p>
          </div>
          <Button type="button" variant="outline" onClick={() => setAddOpen(true)}>
            Add an agent
          </Button>
        </section>
      )}

      <Roster roomId={roomId} agents={roster} canEdit={canEdit} />

      <div className={LAYOUT}>
        <RunsTable runs={data.runs} rowsReadAvailable={data.rowsReadAvailable} nameForUser={nameForUser} limited={data.runs.length >= RUNS_LIMIT} />
        <div className="space-y-6">
          <InvestigationCard roomId={roomId} nameForAgent={nameForAgent} />
        </div>
      </div>

      <AddToRoomDialog roomId={roomId} open={addOpen} onOpenChange={setAddOpen} initialTab="agents" />
    </div>
  );
};
