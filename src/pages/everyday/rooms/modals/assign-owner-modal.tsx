import * as React from "react";

import {
  Dialog,
  DialogBody,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { SearchableSelect, SearchableSelectSkeleton } from "@/components/ui/searchable-select";
import useGetWorkspaceMembers from "@/features/workspace/use-get-workspace-members";
import useUpdateRoomOwner from "@/features/rooms/use-update-room-owner";

/**
 * PUT /rooms/{roomId}/owner has no UI home anywhere in the mocked build — added per
 * docs/rooms/wiring-roadmap.md Phase 1. Candidate list is the workspace's human roster
 * (`GET /workspace/members`, already wired, previously unused by any screen) — there's no
 * "suggested owner" endpoint, so this is a plain picker, not a curated short list.
 */
export function AssignOwnerModal({
  roomId,
  roomTitle,
  open,
  onOpenChange,
}: {
  roomId: string;
  roomTitle: string;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}) {
  const [memberId, setMemberId] = React.useState<string | null>(null);
  const { members, isPending, isError, error } = useGetWorkspaceMembers();
  const { updateRoomOwner, isPending: isSaving } = useUpdateRoomOwner({
    onSuccess: () => onOpenChange(false),
  });

  const humanOptions = React.useMemo(
    () =>
      members
        .filter((m) => m.kind === "Human" && m.isActive)
        .map((m) => ({ value: m.id, label: m.displayName })),
    [members]
  );

  const confirm = () => {
    if (!memberId) return;
    updateRoomOwner({ roomId, ownerMemberId: memberId });
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-lg">
        <DialogHeader>
          <DialogTitle>Assign an owner</DialogTitle>
          <DialogDescription>{roomTitle}</DialogDescription>
        </DialogHeader>

        <DialogBody className="space-y-4 px-5 py-5 sm:px-7 sm:py-6">
          {isPending && <SearchableSelectSkeleton />}
          {isError && (
            <p className="rounded-control border border-rose-border bg-rose-bg px-3.5 py-2.5 text-[11.5px] text-rose">
              {error?.message ?? "Couldn't load workspace members."}
            </p>
          )}
          {!isPending && !isError && (
            <SearchableSelect
              options={humanOptions}
              value={memberId}
              onChange={setMemberId}
              placeholder="Select a person..."
              searchPlaceholder="Search members..."
            />
          )}
        </DialogBody>

        <DialogFooter>
          <div className="flex items-center gap-4">
            <Button type="button" onClick={confirm} disabled={!memberId || isSaving}>
              {isSaving ? "Assigning…" : "Assign"}
            </Button>
            <button
              type="button"
              onClick={() => onOpenChange(false)}
              className="text-[12px] font-semibold text-ink-3 hover:text-ink"
            >
              Cancel
            </button>
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
