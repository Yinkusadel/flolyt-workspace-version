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
import type { ProposalDetail } from "@/pages/rooms/room/types";

const FIELDS = [
  { label: "Audience", value: "100,000", changed: false },
  { label: "Waves", from: "3 × 33,000", to: "4 × 25,000", changed: true },
  { label: "First send", from: "Fri 08:00", to: "Mon 08:00", changed: true },
  { label: "Offer in wave one", value: "none", changed: false },
  { label: "Holdout", value: "10%", changed: false },
];

/** R22 — Edit a play before approving (modal on `/rooms/:id/plays/:id`). */
export function EditPlayModal({
  proposal,
  open,
  onOpenChange,
}: {
  proposal: ProposalDetail;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}) {
  const confirm = () => {
    onOpenChange(false);
    toast.success("Approved with edits");
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-xl">
        <DialogHeader>
          <DialogTitle>Edit before approving</DialogTitle>
          <DialogDescription>Change anything · the effect recalculates as you go</DialogDescription>
        </DialogHeader>

        <DialogBody className="space-y-4 px-5 py-5 sm:px-7 sm:py-6">
          <div className="rounded-panel border border-line bg-paper-2 p-3.5">
            <p className="text-[12px] font-semibold text-ink">{proposal.title}</p>
          </div>

          <div className="space-y-2">
            {FIELDS.map((field) => (
              <div
                key={field.label}
                className={
                  field.changed
                    ? "rounded-panel border border-ultra-border bg-ultra-bg px-3.5 py-2.5"
                    : "rounded-panel border border-line px-3.5 py-2.5"
                }
              >
                <p className="font-mono text-[8.5px] font-medium tracking-[0.7px] text-ink-4 uppercase">
                  {field.label}
                </p>
                {field.changed ? (
                  <p className="mt-0.5 text-[12px]">
                    <span className="text-ink-4 line-through">{field.from}</span>{" "}
                    <span className="font-semibold text-ultra">→ {field.to}</span>
                  </p>
                ) : (
                  <p className="mt-0.5 text-[12px] font-semibold text-ink">{field.value}</p>
                )}
              </div>
            ))}
          </div>

          <div className="rounded-panel border border-amber-border bg-amber-bg px-3.5 py-2.5">
            <p className="text-[11.5px] font-semibold text-ink">Two things changed · the effect is recalculated</p>
            <p className="mt-1 font-mono text-[10.5px] text-amber">
              ₦258M → ₦241M · four smaller waves reach the same people three days later
            </p>
          </div>

          <div>
            <p className="font-mono text-[8.5px] font-medium tracking-[0.85px] text-ink-4 uppercase">
              Why you changed it
            </p>
            <div className="mt-1.5 rounded-panel border border-line bg-paper p-3 text-[11.5px] text-ink-2">
              Friday sends land badly in Nigeria. Moving to Monday and splitting into four keeps us under the
              delivery-mesh throughput ceiling.
            </div>
          </div>

          <div className="rounded-card border border-teal-border bg-teal-bg p-3.5">
            <p className="text-[11.5px] font-semibold text-ink">Your edits sit beside the proposal, they do not replace it</p>
            <p className="mt-1 text-[10px] leading-relaxed text-ink-2">
              The original stays in the log with your version next to it and your reason attached. If Monday sends
              turn out worse, the room can tell the difference between a bad recommendation and a good one that was
              changed.
            </p>
          </div>
        </DialogBody>

        <DialogFooter>
          <div className="flex items-center gap-4">
            <Button type="button" onClick={confirm}>
              Approve with edits
            </Button>
            <button
              type="button"
              onClick={() => onOpenChange(false)}
              className="text-[12px] font-semibold text-ink-3 hover:text-ink"
            >
              Discard edits
            </button>
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
