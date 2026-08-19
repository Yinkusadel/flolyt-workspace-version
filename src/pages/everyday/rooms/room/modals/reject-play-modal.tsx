import * as React from "react";
import { toast } from "sonner";

import { cn } from "@/lib/utils";
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

const REASONS = [
  { label: "It cannot work", sub: "These 42,000 have no email, no push and no consent" },
  { label: "Wrong time", sub: "Right idea, not now · comes back later" },
  { label: "Wrong owner", sub: "Someone else should decide this" },
  { label: "I disagree with the reasoning", sub: "The evidence does not support it" },
];

/** R23 — Reject a play (modal on the plays board). */
export function RejectPlayModal({
  playTitle,
  playMeta,
  open,
  onOpenChange,
}: {
  playTitle: string;
  playMeta: string;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}) {
  const [selected, setSelected] = React.useState(0);

  const confirm = () => {
    onOpenChange(false);
    toast.success("Rejected — the reason is kept");
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-lg">
        <DialogHeader>
          <DialogTitle>Reject this play</DialogTitle>
          <DialogDescription>The reason is stored and cited the next time something like it is proposed</DialogDescription>
        </DialogHeader>

        <DialogBody className="space-y-4 px-5 py-5 sm:px-7 sm:py-6">
          <div className="rounded-panel border border-line bg-paper-2 p-3.5">
            <p className="text-[12px] font-semibold text-ink">{playTitle}</p>
            <p className="mt-1 font-mono text-[10px] text-ink-4">{playMeta}</p>
          </div>

          <div>
            <p className="font-mono text-[8.5px] font-medium tracking-[0.85px] text-ink-4 uppercase">
              Why you are rejecting it
            </p>
            <div className="mt-1.5 space-y-1.5">
              {REASONS.map((reason, i) => (
                <button
                  key={reason.label}
                  type="button"
                  onClick={() => setSelected(i)}
                  className={cn(
                    "flex w-full items-center gap-3 rounded-panel border px-3.5 py-2.5 text-left",
                    selected === i ? "border-rose-border bg-rose-bg" : "border-line bg-paper"
                  )}
                >
                  <span
                    className={cn(
                      "flex size-4 shrink-0 items-center justify-center rounded-full border",
                      selected === i ? "border-rose bg-rose" : "border-line"
                    )}
                  >
                    {selected === i && <span className="size-1.5 rounded-full bg-white" />}
                  </span>
                  <span>
                    <span className="block text-[12px] font-semibold text-ink">{reason.label}</span>
                    <span className="block text-[10.5px] text-ink-3">{reason.sub}</span>
                  </span>
                </button>
              ))}
            </div>
          </div>

          <div>
            <p className="font-mono text-[8.5px] font-medium tracking-[0.85px] text-ink-4 uppercase">
              Say more (optional)
            </p>
            <div className="mt-1.5 rounded-panel border border-line bg-paper p-3 text-[11.5px] text-ink-2">
              A credit they will never see is not an offer. The fix for these customers was upstream, at the moment
              the account was not offered earlier in the lifecycle.
            </div>
          </div>

          <div className="rounded-card border border-teal-border bg-teal-bg p-3.5">
            <p className="text-[11.5px] font-semibold text-ink">A rejection is kept and cited, not deleted</p>
            <p className="mt-1 text-[10px] leading-relaxed text-ink-2">
              The agent will not propose this again without addressing the reason. If something similar comes up in
              another room, your reason appears next to it — rejecting well is how an agent gets better at
              proposing.
            </p>
          </div>
        </DialogBody>

        <DialogFooter>
          <div className="flex items-center gap-4">
            <Button type="button" variant="destructive" onClick={confirm}>
              Reject
            </Button>
            <button
              type="button"
              onClick={() => onOpenChange(false)}
              className="text-[12px] font-semibold text-ink-3 hover:text-ink"
            >
              Cancel
            </button>
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
