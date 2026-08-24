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
import { DS13_UNBLOCKS, DS_TONE_CLASS } from "@/pages/data/data-sources/data";

const TONE_BAR_CLASS = {
  ok: "bg-teal",
  warn: "bg-amber",
  risk: "bg-rose",
  ai: "bg-ultra",
  muted: "bg-ink-4",
  neutral: "bg-ink-3",
  num: "bg-ink-3",
} as const;

/** DS13 — "Widen a scope", hardcoded to `orders.customer_reference`, triggered from the orders detail page. */
export function WidenAScopeModal({ open, onOpenChange }: { open: boolean; onOpenChange: (open: boolean) => void }) {
  const confirm = () => {
    onOpenChange(false);
    toast.success("Requested · waiting on Engineering");
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-xl">
        <DialogHeader>
          <DialogTitle>Add a field to the scope</DialogTitle>
          <DialogDescription>One column · five things unblocked · and it does not exist yet</DialogDescription>
        </DialogHeader>

        <DialogBody className="space-y-4 px-5 py-5 sm:px-7 sm:py-6">
          <div className="rounded-panel border border-line bg-paper-2 px-3.5 py-3">
            <p className="text-[12px] font-semibold text-ink">Add `orders.customer_reference` to the scope</p>
            <p className="mt-1 font-mono text-[9.5px] text-ink-4">
              The field that would join 42,000 guest orders to a customer
            </p>
          </div>

          <div>
            <p className="font-mono text-[8.5px] font-medium tracking-[0.85px] text-ink-4 uppercase">What it would unblock</p>
            <div className="mt-1.5 space-y-2">
              {DS13_UNBLOCKS.map((item) => (
                <div key={item.label} className="relative overflow-hidden rounded-panel border border-line bg-paper py-2.5 pr-3.5 pl-4">
                  <span className={cn("absolute inset-y-0 left-0 w-[3px]", TONE_BAR_CLASS[item.tone])} aria-hidden />
                  <p className="text-[11px] font-semibold text-ink">{item.label}</p>
                  <p className={cn("mt-0.5 text-[9.5px]", DS_TONE_CLASS[item.tone])}>{item.sub}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="rounded-card border border-amber-border bg-amber-bg p-3.5">
            <p className="text-[12px] font-semibold text-ink">The field does not exist yet · this is a request, not a change</p>
            <p className="mt-1.5 text-[10.5px] leading-relaxed text-amber">
              Engineering would have to write a customer reference onto guest orders. Requested 28 July, 21 days
              ago, and it is one column.
            </p>
          </div>

          <p className="text-[10.5px] leading-relaxed text-ink-3">
            This is the single highest-value column in this workspace and it has no owner pushing it. It appears in
            the leakage map, the funnel, three health signals, the segment library and the experiment exclusions —
            always as the same 42,000 people who cannot be joined to anything. Nobody owns Acquire's data gap, so it
            sits in a queue behind things with names attached.
          </p>
        </DialogBody>

        <DialogFooter>
          <div className="flex items-center gap-4">
            <Button type="button" onClick={confirm}>
              Request the field
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
