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
import { PB13_PRESET } from "@/pages/knowledge/playbooks/data";

/** PB13 — "Retire a playbook", hardcoded to "Win back with 20% off at day 60–90". */
export function RetireAPlaybookModal({ open, onOpenChange }: { open: boolean; onOpenChange: (open: boolean) => void }) {
  const preset = PB13_PRESET;

  const confirm = () => {
    onOpenChange(false);
    toast.success("Retired · replaced by Fee transparency reactivation");
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-xl">
        <DialogHeader>
          <DialogTitle>Retire this playbook</DialogTitle>
          <DialogDescription>It stops being runnable and its record stays readable</DialogDescription>
        </DialogHeader>

        <DialogBody className="space-y-4 px-5 py-5 sm:px-7 sm:py-6">
          <div className="rounded-panel border border-line bg-paper-2 px-3.5 py-3">
            <p className="text-[12px] font-semibold text-ink">{preset.subject}</p>
            <p className="mt-1 font-mono text-[9.5px] text-ink-4">{preset.subjectDetail}</p>
          </div>

          <div>
            <p className="font-mono text-[8.5px] font-medium tracking-[0.85px] text-ink-4 uppercase">Why it is being retired · typed</p>
            <div className="mt-1.5 rounded-panel border border-line bg-paper px-3.5 py-3">
              <p className="text-[10.5px] leading-relaxed text-ink-2">{preset.reasonBody}</p>
            </div>
          </div>

          <div>
            <p className="font-mono text-[8.5px] font-medium tracking-[0.85px] text-ink-4 uppercase">What retiring does</p>
            <div className="mt-1.5 space-y-2">
              {preset.doesRows.map((row) => (
                <div key={row.label} className="rounded-panel border border-line bg-paper px-3.5 py-3">
                  <p className="text-[11.5px] font-semibold text-ink">{row.label}</p>
                  <p className="mt-0.5 text-[9.5px] text-ink-4">{row.sub}</p>
                </div>
              ))}
            </div>
          </div>

          <p className="text-[10.5px] leading-relaxed text-ink-3">{preset.closingNote}</p>
        </DialogBody>

        <DialogFooter>
          <div className="flex items-center gap-4">
            <Button type="button" onClick={confirm}>
              Retire it
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
