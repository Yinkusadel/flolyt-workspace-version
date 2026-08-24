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
import { GV14_PRESET, GV_TONE_CLASS } from "@/pages/agents/governance/data";

/** GV14 — "Set a cap", opened from the Spend tab. */
export function SetCapModal({ open, onOpenChange }: { open: boolean; onOpenChange: (open: boolean) => void }) {
  const preset = GV14_PRESET;

  const confirm = () => {
    onOpenChange(false);
    toast.success(`Monthly budget set to ${preset.newValue}`);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-xl">
        <DialogHeader>
          <DialogTitle>Change the budget</DialogTitle>
          <DialogDescription>What it would save, and what would stop being watched</DialogDescription>
        </DialogHeader>

        <DialogBody className="space-y-4 px-5 py-5 sm:px-7 sm:py-6">
          <div className="rounded-panel border border-line bg-paper-2 px-3.5 py-3">
            <p className="text-[12px] font-semibold text-ink">{preset.title}</p>
            <p className="mt-1 font-mono text-[9.5px] text-ink-4">{preset.meta}</p>
          </div>

          <div>
            <p className="font-mono text-[8.5px] font-medium tracking-[0.85px] text-ink-4 uppercase">Change it to</p>
            <div className="mt-1.5 flex items-center justify-between rounded-panel border border-line2 bg-white px-4 py-3">
              <span className="text-[14px] font-semibold text-ink">{preset.newValue}</span>
              <span className="font-mono text-[10px] text-ink-4">{preset.was}</span>
            </div>
          </div>

          <div>
            <p className="font-mono text-[8.5px] font-medium tracking-[0.85px] text-ink-4 uppercase">What this would do</p>
            <div className="mt-1.5 space-y-2">
              {preset.effects.map((item) => (
                <div key={item.label} className="flex items-center justify-between rounded-panel border border-line bg-paper px-3.5 py-2.5">
                  <p className="text-[11px] font-semibold text-ink">{item.label}</p>
                  <p className={`font-mono text-[10.5px] font-semibold ${GV_TONE_CLASS[item.tone]}`}>{item.value}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="rounded-card border border-rose-border bg-rose-bg p-3.5">
            <p className="text-[12px] font-semibold text-ink">{preset.warnTitle}</p>
            <p className="mt-1.5 text-[10.5px] leading-relaxed text-rose">{preset.warnBody}</p>
          </div>

          <div className="rounded-card border border-line bg-paper-2 p-3.5">
            <p className="text-[10.5px] leading-relaxed text-ink-2">{preset.footnote}</p>
          </div>
        </DialogBody>

        <DialogFooter>
          <div className="flex items-center gap-4">
            <Button type="button" onClick={confirm}>
              Set it to {preset.newValue}
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
