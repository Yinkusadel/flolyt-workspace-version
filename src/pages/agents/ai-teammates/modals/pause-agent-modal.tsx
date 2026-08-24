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
import { AgentDot } from "@/pages/everyday/rooms/actor";
import { TM13_PRESET } from "@/pages/agents/ai-teammates/data";

/** TM13 — "Pause an agent", hardcoded to Product Reason, opened from its row on /ai-teammates. */
export function PauseAgentModal({ open, onOpenChange }: { open: boolean; onOpenChange: (open: boolean) => void }) {
  const preset = TM13_PRESET;
  const [reasonIndex, setReasonIndex] = useState(preset.reasons.findIndex((r) => r.on));

  const confirm = () => {
    onOpenChange(false);
    toast.success(`${preset.agent.name} paused`);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-xl">
        <DialogHeader>
          <DialogTitle>Pause this agent</DialogTitle>
          <DialogDescription>Two of four reasons are refused · and one is uncomfortable</DialogDescription>
        </DialogHeader>

        <DialogBody className="space-y-4 px-5 py-5 sm:px-7 sm:py-6">
          <div className="flex items-center gap-2.5 rounded-panel border border-line bg-paper-2 px-3.5 py-3">
            <AgentDot agent={preset.agent} />
            <div className="min-w-0">
              <p className="text-[12px] font-semibold text-ink">{preset.agent.name}</p>
              <p className="mt-0.5 truncate font-mono text-[9.5px] text-ink-4">{preset.meta}</p>
            </div>
          </div>

          <div>
            <p className="font-mono text-[8.5px] font-medium tracking-[0.85px] text-ink-4 uppercase">Why are you pausing it</p>
            <div className="mt-1.5 space-y-2">
              {preset.reasons.map((reason, i) => (
                <button
                  key={reason.label}
                  type="button"
                  disabled={reason.blocked}
                  onClick={() => setReasonIndex(i)}
                  className={cn(
                    "flex w-full items-start gap-2.5 rounded-panel border px-3.5 py-2.5 text-left transition-colors",
                    reason.blocked
                      ? "cursor-not-allowed border-line bg-paper-2"
                      : reasonIndex === i
                        ? "border-ultra-border bg-ultra-bg"
                        : "border-line bg-paper hover:border-ink-4"
                  )}
                >
                  <span
                    className={cn(
                      "mt-0.5 flex size-3 shrink-0 items-center justify-center rounded-full border text-[8px]",
                      reason.blocked
                        ? "border-rose-border text-rose"
                        : reasonIndex === i
                          ? "border-ultra bg-ultra"
                          : "border-line bg-paper"
                    )}
                    aria-hidden
                  >
                    {reason.blocked ? "✕" : null}
                  </span>
                  <span className="min-w-0">
                    <span className={cn("block text-[11.5px] font-semibold", reason.blocked ? "text-ink-4" : "text-ink")}>{reason.label}</span>
                    <span className="mt-0.5 block text-[9.5px] text-ink-4">{reason.sub}</span>
                  </span>
                </button>
              ))}
            </div>
          </div>

          <div className="rounded-card border border-rose-border bg-rose-bg p-3.5">
            <p className="text-[12px] font-semibold text-ink">{preset.warningTitle}</p>
            <p className="mt-1.5 text-[10.5px] leading-relaxed text-rose">{preset.warningBody}</p>
          </div>

          <div className="rounded-card border border-amber-border bg-amber-bg p-3.5">
            <p className="text-[12px] font-semibold text-ink">Pausing stops it everywhere, and it is still the right control to have</p>
            <p className="mt-1.5 text-[10.5px] leading-relaxed text-ink-2">
              It stops in every room, on every stage, immediately. Nobody is prevented from doing this — the reason
              is typed, kept, and shown on the roster next to the agent for as long as it stays paused, which is
              usually enough to make somebody assign an owner instead.
            </p>
          </div>
        </DialogBody>

        <DialogFooter>
          <div className="flex items-center gap-4">
            <Button type="button" onClick={confirm}>
              Pause it
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
