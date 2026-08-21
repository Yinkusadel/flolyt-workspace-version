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
import { RP10_EVIDENCE_PRESET } from "@/pages/customers/replies/data";

/** RP10 — "Make it evidence", hardcoded to the "Too many messages" theme. Opens from the Themes tab. */
export function MakeItEvidenceModal({ open, onOpenChange }: { open: boolean; onOpenChange: (open: boolean) => void }) {
  const preset = RP10_EVIDENCE_PRESET;

  const confirm = () => {
    onOpenChange(false);
    toast.success("Attached to the Retain room, as evidence");
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-xl">
        <DialogHeader>
          <DialogTitle>Use this theme</DialogTitle>
          <DialogDescription>Evidence for a room · never a finding on its own</DialogDescription>
        </DialogHeader>

        <DialogBody className="space-y-4 px-5 py-5 sm:px-7 sm:py-6">
          <div className="rounded-panel border border-line bg-paper-2 px-3.5 py-3">
            <p className="text-[12px] font-semibold text-ink">{preset.subject}</p>
            <p className="mt-1 font-mono text-[9.5px] text-ink-4">{preset.subjectDetail}</p>
          </div>

          <div>
            <p className="font-mono text-[8.5px] font-medium tracking-[0.85px] text-ink-4 uppercase">What this can become</p>
            <div className="mt-1.5 space-y-2">
              {preset.options.map((option) => (
                <div
                  key={option.label}
                  className={cn(
                    "flex items-center gap-3 rounded-panel border px-3.5 py-3",
                    option.blocked
                      ? "border-line bg-paper-2"
                      : option.on
                        ? "border-ultra-border bg-ultra-bg"
                        : "border-line bg-paper"
                  )}
                >
                  {option.blocked ? (
                    <span className="flex size-3 shrink-0 items-center justify-center text-[10px] text-rose">✕</span>
                  ) : (
                    <span
                      className={cn(
                        "size-3 shrink-0 rounded-full border",
                        option.on ? "border-ultra bg-ultra" : "border-line bg-paper"
                      )}
                      aria-hidden
                    />
                  )}
                  <div>
                    <p className={cn("text-[11.5px] font-semibold", option.blocked ? "text-ink-4" : "text-ink")}>{option.label}</p>
                    <p className="mt-0.5 text-[9.5px] text-ink-4">{option.sub}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="rounded-card border border-amber-border bg-amber-bg p-3.5">
            <p className="text-[12px] font-semibold text-ink">{preset.warningTitle}</p>
            <p className="mt-1.5 text-[10.5px] leading-relaxed text-amber">{preset.warningBody}</p>
          </div>

          <div className="rounded-card border border-ultra-border bg-ultra-bg p-3.5">
            <p className="text-[12px] font-semibold text-ink">Replies are the least representative data in the workspace and the earliest</p>
            <p className="mt-1.5 text-[10.5px] leading-relaxed text-ink-2">{preset.closingNote}</p>
          </div>
        </DialogBody>

        <DialogFooter>
          <div className="flex items-center gap-4">
            <Button type="button" onClick={confirm}>
              Attach to the Retain room
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
