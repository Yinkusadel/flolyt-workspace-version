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
import { FN11_PRESET, FN_TONE_CLASS } from "@/pages/revenue/funnel/data";

/** FN11 — "Request instrumentation", hardcoded to `checkout.fee_shown`, opened from the "Not instrumented" tab (/funnel/gaps). */
export function RequestInstrumentationModal({ open, onOpenChange }: { open: boolean; onOpenChange: (open: boolean) => void }) {
  const preset = FN11_PRESET;

  const send = () => {
    onOpenChange(false);
    toast.success("Request sent to Sam Iyer");
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-xl">
        <DialogHeader>
          <DialogTitle>Request instrumentation</DialogTitle>
          <DialogDescription>The request names what it blocks, not how urgent it feels</DialogDescription>
        </DialogHeader>

        <DialogBody className="space-y-4 px-5 py-5 sm:px-7 sm:py-6">
          <div className="rounded-panel border border-line bg-paper-2 px-3.5 py-3">
            <p className="font-mono text-[12px] font-semibold text-ink">{preset.event}</p>
            <p className="mt-1 font-mono text-[9.5px] text-ink-4">{preset.eventMeta}</p>
          </div>

          <div>
            <p className="font-mono text-[8.5px] font-medium tracking-[0.85px] text-ink-4 uppercase">What this blocks · filled in, not typed by you</p>
            <div className="mt-1.5 space-y-2">
              {preset.blocks.map((block) => (
                <div key={block.label} className="rounded-panel border border-line bg-paper px-3.5 py-2.5">
                  <p className="text-[11px] font-semibold text-ink">{block.label}</p>
                  <p className={cn("mt-0.5 text-[9.5px]", FN_TONE_CLASS[block.tone])}>{block.value}</p>
                </div>
              ))}
            </div>
          </div>

          <div>
            <p className="font-mono text-[8.5px] font-medium tracking-[0.85px] text-ink-4 uppercase">When is it needed by</p>
            <div className="mt-1.5 space-y-2">
              {preset.neededBy.map((option) => (
                <div
                  key={option.label}
                  className={cn(
                    "flex items-start gap-2.5 rounded-panel border px-3.5 py-2.5",
                    option.on ? "border-ultra-border bg-ultra-bg" : "border-line bg-paper"
                  )}
                >
                  <span className={cn("mt-0.5 size-3 shrink-0 rounded-full border", option.on ? "border-ultra bg-ultra" : "border-line bg-paper")} aria-hidden />
                  <span className="min-w-0">
                    <span className="block text-[11.5px] font-semibold text-ink">{option.label}</span>
                    <span className="mt-0.5 block text-[9.5px] text-ink-4">{option.sub}</span>
                  </span>
                </div>
              ))}
            </div>
          </div>

          <div className="rounded-card border border-amber-border bg-amber-bg p-3.5">
            <p className="text-[12px] font-semibold text-ink">This is the fifth time and the screen says so</p>
            <p className="mt-1.5 text-[10.5px] leading-relaxed text-ink-2">{preset.closingNote}</p>
          </div>
        </DialogBody>

        <DialogFooter>
          <div className="flex items-center gap-4">
            <Button type="button" onClick={send}>
              Send the request
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
