import { useState } from "react";
import { toast } from "sonner";

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
import { cn } from "@/lib/utils";
import { VL16_PRESET } from "@/pages/revenue/value/data";

/** VL16 — "Close a room with no number", hardcoded to Weekend push fatigue · Kenya, opened from /value?by=room. */
export function CloseARoomModal({ open, onOpenChange }: { open: boolean; onOpenChange: (open: boolean) => void }) {
  const preset = VL16_PRESET;
  const [reasonIndex, setReasonIndex] = useState(preset.reasons.findIndex((r) => r.on));

  const confirm = () => {
    onOpenChange(false);
    toast.success("Room closed at ₦0");
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-xl">
        <DialogHeader>
          <DialogTitle>Close a room with no number</DialogTitle>
          <DialogDescription>A room that recovered nothing still belongs in the ledger</DialogDescription>
        </DialogHeader>

        <DialogBody className="space-y-4 px-5 py-5 sm:px-7 sm:py-6">
          <div className="rounded-panel border border-line bg-paper-2 px-3.5 py-3">
            <p className="text-[12px] font-semibold text-ink">{preset.subject}</p>
            <p className="mt-1 font-mono text-[9.5px] text-ink-4">{preset.subjectDetail}</p>
          </div>

          <div>
            <p className="font-mono text-[8.5px] font-medium tracking-[0.85px] text-ink-4 uppercase">Why is it closing</p>
            <div className="mt-1.5 space-y-2">
              {preset.reasons.map((reason, i) => (
                <button
                  key={reason.label}
                  type="button"
                  onClick={() => setReasonIndex(i)}
                  className={cn(
                    "flex w-full items-start gap-2.5 rounded-panel border px-3.5 py-2.5 text-left transition-colors",
                    reasonIndex === i ? "border-ultra-border bg-ultra-bg" : "border-line bg-paper hover:border-ink-4"
                  )}
                >
                  <span
                    className={cn(
                      "mt-0.5 size-3 shrink-0 rounded-full border",
                      reasonIndex === i ? "border-ultra bg-ultra" : "border-line bg-paper"
                    )}
                    aria-hidden
                  />
                  <span className="min-w-0">
                    <span className="block text-[11.5px] font-semibold text-ink">{reason.label}</span>
                    <span className="mt-0.5 block text-[9.5px] text-ink-4">{reason.sub}</span>
                  </span>
                </button>
              ))}
            </div>
          </div>

          <div className="rounded-card border border-ultra-border bg-ultra-bg p-3.5">
            <p className="text-[12px] font-semibold text-ink">Closing this records that nothing worked, and that is worth recording</p>
            <p className="mt-1.5 text-[10.5px] leading-relaxed text-ultra">
              Fifteen rooms have closed this way. They appear in the ledger at ₦0 with a reason, so the next person
              who sees unsubscribes rise in Kenya finds out it resolved itself last time.
            </p>
          </div>

          <div className="rounded-card border border-line bg-paper p-3.5">
            <p className="text-[12px] font-semibold text-ink">Nothing closes on age and nothing closes itself</p>
            <p className="mt-1.5 text-[10.5px] leading-relaxed text-ink-2">
              This room has been open 41 days and no timer is running. A workspace that auto-closed quiet rooms
              would clear its own backlog and lose the fifteen most useful sentences in the ledger — the ones that
              say a thing was looked at and turned out to be nothing.
            </p>
          </div>
        </DialogBody>

        <DialogFooter>
          <div className="flex items-center gap-4">
            <Button type="button" onClick={confirm}>
              Close at ₦0
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
