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
import { ME16_PRESET } from "@/pages/knowledge/business-memory/data";

/** ME16 — "Supersede a learning", hardcoded to the "Reactivation works best on a Thursday" reference row. */
export function SupersedeALearningModal({ open, onOpenChange }: { open: boolean; onOpenChange: (open: boolean) => void }) {
  const preset = ME16_PRESET;

  const confirm = () => {
    onOpenChange(false);
    toast.success("Superseded everywhere");
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-xl">
        <DialogHeader>
          <DialogTitle>Supersede this learning</DialogTitle>
          <DialogDescription>Scope is required · nothing is superseded everywhere by default</DialogDescription>
        </DialogHeader>

        <DialogBody className="space-y-4 px-5 py-5 sm:px-7 sm:py-6">
          <div className="rounded-panel border border-line bg-paper-2 px-3.5 py-3">
            <p className="text-[12px] font-semibold text-ink">{preset.subject}</p>
            <p className="mt-1 font-mono text-[9.5px] text-ink-4">{preset.subjectDetail}</p>
          </div>

          <div>
            <p className="font-mono text-[8.5px] font-medium tracking-[0.85px] text-ink-4 uppercase">What replaces it</p>
            <div className="mt-1.5 rounded-panel border border-line bg-paper px-3.5 py-3">
              <p className="text-[10.5px] leading-relaxed text-ink-2">{preset.replacementBody}</p>
            </div>
          </div>

          <div>
            <p className="font-mono text-[8.5px] font-medium tracking-[0.85px] text-ink-4 uppercase">
              Where is it superseded · required
            </p>
            <div className="mt-1.5 space-y-2">
              {preset.scopeOptions.map((option) => (
                <div
                  key={option.label}
                  className={cn(
                    "flex items-center gap-3 rounded-panel border px-3.5 py-3",
                    option.selected ? "border-ultra-border bg-ultra-bg" : "border-line bg-paper"
                  )}
                >
                  <span
                    className={cn(
                      "size-3 shrink-0 rounded-full border",
                      option.selected ? "border-ultra bg-ultra" : "border-line bg-paper"
                    )}
                    aria-hidden
                  />
                  <div>
                    <p className="text-[11.5px] font-semibold text-ink">{option.label}</p>
                    <p className="mt-0.5 text-[9.5px] text-ink-4">{option.sub}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <p className="text-[10.5px] leading-relaxed text-ink-3">{preset.closingNote}</p>
        </DialogBody>

        <DialogFooter>
          <div className="flex items-center gap-4">
            <Button type="button" onClick={confirm}>
              Supersede everywhere
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
