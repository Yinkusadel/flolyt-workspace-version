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
import { LK16_RECLASSIFY_PRESET } from "@/pages/revenue/leakage-map/data";

/** LK16 — "Reclassify a claim", hardcoded to Support's Lagos delivery failures finding, opened from the map's Support row. */
export function ReclassifyAClaimModal({ open, onOpenChange }: { open: boolean; onOpenChange: (open: boolean) => void }) {
  const preset = LK16_RECLASSIFY_PRESET;
  const [optionIndex, setOptionIndex] = useState(preset.options.findIndex((o) => o.selected));

  const confirm = () => {
    onOpenChange(false);
    toast.success("Reclassified to causal");
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-xl">
        <DialogHeader>
          <DialogTitle>Reclassify this claim</DialogTitle>
          <DialogDescription>A person promotes a claim · the agent that raised it never can</DialogDescription>
        </DialogHeader>

        <DialogBody className="space-y-4 px-5 py-5 sm:px-7 sm:py-6">
          <div className="rounded-panel border border-line bg-paper-2 px-3.5 py-3">
            <p className="text-[12px] font-semibold text-ink">{preset.subject}</p>
            <p className="mt-1 font-mono text-[9.5px] text-ink-4">{preset.subjectDetail}</p>
          </div>

          <div>
            <p className="font-mono text-[8.5px] font-medium tracking-[0.85px] text-ink-4 uppercase">Move it to</p>
            <div className="mt-1.5 space-y-2">
              {preset.options.map((option, i) => (
                <button
                  key={option.title}
                  type="button"
                  disabled={option.blocked}
                  onClick={() => setOptionIndex(i)}
                  className={cn(
                    "flex w-full items-start gap-2.5 rounded-panel border px-3.5 py-2.5 text-left transition-colors",
                    option.blocked
                      ? "cursor-not-allowed border-line bg-paper-2"
                      : optionIndex === i
                        ? "border-ultra-border bg-ultra-bg"
                        : "border-line bg-paper hover:border-ink-4"
                  )}
                >
                  <span
                    className={cn(
                      "mt-0.5 flex size-3 shrink-0 items-center justify-center rounded-full border text-[8px]",
                      option.blocked
                        ? "border-rose-border text-rose"
                        : optionIndex === i
                          ? "border-ultra bg-ultra"
                          : "border-line bg-paper"
                    )}
                    aria-hidden
                  >
                    {option.blocked ? "✕" : null}
                  </span>
                  <span className="min-w-0">
                    <span className={cn("block text-[11.5px] font-semibold", option.blocked ? "text-ink-4" : "text-ink")}>{option.title}</span>
                    <span className="mt-0.5 block text-[9.5px] text-ink-4">{option.body}</span>
                  </span>
                </button>
              ))}
            </div>
          </div>

          <div>
            <p className="font-mono text-[8.5px] font-medium tracking-[0.85px] text-ink-4 uppercase">The evidence you are relying on · required</p>
            <div className="mt-1.5 space-y-2">
              {preset.evidence.map((row) => (
                <div key={row.label} className="rounded-panel border border-line bg-paper px-3.5 py-2.5">
                  <p className="text-[11px] font-semibold text-ink">{row.label}</p>
                  <p className="mt-0.5 text-[9.5px] text-ink-4">{row.value}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="rounded-card border border-teal-border bg-teal-bg p-3.5">
            <p className="text-[12px] font-semibold text-ink">Amara can promote this and Support Signal cannot</p>
            <p className="mt-1.5 text-[10.5px] leading-relaxed text-ink-2">{preset.closingNote}</p>
          </div>
        </DialogBody>

        <DialogFooter>
          <div className="flex items-center gap-4">
            <Button type="button" onClick={confirm}>
              Promote to causal
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
