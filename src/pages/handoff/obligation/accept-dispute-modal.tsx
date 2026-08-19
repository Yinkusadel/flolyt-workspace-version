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
import { Callout } from "@/pages/lifecycle/stage/rail";

type OptionKey = "accept" | "accept-redate" | "dispute" | "pass-on";

const OPTIONS: { key: OptionKey; label: string; body: string }[] = [
  { key: "accept", label: "Accept it", body: "You own it, and you set the date" },
  { key: "accept-redate", label: "Accept, but change the date", body: "The commitment stands, the date is yours" },
  { key: "dispute", label: "Dispute it", body: "Wrong team, or wrong ask — say which" },
  { key: "pass-on", label: "Pass it on", body: "Name who should own it, and they are told why" },
];

const PRIMARY_LABEL: Record<OptionKey, string> = {
  accept: "Accept it",
  "accept-redate": "Accept and set a new date",
  dispute: "Send the dispute",
  "pass-on": "Choose who",
};

/**
 * H07 — Accept or dispute (`modal · /handoff/:id/o/:oid`). The four options
 * and their descriptions are the shared product copy, so this is the one
 * generic surface — only the summary chip, subtitle and default selection
 * vary per obligation. Selecting "Pass it on" hands off to the Reassign
 * modal (H09) via `onPassItOn` rather than duplicating that flow here.
 */
export function AcceptDisputeModal({
  open,
  onOpenChange,
  obligationTitle,
  contextLine,
  subtitle,
  defaultOption = "accept",
  onPassItOn,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  obligationTitle: string;
  contextLine: string;
  subtitle: string;
  defaultOption?: OptionKey;
  onPassItOn?: () => void;
}) {
  const [selected, setSelected] = useState<OptionKey>(defaultOption);

  const handlePrimary = () => {
    onOpenChange(false);
    if (selected === "pass-on") {
      onPassItOn?.();
      return;
    }
    if (selected === "dispute") {
      toast.success("Dispute sent");
    } else {
      toast.success("Accepted");
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-xl">
        <DialogHeader>
          <DialogTitle>Accept or dispute</DialogTitle>
          <DialogDescription>{subtitle}</DialogDescription>
        </DialogHeader>

        <DialogBody className="space-y-4 px-5 py-5 sm:px-7 sm:py-6">
          <div className="rounded-panel border border-line bg-paper-2 px-3.5 py-2.5">
            <p className="text-[12px] font-semibold text-ink">{obligationTitle}</p>
            <p className="mt-1 text-[10.5px] text-ink-3">{contextLine}</p>
          </div>

          <div className="space-y-1.5">
            {OPTIONS.map((option) => (
              <button
                key={option.key}
                type="button"
                onClick={() => setSelected(option.key)}
                className={cn(
                  "w-full rounded-panel border px-3.5 py-2.5 text-left",
                  selected === option.key ? "border-amber-border bg-amber-bg" : "border-line bg-paper"
                )}
              >
                <p className="text-[12px] font-semibold text-ink">{option.label}</p>
                <p className="mt-0.5 text-[10px] text-ink-3">{option.body}</p>
              </button>
            ))}
          </div>

          {selected === "dispute" && (
            <>
              <div>
                <p className="font-mono text-[8.5px] font-medium tracking-[0.85px] text-ink-4 uppercase">Why</p>
                <textarea
                  defaultValue="A 14-day revenue hold on every release is a release-process change, not an engineering task. It needs Ada's sign-off and a change request — Engineering cannot accept it on its own."
                  rows={3}
                  className="mt-1.5 w-full resize-none rounded-panel border border-line bg-paper px-3.5 py-2.5 text-[11.5px] text-ink-2 outline-none focus-visible:border-ultra-border"
                />
              </div>
              <Callout tone="teal" title="A dispute is not a refusal">
                It goes back to the room that created it, with your reason attached, and the room decides. What it
                cannot do is disappear — a disputed obligation stays visible to both sides until somebody resolves
                it.
              </Callout>
            </>
          )}
        </DialogBody>

        <DialogFooter>
          <div className="flex w-full items-center justify-between gap-4">
            <button
              type="button"
              onClick={() => onOpenChange(false)}
              className="text-[12px] font-semibold text-ink-3 hover:text-ink"
            >
              Cancel
            </button>
            <Button type="button" onClick={handlePrimary}>
              {PRIMARY_LABEL[selected]}
            </Button>
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
