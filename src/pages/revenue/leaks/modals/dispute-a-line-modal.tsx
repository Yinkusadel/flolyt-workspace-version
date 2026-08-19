import { useState } from "react";
import { toast } from "sonner";

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
import { cn } from "@/lib/utils";
import { LK15_DISPUTE_PRESET } from "@/pages/revenue/leaks/data";

/** LK15 — "Dispute a line", hardcoded to Price's ₦31M discount-only-buyers finding, opened from the map's Price row. */
export function DisputeALineModal({ open, onOpenChange }: { open: boolean; onOpenChange: (open: boolean) => void }) {
  const preset = LK15_DISPUTE_PRESET;
  const [optionIndex, setOptionIndex] = useState(preset.options.findIndex((o) => o.selected));

  const confirm = () => {
    onOpenChange(false);
    toast.success("Dispute recorded");
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-xl">
        <DialogHeader>
          <DialogTitle>Dispute this line</DialogTitle>
          <DialogDescription>Disagreement is recorded and kept, not resolved by seniority</DialogDescription>
        </DialogHeader>

        <DialogBody className="space-y-4 px-5 py-5 sm:px-7 sm:py-6">
          <div className="rounded-panel border border-line bg-paper-2 px-3.5 py-3">
            <p className="text-[12px] font-semibold text-ink">{preset.subject}</p>
            <p className="mt-1 font-mono text-[9.5px] text-ink-4">{preset.subjectDetail}</p>
          </div>

          <div>
            <p className="font-mono text-[8.5px] font-medium tracking-[0.85px] text-ink-4 uppercase">What you are disputing</p>
            <div className="mt-1.5 space-y-2">
              {preset.options.map((option, i) => (
                <button
                  key={option.title}
                  type="button"
                  onClick={() => setOptionIndex(i)}
                  className={cn(
                    "flex w-full items-start gap-2.5 rounded-panel border px-3.5 py-2.5 text-left transition-colors",
                    optionIndex === i ? "border-ultra-border bg-ultra-bg" : "border-line bg-paper hover:border-ink-4"
                  )}
                >
                  <span
                    className={cn("mt-0.5 size-3 shrink-0 rounded-full border", optionIndex === i ? "border-ultra bg-ultra" : "border-line bg-paper")}
                    aria-hidden
                  />
                  <span className="min-w-0">
                    <span className="block text-[11.5px] font-semibold text-ink">{option.title}</span>
                    <span className="mt-0.5 block text-[9.5px] text-ink-4">{option.body}</span>
                  </span>
                </button>
              ))}
            </div>
          </div>

          <div>
            <p className="font-mono text-[8.5px] font-medium tracking-[0.85px] text-ink-4 uppercase">Your argument · typed, and it is kept</p>
            <div className="mt-1.5 rounded-panel border border-line bg-white px-3.5 py-2.5">
              <p className="text-[10.5px] leading-relaxed text-ink-2">{preset.argument}</p>
            </div>
          </div>

          <div className="rounded-panel border border-ultra-border bg-ultra-bg px-3.5 py-3">
            <p className="text-[11px] font-semibold text-ink">{preset.whileOpenTitle}</p>
            <p className="mt-1.5 text-[9.5px] font-semibold leading-relaxed text-ultra">{preset.whileOpenBody}</p>
          </div>

          <div className="rounded-card border border-amber-border bg-amber-bg p-3.5">
            <p className="text-[12px] font-semibold text-ink">The Orchestrator will not average your view and the agent's</p>
            <p className="mt-1.5 text-[10.5px] leading-relaxed text-ink-2">{preset.closingNote}</p>
          </div>
        </DialogBody>

        <DialogFooter>
          <div className="flex items-center gap-4">
            <Button type="button" onClick={confirm}>
              Record the dispute
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
