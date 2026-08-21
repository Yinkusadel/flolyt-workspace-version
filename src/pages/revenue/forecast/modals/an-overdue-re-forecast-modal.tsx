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
import { FC10_ACTIONS, FC10_CONTEXT, FC10_HAPPENING, FC_TONE_CLASS } from "@/pages/revenue/forecast/data";

/** FC10 (disk) — "An overdue re-forecast", opened from the Renew row's "overdue" chip on the /forecast index. */
export function AnOverdueReForecastModal({ open, onOpenChange }: { open: boolean; onOpenChange: (open: boolean) => void }) {
  const askKunle = () => {
    onOpenChange(false);
    toast.success("Kunle asked again · a second, dated ask");
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-xl">
        <DialogHeader>
          <DialogTitle>This re-forecast is late</DialogTitle>
          <DialogDescription>The number stays, marked, and nothing is rolled forward</DialogDescription>
        </DialogHeader>

        <DialogBody className="space-y-4 px-5 py-5 sm:px-7 sm:py-6">
          <div className="rounded-panel border border-line bg-paper-2 px-3.5 py-3">
            <p className="text-[12px] font-semibold text-ink">{FC10_CONTEXT.title}</p>
            <p className="mt-1 font-mono text-[9.5px] text-ink-4">{FC10_CONTEXT.sub}</p>
          </div>

          <div>
            <p className="font-mono text-[8.5px] font-medium tracking-[0.85px] text-ink-4 uppercase">What is happening while it is late</p>
            <div className="mt-1.5 space-y-2">
              {FC10_HAPPENING.map((row) => (
                <div key={row.label} className="relative rounded-panel border border-line2 bg-paper px-3.5 py-2.5">
                  <p className={`text-[11px] font-semibold ${FC_TONE_CLASS[row.tone]}`}>{row.label}</p>
                  <p className="mt-0.5 text-[9.5px] text-ink-4">{row.sub}</p>
                </div>
              ))}
            </div>
          </div>

          <div>
            <p className="font-mono text-[8.5px] font-medium tracking-[0.85px] text-ink-4 uppercase">What you can do</p>
            <div className="mt-1.5 space-y-2">
              {FC10_ACTIONS.map((row) => (
                <div
                  key={row.label}
                  className={`flex items-start gap-2.5 rounded-panel border px-3.5 py-2.5 ${
                    row.on ? "border-ultra-border bg-ultra-bg" : row.blocked ? "border-line2 bg-paper-2" : "border-line2 bg-paper"
                  }`}
                >
                  <span className={`mt-0.5 text-[11px] ${row.blocked ? "text-rose" : "text-ink-4"}`}>{row.blocked ? "✕" : row.on ? "●" : "○"}</span>
                  <div>
                    <p className={`text-[11.5px] font-semibold ${row.blocked ? "text-ink-4" : "text-ink"}`}>{row.label}</p>
                    <p className="mt-0.5 text-[9.5px] text-ink-4">{row.sub}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="rounded-card border border-teal-border bg-teal-bg p-3.5">
            <p className="text-[12px] font-semibold text-ink">Four days late is displayed and is not scored</p>
            <p className="mt-1.5 text-[10.5px] leading-relaxed text-ink-2">
              It sits beside the figure as a fact, in the same type as everything else. Kunle is in Nairobi covering
              for someone who leaves on the 22nd, and a workspace that escalated this automatically on day three
              would be wrong about him more often than it was right.
            </p>
          </div>
        </DialogBody>

        <DialogFooter>
          <div className="flex items-center gap-4">
            <Button type="button" onClick={askKunle}>
              Ask Kunle
            </Button>
            <button type="button" onClick={() => onOpenChange(false)} className="text-[12px] font-semibold text-ink-3 hover:text-ink">
              Close
            </button>
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
