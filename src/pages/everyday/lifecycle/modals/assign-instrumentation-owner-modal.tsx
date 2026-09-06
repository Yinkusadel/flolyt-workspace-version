import { useEffect, useState } from "react";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogBody,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { SearchableSelect, SearchableSelectSkeleton, type SearchableSelectOption } from "@/components/ui/searchable-select";
import useGetWorkspaceMembers from "@/features/workspace/use-get-workspace-members";
import useUpdateInstrumentationRequestOwner from "@/features/lifecycle/use-update-instrumentation-request-owner";

/**
 * Assigns who's on the hook for an already-raised instrumentation request —
 * `PUT /instrumentation-requests/{obligationId}/owner`. Separate from raising the request
 * itself — deliberately, per the endpoint's own note: who does the work is usually settled
 * after the ask. Owner is always a person, never a team.
 */
export function AssignInstrumentationOwnerModal({
  obligationId,
  gapName,
  currentOwnerId = null,
  currentOwnerName = null,
  open,
  onOpenChange,
}: {
  obligationId: string | null;
  gapName: string;
  currentOwnerId?: string | null;
  currentOwnerName?: string | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}) {
  const hasOwner = currentOwnerId !== null;
  const [ownerUserId, setOwnerUserId] = useState<string | null>(currentOwnerId);
  const { members, isLoading: membersLoading } = useGetWorkspaceMembers();
  const candidateOptions: SearchableSelectOption[] = members
    .filter((m) => m.kind === "Human" && m.isActive)
    .map((m) => ({ value: m.id, label: m.email ? `${m.displayName} · ${m.email}` : m.displayName }));

  const { assignOwner, isPending } = useUpdateInstrumentationRequestOwner({ onSuccess: () => onOpenChange(false) });

  useEffect(() => {
    if (open) setOwnerUserId(currentOwnerId);
  }, [open, currentOwnerId]);

  const confirm = () => {
    if (!obligationId || !ownerUserId) return;
    assignOwner({ obligationId, ownerUserId });
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-lg">
        <DialogHeader>
          <DialogTitle>{hasOwner ? "Change owner" : "Assign an owner"}</DialogTitle>
          <DialogDescription>
            {hasOwner
              ? `Currently owned by ${currentOwnerName ?? "someone"}. Pick a different workspace member to hand "${gapName}" to.`
              : `Names the person on the hook for "${gapName}". Must be a workspace member, and a person — never a team.`}
          </DialogDescription>
        </DialogHeader>

        <DialogBody className="space-y-4 px-5 py-5 sm:px-7 sm:py-6">
          <div>
            <label className="font-mono text-[8.5px] font-medium tracking-[0.85px] text-ink-4 uppercase">Owner</label>
            {membersLoading ? (
              <SearchableSelectSkeleton className="mt-1.5" />
            ) : (
              <SearchableSelect
                className="mt-1.5"
                options={candidateOptions}
                value={ownerUserId}
                onChange={setOwnerUserId}
                placeholder="Pick a workspace member…"
                emptyText="No active human members found"
              />
            )}
          </div>
        </DialogBody>

        <DialogFooter>
          <div className="flex items-center gap-4">
            <Button type="button" disabled={!ownerUserId || ownerUserId === currentOwnerId || isPending} onClick={confirm}>
              {isPending ? "Saving…" : hasOwner ? "Update owner" : "Assign owner"}
            </Button>
            <button type="button" onClick={() => onOpenChange(false)} className="text-[12px] font-semibold text-ink-3 hover:text-ink">
              Cancel
            </button>
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
