import { useEffect, useState } from "react";
import { X } from "lucide-react";

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
 * unwired consumers, Adopt's Blind Spots tab and Expand's Basket tab). `blocks` comes straight
 * off the gap the backend already identified. `requiredEventSchemas` was originally treated the
 * same way, but the backend refused a real submission on a gap with none listed ("Name the events
 * being asked for... without them this is a conversation rather than a contract") — so it's now
 * a real, always-required editable field, seeded from the gap's own list when one exists.
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
  const [schemas, setSchemas] = useState<string[]>([""]);
  const { raiseRequest, isPending } = useCreateInstrumentationRequest({ onSuccess: () => onOpenChange(false) });

  useEffect(() => {
    if (open) {
      setNeededBy("");
      setSchemas(gap && gap.requiredEventSchemas.length > 0 ? gap.requiredEventSchemas : [""]);
    }
  }, [open, gap]);

  const cleanedSchemas = schemas.map((s) => s.trim()).filter(Boolean);

  const submit = () => {
    if (!gap || !neededBy || cleanedSchemas.length === 0) return;
    raiseRequest({
      gap: gap.gap,
      gapKey: gap.gapKey,
      // End of the selected day, not the start — "needed by 6 Sept" means by the end of 6 Sept.
      // Sending T00:00:00Z made "today" resolve to a moment already behind the request by the
      // time it reached the server, refused as a past deadline for every date except tomorrow+.
      neededByUtc: new Date(`${neededBy}T23:59:59Z`).toISOString(),
      blocks: gap.blocks.length > 0 ? gap.blocks : null,
      ownerUserId: null,
      requiredEventSchemas: cleanedSchemas,
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

            <div>
              <p className="font-mono text-[8.5px] font-medium tracking-[0.85px] text-ink-4 uppercase">
                What Flolyt needs — name the events an engineer can actually satisfy
              </p>
              <div className="mt-1.5 space-y-1.5">
                {schemas.map((schema, index) => (
                  <div key={index} className="flex items-center gap-1.5">
                    <Input
                      value={schema}
                      onChange={(e) => setSchemas(schemas.map((s, i) => (i === index ? e.currentTarget.value : s)))}
                      placeholder="e.g. loyalty.tier_shown"
                      className="font-mono"
                    />
                    {schemas.length > 1 && (
                      <button
                        type="button"
                        onClick={() => setSchemas(schemas.filter((_, i) => i !== index))}
                        className="shrink-0 rounded-control p-1.5 text-ink-4 hover:bg-paper-2 hover:text-ink"
                        aria-label="Remove event"
                      >
                        <X className="size-3.5" />
                      </button>
                    )}
                  </div>
                ))}
              </div>
              <button
                type="button"
                onClick={() => setSchemas([...schemas, ""])}
                className="mt-1.5 text-[11px] font-semibold text-ultra hover:underline"
              >
                + Add another event
              </button>
            </div>

            <div>
              <label className="font-mono text-[8.5px] font-medium tracking-[0.85px] text-ink-4 uppercase">Needed by</label>
              <Input type="date" className="mt-1.5" value={neededBy} onChange={(e) => setNeededBy(e.currentTarget.value)} min={new Date().toISOString().slice(0, 10)} />
            </div>
          </DialogBody>
        )}

        <DialogFooter>
          <div className="flex items-center gap-4">
            <Button type="button" onClick={submit} disabled={isPending || !neededBy || cleanedSchemas.length === 0}>
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
