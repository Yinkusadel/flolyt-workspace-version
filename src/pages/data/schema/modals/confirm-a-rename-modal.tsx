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
import { SM11_AUTOMATIC_ROWS, SM_TONE_CLASS } from "@/pages/data/schema/data";

const TONE_BAR_CLASS = {
  ok: "bg-teal",
  warn: "bg-amber",
  risk: "bg-rose",
  ai: "bg-ultra",
  muted: "bg-ink-4",
  neutral: "bg-ink-3",
  num: "bg-ink-3",
} as const;

/** SM11 — "Confirm a rename", hardcoded to `orders.channel` → `acq_channel`, triggered from that row on the Changes table. */
export function ConfirmARenameModal({ open, onOpenChange }: { open: boolean; onOpenChange: (open: boolean) => void }) {
  const confirmSame = () => {
    onOpenChange(false);
    toast.success("Confirmed · history stitched across the rename");
  };

  const confirmDifferent = () => {
    onOpenChange(false);
    toast.success("Marked as a new field · history not stitched");
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-xl">
        <DialogHeader>
          <DialogTitle>Is this the same field?</DialogTitle>
          <DialogDescription>Four metrics are waiting · and the product will not guess</DialogDescription>
        </DialogHeader>

        <DialogBody className="space-y-4 px-5 py-5 sm:px-7 sm:py-6">
          <div className="rounded-panel border border-rose-border bg-rose-bg px-3.5 py-3">
            <p className="font-mono text-[12px] font-semibold text-ink">`orders.channel` is gone</p>
            <p className="mt-1 font-mono text-[9.5px] font-semibold text-rose">
              Detected in the 06:14 delivery · a column named `acq_channel` appeared
            </p>
          </div>

          <div>
            <p className="font-mono text-[8.5px] font-medium tracking-[0.85px] text-ink-4 uppercase">What happened automatically</p>
            <div className="mt-1.5 space-y-2">
              {SM11_AUTOMATIC_ROWS.map((item) => (
                <div key={item.label} className="relative overflow-hidden rounded-panel border border-line bg-paper py-2.5 pr-3.5 pl-4">
                  <span className={cn("absolute inset-y-0 left-0 w-[3px]", TONE_BAR_CLASS[item.tone])} aria-hidden />
                  <p className="text-[11px] font-semibold text-ink">{item.label}</p>
                  <p className={cn("mt-0.5 text-[9.5px]", SM_TONE_CLASS[item.tone])}>{item.sub}</p>
                </div>
              ))}
            </div>
          </div>

          <div>
            <p className="font-mono text-[8.5px] font-medium tracking-[0.85px] text-ink-4 uppercase">What you are confirming</p>
            <div className="mt-1.5 rounded-panel border border-line2 bg-white p-3.5">
              <p className="text-[11.5px] font-semibold text-ink">`acq_channel` is the same field, renamed</p>
              <p className="mt-1 text-[9.5px] text-ink-4">values match · distribution matches · 1.24M rows both sides</p>
            </div>
          </div>

          <div className="rounded-card border border-amber-border bg-amber-bg p-3.5">
            <p className="text-[12px] font-semibold text-ink">History is continuous only if this is true</p>
            <p className="mt-1.5 text-[10.5px] leading-relaxed text-amber">
              Confirming stitches eight months of history across the rename. If it is a different field, every
              channel figure before July becomes wrong.
            </p>
          </div>

          <p className="text-[10.5px] leading-relaxed text-ink-3">
            The product will not guess that two columns are the same field. The name changed, the values match and
            the distribution matches, and it is still a person's judgement. Automatically stitching a plausible
            match is how a workspace ends up with eight months of history joined across two fields that were never
            the same thing.
          </p>
        </DialogBody>

        <DialogFooter>
          <div className="flex items-center gap-4">
            <Button type="button" onClick={confirmSame}>
              Same field · stitch history
            </Button>
            <button type="button" onClick={confirmDifferent} className="text-[12px] font-semibold text-ink-3 hover:text-ink">
              It is a new field
            </button>
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
