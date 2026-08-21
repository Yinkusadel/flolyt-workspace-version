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
import { BM13_PRESET, BM_TONE_CLASS } from "@/pages/revenue/benchmarks/data";

/** BM12 (disk BM13) — "Add an external benchmark", opened from the "Not compared" tab. The refusal is hardcoded; there is no form that actually adds one. */
export function AddAnExternalBenchmarkModal({ open, onOpenChange }: { open: boolean; onOpenChange: (open: boolean) => void }) {
  const preset = BM13_PRESET;

  const record = () => {
    onOpenChange(false);
    toast.success("Request recorded · this is the fifth time");
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-xl">
        <DialogHeader>
          <DialogTitle>Add an external benchmark</DialogTitle>
          <DialogDescription>Asked for five times since February · this is the fifth answer</DialogDescription>
        </DialogHeader>

        <DialogBody className="space-y-4 px-5 py-5 sm:px-7 sm:py-6">
          <div>
            <p className="font-mono text-[8.5px] font-medium tracking-[0.85px] text-ink-4 uppercase">What you would be adding</p>
            <div className="mt-1.5 rounded-panel border border-line bg-white px-3.5 py-3">
              <p className="text-[11.5px] font-semibold text-ink">{preset.wouldBeAdding.title}</p>
              <p className="mt-1 text-[9.5px] text-ink-4">{preset.wouldBeAdding.sub}</p>
            </div>
          </div>

          <div>
            <p className="font-mono text-[8.5px] font-medium tracking-[0.85px] text-ink-4 uppercase">What would be true of it</p>
            <div className="mt-1.5 space-y-2">
              {preset.wouldBeTrue.map((row) => (
                <div key={row.label} className="rounded-panel border border-line bg-paper px-3.5 py-2.5">
                  <p className={`text-[11px] font-semibold ${BM_TONE_CLASS[row.tone]}`}>{row.label}</p>
                  <p className="mt-0.5 text-[9.5px] text-ink-4">{row.sub}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="rounded-card border border-rose-border bg-rose-bg p-3.5">
            <p className="text-[12px] font-semibold text-ink">This is not a setting and there is no override</p>
            <p className="mt-1.5 text-[10.5px] leading-relaxed text-rose">
              There is no permission that unlocks it and no admin who can. The refusal is the feature, and the
              request is recorded here so the answer does not have to be re-argued.
            </p>
          </div>

          <div className="rounded-card border border-teal-border bg-teal-bg p-3.5">
            <p className="text-[12px] font-semibold text-ink">What you can have instead, today</p>
            <p className="mt-1.5 text-[10.5px] leading-relaxed text-ink-2">
              The UK is a market of this company's own that did not receive the change and sits at 38.9%. It has a
              definition you control, a sample you can see, and anybody can re-derive it from the orders table. It
              answers the same question better than 34% from a report nobody can check.
            </p>
          </div>
        </DialogBody>

        <DialogFooter>
          <div className="flex items-center gap-4">
            <Button type="button" onClick={record}>
              Record the request
            </Button>
            <button type="button" onClick={() => onOpenChange(false)} className="text-[12px] font-semibold text-ink-3 hover:text-ink">
              Close
            </button>
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
