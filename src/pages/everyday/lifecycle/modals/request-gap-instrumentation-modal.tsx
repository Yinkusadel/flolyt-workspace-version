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
import useCreateInstrumentationRequest from "@/features/lifecycle/use-create-instrumentation-request";
import type { InstrumentationGapDto } from "@/services/api/lifecycle/get-instrumentation";

/**
 * Raises `POST /instrumentation-requests` for one specific gap from the workspace-wide
 * `GET /lifecycle/instrumentation` list — replaces the old per-stage static-preset modal
 * (`stage/modals/request-instrumentation-modal.tsx`, deleted 2026-09-06 along with its two
 * unwired consumers, Adopt's Blind Spots tab and Expand's Basket tab). `requiredEventSchemas`/
 * `blocks` come straight off the gap the backend already identified — only the deadline needs
 * typing.
 */
export function RequestGapInstrumentationModal({
  gap,
  open,
  onOpenChange,
}: {
  gap: InstrumentationGapDto | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}) {
  const [neededBy, setNeededBy] = useState("");
  const { raiseRequest, isPending } = useCreateInstrumentationRequest({ onSuccess: () => onOpenChange(false) });

  useEffect(() => {
    if (open) setNeededBy("");
  }, [open, gap]);

  const submit = () => {
    if (!gap || !neededBy) return;
    raiseRequest({
      gap: gap.gap,
      gapKey: gap.gapKey,
      neededByUtc: new Date(`${neededBy}T00:00:00Z`).toISOString(),
      blocks: gap.blocks.length > 0 ? gap.blocks : null,
      ownerUserId: null,
      requiredEventSchemas: gap.requiredEventSchemas.length > 0 ? gap.requiredEventSchemas : null,
    });
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-xl">
        <DialogHeader>
          <DialogTitle>Request instrumentation</DialogTitle>
          <DialogDescription>Sends to Engineering as an obligation, with an owner, a date and a state.</DialogDescription>
        </DialogHeader>

        {gap && (
          <DialogBody className="space-y-4 px-5 py-5 sm:px-7 sm:py-6">
            <div className="rounded-panel border border-amber-border bg-amber-bg px-3.5 py-2.5">
              <p className="text-[12px] font-semibold text-ink">{gap.name}</p>
              <p className="mt-0.5 text-[9px] text-amber">{gap.gap}</p>
            </div>

            {gap.wouldUnlock && (
              <div>
                <p className="font-mono text-[8.5px] font-medium tracking-[0.85px] text-ink-4 uppercase">Would unlock</p>
                <p className="mt-1.5 text-[11.5px] text-ink-2">{gap.wouldUnlock}</p>
              </div>
            )}

            {gap.requiredEventSchemas.length > 0 && (
              <div>
                <p className="font-mono text-[8.5px] font-medium tracking-[0.85px] text-ink-4 uppercase">What Flolyt needs</p>
                <div className="mt-1.5 space-y-1.5">
                  {gap.requiredEventSchemas.map((schema) => (
                    <div key={schema} className="rounded-panel border border-line bg-paper-2 px-3.5 py-2">
                      <p className="font-mono text-[11px] font-semibold text-ink">{schema}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            <div>
              <label className="font-mono text-[8.5px] font-medium tracking-[0.85px] text-ink-4 uppercase">Needed by</label>
              <Input type="date" className="mt-1.5" value={neededBy} onChange={(e) => setNeededBy(e.currentTarget.value)} min={new Date().toISOString().slice(0, 10)} />
            </div>
          </DialogBody>
        )}

        <DialogFooter>
          <div className="flex items-center gap-4">
            <Button type="button" onClick={submit} disabled={isPending || !neededBy}>
              {isPending ? "Sending…" : "Send to Engineering"}
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
