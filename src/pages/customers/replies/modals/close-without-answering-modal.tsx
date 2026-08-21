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
import { RP11_CLOSE_PRESET } from "@/pages/customers/replies/data";

/** RP11 — "Close without answering", hardcoded to "Customer 3,881,406". Opens from the Unanswered table's fixable chip. */
export function CloseWithoutAnsweringModal({ open, onOpenChange }: { open: boolean; onOpenChange: (open: boolean) => void }) {
  const preset = RP11_CLOSE_PRESET;

  const confirm = () => {
    onOpenChange(false);
    toast.success("Closed without answering · 411 remain in the queue");
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-xl">
        <DialogHeader>
          <DialogTitle>Close without answering</DialogTitle>
          <DialogDescription>Legitimate, and it costs a typed sentence every time</DialogDescription>
        </DialogHeader>

        <DialogBody className="space-y-4 px-5 py-5 sm:px-7 sm:py-6">
          <div className="rounded-panel border border-line bg-paper-2 px-3.5 py-3">
            <p className="text-[12px] font-semibold text-ink">{preset.subject}</p>
            <p className="mt-1 font-mono text-[9.5px] text-ink-4">{preset.subjectDetail}</p>
          </div>

          <div>
            <p className="font-mono text-[8.5px] font-medium tracking-[0.85px] text-ink-4 uppercase">{preset.reasonLabel}</p>
            <div className="mt-1.5 rounded-panel border border-line bg-white px-4 py-3">
              <p className="text-[10.5px] leading-relaxed text-ink-2">{preset.reasonBody}</p>
            </div>
          </div>

          <div>
            <p className="font-mono text-[8.5px] font-medium tracking-[0.85px] text-ink-4 uppercase">What closing does and does not do</p>
            <div className="mt-1.5 space-y-2">
              {preset.whatClosingDoes.map((row) => (
                <div key={row.label} className="rounded-panel border border-line bg-paper px-3.5 py-2.5">
                  <p className="text-[11px] font-semibold text-ink">{row.label}</p>
                  <p className="mt-0.5 text-[9.5px] text-ink-4">{row.sub}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="rounded-card border border-amber-border bg-amber-bg p-3.5">
            <p className="text-[12px] font-semibold text-ink">Ninety-four replies have been closed this way and every one has a sentence attached</p>
            <p className="mt-1.5 text-[10.5px] leading-relaxed text-amber">{preset.closingNote}</p>
          </div>
        </DialogBody>

        <DialogFooter>
          <div className="flex items-center gap-4">
            <Button type="button" onClick={confirm}>
              Close with this reason
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
