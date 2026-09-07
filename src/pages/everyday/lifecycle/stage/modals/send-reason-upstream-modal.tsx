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
import { resolveStageKey } from "@/pages/everyday/lifecycle/data";
import { formatCount, formatPercent } from "@/pages/everyday/lifecycle/format-measured-value";
import useRouteChurnUpstream from "@/features/lifecycle/use-route-churn-upstream";
import type { ChurnReasonDto } from "@/services/api/lifecycle/get-churn-reasons";

/**
 * Replaces the deleted CH12 `SendReasonUpstreamModal` — the old design sent to a named person,
 * but `POST /churn/route-upstream` routes to a **stage** (`targetStageKey`), so there's no
 * recipient list here, just the resolved destination stage and an optional note. Evidence
 * attachment and target-stage-owner awareness are deliberately out of scope for this pass — see
 * the Churn route-upstream memory doc for why.
 */
export function SendReasonUpstreamModal({
  reason,
  open,
  onOpenChange,
}: {
  reason: ChurnReasonDto | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}) {
  const [note, setNote] = useState("");
  const { routeUpstream, isPending } = useRouteChurnUpstream({ onSuccess: () => onOpenChange(false) });

  useEffect(() => {
    if (open) setNote("");
  }, [open, reason]);

  const destination = reason?.upstreamStage ? resolveStageKey(reason.upstreamStage) : null;

  const submit = () => {
    if (!reason || !destination) return;
    routeUpstream({
      causeKey: reason.key,
      targetStageKey: destination.key,
      evidence: null,
      note: note.trim() || null,
    });
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-xl">
        <DialogHeader>
          <DialogTitle>Send upstream</DialogTitle>
          <DialogDescription>Churn records the loss — this sends the cause to the stage that actually caused it.</DialogDescription>
        </DialogHeader>

        {reason && (
          <DialogBody className="space-y-4 px-5 py-5 sm:px-7 sm:py-6">
            <div className="rounded-panel border border-line bg-paper px-3.5 py-2.5">
              <p className="font-mono text-[8.5px] font-medium tracking-[0.85px] text-ink-4 uppercase">Finding</p>
              <p className="mt-1.5 text-[12px] font-semibold text-ink">{reason.label}</p>
              <p className="mt-0.5 font-mono text-[9.5px] text-ink-4">
                {reason.customers !== null ? `${formatCount(reason.customers)} customers` : "Customer count unavailable"}
                {reason.share !== null ? ` · ${formatPercent(reason.share)} of lapsed customers` : ""}
              </p>
            </div>

            <div>
              <p className="font-mono text-[8.5px] font-medium tracking-[0.85px] text-ink-4 uppercase">Sends to</p>
              {destination ? (
                <div className="mt-1.5 rounded-panel border border-ultra-border bg-ultra-bg px-3.5 py-2.5">
                  <p className="text-[12.5px] font-semibold text-ultra">{destination.name}</p>
                </div>
              ) : (
                <div className="mt-1.5 rounded-panel border border-rose-border bg-rose-bg/40 px-3.5 py-2.5">
                  <p className="text-[11.5px] text-rose">
                    Couldn't match "{reason.upstreamStage}" to a known stage — this can't be sent yet.
                  </p>
                </div>
              )}
            </div>

            <div>
              <p className="font-mono text-[8.5px] font-medium tracking-[0.85px] text-ink-4 uppercase">Note (optional)</p>
              <textarea
                value={note}
                onChange={(e) => setNote(e.currentTarget.value)}
                rows={3}
                placeholder="Anything the receiving stage should know"
                className="mt-1.5 w-full resize-none rounded-panel border border-line bg-paper px-3.5 py-2.5 text-[11.5px] text-ink outline-none focus:border-ultra-border"
              />
            </div>
          </DialogBody>
        )}

        <DialogFooter>
          <div className="flex items-center gap-4">
            <Button type="button" onClick={submit} disabled={isPending || !destination}>
              {isPending ? "Sending…" : "Send upstream"}
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
