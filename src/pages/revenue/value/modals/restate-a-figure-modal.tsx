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
import { VL17_PRESET, VL_TONE_BG_CLASS } from "@/pages/revenue/value/data";

/** VL17 — "Restate a figure", hardcoded to the Onboarding email rewrite row, opened from /value. */
export function RestateAFigureModal({ open, onOpenChange }: { open: boolean; onOpenChange: (open: boolean) => void }) {
  const preset = VL17_PRESET;

  const confirm = () => {
    onOpenChange(false);
    toast.success(`Restated to ${preset.to}`);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-xl">
        <DialogHeader>
          <DialogTitle>Restate a figure</DialogTitle>
          <DialogDescription>The old number is kept and everyone who read it is told</DialogDescription>
        </DialogHeader>

        <DialogBody className="space-y-4 px-5 py-5 sm:px-7 sm:py-6">
          <div className="rounded-panel border border-line bg-paper-2 px-3.5 py-3">
            <p className="text-[12px] font-semibold text-ink">{preset.subject}</p>
            <p className="mt-1 font-mono text-[9.5px] text-ink-4">{preset.subjectDetail}</p>
          </div>

          <div>
            <p className="font-mono text-[8.5px] font-medium tracking-[0.85px] text-ink-4 uppercase">What is being restated</p>
            <div className="mt-1.5 space-y-3 rounded-panel border border-line bg-white px-3.5 py-3">
              <p className="text-[10.5px] leading-relaxed text-ink-2">{preset.explanation}</p>
              <p className="font-mono text-[13px] font-semibold text-ink">
                {preset.from} → {preset.to}
              </p>
            </div>
          </div>

          <div>
            <p className="font-mono text-[8.5px] font-medium tracking-[0.85px] text-ink-4 uppercase">What happens when you save</p>
            <div className="mt-1.5 space-y-2">
              {preset.effects.map((effect) => (
                <div key={effect.label} className="flex items-center gap-3 rounded-panel border border-line bg-paper px-3.5 py-2.5">
                  <span className={`h-full w-0.5 self-stretch rounded-full ${VL_TONE_BG_CLASS[effect.tone]}`} aria-hidden />
                  <span className="min-w-0">
                    <span className="block text-[11px] font-semibold text-ink">{effect.label}</span>
                    <span className="mt-0.5 block text-[9.5px] text-ink-4">{effect.sub}</span>
                  </span>
                </div>
              ))}
            </div>
          </div>

          <div className="rounded-card border border-teal-border bg-teal-bg p-3.5">
            <p className="text-[12px] font-semibold text-ink">A figure going down is not bad news and is not shown as bad news</p>
            <p className="mt-1.5 text-[10.5px] leading-relaxed text-ink-2">
              Nothing was lost. A number that was wrong is now less wrong, and the eleven people who read the old
              one find out before they quote it again. The alternative — quietly correcting it and letting the pack
              go stale — is how a ledger stops being worth reading.
            </p>
          </div>
        </DialogBody>

        <DialogFooter>
          <div className="flex items-center gap-4">
            <Button type="button" onClick={confirm}>
              Restate to {preset.to}
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
