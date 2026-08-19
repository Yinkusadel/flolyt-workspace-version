import { useState } from "react";
import { Link, useParams } from "react-router-dom";

import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { StageSubpageHeader } from "@/pages/lifecycle/stage/stage-subpage-header";
import { Callout } from "@/pages/lifecycle/stage/rail";
import { KpiCards } from "@/pages/lifecycle/stage/kpi-cards";
import { PersonDot } from "@/pages/rooms/actor";
import { TONE_TEXT_CLASS } from "@/pages/rooms/tone";
import { OBLIGATION_DETAILS } from "@/pages/handoff/data";
import { AcceptDisputeModal } from "@/pages/handoff/obligation/accept-dispute-modal";
import { ReassignModal } from "@/pages/handoff/obligation/reassign-modal";

/** H06 — `/handoff/:id/o/:oid`, with H07/H09 as modals on top. Only "renewal-reforecast" has a full build — the section's canonical demo obligation. */
export default function OneObligationRoute() {
  const { id, oid } = useParams();
  const [acceptOpen, setAcceptOpen] = useState(false);
  const [reassignOpen, setReassignOpen] = useState(false);
  const obligation = oid ? OBLIGATION_DETAILS[oid] : undefined;

  if (!obligation) {
    return (
      <div className="rounded-card border border-dashed border-line bg-paper p-10 text-center">
        <p className="text-[13px] font-semibold text-ink">Obligation not found</p>
        <p className="mt-1.5 text-[11.5px] text-ink-3">It may not have a built page yet, or the link is out of date.</p>
        <Link to={`/handoff/${id}/obligations`} className="mt-4 inline-block text-[11.5px] font-semibold text-ultra hover:underline">
          Back to obligations
        </Link>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <StageSubpageHeader
        crumbs={[
          { label: "Handoff", to: "/handoff" },
          { label: obligation.chainTitle, to: `/handoff/${obligation.chainId}` },
          { label: obligation.title },
        ]}
        title={obligation.title}
        subtitle={`${obligation.team} · ${obligation.owner.name} · due ${obligation.due}${obligation.overdueBy ? ` · ${obligation.overdueBy} overdue` : ""}`}
        action={
          <div className="flex flex-wrap gap-2">
            <Button variant="outline" onClick={() => setReassignOpen(true)}>
              Reassign
            </Button>
            <Button onClick={() => setAcceptOpen(true)}>Accept or dispute</Button>
          </div>
        }
      />

      <KpiCards
        items={[
          { eyebrow: "DUE", value: obligation.due, tone: "rose", note: obligation.overdueBy ? `${obligation.overdueBy} ago` : undefined },
          { eyebrow: "STATE", value: obligation.state, tone: "rose", note: "unchanged since 2 Aug" },
          { eyebrow: "OWNER", value: obligation.owner.name, note: obligation.team },
          { eyebrow: "BLOCKS", value: obligation.blocks, tone: "rose", note: "the renewal forecast" },
        ]}
      />

      <div>
        <p className="mb-2 font-mono text-[9px] font-medium tracking-[0.85px] text-ink-4 uppercase">
          Where this came from
        </p>
        <Callout tone="ultra" title={obligation.originTitle}>
          {obligation.originBody}
        </Callout>
      </div>

      <div>
        <p className="mb-2 font-mono text-[9px] font-medium tracking-[0.85px] text-ink-4 uppercase">
          What has happened to it since
        </p>
        <div className="divide-y divide-line rounded-card border border-line bg-paper">
          {obligation.timeline.map((event, i) => (
            <div key={i} className="flex flex-col gap-1 px-4 py-3 sm:flex-row sm:items-baseline sm:gap-4">
              <span className="w-32 shrink-0 font-mono text-[10px] text-ink-4">{event.at}</span>
              <div className="min-w-0 flex-1">
                <p className={cn("text-[11.5px] font-semibold", event.headlineTone ? TONE_TEXT_CLASS[event.headlineTone] : "text-ink")}>
                  {event.headline}
                </p>
                <p className="mt-0.5 text-[10.5px] text-ink-3">{event.detail}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="rounded-card border-2 border-rose-border bg-rose-bg p-4">
        <p className="text-[12.5px] font-semibold text-ink">Rows four and five are eleven days apart and that gap was a real bug</p>
        <p className="mt-1.5 text-[10.5px] leading-relaxed text-ink-2">
          It was accepted, dated and silently missed. No rule covered "an obligation passed its date", and the daily
          list ranked by revenue rather than by broken commitments. Both were one-line fixes — but only once there
          was a screen where an obligation is a thing with a state.
        </p>
      </div>

      <div className="flex items-center gap-1.5 text-[10.5px] text-ink-4">
        <PersonDot person={obligation.owner} size="sm" />
        <span>Escalates to Ada if still not started by day 7</span>
      </div>

      <AcceptDisputeModal
        open={acceptOpen}
        onOpenChange={setAcceptOpen}
        obligationTitle={obligation.title}
        subtitle="Accepted, dated, and missed"
        contextLine="Accepted by Kunle on 2 Aug · due date set to 9 Aug · now four days overdue"
        defaultOption="accept-redate"
        onPassItOn={() => setReassignOpen(true)}
      />
      <ReassignModal open={reassignOpen} onOpenChange={setReassignOpen} />
    </div>
  );
}
