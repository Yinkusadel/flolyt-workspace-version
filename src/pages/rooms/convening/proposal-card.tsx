import * as React from "react";
import { useNavigate } from "react-router-dom";

import { Button } from "@/components/ui/button";
import { Chip } from "@/components/ui/chip";
import useAcceptConveningProposal from "@/features/rooms/use-accept-convening-proposal";
import useDeclineConveningProposal from "@/features/rooms/use-decline-convening-proposal";
import type { ConveningProposalDto } from "@/services/api/rooms/get-convening-proposals";
import { daysWaiting, formatDayTime, formatMoney, humanize, toNumber } from "@/pages/rooms/convening/format";

const FACT_LABEL = "font-mono text-[9px] font-medium tracking-[0.8px] text-ink-4 uppercase";

function Fact({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="min-w-0">
      <p className={FACT_LABEL}>{label}</p>
      <div className="mt-1 min-h-5 text-[12.5px] text-ink">{children}</div>
    </div>
  );
}

const Dash = () => <span className="text-ink-4">—</span>;

function DeclineBox({
  pending,
  onSubmit,
  onCancel,
}: {
  pending: boolean;
  onSubmit: (why: string) => void;
  onCancel: () => void;
}) {
  const [why, setWhy] = React.useState("");
  const trimmed = why.trim();

  return (
    <div className="mt-4 rounded-panel border border-line bg-paper-2 p-4">
      <p className="text-[12px] font-semibold text-ink">Why are you declining?</p>
      <p className="mt-1 text-[11.5px] text-ink-3">
        Required. Declines are kept, so a category declined every time shows up as a row that shouldn't be in
        the map.
      </p>
      <textarea
        rows={3}
        value={why}
        onChange={(event) => setWhy(event.currentTarget.value)}
        disabled={pending}
        autoFocus
        aria-label="Why are you declining?"
        placeholder="e.g. Bank-side timeout; already escalated with the payments provider."
        className="mt-2.5 w-full resize-y rounded-panel border border-line bg-paper px-2.5 py-2 text-[12.5px] text-ink outline-none placeholder:text-ink-4 focus:border-ring"
      />
      <div className="mt-3 flex flex-wrap items-center gap-2">
        <Button
          type="button"
          variant="outline"
          size="sm"
          className="border-rose-border text-rose hover:bg-rose-bg"
          disabled={!trimmed || pending}
          onClick={() => onSubmit(trimmed)}
        >
          {pending ? "Declining..." : "Decline proposal"}
        </Button>
        <Button type="button" variant="outline" size="sm" disabled={pending} onClick={onCancel}>
          Cancel
        </Button>
      </div>
      <p className="mt-2.5 text-[11.5px] text-ink-3">
        This won't be suggested again. There is one proposal per detector fingerprint, ever.
      </p>
    </div>
  );
}

/** One proposal waiting for a decision (Convening queue.png, "Waiting for a decision"). */
export function ProposalCard({ proposal }: { proposal: ConveningProposalDto }) {
  const navigate = useNavigate();
  const [declining, setDeclining] = React.useState(false);

  const accept = useAcceptConveningProposal({
    // The Room page is still the "being rebuilt" stub; the link is right for when it lands.
    onSuccess: (roomId) => navigate(`/rooms/${roomId}`),
  });
  const decline = useDeclineConveningProposal({ onSuccess: () => setDeclining(false) });

  const amount = formatMoney(proposal.amountAtRisk, proposal.currency);
  const customers = toNumber(proposal.customerCount);
  const waiting = daysWaiting(proposal.raisedAtUtc);
  const busy = accept.isPending || decline.isPending;

  return (
    <article className={`rounded-card border bg-paper p-5 ${declining ? "border-ultra-border" : "border-line"}`}>
      <div className="flex flex-wrap items-start justify-between gap-2">
        <div className="flex flex-wrap items-center gap-1.5">
          <Chip>{humanize(proposal.alertSeverity)}</Chip>
          <Chip>{humanize(proposal.alertCategory)}</Chip>
        </div>
        <p className="text-[11.5px] text-ink-3">
          Raised {formatDayTime(proposal.raisedAtUtc)}
          {waiting !== null && ` · ${waiting} day${waiting === 1 ? "" : "s"} waiting`}
        </p>
      </div>

      <h3 className="mt-3 text-[15px] font-semibold text-ink">{proposal.title}</h3>
      <p className="mt-1 text-[12.5px] text-ink-2">{proposal.description}</p>

      <div className="mt-4 grid grid-cols-2 gap-4 rounded-panel bg-paper-2 p-4 md:grid-cols-5">
        {/* ❌ Backend does NOT provide: conditionLabel (only conditionKey). Left empty until it does. */}
        <Fact label="Condition">{null}</Fact>
        <Fact label="Row">{proposal.rowLabel}</Fact>
        <Fact label="At risk">
          {amount ? <span className="font-mono font-semibold">{amount}</span> : <Dash />}
        </Fact>
        <Fact label="Customers">
          {customers !== null ? <span className="font-mono">{customers.toLocaleString("en-US")}</span> : <Dash />}
        </Fact>
        {/* ❌ Backend does NOT provide: ownerName (only ownerUserId). Left empty until it does; a null
            ownerUserId means nobody owns the stage. */}
        <Fact label="Proposed owner">{proposal.ownerUserId === null ? <Dash /> : null}</Fact>
      </div>

      {declining ? (
        <DeclineBox
          pending={decline.isPending}
          onSubmit={(why) => decline.declineConveningProposal({ proposalId: proposal.id, why })}
          onCancel={() => setDeclining(false)}
        />
      ) : (
        <div className="mt-4 flex flex-wrap items-center gap-2">
          <Button type="button" size="sm" disabled={busy} onClick={() => accept.acceptConveningProposal(proposal.id)}>
            {accept.isPending ? "Opening..." : "Open room"}
          </Button>
          <Button type="button" variant="outline" size="sm" disabled={busy} onClick={() => setDeclining(true)}>
            Decline...
          </Button>
          <p className="text-[11.5px] text-ink-3">
            The figure is re-read on accept. If it has moved away, the room won't open.
          </p>
        </div>
      )}
    </article>
  );
}
