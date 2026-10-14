import * as React from "react";

import { Button } from "@/components/ui/button";
import { Chip } from "@/components/ui/chip";
import useDecideRoomDecision from "@/features/rooms/use-decide-room-decision";
import { useAuth } from "@/utils/auth-context";
import type { RoomDecisionData } from "@/services/api/rooms/get-room-decision";
import { formatDayTime, humanize } from "@/pages/rooms/convening/format";
import { ReviseDialog } from "@/pages/rooms/room/decision/revise-dialog";

const FACT_LABEL = "font-mono text-[9px] font-medium tracking-[0.8px] text-ink-4 uppercase";

function Fact({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="min-w-0 rounded-panel bg-paper-2 p-3.5">
      <p className={FACT_LABEL}>{label}</p>
      <div className="mt-1.5 text-[12.5px] text-ink">{children}</div>
    </div>
  );
}

const Dash = () => <span className="text-ink-4">—</span>;

/** Marks the decision as made: POST /rooms/{roomId}/decision/decide. */
function DecideForm({ roomId }: { roomId: string }) {
  const { user } = useAuth();
  const [summary, setSummary] = React.useState("");
  const { decideRoomDecision, isPending } = useDecideRoomDecision({ onSuccess: () => setSummary("") });

  return (
    <div className="border-t border-line bg-paper-2/60 px-5 py-4">
      <label htmlFor="decide-summary" className="block text-[12px] font-semibold text-ink">
        Mark as decided: what are you deciding?
      </label>
      <p className="mt-1 text-[11.5px] text-ink-3">
        Required. Objections stay on the record exactly as they are; deciding doesn't settle them.
      </p>
      <textarea
        id="decide-summary"
        rows={3}
        value={summary}
        disabled={isPending}
        onChange={(event) => setSummary(event.currentTarget.value)}
        placeholder="e.g. Going with delivery-first; the voucher reading was not chosen because..."
        className="mt-2.5 w-full resize-y rounded-panel border border-line bg-paper px-2.5 py-2 text-[12.5px] text-ink outline-none placeholder:text-ink-4 focus:border-ring disabled:opacity-60"
      />
      <div className="mt-3 flex flex-wrap items-center gap-3">
        <Button
          type="button"
          size="sm"
          disabled={!summary.trim() || isPending}
          onClick={() => decideRoomDecision({ roomId, summary: summary.trim() })}
        >
          {isPending ? "Saving…" : user?.name ? `Mark decided as ${user.name}` : "Mark as decided"}
        </Button>
        {/* ❌ Backend does NOT document what the design's "Hand off obligations..." button calls
            (shown greyed until decided, "each one names a person and a proposed date"). Left out. */}
      </div>
    </div>
  );
}

/** The decision itself (Room · Decision & dissent.png, "The decision"), from GET /rooms/{roomId}/decision. */
export function DecisionCard({ roomId, decision }: { roomId: string; decision: RoomDecisionData }) {
  const [reviseOpen, setReviseOpen] = React.useState(false);

  const decided = decision.decidedAtUtc !== null;
  const statement = decision.statement?.trim() ?? "";
  const hasDraft = statement.length > 0 || decision.revisions.length > 0;
  const revisionNumber = decision.revisions.length ? Math.max(...decision.revisions.map((r) => r.number)) : null;

  return (
    <section className="overflow-hidden rounded-card border border-line bg-paper">
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-line px-5 py-3.5">
        <div className="flex flex-wrap items-center gap-2.5">
          <h2 className="text-[13px] font-semibold text-ink">The decision</h2>
          {decided ? (
            <Chip tone="teal">Decided</Chip>
          ) : hasDraft ? (
            <Chip tone="ultra">Drafted · not decided</Chip>
          ) : (
            <Chip>Not drafted</Chip>
          )}
          {revisionNumber !== null && <span className="font-mono text-[11px] text-ink-3">Revision {revisionNumber}</span>}
        </div>
        <Button type="button" variant="outline" size="sm" onClick={() => setReviseOpen(true)}>
          {hasDraft ? "Revise..." : "Draft the decision"}
        </Button>
      </div>

      <div className="px-5 py-5">
        {statement ? (
          <p className="text-[15px] leading-relaxed whitespace-pre-line text-ink">{statement}</p>
        ) : (
          <p className="text-[12.5px] text-ink-3">No decision has been drafted for this Room yet.</p>
        )}

        <div className="mt-4 grid gap-3 sm:grid-cols-3">
          <Fact label="Guardrails stated">{decision.guardrails ? decision.guardrails : <Dash />}</Fact>
          {/* ❌ Backend does NOT provide: whether the drafter is an agent (the design adds an "Agent" chip). */}
          <Fact label="Drafted by">{decision.draftedByLabel ? decision.draftedByLabel : <Dash />}</Fact>
          <Fact label="Decided by">
            {decision.decidedByLabel ? (
              <>
                {decision.decidedByLabel}
                {decision.decidedAtUtc && (
                  <span className="mt-0.5 block text-[11px] text-ink-3">{formatDayTime(decision.decidedAtUtc)}</span>
                )}
              </>
            ) : (
              <Dash />
            )}
          </Fact>
        </div>

        {decision.recipients.length > 0 && (
          <div className="mt-4">
            <p className={FACT_LABEL}>Who hears about it</p>
            <div className="mt-2 flex flex-wrap gap-2">
              {/* ❌ Backend does NOT provide: userName on recipients (only userId), so no name leads the chip. */}
              {decision.recipients.map((recipient, index) => (
                <Chip key={`${recipient.userId}-${index}`} className="text-[11px] font-normal">
                  {humanize(recipient.class)} · {recipient.what}
                </Chip>
              ))}
            </div>
          </div>
        )}
      </div>

      {hasDraft && !decided && <DecideForm roomId={roomId} />}

      {reviseOpen && (
        <ReviseDialog
          roomId={roomId}
          decision={decision}
          hasDraft={hasDraft}
          open={reviseOpen}
          onOpenChange={setReviseOpen}
        />
      )}
    </section>
  );
}
