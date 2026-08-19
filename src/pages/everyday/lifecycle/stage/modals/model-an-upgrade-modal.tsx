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
import { Callout } from "@/pages/everyday/lifecycle/stage/rail";
import type { ModelUpgradePreset } from "@/pages/everyday/lifecycle/stage/expand/data";

const TELL_TONE_CLASS: Record<"teal" | "amber" | "rose", string> = { teal: "text-teal", amber: "text-amber", rose: "text-rose" };

/** EX13 — Expand's "model an upgrade offer" modal, opened from the Upgrade paths tab's header CTA. */
export function ModelAnUpgradeModal({
  preset,
  open,
  onOpenChange,
}: {
  preset: ModelUpgradePreset;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}) {
  const navigate = useNavigate();

  const confirm = () => {
    onOpenChange(false);
    toast.success("Room opened");
    navigate("/rooms");
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-xl">
        <DialogHeader>
          <DialogTitle>Model an upgrade offer</DialogTitle>
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

          <div className="rounded-panel border border-ultra-border bg-ultra-bg px-3.5 py-2.5">
            <p className="text-[12.5px] font-semibold text-ultra">{preset.summaryTitle}</p>
            <p className="mt-1 font-mono text-[9.5px] text-ink-3">{preset.summaryBody}</p>
          </div>

          <div>
            <p className="font-mono text-[8.5px] font-medium tracking-[0.85px] text-ink-4 uppercase">{preset.tellEyebrow}</p>
            <div className="mt-1.5 divide-y divide-line overflow-hidden rounded-panel border border-line bg-paper">
              {preset.tellRows.map((row) => (
                <div key={row.label} className="flex flex-col gap-0.5 px-3.5 py-2.5 sm:flex-row sm:items-baseline sm:justify-between sm:gap-4">
                  <span className="text-[10.5px] text-ink-2">{row.label}</span>
                  <span className={`font-mono text-[10.5px] font-semibold ${TELL_TONE_CLASS[row.tone]}`}>{row.value}</span>
                </div>
              ))}
            </div>
          </div>

          <Callout tone="amber" title={preset.closingTitle}>
            {preset.closingBody}
          </Callout>
        </DialogBody>

        <DialogFooter>
          <div className="flex items-center gap-4">
            <Button type="button" onClick={confirm}>
              Open a room to test it
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
