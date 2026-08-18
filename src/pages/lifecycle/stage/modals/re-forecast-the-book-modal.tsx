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

export type ReForecastBookPreset = {
  description: string;
  currentAssumptionsEyebrow: string;
  currentAssumptions: { label: string; value: string }[];
  rebuildEyebrow: string;
  options: { id: string; title: string; subtitle: string; selected?: boolean }[];
  numberChange: { from: string; to: string; delta: string; note: string };
  warningTitle: string;
  warningBody: string;
};

/** RN12 — Renew's "re-forecast the book" modal, opened from the Renewal book tab's header CTA. */
export function ReForecastTheBookModal({
  preset,
  open,
  onOpenChange,
}: {
  preset: ReForecastBookPreset;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}) {
  const confirm = () => {
    onOpenChange(false);
    toast.success("Book re-forecast and everyone downstream notified");
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-xl">
        <DialogHeader>
          <DialogTitle>Re-forecast the renewal book</DialogTitle>
          <DialogDescription>{preset.description}</DialogDescription>
        </DialogHeader>

        <DialogBody className="space-y-4 px-5 py-5 sm:px-7 sm:py-6">
          <div>
            <p className="font-mono text-[8.5px] font-medium tracking-[0.85px] text-ink-4 uppercase">{preset.currentAssumptionsEyebrow}</p>
            <div className="mt-1.5 space-y-1.5">
              {preset.currentAssumptions.map((row) => (
                <div key={row.label} className="flex items-center justify-between gap-3 rounded-panel border border-rose-border bg-rose-bg px-3.5 py-2">
                  <span className="text-[10.5px] text-ink-2">{row.label}</span>
                  <span className="font-mono text-[10px] font-semibold text-rose">{row.value}</span>
                </div>
              ))}
            </div>
          </div>

          <div>
            <p className="font-mono text-[8.5px] font-medium tracking-[0.85px] text-ink-4 uppercase">{preset.rebuildEyebrow}</p>
            <div className="mt-1.5 space-y-2.5">
              {preset.options.map((option) => (
                <div
                  key={option.id}
                  className={cn(
                    "flex items-start gap-3 rounded-panel border px-3.5 py-3",
                    option.selected ? "border-ultra-border bg-ultra-bg" : "border-line bg-paper"
                  )}
                >
                  <span
                    className={cn(
                      "mt-0.5 size-3 shrink-0 rounded-full border",
                      option.selected ? "border-ultra bg-ultra" : "border-line bg-paper"
                    )}
                    aria-hidden
                  />
                  <div>
                    <p className="text-[11.5px] font-semibold text-ink">{option.title}</p>
                    <p className="mt-0.5 text-[9px] text-ink-4">{option.subtitle}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="rounded-panel border border-amber-border bg-amber-bg px-3.5 py-3">
            <p className="font-mono text-[15px] font-semibold text-ink">
              {preset.numberChange.from} → {preset.numberChange.to}
            </p>
            <p className="mt-1 text-[9.5px] font-semibold text-amber">{preset.numberChange.delta}</p>
            <p className="mt-1 text-[9px] text-ink-3">{preset.numberChange.note}</p>
          </div>

          <div className="relative overflow-hidden rounded-card border-2 border-amber-border bg-amber-bg pl-4">
            <span className="absolute inset-y-0 left-0 w-[3px] bg-amber" aria-hidden />
            <div className="p-3.5 pl-1">
              <p className="text-[12px] font-semibold text-ink">{preset.warningTitle}</p>
              <p className="mt-1.5 text-[10.5px] leading-relaxed text-ink-2">{preset.warningBody}</p>
            </div>
          </div>
        </DialogBody>

        <DialogFooter>
          <div className="flex items-center gap-4">
            <Button type="button" onClick={confirm}>
              Re-forecast and notify
            </Button>
            <button type="button" onClick={() => onOpenChange(false)} className="text-[12px] font-semibold text-ink-3 hover:text-ink">
              Not yet
            </button>
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
