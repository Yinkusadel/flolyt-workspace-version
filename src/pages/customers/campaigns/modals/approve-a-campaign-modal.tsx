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
import { PersonAvatar } from "@/components/person-avatar";
import { cn } from "@/lib/utils";
import { DEPARTMENT_COLORS } from "@/pages/everyday/lifecycle/data";
import { CP13_APPROVE_PRESET, CP_TONE_CLASS } from "@/pages/customers/campaigns/data";

const TONE_BAR_CLASS = {
  ok: "bg-teal",
  warn: "bg-amber",
  risk: "bg-rose",
  ai: "bg-ultra",
  muted: "bg-ink-4",
  neutral: "bg-ink-3",
  num: "bg-ink-3",
} as const;

/** CP13 — "Approve a campaign", hardcoded to the "Reactivation · wave four" reference row. Opens from the Waiting route. */
export function ApproveACampaignModal({ open, onOpenChange }: { open: boolean; onOpenChange: (open: boolean) => void }) {
  const navigate = useNavigate();
  const preset = CP13_APPROVE_PRESET;

  const confirm = () => {
    onOpenChange(false);
    toast.success("Approved · re-authenticated as Ada Obi");
    navigate("/campaigns/sent");
  };

  const decline = () => {
    onOpenChange(false);
    toast.info("Declined with a reason · routed back to Ifeoma and the room");
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-xl">
        <DialogHeader>
          <DialogTitle>Approve this campaign</DialogTitle>
          <DialogDescription>One send, one person, one re-authentication</DialogDescription>
        </DialogHeader>

        <DialogBody className="space-y-4 px-5 py-5 sm:px-7 sm:py-6">
          <div className="rounded-panel border border-line bg-paper-2 px-3.5 py-3">
            <p className="text-[12px] font-semibold text-ink">{preset.subject}</p>
            <p className="mt-1 font-mono text-[9.5px] text-ink-4">{preset.subjectDetail}</p>
          </div>

          <div>
            <p className="font-mono text-[8.5px] font-medium tracking-[0.85px] text-ink-4 uppercase">What you are approving</p>
            <div className="mt-1.5 space-y-2">
              {preset.items.map((item) => (
                <div key={item.label} className="relative overflow-hidden rounded-panel border border-line bg-paper py-2.5 pr-3.5 pl-4">
                  <span className={cn("absolute inset-y-0 left-0 w-[3px]", TONE_BAR_CLASS[item.tone])} aria-hidden />
                  <p className="text-[11px] font-semibold text-ink">{item.label}</p>
                  <p className={cn("mt-0.5 text-[9.5px]", CP_TONE_CLASS[item.tone])}>{item.value}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="rounded-card border border-amber-border bg-amber-bg p-3.5">
            <p className="text-[12px] font-semibold text-ink">{preset.warningTitle}</p>
            <p className="mt-1.5 text-[10.5px] leading-relaxed text-amber">{preset.warningBody}</p>
          </div>

          <div>
            <p className="font-mono text-[8.5px] font-medium tracking-[0.85px] text-ink-4 uppercase">Re-authenticate to approve</p>
            <div className="mt-1.5 flex items-center gap-3 rounded-panel border border-line bg-white px-3.5 py-3">
              <PersonAvatar kind="human" initials={preset.approver.initials} style={{ backgroundColor: DEPARTMENT_COLORS[preset.approver.department] }} />
              <div className="min-w-0 flex-1">
                <p className="text-[11.5px] font-semibold text-ink">{preset.approver.name}</p>
                <p className="mt-0.5 text-[9.5px] text-ink-4">{preset.approverNote}</p>
              </div>
            </div>
          </div>

          <div className="rounded-card border border-teal-border bg-teal-bg p-3.5">
            <p className="text-[12px] font-semibold text-ink">There is no approve-all on this screen and there is no queue behind it</p>
            <p className="mt-1.5 text-[10.5px] leading-relaxed text-ink-2">{preset.closingNote}</p>
          </div>
        </DialogBody>

        <DialogFooter>
          <div className="flex items-center gap-4">
            <Button type="button" onClick={confirm}>
              Approve this send
            </Button>
            <button type="button" onClick={decline} className="text-[12px] font-semibold text-ink-3 hover:text-ink">
              Decline with a reason
            </button>
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
