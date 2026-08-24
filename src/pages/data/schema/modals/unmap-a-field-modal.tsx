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
import { SM13_HAPPENS, SM_TONE_CLASS } from "@/pages/data/schema/data";

const TONE_BAR_CLASS = {
  ok: "bg-teal",
  warn: "bg-amber",
  risk: "bg-rose",
  ai: "bg-ultra",
  muted: "bg-ink-4",
  neutral: "bg-ink-3",
  num: "bg-ink-3",
} as const;

/** SM13 — "Unmap a field", hardcoded to `orders.gift_message`, triggered from its Action cell on the Unused table. */
export function UnmapAFieldModal({ open, onOpenChange }: { open: boolean; onOpenChange: (open: boolean) => void }) {
  const confirm = () => {
    onOpenChange(false);
    toast.success("Unmapped · `orders.gift_message`");
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-xl">
        <DialogHeader>
          <DialogTitle>Unmap this field</DialogTitle>
          <DialogDescription>Reversible · but re-reading history usually is not</DialogDescription>
        </DialogHeader>

        <DialogBody className="space-y-4 px-5 py-5 sm:px-7 sm:py-6">
          <div className="rounded-panel border border-line bg-paper-2 px-3.5 py-3">
            <p className="font-mono text-[12px] font-semibold text-ink">Unmap `orders.gift_message`</p>
            <p className="mt-1 font-mono text-[9.5px] text-ink-4">Mapped 12 December · nothing has ever depended on it</p>
          </div>

          <div>
            <p className="font-mono text-[8.5px] font-medium tracking-[0.85px] text-ink-4 uppercase">What unmapping does</p>
            <div className="mt-1.5 space-y-2">
              {SM13_HAPPENS.map((item) => (
                <div key={item.label} className="relative overflow-hidden rounded-panel border border-line bg-paper py-2.5 pr-3.5 pl-4">
                  <span className={cn("absolute inset-y-0 left-0 w-[3px]", TONE_BAR_CLASS[item.tone])} aria-hidden />
                  <p className="text-[11px] font-semibold text-ink">{item.label}</p>
                  <p className={cn("mt-0.5 text-[9.5px]", SM_TONE_CLASS[item.tone])}>{item.sub}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="rounded-card border border-teal-border bg-teal-bg p-3.5">
            <p className="text-[12px] font-semibold text-ink">This is the smallest privacy improvement available today</p>
            <p className="mt-1.5 text-[10.5px] leading-relaxed text-teal">
              A gift message is a customer writing to another customer. Nothing in this product needs it and it has
              been readable for eight months.
            </p>
          </div>

          <p className="text-[10.5px] leading-relaxed text-ink-3">
            Unmapping is reversible and re-reading history is not. The column stops being read tonight. If
            something needs it in November it can be mapped again, and it will carry history from that day forward
            only where the source retains it. That asymmetry is why the unused list is reviewed rather than
            auto-pruned.
          </p>
        </DialogBody>

        <DialogFooter>
          <div className="flex items-center gap-4">
            <Button type="button" onClick={confirm}>
              Unmap it
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
