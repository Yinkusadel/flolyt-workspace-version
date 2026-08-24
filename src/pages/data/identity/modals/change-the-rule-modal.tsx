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
import { ID09_PREVIEW_ROWS, ID_TONE_CLASS } from "@/pages/data/identity/data";

/** ID09 — "Change the rule", hardcoded to adding phone number as a match key, triggered from the rule page's header button. */
export function ChangeTheRuleModal({ open, onOpenChange }: { open: boolean; onOpenChange: (open: boolean) => void }) {
  const confirm = () => {
    onOpenChange(false);
    toast.success("Preview requested · full restatement not yet applied");
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-xl">
        <DialogHeader>
          <DialogTitle>Change the identity rule</DialogTitle>
          <DialogDescription>Every count in the product restates · preview first</DialogDescription>
        </DialogHeader>

        <DialogBody className="space-y-4 px-5 py-5 sm:px-7 sm:py-6">
          <div className="rounded-panel border border-line bg-paper-2 px-3.5 py-3">
            <p className="text-[12px] font-semibold text-ink">Add phone number as a match key</p>
            <p className="mt-1 font-mono text-[9.5px] text-ink-4">
              Identity rule v1 → v2 · set 12 December, unchanged since
            </p>
          </div>

          <div>
            <p className="font-mono text-[8.5px] font-medium tracking-[0.85px] text-ink-4 uppercase">What this would do · preview</p>
            <div className="mt-1.5 space-y-2">
              {ID09_PREVIEW_ROWS.map((item) => (
                <div key={item.label} className="flex items-center justify-between rounded-panel border border-line bg-paper px-3.5 py-2.5">
                  <p className="text-[11px] font-semibold text-ink">{item.label}</p>
                  <p className={cn("font-mono text-[10.5px] font-semibold", ID_TONE_CLASS[item.tone])}>{item.value}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="rounded-card border border-rose-border bg-rose-bg p-3.5">
            <p className="text-[12px] font-semibold text-ink">The last line is the one that should stop this</p>
            <p className="mt-1.5 text-[10.5px] leading-relaxed text-rose">
              A false merge combines two people's orders, consent states and contact history into one record, and
              nothing afterwards can tell you it happened.
            </p>
          </div>

          <p className="text-[10.5px] leading-relaxed text-ink-3">
            An identity rule change is the largest restatement this product can perform. Every count, rate, cohort
            and segment ever computed moves at once, both versions are kept, and every figure afterwards carries a
            rule version. It is offered because some businesses genuinely need a different key, and it requires
            this preview because nobody should discover the blast radius afterwards.
          </p>
        </DialogBody>

        <DialogFooter>
          <div className="flex items-center gap-4">
            <Button type="button" onClick={confirm}>
              Preview in full
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
