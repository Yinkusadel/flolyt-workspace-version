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
import { AB14_PRESET, AB_TONE_CLASS } from "@/pages/agents/agent-builder/data";

const TONE_BORDER_CLASS = {
  ok: "border-l-teal",
  warn: "border-l-amber",
  risk: "border-l-rose",
  ai: "border-l-ultra",
  muted: "border-l-ink-4",
  neutral: "border-l-ink-4",
  num: "border-l-ink-4",
} as const;

/** AB14 — "Retire a built agent", a worked example hardcoded to Reseller Terms (already retired in August). */
export function RetireModal({ open, onOpenChange }: { open: boolean; onOpenChange: (open: boolean) => void }) {
  const preset = AB14_PRESET;

  const confirm = () => {
    onOpenChange(false);
    toast.success("Reseller Terms was retired in August — this is how it was explained");
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-xl">
        <DialogHeader>
          <DialogTitle>Retire this agent</DialogTitle>
          <DialogDescription>It stops reading · everything it found stays</DialogDescription>
        </DialogHeader>

        <DialogBody className="space-y-4 px-5 py-5 sm:px-7 sm:py-6">
          <div className="rounded-panel border border-line bg-paper-2 px-3.5 py-3">
            <p className="text-[12px] font-semibold text-ink">{preset.title}</p>
            <p className="mt-1 font-mono text-[9.5px] text-ink-4">{preset.meta}</p>
          </div>

          <div>
            <p className="font-mono text-[8.5px] font-medium tracking-[0.85px] text-ink-4 uppercase">Why it is being retired · typed</p>
            <div className="mt-1.5 rounded-panel border border-line2 bg-white p-3.5">
              <p className="text-[10.5px] leading-relaxed text-ink-2">{preset.reason}</p>
            </div>
          </div>

          <div>
            <p className="font-mono text-[8.5px] font-medium tracking-[0.85px] text-ink-4 uppercase">What retiring does</p>
            <div className="mt-1.5 space-y-2">
              {preset.effects.map((item) => (
                <div key={item.label} className={`rounded-panel border border-l-[3px] border-line bg-paper px-3.5 py-2.5 ${TONE_BORDER_CLASS[item.tone]}`}>
                  <p className="text-[11px] font-semibold text-ink">{item.label}</p>
                  <p className={`mt-0.5 text-[9.5px] ${AB_TONE_CLASS[item.tone]}`}>{item.sub}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="rounded-card border border-line bg-paper-2 p-3.5">
            <p className="text-[12px] font-semibold text-ink">An agent retired because its knowledge moved somewhere better is the good ending</p>
            <p className="mt-1.5 text-[10.5px] leading-relaxed text-ink-2">{preset.footnote}</p>
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
