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
import { RP09_SEND_PRESET } from "@/pages/customers/replies/data";

/** RP09 — "Send an answer", hardcoded to the "Customer 4,118,207" reference row. Opens from the Needs-an-answer table's draft-ready chip. */
export function SendAnAnswerModal({ open, onOpenChange }: { open: boolean; onOpenChange: (open: boolean) => void }) {
  const preset = RP09_SEND_PRESET;

  const confirm = () => {
    onOpenChange(false);
    toast.success("Sent · your name is on it");
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-xl">
        <DialogHeader>
          <DialogTitle>Send this answer</DialogTitle>
          <DialogDescription>One person, no audience, and your name on it</DialogDescription>
        </DialogHeader>

        <DialogBody className="space-y-4 px-5 py-5 sm:px-7 sm:py-6">
          <div className="rounded-panel border border-line bg-paper-2 px-3.5 py-3">
            <p className="text-[12px] font-semibold text-ink">{preset.subject}</p>
            <p className="mt-1 font-mono text-[9.5px] text-ink-4">{preset.subjectDetail}</p>
          </div>

          <div>
            <p className="font-mono text-[8.5px] font-medium tracking-[0.85px] text-ink-4 uppercase">
              This is the one place a message goes to one person
            </p>
            <div className="mt-1.5 space-y-2">
              {preset.items.map((item) => (
                <div key={item.label} className="rounded-panel border border-line bg-paper px-3.5 py-3">
                  <p className="text-[11.5px] font-semibold text-ink">{item.label}</p>
                  <p className="mt-0.5 text-[9.5px] text-ink-4">{item.sub}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="rounded-card border border-amber-border bg-amber-bg p-3.5">
            <p className="text-[12px] font-semibold text-ink">{preset.warningTitle}</p>
            <p className="mt-1.5 text-[10.5px] leading-relaxed text-amber">{preset.warningBody}</p>
          </div>

          <div className="rounded-card border border-ultra-border bg-ultra-bg p-3.5">
            <p className="text-[12px] font-semibold text-ink">An agent wrote every word of this and cannot send one of them</p>
            <p className="mt-1.5 text-[10.5px] leading-relaxed text-ink-2">{preset.closingNote}</p>
          </div>
        </DialogBody>

        <DialogFooter>
          <div className="flex items-center gap-4">
            <Button type="button" onClick={confirm}>
              Send it
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
