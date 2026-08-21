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
import { CP15_STOP_PRESET } from "@/pages/customers/campaigns/data";

/** CP15 — "Stop a campaign", hardcoded to the "Reactivation · wave one" reference row. Opens from the Running route. */
export function StopACampaignModal({ open, onOpenChange }: { open: boolean; onOpenChange: (open: boolean) => void }) {
  const navigate = useNavigate();
  const preset = CP15_STOP_PRESET;

  const confirm = () => {
    onOpenChange(false);
    toast.success("Stopped · closed as unattributable");
    navigate("/campaigns");
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-xl">
        <DialogHeader>
          <DialogTitle>Stop this campaign</DialogTitle>
          <DialogDescription>Three of four reasons are refused, and one of them is the usual one</DialogDescription>
        </DialogHeader>

        <DialogBody className="space-y-4 px-5 py-5 sm:px-7 sm:py-6">
          <div className="rounded-panel border border-line bg-paper-2 px-3.5 py-3">
            <p className="text-[12px] font-semibold text-ink">{preset.subject}</p>
            <p className="mt-1 font-mono text-[9.5px] text-ink-4">{preset.subjectDetail}</p>
          </div>

          <div>
            <p className="font-mono text-[8.5px] font-medium tracking-[0.85px] text-ink-4 uppercase">Why are you stopping it</p>
            <div className="mt-1.5 space-y-2">
              {preset.reasons.map((reason) => (
                <div
                  key={reason.label}
                  className={cn(
                    "flex items-center gap-3 rounded-panel border px-3.5 py-3",
                    reason.blocked
                      ? "border-line bg-paper-2"
                      : reason.on
                        ? "border-ultra-border bg-ultra-bg"
                        : "border-line bg-paper"
                  )}
                >
                  {reason.blocked ? (
                    <span className="flex size-3 shrink-0 items-center justify-center text-[10px] text-rose">✕</span>
                  ) : (
                    <span
                      className={cn(
                        "size-3 shrink-0 rounded-full border",
                        reason.on ? "border-ultra bg-ultra" : "border-line bg-paper"
                      )}
                      aria-hidden
                    />
                  )}
                  <div>
                    <p className={cn("text-[11.5px] font-semibold", reason.blocked ? "text-ink-4" : "text-ink")}>{reason.label}</p>
                    <p className="mt-0.5 text-[9.5px] text-ink-4">{reason.sub}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="rounded-card border border-rose-border bg-rose-bg p-3.5">
            <p className="text-[12px] font-semibold text-ink">{preset.consequenceTitle}</p>
            <p className="mt-1.5 text-[10.5px] leading-relaxed text-rose">{preset.consequenceBody}</p>
          </div>

          <div className="rounded-card border border-ultra-border bg-ultra-bg p-3.5">
            <p className="text-[12px] font-semibold text-ink">The fourth reason is not offered and it is the one people reach for</p>
            <p className="mt-1.5 text-[10.5px] leading-relaxed text-ink-2">{preset.closingNote}</p>
          </div>
        </DialogBody>

        <DialogFooter>
          <div className="flex items-center gap-4">
            <Button type="button" onClick={confirm}>
              Stop and close as unattributable
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
