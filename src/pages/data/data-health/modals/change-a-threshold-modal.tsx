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
import { DH11_WOULD_HAVE_DONE, DH_TONE_CLASS } from "@/pages/data/data-health/data";

const TONE_BAR_CLASS = {
  ok: "bg-teal",
  warn: "bg-amber",
  risk: "bg-rose",
  ai: "bg-ultra",
  muted: "bg-ink-4",
  neutral: "bg-ink-3",
  num: "bg-ink-3",
} as const;

/** DH11 — "Change a threshold", hardcoded to `checkout_events`'s degraded threshold, triggered from its row on the Freshness table. */
export function ChangeAThresholdModal({ open, onOpenChange }: { open: boolean; onOpenChange: (open: boolean) => void }) {
  const confirm = () => {
    onOpenChange(false);
    toast.success("Threshold changed · `checkout_events` now degrades at 2 hours");
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-xl">
        <DialogHeader>
          <DialogTitle>Change this threshold</DialogTitle>
          <DialogDescription>Three fewer alerts and three windows where a wrong number looks right</DialogDescription>
        </DialogHeader>

        <DialogBody className="space-y-4 px-5 py-5 sm:px-7 sm:py-6">
          <div className="rounded-panel border border-line bg-paper-2 px-3.5 py-3">
            <p className="text-[12px] font-semibold text-ink">`checkout_events` · degraded threshold</p>
            <p className="mt-1 font-mono text-[9.5px] text-ink-4">
              Currently 30 minutes · fired at 04:14 today, two minutes past
            </p>
          </div>

          <div>
            <p className="font-mono text-[8.5px] font-medium tracking-[0.85px] text-ink-4 uppercase">Change it to</p>
            <div className="mt-1.5 flex items-baseline justify-between rounded-panel border border-line2 bg-white px-4 py-3">
              <span className="text-[14px] font-semibold text-ink">2 hours</span>
              <span className="font-mono text-[10px] text-ink-4">was 30 minutes</span>
            </div>
          </div>

          <div>
            <p className="font-mono text-[8.5px] font-medium tracking-[0.85px] text-ink-4 uppercase">What this would have done</p>
            <div className="mt-1.5 space-y-2">
              {DH11_WOULD_HAVE_DONE.map((item) => (
                <div key={item.label} className="relative flex items-center justify-between overflow-hidden rounded-panel border border-line bg-paper py-2.5 pr-3.5 pl-4">
                  <span className={cn("absolute inset-y-0 left-0 w-[3px]", TONE_BAR_CLASS[item.tone])} aria-hidden />
                  <p className="text-[11px] font-semibold text-ink">{item.label}</p>
                  <p className={cn("font-mono text-[10.5px] font-semibold", DH_TONE_CLASS[item.tone])}>{item.value}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="rounded-card border border-rose-border bg-rose-bg p-3.5">
            <p className="text-[12px] font-semibold text-ink">A quieter threshold does not mean fewer outages</p>
            <p className="mt-1.5 text-[10.5px] leading-relaxed text-rose">
              It means two hours each time in which the funnel shows a number built from partial data, and nothing
              on any screen says so. The outage is the same length either way.
            </p>
          </div>

          <p className="text-[10.5px] leading-relaxed text-ink-3">
            Raising a freshness threshold is a decision about honesty, not about noise. Four alerts in ninety days
            is not a noisy check. What this change buys is three fewer notifications and three windows in which a
            wrong number looks like a right one, and the trade is stated in that order because the notification is
            the thing somebody is annoyed by today.
          </p>
        </DialogBody>

        <DialogFooter>
          <div className="flex items-center gap-4">
            <Button type="button" onClick={confirm}>
              Change it to 2 hours
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
