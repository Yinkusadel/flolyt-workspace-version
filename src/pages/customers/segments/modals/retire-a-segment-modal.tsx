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
import { SG13_RETIRE_PRESET, SG_TONE_CLASS } from "@/pages/customers/segments/data";

const TONE_BAR_CLASS = {
  ok: "bg-teal",
  warn: "bg-amber",
  risk: "bg-rose",
  ai: "bg-ultra",
  muted: "bg-ink-4",
  neutral: "bg-ink-3",
  num: "bg-ink-3",
} as const;

/** SG13 — "Retire a segment", hardcoded to the "Lagos, order failed in March" reference row. */
export function RetireASegmentModal({ open, onOpenChange }: { open: boolean; onOpenChange: (open: boolean) => void }) {
  const navigate = useNavigate();
  const preset = SG13_RETIRE_PRESET;

  const confirm = () => {
    onOpenChange(false);
    toast.success("Retired · still readable");
    navigate("/segments/retired");
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-xl">
        <DialogHeader>
          <DialogTitle>Retire this segment</DialogTitle>
          <DialogDescription>It stops being usable and stays readable forever</DialogDescription>
        </DialogHeader>

        <DialogBody className="space-y-4 px-5 py-5 sm:px-7 sm:py-6">
          <div className="rounded-panel border border-line bg-paper-2 px-3.5 py-3">
            <p className="text-[12px] font-semibold text-ink">{preset.subject}</p>
            <p className="mt-1 font-mono text-[9.5px] text-ink-4">{preset.subjectDetail}</p>
          </div>

          <div>
            <p className="font-mono text-[8.5px] font-medium tracking-[0.85px] text-ink-4 uppercase">Why it is being retired · typed</p>
            <div className="mt-1.5 rounded-panel border border-line bg-white px-3.5 py-3">
              <p className="text-[10.5px] leading-relaxed text-ink-2">{preset.reason}</p>
            </div>
          </div>

          <div>
            <p className="font-mono text-[8.5px] font-medium tracking-[0.85px] text-ink-4 uppercase">What retiring does and does not do</p>
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

          <div className="rounded-card border border-teal-border bg-teal-bg p-3.5">
            <p className="text-[12px] font-semibold text-ink">Retiring is about what may happen next, not about tidying up</p>
            <p className="mt-1.5 text-[10.5px] leading-relaxed text-ink-2">{preset.closingNote}</p>
          </div>
        </DialogBody>

        <DialogFooter>
          <div className="flex items-center gap-4">
            <Button type="button" onClick={confirm}>
              Retire it
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
