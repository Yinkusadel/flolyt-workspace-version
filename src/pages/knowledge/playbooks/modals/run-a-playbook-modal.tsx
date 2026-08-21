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
import { PB11_PRESET } from "@/pages/knowledge/playbooks/data";

/** PB11 — "Run a playbook", hardcoded to "Retry cards at 09:00 local · in the UK". */
export function RunAPlaybookModal({ open, onOpenChange }: { open: boolean; onOpenChange: (open: boolean) => void }) {
  const preset = PB11_PRESET;

  const confirm = () => {
    onOpenChange(false);
    toast.success("Proposal created · waiting on Ravi's approval");
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-xl">
        <DialogHeader>
          <DialogTitle>Run this playbook</DialogTitle>
          <DialogDescription>It creates a proposal · a person still approves the send</DialogDescription>
        </DialogHeader>

        <DialogBody className="space-y-4 px-5 py-5 sm:px-7 sm:py-6">
          <div className="rounded-panel border border-line bg-paper-2 px-3.5 py-3">
            <p className="text-[12px] font-semibold text-ink">{preset.subject}</p>
            <p className="mt-1 font-mono text-[9.5px] text-ink-4">{preset.subjectDetail}</p>
          </div>

          <div>
            <p className="font-mono text-[8.5px] font-medium tracking-[0.85px] text-ink-4 uppercase">Preconditions · checked now</p>
            <div className="mt-1.5 space-y-2">
              {preset.preconditionRows.map((row) => (
                <div
                  key={row.label}
                  className="flex items-center justify-between gap-3 rounded-panel border border-line bg-paper px-3.5 py-3"
                >
                  <div>
                    <p className="text-[11.5px] font-semibold text-ink">{row.label}</p>
                    <p className="mt-0.5 text-[9.5px] text-ink-4">{row.sub}</p>
                  </div>
                  <span className="shrink-0 font-mono text-[9.5px] font-semibold text-teal">met</span>
                </div>
              ))}
            </div>
          </div>

          <div className="rounded-card border border-amber-border bg-amber-bg p-3.5">
            <p className="text-[12px] font-semibold text-ink">{preset.warningTitle}</p>
            <p className="mt-1.5 text-[10.5px] leading-relaxed text-amber">{preset.warningBody}</p>
          </div>

          <p className="text-[10.5px] leading-relaxed text-ink-3">{preset.closingNote}</p>
        </DialogBody>

        <DialogFooter>
          <div className="flex items-center gap-4">
            <Button type="button" onClick={confirm}>
              Create the proposal
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
