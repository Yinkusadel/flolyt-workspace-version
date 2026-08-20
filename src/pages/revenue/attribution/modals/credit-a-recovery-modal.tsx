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
import { AT09_PRESET } from "@/pages/revenue/attribution/data";

/** AT09 — "Credit a recovery", hardcoded to the Kenya retry window holdout, opened from its row on /attribution/holdouts. */
export function CreditARecoveryModal({ open, onOpenChange }: { open: boolean; onOpenChange: (open: boolean) => void }) {
  const preset = AT09_PRESET;
  const [methodIndex, setMethodIndex] = useState(preset.methods.findIndex((m) => m.on));

  const confirm = () => {
    onOpenChange(false);
    toast.success(`Credited ${preset.amount} to ${preset.creditedTo}`);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-xl">
        <DialogHeader>
          <DialogTitle>Credit a recovery</DialogTitle>
          <DialogDescription>Two of four methods are unavailable and one never is</DialogDescription>
        </DialogHeader>

        <DialogBody className="space-y-4 px-5 py-5 sm:px-7 sm:py-6">
          <div className="rounded-panel border border-line bg-paper-2 px-3.5 py-3">
            <p className="text-[12px] font-semibold text-ink">{preset.subject}</p>
            <p className="mt-1 font-mono text-[9.5px] text-ink-4">{preset.subjectDetail}</p>
          </div>

          <div>
            <p className="font-mono text-[8.5px] font-medium tracking-[0.85px] text-ink-4 uppercase">How was it measured</p>
            <div className="mt-1.5 space-y-2">
              {preset.methods.map((method, i) => (
                <button
                  key={method.label}
                  type="button"
                  disabled={method.blocked}
                  onClick={() => setMethodIndex(i)}
                  className={cn(
                    "flex w-full items-start gap-2.5 rounded-panel border px-3.5 py-2.5 text-left transition-colors",
                    method.blocked
                      ? "cursor-not-allowed border-line bg-paper-2"
                      : methodIndex === i
                        ? "border-ultra-border bg-ultra-bg"
                        : "border-line bg-paper hover:border-ink-4"
                  )}
                >
                  <span
                    className={cn(
                      "mt-0.5 flex size-3 shrink-0 items-center justify-center rounded-full border text-[8px]",
                      method.blocked
                        ? "border-rose-border text-rose"
                        : methodIndex === i
                          ? "border-ultra bg-ultra"
                          : "border-line bg-paper"
                    )}
                    aria-hidden
                  >
                    {method.blocked ? "✕" : null}
                  </span>
                  <span className="min-w-0">
                    <span className={cn("block text-[11.5px] font-semibold", method.blocked ? "text-ink-4" : "text-ink")}>{method.label}</span>
                    <span className="mt-0.5 block text-[9.5px] text-ink-4">{method.sub}</span>
                  </span>
                </button>
              ))}
            </div>
          </div>

          <div>
            <p className="font-mono text-[8.5px] font-medium tracking-[0.85px] text-ink-4 uppercase">Credited to · one thing, and it is a metric</p>
            <div className="mt-1.5 flex items-center justify-between rounded-panel border border-line bg-white px-3.5 py-2.5">
              <span className="text-[11.5px] font-semibold text-ink">{preset.creditedTo}</span>
              <span className="font-mono text-[9.5px] text-ink-4">{preset.creditedToMeta}</span>
            </div>
          </div>

          <div className="rounded-card border border-amber-border bg-amber-bg p-3.5">
            <p className="text-[12px] font-semibold text-ink">This overlaps the Nairobi dunning room and the overlap is subtracted</p>
            <p className="mt-1.5 text-[10.5px] leading-relaxed text-amber">{preset.overlapWarning}</p>
          </div>

          <div className="rounded-card border border-teal-border bg-teal-bg p-3.5">
            <p className="text-[12px] font-semibold text-ink">Recovery is credited once, to a metric, never to a person</p>
            <p className="mt-1.5 text-[10.5px] leading-relaxed text-ink-2">
              There is no leaderboard behind this field and no way to type a name into it. Crediting recovery to
              people turns the ledger into a performance record, and a performance record is the one thing nobody
              will ever mark unattributable on.
            </p>
          </div>
        </DialogBody>

        <DialogFooter>
          <div className="flex items-center gap-4">
            <Button type="button" onClick={confirm}>
              Credit {preset.amount}
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
