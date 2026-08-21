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
import { FC11_CONTEXT } from "@/pages/revenue/forecast/data";

/** FC11 (disk) — "Revise a signed forecast", opened from a "Revise" action on /forecast/actuals (the modal's own base tab in the export, though the preset content it revises — Retain, not one of that page's own rows — is what actually determines its meaning, same "read the preset, not just the base frame" call the Attribution rebuild made). */
export function ReviseASignedForecastModal({ open, onOpenChange }: { open: boolean; onOpenChange: (open: boolean) => void }) {
  const preset = FC11_CONTEXT;

  const revise = () => {
    onOpenChange(false);
    toast.success(`Revised to ${preset.newValue} · reason recorded`);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-xl">
        <DialogHeader>
          <DialogTitle>Revise your forecast</DialogTitle>
          <DialogDescription>Name the input that moved · the original stays visible</DialogDescription>
        </DialogHeader>

        <DialogBody className="space-y-4 px-5 py-5 sm:px-7 sm:py-6">
          <div className="rounded-panel border border-line bg-paper-2 px-3.5 py-3">
            <p className="text-[12px] font-semibold text-ink">{preset.title}</p>
            <p className="mt-1 font-mono text-[9.5px] text-ink-4">{preset.sub}</p>
          </div>

          <div>
            <p className="font-mono text-[8.5px] font-medium tracking-[0.85px] text-ink-4 uppercase">Revising it to</p>
            <div className="mt-1.5 flex items-center justify-between rounded-panel border border-line2 bg-white px-4 py-3">
              <p className="text-[14px] font-semibold text-ink">{preset.newValue}</p>
              <p className="font-mono text-[10px] text-ink-4">{preset.wasValue}</p>
            </div>
          </div>

          <div>
            <p className="font-mono text-[8.5px] font-medium tracking-[0.85px] text-ink-4 uppercase">Which input moved · required</p>
            <div className="mt-1.5 rounded-panel border border-line2 bg-white px-3.5 py-3">
              <p className="text-[10.5px] leading-relaxed text-ink-2">{preset.whichInput}</p>
            </div>
          </div>

          <div className="rounded-card border border-amber-border bg-amber-bg p-3.5">
            <p className="text-[12px] font-semibold text-ink">{preset.warningTitle}</p>
            <p className="mt-1.5 text-[10.5px] leading-relaxed text-amber">{preset.warningBody}</p>
          </div>

          <div className="rounded-card border border-teal-border bg-teal-bg p-3.5">
            <p className="text-[12px] font-semibold text-ink">The original is kept and everybody who read it is told</p>
            <p className="mt-1.5 text-[10.5px] leading-relaxed text-ink-2">
              29.8% stays visible with its date, its reason and its signer. Four people have opened this forecast
              since 2 August and all four are notified with what moved and why — because a revision nobody hears
              about is how two people leave the same meeting with different numbers.
            </p>
          </div>
        </DialogBody>

        <DialogFooter>
          <div className="flex items-center gap-4">
            <Button type="button" onClick={revise}>
              Revise to {preset.newValue}
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
