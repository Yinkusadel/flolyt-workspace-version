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
import { HL12_ADD_SIGNAL_PRESET, HL_TONE_CLASS } from "@/pages/customers/customer-health/data";

const TONE_BAR_CLASS = {
  ok: "bg-teal",
  warn: "bg-amber",
  risk: "bg-rose",
  ai: "bg-ultra",
  muted: "bg-ink-4",
  neutral: "bg-ink-3",
  num: "bg-ink-3",
} as const;

/** HL12 — "Add a signal", hardcoded to the "Reordered the same item" proposal, opened from the Signals tab's header CTA. */
export function AddASignalModal({ open, onOpenChange }: { open: boolean; onOpenChange: (open: boolean) => void }) {
  const preset = HL12_ADD_SIGNAL_PRESET;

  const confirm = () => {
    onOpenChange(false);
    toast.info("An agent-proposed signal needs a person to accept it — not added");
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-xl">
        <DialogHeader>
          <DialogTitle>Add a signal</DialogTitle>
          <DialogDescription>Five required fields, and the overlap is stated rather than resolved</DialogDescription>
        </DialogHeader>

        <DialogBody className="space-y-4 px-5 py-5 sm:px-7 sm:py-6">
          <div className="rounded-panel border border-line bg-paper-2 px-3.5 py-3">
            <p className="text-[12px] font-semibold text-ink">{preset.subject}</p>
            <p className="mt-1 font-mono text-[9.5px] text-ink-4">{preset.subjectDetail}</p>
          </div>

          <div>
            <p className="font-mono text-[8.5px] font-medium tracking-[0.85px] text-ink-4 uppercase">Required before it can be a signal</p>
            <div className="mt-1.5 space-y-2">
              {preset.fields.map((field) => (
                <div key={field.label} className="relative overflow-hidden rounded-panel border border-line bg-paper py-2.5 pr-3.5 pl-4">
                  <span className={cn("absolute inset-y-0 left-0 w-[3px]", TONE_BAR_CLASS[field.tone])} aria-hidden />
                  <p className="text-[11px] font-semibold text-ink">{field.label}</p>
                  <p className={cn("mt-0.5 text-[9.5px]", HL_TONE_CLASS[field.tone])}>{field.value}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="rounded-card border border-amber-border bg-amber-bg p-3.5">
            <p className="text-[12px] font-semibold text-ink">{preset.overlapTitle}</p>
            <p className="mt-1.5 text-[10.5px] leading-relaxed text-amber">{preset.overlapBody}</p>
          </div>

          <div className="rounded-card border border-ultra-border bg-ultra-bg p-3.5">
            <p className="text-[12px] font-semibold text-ink">An agent proposed this signal and cannot add it</p>
            <p className="mt-1.5 text-[10.5px] leading-relaxed text-ink-2">{preset.closingNote}</p>
          </div>
        </DialogBody>

        <DialogFooter>
          <div className="flex items-center gap-4">
            <Button type="button" onClick={confirm}>
              Add the signal
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
