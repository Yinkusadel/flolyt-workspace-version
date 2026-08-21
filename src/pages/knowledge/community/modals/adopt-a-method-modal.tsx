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
import { CM_TONE_CLASS, CM11_PRESET } from "@/pages/knowledge/community/data";

/** CM11 — "Adopt a method", hardcoded to "Ask support what people wrote in about first". */
export function AdoptAMethodModal({ open, onOpenChange }: { open: boolean; onOpenChange: (open: boolean) => void }) {
  const preset = CM11_PRESET;

  const confirm = () => {
    onOpenChange(false);
    toast.success("Adopted · arrives as a playbook with an empty record");
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-xl">
        <DialogHeader>
          <DialogTitle>Adopt this method</DialogTitle>
          <DialogDescription>It arrives as a playbook with an empty record</DialogDescription>
        </DialogHeader>

        <DialogBody className="space-y-4 px-5 py-5 sm:px-7 sm:py-6">
          <div className="rounded-panel border border-line bg-paper-2 px-3.5 py-3">
            <p className="text-[12px] font-semibold text-ink">{preset.subject}</p>
            <p className="mt-1 font-mono text-[9.5px] text-ink-4">{preset.subjectDetail}</p>
          </div>

          <div>
            <p className="font-mono text-[8.5px] font-medium tracking-[0.85px] text-ink-4 uppercase">
              What adopting it does here
            </p>
            <div className="mt-1.5 space-y-2">
              {preset.doesRows.map((row) => (
                <div key={row.label} className="rounded-panel border border-line bg-paper px-3.5 py-3">
                  <p className={`text-[11.5px] font-semibold ${CM_TONE_CLASS[row.tone]}`}>{row.label}</p>
                  <p className="mt-0.5 text-[9.5px] text-ink-4">{row.sub}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="rounded-card border border-amber-border bg-amber-bg p-3.5">
            <p className="text-[12px] font-semibold text-ink">{preset.warningTitle}</p>
            <p className="mt-1.5 text-[10.5px] leading-relaxed text-amber">{preset.warningBody}</p>
          </div>

          <p className="text-[10.5px] leading-relaxed text-ink-3">{preset.closingNote}</p>
        </DialogBody>

        <DialogFooter>
          <div className="flex items-center gap-4">
            <Button type="button" onClick={confirm}>
              Adopt it
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
