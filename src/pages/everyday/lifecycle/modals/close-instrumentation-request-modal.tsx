import { useEffect, useState } from "react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Dialog,
  DialogBody,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import useCloseInstrumentationRequest from "@/features/lifecycle/use-close-instrumentation-request";

/**
 * Closes an already-raised instrumentation request — `POST /instrumentation-requests/{obligationId}/close`.
 * `resolved: true` (delivered) needs nothing else; `resolved: false` (withdrawn) requires a note,
 * per the endpoint's own note: a withdrawal with no reason just invites the next person to raise
 * the identical request again.
 */
export function CloseInstrumentationRequestModal({
  obligationId,
  gapName,
  resolved,
  open,
  onOpenChange,
}: {
  obligationId: string | null;
  gapName: string;
  /** true = mark delivered, false = withdraw */
  resolved: boolean;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}) {
  const [note, setNote] = useState("");
  const { closeRequest, isPending } = useCloseInstrumentationRequest({ onSuccess: () => onOpenChange(false) });

  useEffect(() => {
    if (open) setNote("");
  }, [open]);

  const needsNote = !resolved;
  const canSubmit = !!obligationId && (!needsNote || note.trim().length > 0);

  const confirm = () => {
    if (!obligationId || !canSubmit) return;
    closeRequest({ obligationId, resolved, note: needsNote ? note.trim() : null });
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>{resolved ? "Mark this request delivered" : "Withdraw this request"}</DialogTitle>
          <DialogDescription>
            {resolved
              ? `"${gapName}" will be recorded as delivered.`
              : `"${gapName}" will be withdrawn. Say why, so the next person doesn't just raise it again.`}
          </DialogDescription>
        </DialogHeader>

        {needsNote && (
          <DialogBody className="px-5 py-5 sm:px-7 sm:py-6">
            <label className="font-mono text-[8.5px] font-medium tracking-[0.85px] text-ink-4 uppercase">Reason</label>
            <Input className="mt-1.5" value={note} onChange={(e) => setNote(e.currentTarget.value)} placeholder="e.g. no longer needed, covered by a different source" />
          </DialogBody>
        )}

        <DialogFooter>
          <div className="flex items-center gap-4">
            <Button type="button" disabled={!canSubmit || isPending} onClick={confirm}>
              {isPending ? "Saving…" : resolved ? "Mark delivered" : "Withdraw"}
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
