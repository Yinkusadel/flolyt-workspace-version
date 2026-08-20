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
import { AT10_PRESET } from "@/pages/revenue/attribution/data";

/** AT10 — "Mark it unattributable", hardcoded to the Accra reactivation row, opened from /attribution/unattributable. */
export function MarkUnattributableModal({ open, onOpenChange }: { open: boolean; onOpenChange: (open: boolean) => void }) {
  const preset = AT10_PRESET;
  const [avoidableIndex, setAvoidableIndex] = useState(preset.avoidable.findIndex((a) => a.on));

  const confirm = () => {
    onOpenChange(false);
    toast.success("Marked unattributable");
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-xl">
        <DialogHeader>
          <DialogTitle>Mark it unattributable</DialogTitle>
          <DialogDescription>It stays in the ledger · what changes is whether a rule is written</DialogDescription>
        </DialogHeader>

        <DialogBody className="space-y-4 px-5 py-5 sm:px-7 sm:py-6">
          <div className="rounded-panel border border-line bg-paper-2 px-3.5 py-3">
            <p className="text-[12px] font-semibold text-ink">{preset.subject}</p>
            <p className="mt-1 font-mono text-[9.5px] text-ink-4">{preset.subjectDetail}</p>
          </div>

          <div>
            <p className="font-mono text-[8.5px] font-medium tracking-[0.85px] text-ink-4 uppercase">Why it cannot be attributed · typed, not picked</p>
            <div className="mt-1.5 rounded-panel border border-line bg-white px-3.5 py-2.5">
              <p className="text-[10.5px] leading-relaxed text-ink-2">{preset.reason}</p>
            </div>
          </div>

          <div>
            <p className="font-mono text-[8.5px] font-medium tracking-[0.85px] text-ink-4 uppercase">And was it avoidable?</p>
            <div className="mt-1.5 space-y-2">
              {preset.avoidable.map((option, i) => (
                <button
                  key={option.label}
                  type="button"
                  onClick={() => setAvoidableIndex(i)}
                  className={cn(
                    "flex w-full items-start gap-2.5 rounded-panel border px-3.5 py-2.5 text-left transition-colors",
                    avoidableIndex === i ? "border-ultra-border bg-ultra-bg" : "border-line bg-paper hover:border-ink-4"
                  )}
                >
                  <span
                    className={cn(
                      "mt-0.5 size-3 shrink-0 rounded-full border",
                      avoidableIndex === i ? "border-ultra bg-ultra" : "border-line bg-paper"
                    )}
                    aria-hidden
                  />
                  <span className="min-w-0">
                    <span className="block text-[11.5px] font-semibold text-ink">{option.label}</span>
                    <span className="mt-0.5 block text-[9.5px] text-ink-4">{option.sub}</span>
                  </span>
                </button>
              ))}
            </div>
          </div>

          <div className="rounded-card border border-amber-border bg-amber-bg p-3.5">
            <p className="text-[12px] font-semibold text-ink">Unattributable is a value, and the avoidability question is the useful half</p>
            <p className="mt-1.5 text-[10.5px] leading-relaxed text-ink-2">
              The money stays in the ledger either way. What changes is whether a rule gets written — three of the
              four rows on this list produced one, and the fourth is the refund nobody should have withheld.
              Without the question, all four look like the same failure.
            </p>
          </div>
        </DialogBody>

        <DialogFooter>
          <div className="flex items-center gap-4">
            <Button type="button" onClick={confirm}>
              Mark unattributable
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
