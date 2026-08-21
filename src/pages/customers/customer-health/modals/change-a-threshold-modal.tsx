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
import { HL13_THRESHOLD_PRESET, HL_TONE_CLASS } from "@/pages/customers/customer-health/data";

const TONE_BAR_CLASS = {
  ok: "bg-teal",
  warn: "bg-amber",
  risk: "bg-rose",
  ai: "bg-ultra",
  muted: "bg-ink-4",
  neutral: "bg-ink-3",
  num: "bg-ink-3",
} as const;

/** HL13 — "Change a threshold", hardcoded to the "Feature depth" preset. */
export function ChangeAThresholdModal({ open, onOpenChange }: { open: boolean; onOpenChange: (open: boolean) => void }) {
  const preset = HL13_THRESHOLD_PRESET;

  const confirm = () => {
    onOpenChange(false);
    toast.success("Threshold changed to 1.2 · the old value and date are kept");
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-xl">
        <DialogHeader>
          <DialogTitle>Change this threshold</DialogTitle>
          <DialogDescription>What it would have silenced, before you decide</DialogDescription>
        </DialogHeader>

        <DialogBody className="space-y-4 px-5 py-5 sm:px-7 sm:py-6">
          <div className="rounded-panel border border-line bg-paper-2 px-3.5 py-3">
            <p className="text-[12px] font-semibold text-ink">{preset.subject}</p>
            <p className="mt-1 font-mono text-[9.5px] text-ink-4">{preset.subjectDetail}</p>
          </div>

          <div>
            <p className="font-mono text-[8.5px] font-medium tracking-[0.85px] text-ink-4 uppercase">Change it to</p>
            <div className="mt-1.5 flex items-center justify-between rounded-panel border border-line bg-white px-4 py-3">
              <p className="text-[13px] font-semibold text-ink">{preset.changeTo}</p>
              <p className="font-mono text-[10px] text-ink-4">{preset.was}</p>
            </div>
          </div>

          <div>
            <p className="font-mono text-[8.5px] font-medium tracking-[0.85px] text-ink-4 uppercase">What this would have done</p>
            <div className="mt-1.5 space-y-2">
              {preset.effects.map((effect) => (
                <div key={effect.label} className="relative flex items-center justify-between overflow-hidden rounded-panel border border-line bg-paper py-2.5 pr-3.5 pl-4">
                  <span className={cn("absolute inset-y-0 left-0 w-[3px]", TONE_BAR_CLASS[effect.tone])} aria-hidden />
                  <p className="text-[11px] font-semibold text-ink">{effect.label}</p>
                  <p className={cn("font-mono text-[10.5px] font-semibold", HL_TONE_CLASS[effect.tone])}>{effect.value}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="rounded-card border border-rose-border bg-rose-bg p-3.5">
            <p className="text-[12px] font-semibold text-ink">{preset.warningTitle}</p>
            <p className="mt-1.5 text-[10.5px] leading-relaxed text-rose">{preset.warningBody}</p>
          </div>

          <div className="rounded-card border border-amber-border bg-amber-bg p-3.5">
            <p className="text-[12px] font-semibold text-ink">The change is allowed, recorded, and shown next to the breach count forever</p>
            <p className="mt-1.5 text-[10.5px] leading-relaxed text-ink-2">{preset.closingNote}</p>
          </div>
        </DialogBody>

        <DialogFooter>
          <div className="flex items-center gap-4">
            <Button type="button" onClick={confirm}>
              Change to 1.2
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
