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
import { Callout } from "@/pages/lifecycle/stage/rail";
import type { BuildAudiencePreset } from "@/pages/lifecycle/stage/retain/data";

/** RT13 — Retain's "build a reactivation audience" modal, opened from the Reactivation tab's header CTA. */
export function BuildAnAudienceModal({
  preset,
  open,
  onOpenChange,
}: {
  preset: BuildAudiencePreset;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}) {
  const build = () => {
    onOpenChange(false);
    toast.success("Audience built");
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-xl">
        <DialogHeader>
          <DialogTitle>Build a reactivation audience</DialogTitle>
          <DialogDescription>{preset.subtitle}</DialogDescription>
        </DialogHeader>

        <DialogBody className="space-y-4 px-5 py-5 sm:px-7 sm:py-6">
          <div>
            <p className="font-mono text-[8.5px] font-medium tracking-[0.85px] text-ink-4 uppercase">{preset.criteriaEyebrow}</p>
            <div className="mt-1.5 divide-y divide-line overflow-hidden rounded-panel border border-line bg-paper-2">
              {preset.criteria.map((row) => (
                <div key={row.label} className="flex items-baseline justify-between gap-3 px-3.5 py-2.5">
                  <span className="text-[10px] text-ink-3">{row.label}</span>
                  <span className="font-mono text-[10px] font-semibold text-ink">{row.value}</span>
                </div>
              ))}
            </div>
          </div>

          <div>
            <p className="font-mono text-[8.5px] font-medium tracking-[0.85px] text-ink-4 uppercase">{preset.exclusionsEyebrow}</p>
            <div className="mt-1.5 divide-y divide-line overflow-hidden rounded-panel border border-line bg-paper">
              <div className="flex items-baseline justify-between gap-3 px-3.5 py-2.5">
                <span className="text-[11.5px] font-semibold text-ink-2">{preset.matchedLabel}</span>
                <span className="font-mono text-[11px] font-semibold text-ink-2">{preset.matchedValue}</span>
              </div>
              {preset.exclusions.map((row) => (
                <div key={row.label} className="px-3.5 py-2.5">
                  <div className="flex items-baseline justify-between gap-3">
                    <span className="text-[11px] text-ink-2">{row.label}</span>
                    <span className="font-mono text-[11px] font-semibold text-rose">{row.value}</span>
                  </div>
                  {row.note && <p className="mt-0.5 text-[9px] text-ink-4">{row.note}</p>}
                </div>
              ))}
              <div className="flex items-baseline justify-between gap-3 px-3.5 py-2.5">
                <span className="text-[11.5px] font-semibold text-ink">{preset.finalLabel}</span>
                <span className="font-mono text-[11px] font-semibold text-teal">{preset.finalValue}</span>
              </div>
            </div>
          </div>

          <div className="rounded-panel border border-ultra-border bg-ultra-bg px-3.5 py-2.5">
            <p className="text-[12.5px] font-semibold text-ultra">{preset.summaryTitle}</p>
            <p className="mt-1 font-mono text-[9.5px] text-ink-3">{preset.summaryBody}</p>
          </div>

          <Callout tone="teal" title={preset.closingTitle}>
            {preset.closingBody}
          </Callout>
        </DialogBody>

        <DialogFooter>
          <div className="flex items-center gap-4">
            <Button type="button" onClick={build}>
              Build the audience
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
