import * as React from "react";
import { KeyRound } from "lucide-react";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import type { Proposal } from "@/pages/rooms/types";

/** Whoever is signed in for this mock — the kit's copy names a specific owner and ceiling. */
export const CURRENT_APPROVER = { name: "Ada Okafor", role: "Owner" };

/** Screen 115 (approve with re-auth) — see flolyt-kit-122/115-approve-with-reauth.svg. */
export function ApproveReauthModal({
  proposal,
  open,
  onOpenChange,
  onApproved,
}: {
  proposal: Proposal;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onApproved: () => void;
}) {
  const [touched, setTouched] = React.useState(false);

  React.useEffect(() => {
    if (open) setTouched(false);
  }, [open]);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <span className="font-mono text-[9px] font-medium tracking-[0.85px] text-ink-4 uppercase">
            Approval · above your re-authentication threshold
          </span>
          <DialogTitle>{proposal.title}</DialogTitle>
          <DialogDescription>
            {proposal.reauthAmount} at stake · you are {CURRENT_APPROVER.name}, {CURRENT_APPROVER.role}
          </DialogDescription>
        </DialogHeader>

        <div className="grid grid-cols-1 gap-6 px-7 py-6 sm:grid-cols-[1fr_260px]">
          <dl className="divide-y divide-line border-t border-line">
            {proposal.rows.map((row) => (
              <div key={row.label} className="flex items-center justify-between gap-3 py-2">
                <dt className="text-[11.5px] text-ink-3">{row.label}</dt>
                <dd className="font-mono text-[11.5px] font-medium text-ink-2">{row.value}</dd>
              </div>
            ))}
          </dl>

          <div className="space-y-3">
            <div className="rounded-card border border-amber-border bg-amber-bg p-4">
              <p className="font-mono text-[9px] font-medium tracking-[0.85px] text-amber uppercase">
                Re-authenticate
              </p>
              <p className="mt-2 text-[11.5px] leading-relaxed text-ink-2">
                Above {proposal.reauthAmount}, an approval needs your hardware key again — even in an active
                session.
              </p>
              <Button
                type="button"
                variant={touched ? "secondary" : "outline"}
                size="sm"
                className="mt-3 w-full"
                onClick={() => setTouched(true)}
              >
                <KeyRound data-icon="inline-start" className={cn(touched && "text-teal")} />
                {touched ? "Key confirmed" : "Touch your key"}
              </Button>
            </div>

            {proposal.objection && (
              <div className="rounded-card border border-line bg-paper-2 p-4">
                <p className="font-mono text-[9px] font-medium tracking-[0.85px] text-ink-4 uppercase">
                  One objection is open
                </p>
                <p className="mt-2 text-[11.5px] leading-relaxed text-ink-2">{proposal.objection}</p>
              </div>
            )}
          </div>
        </div>

        <div className="space-y-2 border-t border-line border-dashed px-7 py-4">
          <p className="text-[11.5px] text-ink-2">
            Approving this does not close the objection. It stays on the room until someone answers it.
          </p>
          <p className="text-[11px] text-ink-4">
            Your name, the time and your ceiling are written to the audit log beside the agent's proposal.
          </p>
        </div>

        <DialogFooter>
          <div className="flex items-center gap-4">
            <Button type="button" disabled={!touched} onClick={onApproved}>
              Approve · {proposal.reauthAmount}
            </Button>
            <button
              type="button"
              onClick={() => onOpenChange(false)}
              className="text-[12px] font-semibold text-ink-3 hover:text-ink"
            >
              Reject
            </button>
          </div>
          <p className="hidden font-mono text-[10.5px] text-ink-4 sm:block">
            Your name, ceiling and the time go to the audit log
          </p>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
