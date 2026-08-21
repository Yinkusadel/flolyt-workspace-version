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
import { SG12_FREEZE_PRESET, SG_TONE_CLASS } from "@/pages/customers/segments/data";

const TONE_BAR_CLASS = {
  ok: "bg-teal",
  warn: "bg-amber",
  risk: "bg-rose",
  ai: "bg-ultra",
  muted: "bg-ink-4",
  neutral: "bg-ink-3",
  num: "bg-ink-3",
} as const;

/** SG12 — "Freeze a segment", hardcoded to the "Lapsed after the fee change" reference row. */
export function FreezeASegmentModal({ open, onOpenChange }: { open: boolean; onOpenChange: (open: boolean) => void }) {
  const navigate = useNavigate();
  const preset = SG12_FREEZE_PRESET;

  const confirm = () => {
    onOpenChange(false);
    toast.success("Frozen until 21 August");
    navigate("/segments/lapsed-fee");
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-xl">
        <DialogHeader>
          <DialogTitle>Freeze this segment</DialogTitle>
          <DialogDescription>Membership locks · and it starts going stale the same minute</DialogDescription>
        </DialogHeader>

        <DialogBody className="space-y-4 px-5 py-5 sm:px-7 sm:py-6">
          <div className="rounded-panel border border-line bg-paper-2 px-3.5 py-3">
            <p className="text-[12px] font-semibold text-ink">{preset.subject}</p>
            <p className="mt-1 font-mono text-[9.5px] text-ink-4">{preset.subjectDetail}</p>
          </div>

          <div>
            <p className="font-mono text-[8.5px] font-medium tracking-[0.85px] text-ink-4 uppercase">What freezing does</p>
            <div className="mt-1.5 space-y-2">
              {preset.effects.map((effect) => (
                <div key={effect.label} className="relative overflow-hidden rounded-panel border border-line bg-paper py-2.5 pr-3.5 pl-4">
                  <span className={cn("absolute inset-y-0 left-0 w-[3px]", TONE_BAR_CLASS[effect.tone])} aria-hidden />
                  <p className="text-[11px] font-semibold text-ink">{effect.label}</p>
                  <p className={cn("mt-0.5 text-[9.5px]", SG_TONE_CLASS[effect.tone])}>{effect.sub}</p>
                </div>
              ))}
            </div>
          </div>

          <div>
            <p className="font-mono text-[8.5px] font-medium tracking-[0.85px] text-ink-4 uppercase">Until when · required</p>
            <div className="mt-1.5 space-y-2">
              {preset.untilOptions.map((option) => (
                <div
                  key={option.label}
                  className={cn(
                    "flex items-center gap-3 rounded-panel border px-3.5 py-3",
                    option.blocked
                      ? "border-line bg-paper-2"
                      : option.selected
                        ? "border-ultra-border bg-ultra-bg"
                        : "border-line bg-paper"
                  )}
                >
                  {option.blocked ? (
                    <span className="flex size-3 shrink-0 items-center justify-center text-[10px] text-rose">✕</span>
                  ) : (
                    <span
                      className={cn(
                        "size-3 shrink-0 rounded-full border",
                        option.selected ? "border-ultra bg-ultra" : "border-line bg-paper"
                      )}
                      aria-hidden
                    />
                  )}
                  <div>
                    <p className={cn("text-[11.5px] font-semibold", option.blocked ? "text-ink-4" : "text-ink")}>{option.label}</p>
                    <p className="mt-0.5 text-[9.5px] text-ink-4">{option.sub}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="rounded-card border border-amber-border bg-amber-bg p-3.5">
            <p className="text-[12px] font-semibold text-ink">A frozen segment is right for the experiment and wrong for everything else</p>
            <p className="mt-1.5 text-[10.5px] leading-relaxed text-ink-2">{preset.closingNote}</p>
          </div>
        </DialogBody>

        <DialogFooter>
          <div className="flex items-center gap-4">
            <Button type="button" onClick={confirm}>
              Freeze until 21 August
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
