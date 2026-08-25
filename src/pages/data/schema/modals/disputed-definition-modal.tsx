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
import { SM12_TWO_DEFINITIONS, SM12_WILL_DO, SM_TONE_CLASS } from "@/pages/data/schema/data";

/** SM12 — "A disputed definition", hardcoded to "Active", triggered from that row's Disputed cell on the Definitions table. */
export function DisputedDefinitionModal({ open, onOpenChange }: { open: boolean; onOpenChange: (open: boolean) => void }) {
  const confirm = () => {
    onOpenChange(false);
    toast.success("Named both · routed to Ifeoma and Tunde");
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-xl">
        <DialogHeader>
          <DialogTitle>Two definitions of one word</DialogTitle>
          <DialogDescription>Both are named · neither is averaged away</DialogDescription>
        </DialogHeader>

        <DialogBody className="space-y-4 px-5 py-5 sm:px-7 sm:py-6">
          <div className="rounded-panel border border-line bg-paper-2 px-3.5 py-3">
            <p className="text-[12px] font-semibold text-ink">Active</p>
            <p className="mt-1 font-mono text-[9.5px] text-ink-4">Two definitions in use · 8 metrics use one, 3 use the other</p>
          </div>

          <div>
            <p className="font-mono text-[8.5px] font-medium tracking-[0.85px] text-ink-4 uppercase">The two definitions in use</p>
            <div className="mt-1.5 space-y-2">
              {SM12_TWO_DEFINITIONS.map((item) => (
                <div key={item.label} className="relative overflow-hidden rounded-panel border border-line bg-paper py-2.5 pr-3.5 pl-4">
                  <span className={cn("absolute inset-y-0 left-0 w-[3px]", item.tone === "warn" ? "bg-amber" : "bg-teal")} aria-hidden />
                  <div className="flex items-baseline justify-between gap-3">
                    <p className="text-[11.5px] font-semibold text-ink">{item.label}</p>
                    <p className="font-mono text-[9.5px] text-ink-4">{item.uses}</p>
                  </div>
                  <p className={cn("mt-0.5 text-[9.5px]", SM_TONE_CLASS[item.tone])}>{item.who}</p>
                </div>
              ))}
            </div>
          </div>

          <div>
            <p className="font-mono text-[8.5px] font-medium tracking-[0.85px] text-ink-4 uppercase">What this screen will do</p>
            <div className="mt-1.5 space-y-2">
              {SM12_WILL_DO.map((item) => (
                <div
                  key={item.label}
                  className={cn(
                    "flex items-start gap-3 rounded-panel border px-3.5 py-3",
                    item.blocked ? "border-line bg-paper-2" : item.on ? "border-ultra-border bg-ultra-bg" : "border-line bg-paper"
                  )}
                >
                  {item.blocked ? (
                    <span className="mt-0.5 flex size-3 shrink-0 items-center justify-center text-[10px] text-rose">✕</span>
                  ) : (
                    <span
                      className={cn("mt-0.5 size-3 shrink-0 rounded-full border", item.on ? "border-ultra bg-ultra" : "border-line bg-white")}
                      aria-hidden
                    />
                  )}
                  <div>
                    <p className={cn("text-[11.5px] font-semibold", item.blocked ? "text-ink-4" : "text-ink")}>{item.label}</p>
                    <p className="mt-0.5 text-[9.5px] text-ink-4">{item.sub}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <p className="text-[10.5px] leading-relaxed text-ink-3">
            Two teams reporting different active counts is not a data problem. Nothing is broken, both numbers are
            correct, and they have been diverging in reports for months. The schema's job is to make that legible
            and put it in front of the two people who own the two windows. Choosing between them is a definition
            change, with a preview and a restatement.
          </p>
        </DialogBody>

        <DialogFooter>
          <div className="flex items-center gap-4">
            <Button type="button" onClick={confirm}>
              Name both and route it
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
