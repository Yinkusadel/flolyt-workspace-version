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
import { Callout } from "@/pages/lifecycle/stage/rail";
import type { RequestInstrumentationPreset, UnblockRow } from "@/pages/lifecycle/stage/adopt/data";

const UNBLOCK_TONE_CLASS: Record<UnblockRow["tone"], string> = { neutral: "text-ink-2", amber: "text-amber", rose: "text-rose" };

/** AD13 — Adopt's "request instrumentation" modal, opened from the Not instrumented tab's header CTA. */
export function RequestInstrumentationModal({
  preset,
  open,
  onOpenChange,
}: {
  preset: RequestInstrumentationPreset;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}) {
  const send = () => {
    onOpenChange(false);
    toast.success("Sent to Engineering");
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-xl">
        <DialogHeader>
          <DialogTitle>Request instrumentation</DialogTitle>
          <DialogDescription>{preset.subtitle}</DialogDescription>
        </DialogHeader>

        <DialogBody className="space-y-4 px-5 py-5 sm:px-7 sm:py-6">
          <div>
            <p className="font-mono text-[8.5px] font-medium tracking-[0.85px] text-ink-4 uppercase">What is invisible</p>
            <div className="mt-1.5 rounded-panel border border-amber-border bg-amber-bg px-3.5 py-2.5">
              <p className="text-[12px] font-semibold text-ink">{preset.invisibleTitle}</p>
              <p className="mt-0.5 text-[9px] text-amber">{preset.invisibleBody}</p>
            </div>
          </div>

          <div>
            <p className="font-mono text-[8.5px] font-medium tracking-[0.85px] text-ink-4 uppercase">{preset.needsEyebrow}</p>
            <div className="mt-1.5 space-y-2">
              {preset.events.map((event) => (
                <div key={event.id} className="rounded-panel border border-line bg-paper-2 px-3.5 py-2.5">
                  <p className="font-mono text-[11px] font-semibold text-ink">{event.name}</p>
                  <p className="mt-0.5 text-[9px] text-ink-4">{event.description}</p>
                </div>
              ))}
            </div>
          </div>

          <div>
            <p className="font-mono text-[8.5px] font-medium tracking-[0.85px] text-ink-4 uppercase">{preset.unblockEyebrow}</p>
            <div className="mt-1.5 divide-y divide-line overflow-hidden rounded-panel border border-line bg-paper">
              {preset.unblockRows.map((row) => (
                <div key={row.label} className="flex flex-col gap-1 px-3.5 py-2.5 sm:flex-row sm:items-baseline sm:justify-between sm:gap-4">
                  <span className="text-[11px] text-ink-2">{row.label}</span>
                  <span className={cn("font-mono text-[10.5px]", UNBLOCK_TONE_CLASS[row.tone])}>{row.value}</span>
                </div>
              ))}
            </div>
          </div>

          <Callout tone="amber" title={preset.obligationTitle}>
            {preset.obligationBody}
          </Callout>
        </DialogBody>

        <DialogFooter>
          <div className="flex items-center gap-4">
            <Button type="button" onClick={send}>
              Send to Engineering
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
