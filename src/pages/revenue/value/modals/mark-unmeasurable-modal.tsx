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
import { VL15_PRESET, VL_TONE_BG_CLASS } from "@/pages/revenue/value/data";

/** VL15 — "Mark it unmeasurable", hardcoded to the Accra reactivation row, opened from /value/unmeasurable. */
export function MarkUnmeasurableModal({ open, onOpenChange }: { open: boolean; onOpenChange: (open: boolean) => void }) {
  const preset = VL15_PRESET;

  const confirm = () => {
    onOpenChange(false);
    toast.success("Marked unmeasurable");
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-xl">
        <DialogHeader>
          <DialogTitle>Mark it unmeasurable</DialogTitle>
          <DialogDescription>It stays on the ledger, it just never enters a total</DialogDescription>
        </DialogHeader>

        <DialogBody className="space-y-4 px-5 py-5 sm:px-7 sm:py-6">
          <div className="rounded-panel border border-line bg-paper-2 px-3.5 py-3">
            <p className="text-[12px] font-semibold text-ink">{preset.subject}</p>
            <p className="mt-1 font-mono text-[9.5px] text-ink-4">{preset.subjectDetail}</p>
          </div>

          <div>
            <p className="font-mono text-[8.5px] font-medium tracking-[0.85px] text-ink-4 uppercase">Why it cannot be measured · typed, not picked</p>
            <div className="mt-1.5 rounded-panel border border-line bg-white px-3.5 py-2.5">
              <p className="text-[10.5px] leading-relaxed text-ink-2">{preset.reason}</p>
            </div>
          </div>

          <div>
            <p className="font-mono text-[8.5px] font-medium tracking-[0.85px] text-ink-4 uppercase">What happens to it</p>
            <div className="mt-1.5 space-y-2">
              {preset.outcomes.map((outcome) => (
                <div key={outcome.label} className="flex items-center gap-3 rounded-panel border border-line bg-paper px-3.5 py-2.5">
                  <span className={`h-full w-0.5 self-stretch rounded-full ${VL_TONE_BG_CLASS[outcome.tone]}`} aria-hidden />
                  <span className="min-w-0">
                    <span className="block text-[11.5px] font-semibold text-ink">{outcome.label}</span>
                    <span className="mt-0.5 block text-[9.5px] text-ink-4">{outcome.sub}</span>
                  </span>
                </div>
              ))}
            </div>
          </div>

          <div className="rounded-card border border-amber-border bg-amber-bg p-3.5">
            <p className="text-[12px] font-semibold text-ink">Unmeasurable is a value, and it is the only honest one here</p>
            <p className="mt-1.5 text-[10.5px] leading-relaxed text-ink-2">
              The alternative is a plausible figure nobody could ever check, sitting in the same column as ₦62M that
              came off a real holdout. One unverifiable row would make every row on this ledger a matter of opinion.
            </p>
          </div>
        </DialogBody>

        <DialogFooter>
          <div className="flex items-center gap-4">
            <Button type="button" onClick={confirm}>
              Mark it unmeasurable
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
