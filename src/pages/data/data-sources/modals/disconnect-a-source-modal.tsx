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
import { DS14_HAPPENS, DS_TONE_CLASS } from "@/pages/data/data-sources/data";

const TONE_BAR_CLASS = {
  ok: "bg-teal",
  warn: "bg-amber",
  risk: "bg-rose",
  ai: "bg-ultra",
  muted: "bg-ink-4",
  neutral: "bg-ink-3",
  num: "bg-ink-3",
} as const;

/** DS14 — "Disconnect a source", hardcoded to `loyalty_events`, triggered from its state chip on the Connected table. */
export function DisconnectASourceModal({ open, onOpenChange }: { open: boolean; onOpenChange: (open: boolean) => void }) {
  const confirm = () => {
    onOpenChange(false);
    toast.success("Disconnected · `loyalty_events`");
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-xl">
        <DialogHeader>
          <DialogTitle>Disconnect this source</DialogTitle>
          <DialogDescription>It costs one click and removes a question worth keeping</DialogDescription>
        </DialogHeader>

        <DialogBody className="space-y-4 px-5 py-5 sm:px-7 sm:py-6">
          <div className="rounded-panel border border-line bg-paper-2 px-3.5 py-3">
            <p className="text-[12px] font-semibold text-ink">Disconnect `loyalty_events`</p>
            <p className="mt-1 font-mono text-[9.5px] text-ink-4">Connected Aug 2024 · has never delivered a row</p>
          </div>

          <div>
            <p className="font-mono text-[8.5px] font-medium tracking-[0.85px] text-ink-4 uppercase">What happens</p>
            <div className="mt-1.5 space-y-2">
              {DS14_HAPPENS.map((item) => (
                <div key={item.label} className="relative overflow-hidden rounded-panel border border-line bg-paper py-2.5 pr-3.5 pl-4">
                  <span className={cn("absolute inset-y-0 left-0 w-[3px]", TONE_BAR_CLASS[item.tone])} aria-hidden />
                  <p className="text-[11px] font-semibold text-ink">{item.label}</p>
                  <p className={cn("mt-0.5 text-[9.5px]", DS_TONE_CLASS[item.tone])}>{item.sub}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="rounded-card border border-rose-border bg-rose-bg p-3.5">
            <p className="text-[12px] font-semibold text-ink">Disconnecting it removes the evidence that it never worked</p>
            <p className="mt-1.5 text-[10.5px] leading-relaxed text-rose">
              A silent source on the list is an open question about a feature that was built and never fired. A
              missing source is nothing at all, and in a year nobody will know the tiers were never shown.
            </p>
          </div>

          <p className="text-[10.5px] leading-relaxed text-ink-3">
            The tidiest thing to do with this row is the wrong thing. It has carried nothing for a year and
            cleaning it up costs one click. What it is actually doing is holding a question open — why does a
            loyalty feature exist that has never displayed a tier — and that question is worth more than a shorter
            list of sources.
          </p>
        </DialogBody>

        <DialogFooter>
          <div className="flex items-center gap-4">
            <Button type="button" variant="destructive" onClick={confirm}>
              Disconnect it
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
