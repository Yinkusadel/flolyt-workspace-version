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
import { AN13_PRESET } from "@/pages/agents/agent-detail/data";

/** AN13 — "Edit a threshold", hardcoded to the one unrouted condition, opened from its row on /agent-detail/conditions. */
export function EditThresholdModal({ open, onOpenChange }: { open: boolean; onOpenChange: (open: boolean) => void }) {
  const preset = AN13_PRESET;

  const confirm = () => {
    onOpenChange(false);
    toast.success("Routed to Ifeoma");
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-xl">
        <DialogHeader>
          <DialogTitle>Where should this route?</DialogTitle>
          <DialogDescription>Two of four destinations are refused, and the field is empty today</DialogDescription>
        </DialogHeader>

        <DialogBody className="space-y-4 px-5 py-5 sm:px-7 sm:py-6">
          <div className="rounded-panel border border-line bg-paper-2 px-3.5 py-3">
            <p className="text-[12px] font-semibold text-ink">{preset.title}</p>
            <p className="mt-1 font-mono text-[9.5px] text-ink-4">{preset.meta}</p>
          </div>

          <div>
            <p className="font-mono text-[8.5px] font-medium tracking-[0.85px] text-ink-4 uppercase">Where it routes · the field that is empty</p>
            <div className="mt-1.5 space-y-2">
              {preset.options.map((item) => (
                <div
                  key={item.label}
                  className={
                    item.state === "selected"
                      ? "flex items-start gap-2.5 rounded-panel border border-ultra-border bg-ultra-bg px-3.5 py-2.5"
                      : item.state === "blocked"
                        ? "flex items-start gap-2.5 rounded-panel border border-line bg-paper-2 px-3.5 py-2.5 opacity-70"
                        : "flex items-start gap-2.5 rounded-panel border border-line2 bg-paper px-3.5 py-2.5"
                  }
                >
                  <span
                    className={
                      item.state === "selected"
                        ? "mt-0.5 flex size-3.5 shrink-0 items-center justify-center rounded-full bg-ultra"
                        : item.state === "blocked"
                          ? "mt-0.5 flex size-3.5 shrink-0 items-center justify-center text-[10px] font-semibold text-rose"
                          : "mt-0.5 size-3.5 shrink-0 rounded-full border border-line2 bg-white"
                    }
                  >
                    {item.state === "blocked" && "✕"}
                  </span>
                  <span>
                    <p className={`text-[11.5px] font-semibold ${item.state === "blocked" ? "text-ink-4" : "text-ink"}`}>{item.label}</p>
                    <p className="mt-0.5 text-[9.5px] text-ink-4">{item.sub}</p>
                  </span>
                </div>
              ))}
            </div>
          </div>

          <div className="rounded-card border border-amber-border bg-amber-bg p-3.5">
            <p className="text-[12px] font-semibold text-ink">{preset.warnTitle}</p>
            <p className="mt-1.5 text-[10.5px] leading-relaxed text-amber">{preset.warnBody}</p>
          </div>

          <div className="rounded-card border border-line bg-paper-2 p-3.5">
            <p className="text-[10.5px] leading-relaxed text-ink-2">{preset.footnote}</p>
          </div>
        </DialogBody>

        <DialogFooter>
          <div className="flex items-center gap-4">
            <Button type="button" onClick={confirm}>
              Route it to Ifeoma
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
