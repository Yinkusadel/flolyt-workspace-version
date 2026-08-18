import { useState } from "react";
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

type ShareOption = { id: string; title: string; note: string };
type ExportFormat = { id: string; label: string; note: string };

export type ShareOrExportPreset = {
  viewLabel: string;
  snapshotLabel: string;
  shareOptions: ShareOption[];
  exportFormats: ExportFormat[];
  caveatTitle: string;
  caveatBody: string;
};

/** A15 — "share or export" modal, available from any stage screen. */
export function ShareOrExportModal({
  preset,
  open,
  onOpenChange,
}: {
  preset: ShareOrExportPreset;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}) {
  const [shareOption, setShareOption] = useState(preset.shareOptions[0]?.id);

  const confirm = () => {
    onOpenChange(false);
    toast.success("Shared");
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-xl">
        <DialogHeader>
          <DialogTitle>Share this view</DialogTitle>
          <DialogDescription>{preset.viewLabel}</DialogDescription>
        </DialogHeader>

        <DialogBody className="space-y-4 px-5 py-5 sm:px-7 sm:py-6">
          <div>
            <p className="font-mono text-[8.5px] font-medium tracking-[0.85px] text-ink-4 uppercase">
              What you are sharing
            </p>
            <div className="mt-1.5 rounded-panel border border-line bg-paper-2 px-3.5 py-2.5">
              <p className="text-[11.5px] font-semibold text-ink">{preset.snapshotLabel}</p>
              <p className="mt-0.5 text-[9px] text-ink-4">A live view, not a snapshot — the numbers move when the sources do</p>
            </div>
          </div>

          <div className="space-y-2">
            {preset.shareOptions.map((option) => (
              <button
                key={option.id}
                type="button"
                onClick={() => setShareOption(option.id)}
                className={cn(
                  "flex w-full items-start gap-2.5 rounded-panel border px-3.5 py-2.5 text-left transition-colors",
                  shareOption === option.id ? "border-ultra-border bg-ultra-bg" : "border-line bg-paper hover:border-ink-4"
                )}
              >
                <span
                  className={cn(
                    "mt-0.5 size-3 shrink-0 rounded-full border",
                    shareOption === option.id ? "border-ultra bg-ultra" : "border-line bg-paper"
                  )}
                  aria-hidden
                />
                <span className="min-w-0">
                  <span className="block text-[11.5px] font-semibold text-ink">{option.title}</span>
                  <span className="mt-0.5 block text-[9.5px] text-ink-4">{option.note}</span>
                </span>
              </button>
            ))}
          </div>

          <div>
            <p className="font-mono text-[8.5px] font-medium tracking-[0.85px] text-ink-4 uppercase">Export</p>
            <div className="mt-1.5 grid grid-cols-3 gap-2.5">
              {preset.exportFormats.map((format) => (
                <button
                  key={format.id}
                  type="button"
                  onClick={() => toast.info(`Exporting ${format.label}`)}
                  className="rounded-panel border border-line bg-paper px-3.5 py-2.5 text-left transition-colors hover:border-ink-4"
                >
                  <span className="block font-mono text-[11.5px] font-semibold text-ink">{format.label}</span>
                  <span className="mt-0.5 block text-[9px] text-ink-4">{format.note}</span>
                </button>
              ))}
            </div>
          </div>

          <div className="relative overflow-hidden rounded-card border border-amber-border bg-amber-bg pl-4">
            <span className="absolute inset-y-0 left-0 w-[3px] bg-amber" aria-hidden />
            <div className="p-3.5 pl-1">
              <p className="text-[12px] font-semibold text-ink">{preset.caveatTitle}</p>
              <p className="mt-1.5 text-[10.5px] leading-relaxed text-ink-2">{preset.caveatBody}</p>
            </div>
          </div>
        </DialogBody>

        <DialogFooter>
          <div className="flex items-center gap-4">
            <Button type="button" onClick={confirm}>
              Share it
            </Button>
            <button
              type="button"
              onClick={() => onOpenChange(false)}
              className="text-[12px] font-semibold text-ink-3 hover:text-ink"
            >
              Cancel
            </button>
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
