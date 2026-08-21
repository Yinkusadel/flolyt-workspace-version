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
import { XP14_CHANGE_PRESET } from "@/pages/customers/experiments/data";

/** XP14 — "Change the condition", hardcoded to "Basket prompt · rerun". Opens from the Running tab's condition table. */
export function ChangeTheConditionModal({ open, onOpenChange }: { open: boolean; onOpenChange: (open: boolean) => void }) {
  const preset = XP14_CHANGE_PRESET;

  const confirm = () => {
    onOpenChange(false);
    toast.success("Condition changed · day 1, before any data was read");
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-xl">
        <DialogHeader>
          <DialogTitle>Change the failure condition</DialogTitle>
          <DialogDescription>Allowed on day one, refused after the first reading</DialogDescription>
        </DialogHeader>

        <DialogBody className="space-y-4 px-5 py-5 sm:px-7 sm:py-6">
          <div className="rounded-panel border border-line bg-paper-2 px-3.5 py-3">
            <p className="text-[12px] font-semibold text-ink">{preset.subject}</p>
            <p className="mt-1 font-mono text-[9.5px] text-ink-4">{preset.subjectDetail}</p>
          </div>

          <div>
            <p className="font-mono text-[8.5px] font-medium tracking-[0.85px] text-ink-4 uppercase">The condition you registered</p>
            <div className="mt-1.5 rounded-panel border border-line bg-paper-2 px-4 py-3">
              <p className="text-[11.5px] font-semibold text-ink">{preset.original}</p>
            </div>
          </div>

          <div>
            <p className="font-mono text-[8.5px] font-medium tracking-[0.85px] text-ink-4 uppercase">What you are changing it to</p>
            <div className="mt-1.5 rounded-panel border border-line bg-white px-4 py-3">
              <p className="text-[11.5px] font-semibold text-ink">{preset.changedTo}</p>
            </div>
          </div>

          <div className="rounded-card border border-rose-border bg-rose-bg p-3.5">
            <p className="text-[12px] font-semibold text-ink">{preset.warningTitle}</p>
            <p className="mt-1.5 text-[10.5px] leading-relaxed text-rose">{preset.warningBody}</p>
          </div>

          <div>
            <p className="font-mono text-[8.5px] font-medium tracking-[0.85px] text-ink-4 uppercase">What will be visible forever</p>
            <div className="mt-1.5 space-y-2">
              {preset.visibleForever.map((row) => (
                <div key={row.label} className="rounded-panel border border-line bg-paper px-3.5 py-2.5">
                  <p className="text-[11px] font-semibold text-ink">{row.label}</p>
                  <p className="mt-0.5 text-[9.5px] text-ink-4">{row.sub}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="rounded-card border border-ultra-border bg-ultra-bg p-3.5">
            <p className="text-[12px] font-semibold text-ink">A pre-registration that can be edited quietly is not a pre-registration</p>
            <p className="mt-1.5 text-[10.5px] leading-relaxed text-ink-2">{preset.closingNote}</p>
          </div>
        </DialogBody>

        <DialogFooter>
          <div className="flex items-center gap-4">
            <Button type="button" onClick={confirm}>
              Change it · day 1
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
