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
import { SC11_PRESET, SC_TONE_CLASS } from "@/pages/revenue/scenario/data";

/** SC11 — "Change an assumption", hardcoded to S-114's weakest input ("it returns over 9 weeks"), opened from the S-114 detail page. */
export function ChangeAnAssumptionModal({ open, onOpenChange }: { open: boolean; onOpenChange: (open: boolean) => void }) {
  const preset = SC11_PRESET;

  const confirm = () => {
    onOpenChange(false);
    toast.success(`Assumption changed · range narrows to ${preset.rangeEffect[0].after} – ${preset.rangeEffect[1].after}`);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-xl">
        <DialogHeader>
          <DialogTitle>Change an assumption</DialogTitle>
          <DialogDescription>The range moves, and your name and reason move with it</DialogDescription>
        </DialogHeader>

        <DialogBody className="space-y-4 px-5 py-5 sm:px-7 sm:py-6">
          <div className="rounded-panel border border-line bg-paper-2 px-3.5 py-3">
            <p className="text-[12px] font-semibold text-ink">{preset.current}</p>
            <p className="mt-1 font-mono text-[9.5px] text-ink-4">{preset.currentMeta}</p>
          </div>

          <div>
            <p className="font-mono text-[8.5px] font-medium tracking-[0.85px] text-ink-4 uppercase">Change it to</p>
            <div className="mt-1.5 flex items-center justify-between rounded-panel border border-line bg-white px-4 py-3">
              <span className="text-[14px] font-semibold text-ink">{preset.proposed}</span>
              <span className="font-mono text-[10px] text-ink-4">{preset.was}</span>
            </div>
          </div>

          <div>
            <p className="font-mono text-[8.5px] font-medium tracking-[0.85px] text-ink-4 uppercase">What this does to the range</p>
            <div className="mt-1.5 space-y-1.5">
              {preset.rangeEffect.map((row) => (
                <div key={row.label} className="flex items-center justify-between rounded-panel border border-line bg-paper px-3.5 py-2">
                  <span className="text-[11px] font-semibold text-ink">{row.label}</span>
                  <span className="flex items-center gap-2 font-mono text-[10.5px]">
                    <span className="text-ink-4">{row.before}</span>
                    <span className="text-ink-4">→</span>
                    <span className={`font-semibold ${SC_TONE_CLASS[row.tone]}`}>{row.after}</span>
                  </span>
                </div>
              ))}
            </div>
          </div>

          <div>
            <p className="font-mono text-[8.5px] font-medium tracking-[0.85px] text-ink-4 uppercase">Why · typed, and it stays on the scenario</p>
            <div className="mt-1.5 rounded-panel border border-line bg-white px-3.5 py-2.5">
              <p className="text-[10.5px] leading-relaxed text-ink-2">{preset.reason}</p>
            </div>
          </div>

          <div className="rounded-card border border-amber-border bg-amber-bg p-3.5">
            <p className="text-[12px] font-semibold text-ink">Widening a range is allowed and narrowing one is allowed, and both are signed</p>
            <p className="mt-1.5 text-[10.5px] leading-relaxed text-ink-2">
              There is no approval on this. Anyone who can see the scenario can change an assumption they can
              defend, and their name and reason travel with it permanently. What is not offered is editing the
              confidence — that comes from the evidence behind the input, not from how sure the person editing it
              feels.
            </p>
          </div>
        </DialogBody>

        <DialogFooter>
          <div className="flex items-center gap-4">
            <Button type="button" onClick={confirm}>
              Change it to {preset.proposed}
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
