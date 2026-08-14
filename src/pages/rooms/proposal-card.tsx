import * as React from "react";
import { toast } from "sonner";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { ApproveReauthModal, CURRENT_APPROVER } from "@/pages/rooms/approve-reauth-modal";
import type { Proposal } from "@/pages/rooms/types";

/** Screen 33 (proposal review states) — see flolyt-kit-122/33-proposal-review-states.svg. */
export function ProposalCard({ proposal }: { proposal: Proposal }) {
  const [status, setStatus] = React.useState(proposal.status);
  const [decidedNote, setDecidedNote] = React.useState(proposal.decidedNote);
  const [values, setValues] = React.useState(() => Object.fromEntries(proposal.rows.map((r) => [r.label, r.value])));
  const [reauthOpen, setReauthOpen] = React.useState(false);

  const decide = (withEdits: boolean) => {
    setDecidedNote({ by: CURRENT_APPROVER.name, time: "just now", detail: withEdits ? "Approved with edits." : "Approved." });
    setStatus("decided");
  };

  const approve = (withEdits: boolean) => {
    if (proposal.reauthAmount) {
      setReauthOpen(true);
      return;
    }
    decide(withEdits);
    toast.success(withEdits ? "Approved with edits" : "Approved");
  };

  const reject = () => {
    toast.info("Rejected");
  };

  const reauthModal = proposal.reauthAmount && (
    <ApproveReauthModal
      proposal={proposal}
      open={reauthOpen}
      onOpenChange={setReauthOpen}
      onApproved={() => {
        decide(false);
        setReauthOpen(false);
        toast.success(`Approved · ${proposal.reauthAmount}`);
      }}
    />
  );

  if (status === "decided") {
    return (
      <div className="rounded-card border border-teal-border bg-teal-bg p-4">
        <div className="flex items-start gap-2.5">
          <span className="mt-0.5 flex size-4 shrink-0 items-center justify-center rounded-full bg-teal text-[8px] font-bold text-white">
            ✓
          </span>
          <div className="min-w-0">
            <p className="text-[11.5px] font-semibold text-ink">
              {decidedNote?.detail ?? "Approved."}{" "}
              <span className="font-normal text-ink-2">
                by {decidedNote?.by} · {decidedNote?.time}
              </span>
            </p>
          </div>
        </div>
      </div>
    );
  }

  if (status === "editing") {
    return (
      <div className="rounded-card border border-line bg-paper p-4">
        <h4 className="text-[13px] font-semibold text-ink">{proposal.title}</h4>
        <div className="mt-3 space-y-3">
          {proposal.rows.map((row) => (
            <div key={row.label}>
              <label className="text-[10.5px] text-ink-3">{row.label}</label>
              <input
                value={values[row.label]}
                onChange={(e) => setValues((v) => ({ ...v, [row.label]: e.currentTarget.value }))}
                className="mt-1 w-full rounded-control border border-line bg-paper px-2.5 py-1.5 text-[11.5px] text-ink outline-none focus:border-ring"
              />
            </div>
          ))}
        </div>
        <div className="mt-4 flex items-center gap-4">
          <Button type="button" size="sm" onClick={() => approve(true)}>
            Approve with edits
          </Button>
          <button
            type="button"
            onClick={() => setStatus("pending")}
            className="text-[11.5px] font-semibold text-ink-4 hover:text-ink-3"
          >
            Cancel
          </button>
        </div>
        {reauthModal}
      </div>
    );
  }

  return (
    <div className="relative overflow-hidden rounded-card border border-line bg-paper pl-3.5">
      <span className="absolute inset-y-0 left-0 w-[3px] bg-amber" aria-hidden />
      <div className="py-3.5 pr-3.5 pl-1">
        <span className="font-mono text-[9px] font-semibold tracking-[0.9px] text-amber uppercase">
          Needs your approval
        </span>
        <h4 className="mt-1.5 text-[13px] font-semibold text-ink">{proposal.title}</h4>
        <dl className="mt-2.5 space-y-1.5">
          {proposal.rows.map((row) => (
            <div key={row.label} className="flex items-baseline justify-between gap-3">
              <dt className="text-[11px] text-ink-4">{row.label}</dt>
              <dd className="text-right text-[11px] font-medium text-ink-2">{row.value}</dd>
            </div>
          ))}
        </dl>
        {proposal.footnote && <p className="mt-2 text-[10.5px] text-ink-3">{proposal.footnote}</p>}
        <div className="mt-3 flex items-center gap-4">
          <Button type="button" size="sm" onClick={() => approve(false)}>
            Approve{proposal.reauthAmount ? ` · ${proposal.reauthAmount}` : ""}
          </Button>
          <button
            type="button"
            onClick={() => setStatus("editing")}
            className="text-[11.5px] font-semibold text-ink-2 hover:text-ink"
          >
            Edit
          </button>
          <button
            type="button"
            onClick={reject}
            className="text-[11.5px] font-semibold text-ink-4 hover:text-rose"
          >
            Reject
          </button>
        </div>
        <p className={cn("mt-3 border-t border-dashed border-line pt-2.5 font-mono text-[9px] text-ink-4")}>
          {proposal.actionKey}
        </p>
      </div>
      {reauthModal}
    </div>
  );
}
