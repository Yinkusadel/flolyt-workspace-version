import { toast } from "sonner";

import {
  Dialog,
  DialogBody,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { VL14_PRESET, VL_TONE_BG_CLASS, VL_TONE_CLASS } from "@/pages/revenue/value/data";

/** VL14 — "Credit a recovery", hardcoded to the Kenya retry window room, opened from its row on /value?as=owner. */
export function CreditARecoveryModal({ open, onOpenChange }: { open: boolean; onOpenChange: (open: boolean) => void }) {
  const preset = VL14_PRESET;

  const confirm = () => {
    onOpenChange(false);
    toast.success(`Credited ${preset.amount} to ${preset.creditedTo}`);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-xl">
        <DialogHeader>
          <DialogTitle>Credit a recovery</DialogTitle>
          <DialogDescription>What was observed and what is attributable are different numbers</DialogDescription>
        </DialogHeader>

        <DialogBody className="space-y-4 px-5 py-5 sm:px-7 sm:py-6">
          <div className="rounded-panel border border-line bg-paper-2 px-3.5 py-3">
            <p className="text-[12px] font-semibold text-ink">{preset.subject}</p>
            <p className="mt-1 font-mono text-[9.5px] text-ink-4">{preset.subjectDetail}</p>
          </div>

          <div>
            <p className="font-mono text-[8.5px] font-medium tracking-[0.85px] text-ink-4 uppercase">The figure · and what it is measured against</p>
            <div className="mt-1.5 space-y-2">
              {preset.rows.map((row) => (
                <div key={row.label} className="flex items-center justify-between gap-3 rounded-panel border border-line bg-paper px-3.5 py-2.5">
                  <span className={`h-full w-0.5 self-stretch rounded-full ${VL_TONE_BG_CLASS[row.tone]}`} aria-hidden />
                  <span className="min-w-0 flex-1">
                    <span className="block text-[11px] font-semibold text-ink">{row.label}</span>
                    <span className="mt-0.5 block text-[9.5px] text-ink-4">{row.sub}</span>
                  </span>
                  <span className={`shrink-0 font-mono text-[11.5px] font-semibold ${VL_TONE_CLASS[row.tone]}`}>{row.value}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="rounded-card border border-amber-border bg-amber-bg p-3.5">
            <p className="text-[12px] font-semibold text-ink">{preset.rows[3].value} was observed and {preset.rows[3].value} does not all go in the ledger</p>
            <p className="mt-1.5 text-[10.5px] leading-relaxed text-amber">{preset.warning}</p>
          </div>

          <div>
            <p className="font-mono text-[8.5px] font-medium tracking-[0.85px] text-ink-4 uppercase">Credited to · a metric, not a person</p>
            <div className="mt-1.5 flex items-center justify-between rounded-panel border border-line bg-white px-3.5 py-2.5">
              <span className="text-[11.5px] font-semibold text-ink">{preset.creditedTo}</span>
              <span className="font-mono text-[9.5px] text-ink-4">{preset.creditedToMeta}</span>
            </div>
          </div>

          <div className="rounded-card border border-teal-border bg-teal-bg p-3.5">
            <p className="text-[12px] font-semibold text-ink">It goes in as KES and stays as KES</p>
            <p className="mt-1.5 text-[10.5px] leading-relaxed text-ink-2">
              There is no conversion on entry, no naira equivalent stored alongside it, and no combined figure
              anywhere downstream. The Kenyan column exists so that this number never has to become a small part of
              a Nigerian one.
            </p>
          </div>
        </DialogBody>

        <DialogFooter>
          <div className="flex items-center gap-4">
            <Button type="button" onClick={confirm}>
              Credit {preset.amount}
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
