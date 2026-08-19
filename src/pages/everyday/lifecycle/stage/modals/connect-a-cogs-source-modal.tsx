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
import { Callout } from "@/pages/everyday/lifecycle/stage/rail";
import { Chip } from "@/pages/everyday/lifecycle/stage/chip";
import type { ConnectCogsPreset } from "@/pages/everyday/lifecycle/stage/price/data";

/** PR13 — Price's "connect a COGS source" modal, opened from the Margin tab's header CTA. */
export function ConnectACogsSourceModal({
  preset,
  open,
  onOpenChange,
}: {
  preset: ConnectCogsPreset;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}) {
  const upload = () => {
    onOpenChange(false);
    toast.success("CSV uploaded");
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-xl">
        <DialogHeader>
          <DialogTitle>Connect cost of goods</DialogTitle>
          <DialogDescription>Six figures across four stages unblock the moment this arrives</DialogDescription>
        </DialogHeader>

        <DialogBody className="space-y-4 px-5 py-5 sm:px-7 sm:py-6">
          <div>
            <p className="font-mono text-[8.5px] font-medium tracking-[0.85px] text-ink-4 uppercase">What Flolyt needs</p>
            <div className="mt-1.5 rounded-panel border border-amber-border bg-amber-bg px-3.5 py-2.5">
              <p className="text-[12px] font-semibold text-ink">{preset.needTitle}</p>
              <p className="mt-0.5 text-[9px] text-amber">{preset.needBody}</p>
            </div>
          </div>

          <div>
            <p className="font-mono text-[8.5px] font-medium tracking-[0.85px] text-ink-4 uppercase">{preset.optionsEyebrow}</p>
            <div className="mt-1.5 space-y-2.5">
              {preset.options.map((option) => (
                <div
                  key={option.id}
                  className={cn(
                    "flex items-center justify-between gap-3 rounded-panel border px-3.5 py-3",
                    option.disabled ? "border-line bg-paper-2" : option.selected ? "border-ultra-border bg-ultra-bg" : "border-line bg-paper"
                  )}
                >
                  <div className="flex items-start gap-3">
                    {option.disabled ? (
                      <span className="mt-0.5 text-[11px] font-semibold text-rose" aria-hidden>
                        ✕
                      </span>
                    ) : (
                      <span
                        className={cn(
                          "mt-0.5 size-3 shrink-0 rounded-full border",
                          option.selected ? "border-ultra bg-ultra" : "border-line bg-paper"
                        )}
                        aria-hidden
                      />
                    )}
                    <div>
                      <p className={cn("text-[11.5px] font-semibold", option.disabled ? "text-ink-4" : "text-ink")}>{option.title}</p>
                      <p className="mt-0.5 text-[9px] text-ink-4">{option.subtitle}</p>
                    </div>
                  </div>
                  <Chip tone={option.badgeTone}>{option.badge}</Chip>
                </div>
              ))}
            </div>
          </div>

          <Callout tone="rose" title={preset.warningTitle}>
            {preset.warningBody}
          </Callout>
        </DialogBody>

        <DialogFooter>
          <div className="flex items-center gap-4">
            <Button type="button" onClick={upload}>
              Upload a CSV
            </Button>
            <button type="button" onClick={() => onOpenChange(false)} className="text-[12px] font-semibold text-ink-3 hover:text-ink">
              Not now
            </button>
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
