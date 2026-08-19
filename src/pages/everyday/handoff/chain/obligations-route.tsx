import { useState } from "react";
import { Link } from "react-router-dom";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { StageSubpageHeader } from "@/pages/everyday/lifecycle/stage/stage-subpage-header";
import { Chip } from "@/pages/everyday/lifecycle/stage/chip";
import { Callout } from "@/pages/everyday/lifecycle/stage/rail";
import { KpiCards } from "@/pages/everyday/lifecycle/stage/kpi-cards";
import { ChainTabs } from "@/pages/everyday/handoff/chain/chain-tabs";
import { useChainContext } from "@/pages/everyday/handoff/chain/chain-layout";
import { OwnerCell } from "@/pages/everyday/handoff/owner-cell";
import { AcceptDisputeModal } from "@/pages/everyday/handoff/obligation/accept-dispute-modal";
import { TeamDot } from "@/pages/everyday/inbox/team-dot";
import { TONE_TEXT_CLASS } from "@/pages/everyday/rooms/tone";

const HEAD_CLASS = "px-4 py-2.5 font-mono text-[8.5px] font-medium tracking-[0.8px] text-ink-4 uppercase";

/** H05 — `/handoff/:id/obligations`, for a live chain (currently only "delivery-fee"). */
export default function ObligationsRoute() {
  const { chain } = useChainContext();
  const obligations = chain.obligations ?? [];
  const overdueRow = obligations.find((o) => o.stateTone === "rose" && o.owner);
  const unacceptedRow = obligations.find((o) => o.unacceptedLabel);
  const [reviewOpen, setReviewOpen] = useState(false);

  return (
    <div className="space-y-6">
      <StageSubpageHeader
        crumbs={[{ label: "Handoff", to: "/handoff" }, { label: chain.title, to: `/handoff/${chain.id}` }, { label: "Obligations" }]}
        title={`One cause, five teams · obligations`}
        subtitle={chain.obligationsSubtitle}
        action={<Button onClick={() => toast.success("Reminder sent")}>Chase the overdue one</Button>}
      />

      <ChainTabs chainId={chain.id} active="obligations" />

      {chain.obligationsStats && <KpiCards items={chain.obligationsStats} />}

      <div>
        <p className="mb-2 font-mono text-[9px] font-medium tracking-[0.85px] text-ink-4 uppercase">
          Every obligation, and who said yes to it
        </p>
        <div className="overflow-x-auto rounded-card border border-line bg-paper">
          <table className="w-full min-w-[720px] text-left text-[11.5px]">
            <thead>
              <tr className="border-b border-line bg-paper-2">
                <th className={HEAD_CLASS}>Owes</th>
                <th className={HEAD_CLASS}>Team</th>
                <th className={HEAD_CLASS}>Owner</th>
                <th className={HEAD_CLASS}>Due</th>
                <th className={HEAD_CLASS}>State</th>
                <th className={HEAD_CLASS}>Last moved</th>
                <th className={HEAD_CLASS}></th>
              </tr>
            </thead>
            <tbody>
              {obligations.map((row) => (
                <tr key={row.id} className="border-b border-line last:border-0">
                  <td className="px-4 py-3 font-semibold whitespace-nowrap">
                    {row.id === overdueRow?.id ? (
                      <Link to={`/handoff/${chain.id}/o/${row.id}`} className="text-ultra hover:underline">
                        {row.title}
                      </Link>
                    ) : (
                      <span className="text-ink-2">{row.title}</span>
                    )}
                  </td>
                  <td className="px-4 py-3 whitespace-nowrap">
                    <TeamDot team={row.team} />
                  </td>
                  <td className="px-4 py-3 whitespace-nowrap">
                    <OwnerCell owner={row.owner} unacceptedLabel={row.unacceptedLabel} />
                  </td>
                  <td className={cn("px-4 py-3 whitespace-nowrap", row.dueTone ? TONE_TEXT_CLASS[row.dueTone] : "text-ink-2")}>
                    {row.due}
                  </td>
                  <td className="px-4 py-3">
                    <Chip tone={row.stateTone}>{row.state}</Chip>
                  </td>
                  <td className={cn("px-4 py-3 whitespace-nowrap", row.lastMovedTone ? TONE_TEXT_CLASS[row.lastMovedTone] : "text-ink-4")}>
                    {row.lastMoved}
                  </td>
                  <td className="px-4 py-3 text-right whitespace-nowrap">
                    {row.id === unacceptedRow?.id && (
                      <button
                        type="button"
                        onClick={() => setReviewOpen(true)}
                        className="text-[10.5px] font-semibold text-ultra hover:underline"
                      >
                        Review
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {chain.obligationsInsight && (
        <Callout tone={chain.obligationsInsight.tone} title={chain.obligationsInsight.title}>
          {chain.obligationsInsight.body}
        </Callout>
      )}

      {unacceptedRow && (
        <AcceptDisputeModal
          open={reviewOpen}
          onOpenChange={setReviewOpen}
          obligationTitle={unacceptedRow.title}
          subtitle="Nobody has said yes to this in eleven days"
          contextLine="Created 2 Aug by the room · routed to Engineering · read 4 times · accepted by nobody"
          defaultOption="dispute"
        />
      )}
    </div>
  );
}
