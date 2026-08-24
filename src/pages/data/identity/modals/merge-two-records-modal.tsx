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
import { ID10_MERGE_ROWS, ID_TONE_CLASS } from "@/pages/data/identity/data";

const TONE_BAR_CLASS = {
  ok: "bg-teal",
  warn: "bg-amber",
  risk: "bg-rose",
  ai: "bg-ultra",
  muted: "bg-ink-4",
  neutral: "bg-ink-3",
  num: "bg-ink-3",
} as const;

/** ID10 — "Merge two records", hardcoded to a same-unverified-email pair, triggered from that row on the Duplicates table. */
export function MergeTwoRecordsModal({ open, onOpenChange }: { open: boolean; onOpenChange: (open: boolean) => void }) {
  const confirm = () => {
    onOpenChange(false);
    toast.success("Merged · consent resolved to the stricter state");
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-xl">
        <DialogHeader>
          <DialogTitle>Merge these two</DialogTitle>
          <DialogDescription>Consent resolves to the stricter state · always</DialogDescription>
        </DialogHeader>

        <DialogBody className="space-y-4 px-5 py-5 sm:px-7 sm:py-6">
          <div className="rounded-panel border border-line bg-paper-2 px-3.5 py-3">
            <p className="text-[12px] font-semibold text-ink">Merge two records</p>
            <p className="mt-1 font-mono text-[9.5px] text-ink-4">Same unverified email · different signup dates · same market</p>
          </div>

          <div>
            <p className="font-mono text-[8.5px] font-medium tracking-[0.85px] text-ink-4 uppercase">What merging does</p>
            <div className="mt-1.5 space-y-2">
              {ID10_MERGE_ROWS.map((item) => (
                <div key={item.label} className="relative overflow-hidden rounded-panel border border-line bg-paper py-2.5 pr-3.5 pl-4">
                  <span className={cn("absolute inset-y-0 left-0 w-[3px]", TONE_BAR_CLASS[item.tone])} aria-hidden />
                  <p className="text-[11px] font-semibold text-ink">{item.label}</p>
                  <p className={cn("mt-0.5 text-[9.5px]", ID_TONE_CLASS[item.tone])}>{item.sub}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="rounded-card border border-amber-border bg-amber-bg p-3.5">
            <p className="text-[12px] font-semibold text-ink">One of these two opted out and the other did not</p>
            <p className="mt-1.5 text-[10.5px] leading-relaxed text-amber">
              The merged record is opted out. Consent always resolves to the stricter state, in every merge,
              without exception.
            </p>
          </div>

          <p className="text-[10.5px] leading-relaxed text-ink-3">
            Merging is reversible for as long as nothing has been done to the merged person. Both source records
            are kept, so a reversal restores them and everything computed from them. Once a play has been sent to
            the merged identity or a figure credited against it, reversing becomes a restatement rather than an
            undo — which is why the duplicates screen shows how long each merge has stood.
          </p>
        </DialogBody>

        <DialogFooter>
          <div className="flex items-center gap-4">
            <Button type="button" onClick={confirm}>
              Merge them
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
