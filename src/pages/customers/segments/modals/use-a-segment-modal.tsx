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
import { SG14_USE_PRESET } from "@/pages/customers/segments/data";

/** SG14 — "Use a segment", hardcoded to the "Two features in week one" reference row. */
export function UseASegmentModal({ open, onOpenChange }: { open: boolean; onOpenChange: (open: boolean) => void }) {
  const navigate = useNavigate();
  const preset = SG14_USE_PRESET;

  const confirm = () => {
    onOpenChange(false);
    toast.success("Room opened");
    navigate("/rooms");
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-xl">
        <DialogHeader>
          <DialogTitle>Use this segment</DialogTitle>
          <DialogDescription>Two of the four are not offered, and the screen says why</DialogDescription>
        </DialogHeader>

        <DialogBody className="space-y-4 px-5 py-5 sm:px-7 sm:py-6">
          <div className="rounded-panel border border-line bg-paper-2 px-3.5 py-3">
            <p className="text-[12px] font-semibold text-ink">{preset.subject}</p>
            <p className="mt-1 font-mono text-[9.5px] text-ink-4">{preset.subjectDetail}</p>
          </div>

          <div>
            <p className="font-mono text-[8.5px] font-medium tracking-[0.85px] text-ink-4 uppercase">What you can do with it</p>
            <div className="mt-1.5 space-y-2">
              {preset.actions.map((action) => (
                <div
                  key={action.label}
                  className={cn(
                    "flex items-center gap-3 rounded-panel border px-3.5 py-3",
                    action.blocked
                      ? "border-line bg-paper-2"
                      : action.selected
                        ? "border-ultra-border bg-ultra-bg"
                        : "border-line bg-paper"
                  )}
                >
                  {action.blocked ? (
                    <span className="flex size-3 shrink-0 items-center justify-center text-[10px] text-rose">✕</span>
                  ) : (
                    <span
                      className={cn(
                        "size-3 shrink-0 rounded-full border",
                        action.selected ? "border-ultra bg-ultra" : "border-line bg-paper"
                      )}
                      aria-hidden
                    />
                  )}
                  <div>
                    <p className={cn("text-[11.5px] font-semibold", action.blocked ? "text-ink-4" : "text-ink")}>{action.label}</p>
                    <p className="mt-0.5 text-[9.5px] text-ink-4">{action.sub}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="rounded-panel border border-amber-border bg-amber-bg px-3.5 py-3">
            <p className="text-[11.5px] font-semibold text-ink">{preset.warningTitle}</p>
            <p className="mt-1 text-[10.5px] font-semibold text-amber">{preset.warningBody}</p>
          </div>

          <div className="rounded-card border border-teal-border bg-teal-bg p-3.5">
            <p className="text-[12px] font-semibold text-ink">You cannot export the people and that is the whole boundary</p>
            <p className="mt-1.5 text-[10.5px] leading-relaxed text-ink-2">{preset.closingNote}</p>
          </div>
        </DialogBody>

        <DialogFooter>
          <div className="flex items-center gap-4">
            <Button type="button" onClick={confirm}>
              Open a room
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
