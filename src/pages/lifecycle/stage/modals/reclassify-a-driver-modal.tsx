import { useState } from "react";
import { useNavigate } from "react-router-dom";
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
import type { ReclassifyPreset } from "@/pages/lifecycle/stage/support/data";

const EFFECT_TONE_CLASS: Record<"teal" | "amber" | "neutral", string> = { teal: "text-teal", amber: "text-amber", neutral: "text-ink-3" };

/** SU12 — Support's "reclassify a driver" modal, opened from the Contact drivers tab's header CTA. */
export function ReclassifyADriverModal({
  preset,
  open,
  onOpenChange,
}: {
  preset: ReclassifyPreset;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}) {
  const navigate = useNavigate();
  const [optionId, setOptionId] = useState(preset.options.find((o) => o.selected)?.id ?? preset.options[0]?.id);

  const confirm = () => {
    onOpenChange(false);
    toast.success("Reclassified · room opened");
    navigate("/rooms");
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-xl">
        <DialogHeader>
          <DialogTitle>Reclassify this driver</DialogTitle>
          <DialogDescription>Move the cause to the stage that owns it, and open a room there</DialogDescription>
        </DialogHeader>

        <DialogBody className="space-y-4 px-5 py-5 sm:px-7 sm:py-6">
          <div>
            <p className="font-mono text-[8.5px] font-medium tracking-[0.85px] text-ink-4 uppercase">The driver</p>
            <div className="mt-1.5 rounded-panel border border-line bg-paper-2 px-3.5 py-2.5">
              <p className="text-[12px] font-semibold text-ink">{preset.driverSummary}</p>
              <p className="mt-0.5 text-[9px] text-ink-4">{preset.driverDetail}</p>
            </div>
          </div>

          <div>
            <p className="font-mono text-[8.5px] font-medium tracking-[0.85px] text-ink-4 uppercase">{preset.optionsEyebrow}</p>
            <div className="mt-1.5 space-y-2">
              {preset.options.map((option) => (
                <button
                  key={option.id}
                  type="button"
                  onClick={() => setOptionId(option.id)}
                  className={cn(
                    "flex w-full items-start gap-2.5 rounded-panel border px-3.5 py-2.5 text-left transition-colors",
                    optionId === option.id ? "border-ultra-border bg-ultra-bg" : "border-line bg-paper hover:border-ink-4"
                  )}
                >
                  <span
                    className={cn(
                      "mt-0.5 size-3 shrink-0 rounded-full border",
                      optionId === option.id ? "border-ultra bg-ultra" : "border-line bg-paper"
                    )}
                    aria-hidden
                  />
                  <span className="min-w-0">
                    <span className="block text-[11.5px] font-semibold text-ink">{option.title}</span>
                    <span className="mt-0.5 block text-[9.5px] text-ink-4">{option.body}</span>
                  </span>
                </button>
              ))}
            </div>
          </div>

          <div>
            <p className="font-mono text-[8.5px] font-medium tracking-[0.85px] text-ink-4 uppercase">{preset.effectsEyebrow}</p>
            <div className="mt-1.5 divide-y divide-line overflow-hidden rounded-panel border border-line bg-paper">
              {preset.effects.map((row) => (
                <div key={row.label} className="flex flex-col gap-0.5 px-3.5 py-2.5 sm:flex-row sm:items-baseline sm:justify-between sm:gap-4">
                  <span className="text-[10.5px] text-ink-2">{row.label}</span>
                  <span className={`font-mono text-[10.5px] ${EFFECT_TONE_CLASS[row.tone]}`}>{row.value}</span>
                </div>
              ))}
            </div>
          </div>

          <Callout tone="ultra" title={preset.closingTitle}>
            {preset.closingBody}
          </Callout>
        </DialogBody>

        <DialogFooter>
          <div className="flex items-center gap-4">
            <Button type="button" onClick={confirm}>
              Reclassify and open a room
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
