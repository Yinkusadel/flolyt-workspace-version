import * as React from "react";

import { Button } from "@/components/ui/button";
import { Collapse } from "@/components/ui/collapse";
import { NotesToggle } from "@/components/ui/notes-toggle";
import type { SearchableSelectOption } from "@/components/ui/searchable-select";
import { Skeleton } from "@/components/ui/skeleton";
import { useGetRoomConflicts } from "@/features/rooms/use-get-room-conflicts";
import useGetWorkspaceMembers from "@/features/workspace/use-get-workspace-members";
import { useAuth } from "@/utils/auth-context";
import { OpenConflict, SettledConflict } from "@/pages/rooms/room/conflicts/conflict-card";
import { buildConflictNotices, ConflictNotices } from "@/pages/rooms/room/conflicts/notices";
import { RaiseConflictDialog } from "@/pages/rooms/room/conflicts/raise-conflict-dialog";

function ConflictsSkeleton() {
  return (
    <div className="space-y-4" aria-busy="true" aria-label="Loading conflicts">
      <Skeleton className="h-8 w-56" />
      <Skeleton className="h-104 rounded-card" />
    </div>
  );
}

/** The Conflicts tab (Room · Conflicts.png), on GET /rooms/{roomId}/conflicts. */
export const ConflictsTab = ({ roomId }: { roomId: string }) => {
  // Same params as the tab bar's count badge, so both read one cached request.
  const query = useGetRoomConflicts(roomId, { includeResolved: true });
  const { members } = useGetWorkspaceMembers();
  const { user } = useAuth();
  const [raiseOpen, setRaiseOpen] = React.useState(false);
  const [showSettled, setShowSettled] = React.useState(true);
  // The notes about the conflicts stay tucked behind the info icon until asked for (the Leakage Map's pattern).
  const [notesOpen, setNotesOpen] = React.useState(false);

  const names = React.useMemo(() => new Map(members.map((m) => [m.id, m.displayName])), [members]);
  const nameOf = React.useCallback((userId: string) => names.get(userId) ?? "someone", [names]);

  // Active people other than the viewer: escalating to yourself would move nothing.
  const people = React.useMemo<SearchableSelectOption[]>(
    () =>
      members
        .filter((m) => m.kind === "Human" && m.isActive && m.id !== user?.id)
        .map((m) => ({ value: m.id, label: m.displayName })),
    [members, user?.id]
  );

  if (query.isPending) return <ConflictsSkeleton />;
  if (query.isError) {
    return (
      <div className="flex flex-wrap items-center gap-3 rounded-card border border-rose-border bg-rose-bg/40 px-4 py-3">
        <p className="text-[12px] text-rose">{query.error?.message || "Couldn't load the conflicts."}</p>
        <Button type="button" variant="outline" size="sm" onClick={() => query.refetch()}>
          Retry
        </Button>
      </div>
    );
  }

  const { conflicts, open } = query.data.data;
  const openConflicts = conflicts.filter((conflict) => !conflict.isResolved);
  const settled = conflicts.filter((conflict) => conflict.isResolved);
  const notices = buildConflictNotices(conflicts);

  return (
    <div className="space-y-6">
      <div>
        <div className="flex flex-wrap items-center justify-between gap-3">
          <p className="text-[12px] text-ink-3">
            {open} open · {settled.length} settled
          </p>
          <div className="flex items-center gap-3">
            {notices.length > 0 && (
              <NotesToggle
                count={notices.length}
                warning
                open={notesOpen}
                onToggle={() => setNotesOpen((current) => !current)}
                controlsId="conflict-notices"
                subject="these conflicts"
              />
            )}
            <Button type="button" variant="outline" size="sm" onClick={() => setRaiseOpen(true)}>
              Raise a conflict...
            </Button>
          </div>
        </div>
        {notices.length > 0 && (
          <Collapse id="conflict-notices" open={notesOpen}>
            {/* Padding, not margin: a margin would collapse out of the measured box and get clipped. */}
            <div className="pt-3">
              <ConflictNotices notices={notices} />
            </div>
          </Collapse>
        )}
      </div>

      {conflicts.length === 0 ? (
        <div className="rounded-card border border-dashed border-line bg-paper p-10 text-center">
          <p className="text-[13px] font-semibold text-ink">No conflicts in this Room</p>
          <p className="mt-1.5 text-[11.5px] text-ink-3">
            A conflict appears here when two readings disagree and a person has to decide between them.
          </p>
        </div>
      ) : (
        <>
          {openConflicts.length === 0 ? (
            <div className="rounded-card border border-dashed border-line bg-paper p-8 text-center">
              <p className="text-[13px] font-semibold text-ink">Nothing is waiting on a decision</p>
              <p className="mt-1.5 text-[11.5px] text-ink-3">Settled conflicts stay on the record below.</p>
            </div>
          ) : (
            <div className="space-y-4">
              {openConflicts.map((conflict) => (
                <OpenConflict key={conflict.id} conflict={conflict} nameOf={nameOf} people={people} />
              ))}
            </div>
          )}

          {settled.length > 0 && (
            <section>
              <div className="flex items-center justify-between gap-3">
                <h2 className="text-[15px] font-semibold text-ink">Settled</h2>
                <label className="flex items-center gap-2 text-[12px] text-ink">
                  <input
                    type="checkbox"
                    checked={showSettled}
                    onChange={(event) => setShowSettled(event.currentTarget.checked)}
                    className="size-3.5 rounded border-line"
                  />
                  Show settled conflicts
                </label>
              </div>
              {showSettled && (
                <div className="mt-4 space-y-4">
                  {settled.map((conflict) => (
                    <SettledConflict key={conflict.id} conflict={conflict} nameOf={nameOf} />
                  ))}
                </div>
              )}
            </section>
          )}
        </>
      )}

      {raiseOpen && <RaiseConflictDialog roomId={roomId} open={raiseOpen} onOpenChange={setRaiseOpen} />}
    </div>
  );
};
