import { useState } from "react";
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
import { Callout } from "@/pages/everyday/lifecycle/stage/rail";

const DELIVERY_OPTIONS = [
  { key: "digest", label: "In the 06:00 digest", note: "Grouped with everything else that morning" },
  { key: "push", label: "Push, immediately", note: "Reserved for things a person must act on now" },
  { key: "email", label: "Email, immediately", note: "Reserved for source failures" },
] as const;

/** D13 — the only rule the export shows opened for editing is "A room opens above ₦25M" (data.ts EDITABLE_RULE_ID), same "one reference row" pattern as every prior modal in this app. */
export function EditNotificationRuleModal({
  open,
  onOpenChange,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}) {
  const [delivery, setDelivery] = useState<(typeof DELIVERY_OPTIONS)[number]["key"]>("digest");

  const save = () => {
    onOpenChange(false);
    toast.success("Rule saved");
  };

  const del = () => {
    onOpenChange(false);
    toast.success("Rule deleted");
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-xl">
        <DialogHeader>
          <DialogTitle>Edit rule</DialogTitle>
          <DialogDescription>A room opens above ₦25M at risk</DialogDescription>
        </DialogHeader>

        <DialogBody className="space-y-4 px-5 py-5 sm:px-7 sm:py-6">
          <div>
            <p className="font-mono text-[8.5px] font-medium tracking-[0.85px] text-ink-4 uppercase">When</p>
            <div className="mt-1.5 rounded-panel border border-line bg-paper-2 px-3.5 py-2.5">
              <p className="text-[12px] font-semibold text-ink">A room opens above a revenue threshold</p>
            </div>
          </div>

          <div>
            <p className="font-mono text-[8.5px] font-medium tracking-[0.85px] text-ink-4 uppercase">Threshold</p>
            <div className="mt-1.5 rounded-panel border border-line bg-paper-2 px-3.5 py-2.5">
              <p className="text-[12px] font-semibold text-ink">₦25,000,000 at risk</p>
            </div>
          </div>

          <div>
            <p className="font-mono text-[8.5px] font-medium tracking-[0.85px] text-ink-4 uppercase">Who it reaches</p>
            <div className="mt-1.5 rounded-panel border border-line bg-paper-2 px-3.5 py-2.5">
              <p className="text-[12px] font-semibold text-ink">Stage owner · and Ada Obi</p>
            </div>
          </div>

          <div>
            <p className="font-mono text-[8.5px] font-medium tracking-[0.85px] text-ink-4 uppercase">How it arrives</p>
            <div className="mt-1.5 space-y-1.5">
              {DELIVERY_OPTIONS.map((option) => (
                <button
                  key={option.key}
                  type="button"
                  onClick={() => setDelivery(option.key)}
                  className={cn(
                    "w-full rounded-panel border px-3.5 py-2.5 text-left",
                    delivery === option.key ? "border-ultra-border bg-ultra-bg" : "border-line bg-paper"
                  )}
                >
                  <p className="text-[12px] font-semibold text-ink">{option.label}</p>
                  <p className="mt-0.5 text-[10px] text-ink-3">{option.note}</p>
                </button>
              ))}
            </div>
          </div>

          <div className="rounded-card border border-line bg-paper-2 p-3.5">
            <p className="text-[11.5px] font-semibold text-ink">Against the last 90 days, this would have fired 24 times</p>
            <p className="mt-1 font-mono text-[10px] text-ink-4">At ₦5M it would have fired 118 times · at ₦100M, four</p>
          </div>

          <Callout tone="amber" title="Quiet hours apply, with one exception">
            This rule waits until 06:00 local in each market. A guardrail stopping a send does not wait — it is the
            only rule allowed to ignore quiet hours, and it cannot be changed here.
          </Callout>
        </DialogBody>

        <DialogFooter>
          <div className="flex w-full items-center justify-between gap-4">
            <button type="button" onClick={del} className="text-[12px] font-semibold text-ink-3 hover:text-rose">
              Delete rule
            </button>
            <Button type="button" onClick={save}>
              Save rule
            </Button>
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
