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
import { DH12_HAPPENS_NEXT, DH_TONE_CLASS } from "@/pages/data/data-health/data";

const TONE_BAR_CLASS = {
  ok: "bg-teal",
  warn: "bg-amber",
  risk: "bg-rose",
  ai: "bg-ultra",
  muted: "bg-ink-4",
  neutral: "bg-ink-3",
  num: "bg-ink-3",
} as const;

/** DH12 — "Report a problem", hardcoded to `ad_spend`, triggered from the "What this cannot catch" page's header action. */
export function ReportAProblemModal({ open, onOpenChange }: { open: boolean; onOpenChange: (open: boolean) => void }) {
  const confirm = () => {
    onOpenChange(false);
    toast.success("Reported · `ad_spend` marked disputed");
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-xl">
        <DialogHeader>
          <DialogTitle>Something is wrong with `ad_spend`</DialogTitle>
          <DialogDescription>Every automatic check says healthy · you think otherwise</DialogDescription>
        </DialogHeader>

        <DialogBody className="space-y-4 px-5 py-5 sm:px-7 sm:py-6">
          <div>
            <p className="font-mono text-[8.5px] font-medium tracking-[0.85px] text-ink-4 uppercase">What looks wrong · typed</p>
            <div className="mt-1.5 rounded-panel border border-line2 bg-white p-3.5">
              <p className="text-[10.5px] leading-relaxed text-ink-2">
                Spend for June looks about a fifth too low against what the agency invoiced us. The daily numbers
                are all there.
              </p>
            </div>
          </div>

          <div>
            <p className="font-mono text-[8.5px] font-medium tracking-[0.85px] text-ink-4 uppercase">What happens next</p>
            <div className="mt-1.5 space-y-2">
              {DH12_HAPPENS_NEXT.map((item) => (
                <div key={item.label} className="relative overflow-hidden rounded-panel border border-line bg-paper py-2.5 pr-3.5 pl-4">
                  <span className={cn("absolute inset-y-0 left-0 w-[3px]", TONE_BAR_CLASS[item.tone])} aria-hidden />
                  <p className="text-[11px] font-semibold text-ink">{item.label}</p>
                  <p className={cn("mt-0.5 text-[9.5px]", DH_TONE_CLASS[item.tone])}>{item.sub}</p>
                </div>
              ))}
            </div>
          </div>

          <p className="text-[10.5px] leading-relaxed text-ink-3">
            A person noticing something is the only check that catches a source arriving correctly and being wrong.
            The ad_spend hole was found this way in June, by somebody who knew how the agency billed. Four
            automatic checks had said healthy every day for six months. This form exists because that is the
            normal way this class of problem is found, and it should not require knowing who to email.
          </p>
        </DialogBody>

        <DialogFooter>
          <div className="flex items-center gap-4">
            <Button type="button" onClick={confirm}>
              Report it
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
