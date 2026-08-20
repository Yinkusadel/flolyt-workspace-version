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
import { SC12_PRESET } from "@/pages/revenue/scenario/data";

/** SC12 — "Share a scenario", hardcoded to S-114, opened from the Saved list's share action. */
export function ShareAScenarioModal({ open, onOpenChange }: { open: boolean; onOpenChange: (open: boolean) => void }) {
  const preset = SC12_PRESET;

  const share = () => {
    onOpenChange(false);
    toast.success("Shared with Ravi");
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-xl">
        <DialogHeader>
          <DialogTitle>Share this scenario</DialogTitle>
          <DialogDescription>Four things travel with it whether you want them to or not</DialogDescription>
        </DialogHeader>

        <DialogBody className="space-y-4 px-5 py-5 sm:px-7 sm:py-6">
          <div className="rounded-panel border border-line bg-paper-2 px-3.5 py-3">
            <p className="text-[12px] font-semibold text-ink">{preset.subject}</p>
            <p className="mt-1 font-mono text-[9.5px] text-ink-4">{preset.subjectDetail}</p>
          </div>

          <div>
            <p className="font-mono text-[8.5px] font-medium tracking-[0.85px] text-ink-4 uppercase">What travels with it</p>
            <div className="mt-1.5 space-y-2">
              {preset.travels.map((row) => (
                <div key={row.label} className="flex items-center gap-3 rounded-panel border border-line bg-paper px-3.5 py-2.5">
                  <span className="min-w-0 flex-1">
                    <span className="block text-[11px] font-semibold text-ink">{row.label}</span>
                    <span className="mt-0.5 block text-[9.5px] text-ink-4">{row.sub}</span>
                  </span>
                  <span className={cn("shrink-0 font-mono text-[9px] font-semibold uppercase", row.fixed ? "text-rose" : "text-teal")}>
                    {row.fixed ? "always" : "optional"}
                  </span>
                </div>
              ))}
            </div>
          </div>

          <div className="rounded-card border border-rose-border bg-rose-bg p-3.5">
            <p className="text-[11px] font-semibold text-ink">You cannot send the number on its own</p>
            <p className="mt-1.5 text-[10.5px] leading-relaxed text-rose">{preset.warning}</p>
          </div>

          <div className="rounded-card border border-amber-border bg-amber-bg p-3.5">
            <p className="text-[12px] font-semibold text-ink">It goes stale and it says so where it lands</p>
            <p className="mt-1.5 text-[10.5px] leading-relaxed text-ink-2">
              The shared view reads live and shows the date of the last assumption change at the top. A PDF carries
              the export date and a line saying two assumptions have changed since — because the version somebody
              read eleven days ago has a different low end and no way of knowing it.
            </p>
          </div>
        </DialogBody>

        <DialogFooter>
          <div className="flex items-center gap-4">
            <Button type="button" onClick={share}>
              Share with Ravi
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
