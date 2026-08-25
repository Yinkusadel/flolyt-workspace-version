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
import { ID13_REMOVED_ROWS, ID_TONE_CLASS } from "@/pages/data/identity/data";

const TONE_BAR_CLASS = {
  ok: "bg-teal",
  warn: "bg-amber",
  risk: "bg-rose",
  ai: "bg-ultra",
  muted: "bg-ink-4",
  neutral: "bg-ink-3",
  num: "bg-ink-3",
} as const;

/** ID13 — "Process an erasure request", triggered from a header button on the Erasure page. */
export function ErasureRequestModal({ open, onOpenChange }: { open: boolean; onOpenChange: (open: boolean) => void }) {
  const confirm = () => {
    onOpenChange(false);
    toast.success("Erased · identity and personal fields removed");
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-xl">
        <DialogHeader>
          <DialogTitle>Process an erasure request</DialogTitle>
          <DialogDescription>Irreversible · no approval step · no refusal path</DialogDescription>
        </DialogHeader>

        <DialogBody className="space-y-4 px-5 py-5 sm:px-7 sm:py-6">
          <div className="rounded-panel border border-line bg-paper-2 px-3.5 py-3">
            <p className="text-[12px] font-semibold text-ink">Erasure request</p>
            <p className="mt-1 font-mono text-[9.5px] text-ink-4">
              Received via support · verified · 11 orders, 2 replies, 4 cohorts
            </p>
          </div>

          <div>
            <p className="font-mono text-[8.5px] font-medium tracking-[0.85px] text-ink-4 uppercase">What will be removed</p>
            <div className="mt-1.5 space-y-2">
              {ID13_REMOVED_ROWS.map((item) => (
                <div key={item.label} className="relative overflow-hidden rounded-panel border border-line bg-paper py-2.5 pr-3.5 pl-4">
                  <span className={cn("absolute inset-y-0 left-0 w-[3px]", TONE_BAR_CLASS[item.tone])} aria-hidden />
                  <p className="text-[11px] font-semibold text-ink">{item.label}</p>
                  <p className={cn("mt-0.5 text-[9.5px]", ID_TONE_CLASS[item.tone])}>{item.sub}</p>
                </div>
              ))}
            </div>
          </div>

          <div>
            <p className="font-mono text-[8.5px] font-medium tracking-[0.85px] text-ink-4 uppercase">What will remain</p>
            <div className="mt-1.5 rounded-panel border border-line2 bg-paper-2 p-3.5">
              <p className="text-[10.5px] leading-relaxed text-ink-2">
                Eleven transactions, unlinked and anonymous, and the aggregate figures they contributed to. An
                aggregate is not personal data and is not restated.
              </p>
            </div>
          </div>

          <p className="text-[10.5px] leading-relaxed text-ink-3">
            Erasure is irreversible and is completed without anybody approving it. There is no refusal path, no
            approval step and no delay for review. The request is verified, recorded and executed, and the only
            human involvement is verifying that the person asking is the person concerned.
          </p>
        </DialogBody>

        <DialogFooter>
          <div className="flex items-center gap-4">
            <Button type="button" variant="destructive" onClick={confirm}>
              Erase
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
