import * as React from "react";
import { useQueryClient } from "@tanstack/react-query";

import { Button } from "@/components/ui/button";
import { Dialog, DialogBody, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { SearchableSelect, SearchableSelectSkeleton } from "@/components/ui/searchable-select";
import useReopenRoom from "@/features/rooms/use-reopen-room";
import { ROOM_QUERY_KEY } from "@/features/rooms/use-get-room";
import useGetWorkspaceMembers from "@/features/workspace/use-get-workspace-members";
import type { RoomDetailDto } from "@/services/api/rooms/get-room";

const FIELD_LABEL = "mb-1.5 block text-[11px] font-semibold text-ink-2";
const AREA =
  "w-full resize-y rounded-panel border border-line bg-paper-2 px-2.5 py-2 text-[12.5px] text-ink outline-none placeholder:text-ink-4 focus:border-ring disabled:opacity-60";

/** The "no change" choice: the request then sends `ownerMemberId: null`. */
const KEEP_OWNER = "keep-current-owner";

/**
 * Reopens an archived Room (`POST /rooms/{roomId}/reopen`) as its next opening. A reason is required; a new owner is optional.
 * Mock-verified only: the real reopen has never run, and what `ownerMemberId: null` does on the backend (presumably keeps the owner) is unconfirmed.
 */
/** The few fields the dialog needs, so it works from the Room page (`RoomDetailDto`) and from a Rooms list row alike. */
export type ReopenableRoom = Pick<RoomDetailDto, "id" | "title" | "openingNumber" | "ownerName">;

export function ReopenRoomDialog({ room, open, onOpenChange }: { room: ReopenableRoom; open: boolean; onOpenChange: (open: boolean) => void }) {
  const queryClient = useQueryClient();
  const members = useGetWorkspaceMembers();
  const [why, setWhy] = React.useState("");
  const [owner, setOwner] = React.useState<string>(KEEP_OWNER);

  const { reopenRoom, isPending } = useReopenRoom({
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ROOM_QUERY_KEY(room.id) });
      onOpenChange(false);
      setWhy("");
      setOwner(KEEP_OWNER);
    },
  });

  const ownerOptions = [
    { value: KEEP_OWNER, label: room.ownerName ? `Keep the current owner (${room.ownerName})` : "Keep the current owner" },
    ...members.members.filter((member) => member.kind === "Human" && member.isActive).map((member) => ({ value: member.id, label: member.displayName })),
  ];

  return (
    <Dialog open={open} onOpenChange={(next) => !isPending && onOpenChange(next)}>
      <DialogContent className="max-w-lg">
        <DialogHeader>
          <DialogTitle>Reopen {room.title}</DialogTitle>
          <DialogDescription>
            This starts opening {room.openingNumber + 1} of the same room. Every link to it still works and the earlier opening is kept whole, with its outcome and
            predictions. The log, evidence, decision and plays start empty, and the people count is read again as it stands now.
          </DialogDescription>
        </DialogHeader>
        <DialogBody className="space-y-4 px-5 py-5 sm:px-7 sm:py-6">
          <div>
            <label htmlFor="reopen-why" className={FIELD_LABEL}>
              Why are you reopening it? (required)
            </label>
            <textarea id="reopen-why" rows={3} value={why} disabled={isPending} onChange={(event) => setWhy(event.currentTarget.value)} className={AREA} />
          </div>
          <div>
            <span className={FIELD_LABEL}>Owner (optional)</span>
            {members.isPending ? (
              <SearchableSelectSkeleton />
            ) : members.isError ? (
              <p className="text-[12px] text-rose">{members.error.message || "The workspace members couldn't be loaded"}</p>
            ) : (
              <SearchableSelect options={ownerOptions} value={owner} onChange={setOwner} placeholder="Keep the current owner" searchPlaceholder="Search teammates" emptyText="Nobody found" disabled={isPending} />
            )}
          </div>
        </DialogBody>
        <DialogFooter>
          <div className="flex items-center gap-4">
            <Button
              type="button"
              disabled={isPending || !why.trim()}
              onClick={() => reopenRoom({ roomId: room.id, why: why.trim(), ownerMemberId: owner === KEEP_OWNER ? null : owner })}
            >
              {isPending ? "Reopening…" : "Reopen room"}
            </Button>
            <button type="button" disabled={isPending} onClick={() => onOpenChange(false)} className="text-[12px] font-semibold text-ink-3 hover:text-ink">
              Cancel
            </button>
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
