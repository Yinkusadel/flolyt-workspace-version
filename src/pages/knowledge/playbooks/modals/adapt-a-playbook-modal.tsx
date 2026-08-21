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
import { PB12_PRESET } from "@/pages/knowledge/playbooks/data";

/** PB12 — "Adapt a playbook", hardcoded to "Retry cards at 09:00 · adapt for Ghana". */
export function AdaptAPlaybookModal({ open, onOpenChange }: { open: boolean; onOpenChange: (open: boolean) => void }) {
  const preset = PB12_PRESET;

  const confirm = () => {
    onOpenChange(false);
    toast.success("Forked · Retry at payday +1 · Kenya, 0 runs");
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-xl">
        <DialogHeader>
          <DialogTitle>Adapt this playbook</DialogTitle>
          <DialogDescription>Changing the method forks it · the track record does not come with it</DialogDescription>
        </DialogHeader>

        <DialogBody className="space-y-4 px-5 py-5 sm:px-7 sm:py-6">
          <div className="rounded-panel border border-line bg-paper-2 px-3.5 py-3">
            <p className="text-[12px] font-semibold text-ink">{preset.subject}</p>
            <p className="mt-1 font-mono text-[9.5px] text-ink-4">{preset.subjectDetail}</p>
          </div>

          <div>
            <p className="font-mono text-[8.5px] font-medium tracking-[0.85px] text-ink-4 uppercase">What you are changing</p>
            <div className="mt-1.5 space-y-2">
              {preset.changeRows.map((row) => (
                <div
                  key={row.label}
                  className={cn(
                    "flex items-center gap-3 rounded-panel border px-3.5 py-3",
                    row.blocked
                      ? "border-line bg-paper-2"
                      : row.selected
                        ? "border-ultra-border bg-ultra-bg"
                        : "border-line bg-paper"
                  )}
                >
                  {row.blocked ? (
                    <span className="flex size-3 shrink-0 items-center justify-center text-[10px] text-rose">✕</span>
                  ) : (
                    <span
                      className={cn(
                        "size-3 shrink-0 rounded-full border",
                        row.selected ? "border-ultra bg-ultra" : "border-line bg-paper"
                      )}
                      aria-hidden
                    />
                  )}
                  <div>
                    <p className={cn("text-[11.5px] font-semibold", row.blocked ? "text-ink-4" : "text-ink")}>{row.label}</p>
                    <p className="mt-0.5 text-[9.5px] text-ink-4">{row.sub}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="rounded-card border border-rose-border bg-rose-bg p-3.5">
            <p className="text-[12px] font-semibold text-ink">{preset.warningTitle}</p>
            <p className="mt-1.5 text-[10.5px] leading-relaxed text-rose">{preset.warningBody}</p>
          </div>

          <p className="text-[10.5px] leading-relaxed text-ink-3">{preset.closingNote}</p>
        </DialogBody>

        <DialogFooter>
          <div className="flex items-center gap-4">
            <Button type="button" onClick={confirm}>
              Fork it for Ghana
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
