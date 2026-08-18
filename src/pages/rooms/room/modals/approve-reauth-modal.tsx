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
import type { ProposalDetail, RoomDetail } from "@/pages/rooms/room/types";

/** R21 — Approve with re-auth (modal on `/rooms/:id/plays/:id`). */
export function ApproveReauthModal({
  room,
  proposal,
  open,
  onOpenChange,
}: {
  room: RoomDetail;
  proposal: ProposalDetail;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}) {
  const confirm = () => {
    onOpenChange(false);
    toast.success("Approved — running under your identity");
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-xl">
        <DialogHeader>
          <DialogTitle>Approve this play</DialogTitle>
          <DialogDescription>100,000 people will receive this on Friday morning</DialogDescription>
        </DialogHeader>

        <DialogBody className="space-y-4 px-5 py-5 sm:px-7 sm:py-6">
          <div className="rounded-panel border border-line bg-paper-2 p-3.5">
            <p className="text-[12px] font-semibold text-ink">{proposal.title}</p>
            <p className="mt-1 font-mono text-[10px] text-ink-4">
              First send Friday 08:00 local · no offer in wave one · 10% held back
            </p>
          </div>

          <div>
            <p className="font-mono text-[8.5px] font-medium tracking-[0.85px] text-ink-4 uppercase">
              This will run under your identity
            </p>
            <div className="mt-1.5 divide-y divide-line rounded-panel border border-line">
              {[
                { label: "Approved by", value: `${room.owner?.name ?? "You"} · you` },
                { label: "Recorded in", value: "this room's log and the workspace audit log" },
                { label: "Visible to", value: "everyone in this room, and Ada" },
                { label: "Reaches", value: "100,000 real people on Friday morning", tone: "text-rose" },
                { label: "Can be stopped", value: "up to the send, and held mid-flight", tone: "text-teal" },
                { label: "Cannot be", value: "recalled after delivery", tone: "text-rose" },
              ].map((row) => (
                <div key={row.label} className="flex items-start justify-between gap-3 px-3.5 py-2 text-[11.5px]">
                  <span className="shrink-0 text-ink-3">{row.label}</span>
                  <span className={cn("text-right", row.tone ?? "text-ink-2")}>{row.value}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="rounded-card border border-ultra-border bg-ultra-bg p-3.5">
            <p className="text-[12px] font-semibold text-ink">Confirm it is you</p>
            <p className="mt-1 text-[10.5px] text-ink-2">Face ID, or your password</p>
            <Button className="mt-2.5">Use Face ID</Button>
          </div>

          <div className="rounded-card border border-amber-border bg-amber-bg p-3.5">
            <p className="text-[11.5px] font-semibold text-ink">Re-authentication is per approval, not per session</p>
            <p className="mt-1 text-[10px] leading-relaxed text-ink-2">
              This runs as you, so the product asks who you are every single time rather than once when you signed
              in. It is the only friction in Flolyt that exists on purpose, and it is the reason there is no bulk
              approve.
            </p>
          </div>
        </DialogBody>

        <DialogFooter>
          <div className="flex items-center gap-4">
            <Button type="button" onClick={confirm}>
              Approve
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
