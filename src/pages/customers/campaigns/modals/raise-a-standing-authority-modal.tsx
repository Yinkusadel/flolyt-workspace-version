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
import { CP14_STANDING_PRESET } from "@/pages/customers/campaigns/data";

/** CP14 — "Raise a standing authority", hardcoded to Ada's reactivation grant. Opens from the Waiting route. */
export function RaiseAStandingAuthorityModal({ open, onOpenChange }: { open: boolean; onOpenChange: (open: boolean) => void }) {
  const preset = CP14_STANDING_PRESET;

  const confirm = () => {
    onOpenChange(false);
    toast.success("Standing authority raised to 60,000 · wave three can now be approved");
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-xl">
        <DialogHeader>
          <DialogTitle>Raise your standing authority</DialogTitle>
          <DialogDescription>One number moves · scope, count and expiry do not</DialogDescription>
        </DialogHeader>

        <DialogBody className="space-y-4 px-5 py-5 sm:px-7 sm:py-6">
          <div className="rounded-panel border border-line bg-paper-2 px-3.5 py-3">
            <p className="text-[12px] font-semibold text-ink">{preset.subject}</p>
            <p className="mt-1 font-mono text-[9.5px] text-ink-4">{preset.subjectDetail}</p>
          </div>

          <div>
            <p className="font-mono text-[8.5px] font-medium tracking-[0.85px] text-ink-4 uppercase">Raising the ceiling</p>
            <div className="mt-1.5 flex items-center justify-between rounded-panel border border-line bg-white px-4 py-3">
              <p className="text-[13px] font-semibold text-ink">{preset.ceilingLabel}</p>
              <p className="font-mono text-[10px] text-ink-4">{preset.ceilingWas}</p>
            </div>
          </div>

          <div>
            <p className="font-mono text-[8.5px] font-medium tracking-[0.85px] text-ink-4 uppercase">What else stays exactly as it is</p>
            <div className="mt-1.5 space-y-2">
              {preset.unchanged.map((row) => (
                <div key={row.label} className="flex items-center justify-between rounded-panel border border-line bg-paper px-3.5 py-2.5">
                  <p className="text-[11px] font-semibold text-ink">{row.label}</p>
                  <p className="text-right text-[9.5px] text-ink-4">{row.value}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="rounded-card border border-ultra-border bg-ultra-bg p-3.5">
            <p className="text-[12px] font-semibold text-ink">A standing authority is the answer to a queue and it is not a permission level</p>
            <p className="mt-1.5 text-[10.5px] leading-relaxed text-ink-2">{preset.closingNote}</p>
          </div>
        </DialogBody>

        <DialogFooter>
          <div className="flex items-center gap-4">
            <Button type="button" onClick={confirm}>
              Raise to 60,000
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
