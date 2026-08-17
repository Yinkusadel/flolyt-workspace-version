import { toast } from "sonner";
import { useState } from "react";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { cn } from "@/lib/utils";

export type FieldCandidate = {
  id: string;
  field: string;
  source: string;
};

export type MapAFieldPreset = {
  needTitle: string;
  needNote: string;
  candidates: FieldCandidate[];
  noneOption: string;
  warningTitle: string;
  warningBody: string;
};

/** A12 — "map a field" modal, shown from any "Unavailable" metric's connect action. */
export function MapAFieldModal({
  metricLabel,
  preset,
  open,
  onOpenChange,
}: {
  metricLabel: string;
  preset: MapAFieldPreset;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}) {
  const [selected, setSelected] = useState<string | "none">(preset.candidates[0]?.id ?? "none");

  const confirm = () => {
    onOpenChange(false);
    toast.success(selected === "none" ? "Connecting a new source" : "Previewing the change");
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-xl">
        <DialogHeader>
          <DialogTitle>Map a field</DialogTitle>
          <DialogDescription>{metricLabel} needs cost of goods · here is what Flolyt found</DialogDescription>
        </DialogHeader>

        <div className="space-y-4 px-5 py-5 sm:px-7 sm:py-6">
          <div className="rounded-panel border border-amber-border bg-amber-bg px-3.5 py-2.5">
            <p className="text-[12px] font-semibold text-ink">{preset.needTitle}</p>
            <p className="mt-0.5 text-[9px] text-amber">{preset.needNote}</p>
          </div>

          <div>
            <p className="font-mono text-[8.5px] font-medium tracking-[0.85px] text-ink-4 uppercase">
              What it found that might be it
            </p>
            <div className="mt-1.5 space-y-2">
              {preset.candidates.map((candidate) => (
                <button
                  key={candidate.id}
                  type="button"
                  onClick={() => setSelected(candidate.id)}
                  className={cn(
                    "flex w-full items-start gap-2.5 rounded-panel border px-3.5 py-2.5 text-left transition-colors",
                    selected === candidate.id
                      ? "border-ultra-border bg-ultra-bg"
                      : "border-line bg-paper hover:border-ink-4"
                  )}
                >
                  <span
                    className={cn(
                      "mt-0.5 size-3 shrink-0 rounded-full border",
                      selected === candidate.id ? "border-ultra bg-ultra" : "border-line bg-paper"
                    )}
                    aria-hidden
                  />
                  <span className="min-w-0">
                    <span className="block font-mono text-[11.5px] font-semibold text-ink">{candidate.field}</span>
                    <span className="mt-0.5 block text-[9px] text-ink-4">{candidate.source}</span>
                  </span>
                </button>
              ))}
              <button
                type="button"
                onClick={() => setSelected("none")}
                className={cn(
                  "w-full rounded-panel border border-dashed px-3.5 py-2.5 text-left text-[11px] transition-colors",
                  selected === "none" ? "border-ink-4 text-ink-2" : "border-line text-ink-3 hover:border-ink-4"
                )}
              >
                {preset.noneOption}
              </button>
            </div>
          </div>

          <div className="relative overflow-hidden rounded-card border border-amber-border bg-amber-bg pl-4">
            <span className="absolute inset-y-0 left-0 w-[3px] bg-amber" aria-hidden />
            <div className="p-3.5 pl-1">
              <p className="text-[12px] font-semibold text-ink">{preset.warningTitle}</p>
              <p className="mt-1.5 text-[10.5px] leading-relaxed text-ink-2">{preset.warningBody}</p>
            </div>
          </div>
        </div>

        <DialogFooter>
          <div className="flex items-center gap-4">
            <Button type="button" onClick={confirm}>
              {selected === "none" ? "Connect a source" : "Preview the change"}
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
