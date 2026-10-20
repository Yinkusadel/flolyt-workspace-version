import { useState } from "react";

import { ConfirmModal } from "@/components/confirm-modal";
import useDisableRelationship from "@/features/datasource-relationships/use-disable-relationship";
import { RelationshipApiError } from "@/services/api/datasource-relationships/relationship-error";
import type { RelationshipMapping } from "@/services/api/datasource-relationships/types";

/**
 * POST /{id}/disable (step 6 of docs/datasource-relationships/build-plan.md). A reason is required
 * and is recorded in the audit trail with the actor. Sends the revision the page was showing, so a
 * 409 means the relationship changed underneath and the person should look again before retrying.
 */
export function DisableRelationshipModal({
  open,
  onOpenChange,
  mapping,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  mapping: RelationshipMapping;
}) {
  const [reason, setReason] = useState("");
  const { disableRelationship, isPending, error } = useDisableRelationship({
    onSuccess: () => {
      setReason("");
      onOpenChange(false);
    },
  });

  const apiError = error instanceof RelationshipApiError ? error : null;
  const trimmed = reason.trim();

  return (
    <ConfirmModal
      open={open}
      onOpenChange={(next) => {
        if (!next) setReason("");
        onOpenChange(next);
      }}
      title="Disable this relationship?"
      description="New reads stop using it, and its approval is cleared. Results already published keep their original evidence until they are recomputed. To turn it back on, preview and approve it again."
      confirmLabel="Disable relationship"
      pendingLabel="Disabling..."
      isPending={isPending}
      confirmDisabled={trimmed.length === 0}
      onConfirm={() =>
        disableRelationship({
          id: mapping.id,
          payload: { expectedRevision: mapping.revision, reason: trimmed },
        })
      }
    >
      <label htmlFor="disable-reason" className="text-[11px] text-ink-3">
        Why are you disabling it?
      </label>
      <textarea
        id="disable-reason"
        rows={3}
        value={reason}
        disabled={isPending}
        onChange={(e) => setReason(e.currentTarget.value)}
        placeholder="e.g. The account identifier was replaced"
        className="mt-1.5 w-full resize-y rounded-panel border border-line bg-paper-2 px-2.5 py-2 text-[12.5px] text-ink outline-none placeholder:text-ink-4 focus:border-ring"
      />
      <p className="mt-1 text-[10.5px] text-ink-4">Saved in the audit trail.</p>
      {apiError && (
        <p className="mt-2 text-[11px] text-destructive">
          {apiError.message}
          {apiError.status === 409 ? " Close this, check the latest revision, then try again." : ""}
        </p>
      )}
    </ConfirmModal>
  );
}
