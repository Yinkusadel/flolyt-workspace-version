import { X } from "lucide-react";
import { toast } from "sonner";
import { useNavigate } from "react-router-dom";

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
import { S131_BECOME, SECOND_ORDER_ROOM_HREF } from "@/pages/revenue/scenario/data";

/** SC13 — "Turn it into something", hardcoded to S-131, opened from the S-131 detail page. */
export function TurnItIntoSomethingModal({ open, onOpenChange }: { open: boolean; onOpenChange: (open: boolean) => void }) {
  const navigate = useNavigate();

  const attach = () => {
    onOpenChange(false);
    toast.success("Attached to Second order never happened, as a question");
    navigate(SECOND_ORDER_ROOM_HREF);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-xl">
        <DialogHeader>
          <DialogTitle>What this can become</DialogTitle>
          <DialogDescription>Two of the four are not offered, and the screen says why</DialogDescription>
        </DialogHeader>

        <DialogBody className="space-y-4 px-5 py-5 sm:px-7 sm:py-6">
          <div className="rounded-panel border border-line bg-paper-2 px-3.5 py-3">
            <p className="text-[12px] font-semibold text-ink">S-131 · Reactivation wave three at 52,000</p>
            <p className="mt-1 font-mono text-[9.5px] text-ink-4">₦31M – ₦58M · confidence 4 of 5 · modelled by Ifeoma Nwosu</p>
          </div>

          <div>
            <p className="font-mono text-[8.5px] font-medium tracking-[0.85px] text-ink-4 uppercase">What this scenario can become</p>
            <div className="mt-1.5 space-y-2">
              {S131_BECOME.map((row) => (
                <div
                  key={row.label}
                  className={cn(
                    "flex items-start gap-2.5 rounded-panel border px-3.5 py-2.5",
                    row.on ? "border-ultra-border bg-ultra-bg" : row.blocked ? "border-line bg-paper-2" : "border-line bg-paper"
                  )}
                >
                  {row.blocked ? (
                    <X className="mt-0.5 size-3.5 shrink-0 text-rose" aria-hidden />
                  ) : (
                    <span className={cn("mt-0.5 size-3 shrink-0 rounded-full border", row.on ? "border-ultra bg-ultra" : "border-line bg-white")} aria-hidden />
                  )}
                  <span className="min-w-0">
                    <span className={cn("block text-[11.5px] font-semibold", row.blocked ? "text-ink-4" : "text-ink")}>{row.label}</span>
                    <span className="mt-0.5 block text-[9.5px] text-ink-4">{row.sub}</span>
                  </span>
                </div>
              ))}
            </div>
          </div>

          <div className="rounded-card border border-amber-border bg-amber-bg p-3.5">
            <p className="text-[11px] font-semibold text-ink">Wave three is 52,000 and the standing authority stops at 50,000</p>
            <p className="mt-1.5 text-[10.5px] leading-relaxed text-amber">
              Neither the scenario nor the play will round it down to 49,999. It waits for Ada, and the wait costs
              ₦2.1M a day.
            </p>
          </div>

          <div className="rounded-card border border-teal-border bg-teal-bg p-3.5">
            <p className="text-[11px] font-semibold text-ink">A scenario has no audience and that is why it cannot run</p>
            <p className="mt-1.5 text-[10.5px] leading-relaxed text-ink-2">
              It has a population, which is a count. A play needs a list, exclusions, a frequency cap, a holdout and
              a named approver, and none of those exist here. The gap between the two is the whole difference
              between asking what something would be worth and doing it.
            </p>
          </div>
        </DialogBody>

        <DialogFooter>
          <div className="flex items-center gap-4">
            <Button type="button" onClick={attach}>
              Attach to the room
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
