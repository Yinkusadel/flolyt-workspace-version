import * as React from "react";
import { X } from "lucide-react";
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
import { Callout } from "@/pages/lifecycle/stage/rail";
import { cn } from "@/lib/utils";

const OPTIONS = [
  { id: "tomorrow", label: "Tomorrow morning", note: "back at 06:00 in your digest" },
  { id: "picked", label: "A date you pick", note: "Monday 18 August · when Ravi is back" },
  { id: "changes", label: "When something changes", note: "when the fee fix lands, or a third reading arrives" },
] as const;

/** T08 — opened from a "needs you" row's Snooze action (currently wired only for the growth-vs-finance conflict item). */
export function SnoozeOrDismissModal({ open, onOpenChange }: { open: boolean; onOpenChange: (open: boolean) => void }) {
  const [selected, setSelected] = React.useState<(typeof OPTIONS)[number]["id"]>("picked");
  const [reason, setReason] = React.useState("Ravi is on leave until the 18th and this needs him. Tunde knows it is held.");

  const snooze = () => {
    onOpenChange(false);
    toast.success("Snoozed until the 18th");
  };

  const dismiss = () => {
    onOpenChange(false);
    toast.success("Dismissed");
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-xl">
        <DialogHeader>
          <DialogTitle>Snooze this</DialogTitle>
          <DialogDescription>A snooze always has a return date and a typed reason</DialogDescription>
        </DialogHeader>

        <DialogBody className="space-y-4 px-5 py-5 sm:px-7 sm:py-6">
          <div className="rounded-panel border border-line bg-paper-2 px-3.5 py-3">
            <p className="text-[12.5px] font-semibold text-ink">Decide the growth vs finance conflict</p>
            <p className="mt-1 text-[10px] text-ink-4">₦88M · raised 07:52 · Tunde and Ravi are both waiting</p>
          </div>

          <div>
            <p className="font-mono text-[8.5px] font-medium tracking-[0.85px] text-ink-4 uppercase">Until when</p>
            <div className="mt-1.5 space-y-2">
              {OPTIONS.map((option) => {
                const isSelected = selected === option.id;
                return (
                  <button
                    key={option.id}
                    type="button"
                    onClick={() => setSelected(option.id)}
                    className={cn(
                      "flex w-full items-center justify-between gap-3 rounded-panel border px-3.5 py-3 text-left",
                      isSelected ? "border-ultra-border bg-ultra-bg" : "border-line bg-paper"
                    )}
                  >
                    <div>
                      <p className="text-[11.5px] font-semibold text-ink">{option.label}</p>
                      <p className="mt-0.5 text-[9.5px] text-ink-4">{option.note}</p>
                    </div>
                    <span
                      className={cn(
                        "size-3 shrink-0 rounded-full border",
                        isSelected ? "border-ultra bg-ultra" : "border-line bg-paper"
                      )}
                      aria-hidden
                    />
                  </button>
                );
              })}
              <div className="flex w-full cursor-not-allowed items-center justify-between gap-3 rounded-panel border border-line bg-paper-2 px-3.5 py-3 text-left opacity-60">
                <div>
                  <p className="text-[11.5px] font-semibold text-ink-3">Indefinitely</p>
                  <p className="mt-0.5 text-[9.5px] text-ink-4">not offered · a snooze always has a return date</p>
                </div>
                <X className="size-3.5 shrink-0 text-rose" aria-hidden />
              </div>
            </div>
          </div>

          <div>
            <p className="font-mono text-[8.5px] font-medium tracking-[0.85px] text-ink-4 uppercase">
              Why · typed, not picked from a list
            </p>
            <textarea
              value={reason}
              onChange={(e) => setReason(e.currentTarget.value)}
              rows={2}
              className="mt-1.5 w-full resize-none rounded-panel border border-line bg-paper px-3.5 py-2.5 text-[11.5px] text-ink outline-none focus:border-ink-4"
            />
          </div>

          <Callout tone="amber" title="This is above ₦25M, so it cannot be snoozed past 7 days">
            It returns on the 18th whether or not the reason still holds, and says why it came back.
          </Callout>

          <Callout tone="teal" title="Everyone waiting on this is told">
            Tunde and Ravi both see that it is snoozed, until when, and your reason. A decision held quietly is
            indistinguishable from a decision nobody made — which is exactly how ₦31M sat untouched for two weeks
            in the Ghana room.
          </Callout>
        </DialogBody>

        <DialogFooter>
          <div className="flex items-center gap-4">
            <Button type="button" onClick={snooze}>
              Snooze until the 18th
            </Button>
            <button type="button" onClick={dismiss} className="text-[12px] font-semibold text-ink-3 hover:text-ink">
              Dismiss instead
            </button>
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
