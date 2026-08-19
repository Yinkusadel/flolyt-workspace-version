import * as React from "react";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { StageSubpageHeader } from "@/pages/everyday/lifecycle/stage/stage-subpage-header";
import { useRoomContext } from "@/pages/everyday/rooms/room/room-layout";
import { ThreeCardRow } from "@/pages/everyday/rooms/room/three-card-row";
import { ApproveReauthModal } from "@/pages/everyday/rooms/room/modals/approve-reauth-modal";
import { EditPlayModal } from "@/pages/everyday/rooms/room/modals/edit-play-modal";
import { TONE_TEXT_CLASS } from "@/pages/everyday/rooms/tone";

const HEAD_CLASS = "px-4 py-2.5 font-mono text-[8.5px] font-medium tracking-[0.8px] text-ink-4 uppercase";

/** R20 — Room · one proposal (`/rooms/:id/plays/:playId`), with R21/R22 modals on top. */
export const OneProposalRoute = () => {
  const { room } = useRoomContext();
  const [approveOpen, setApproveOpen] = React.useState(false);
  const [editOpen, setEditOpen] = React.useState(false);
  const proposal = room.proposal;
  if (!proposal) return null;

  return (
    <div className="space-y-6">
      <StageSubpageHeader
        crumbs={[{ label: "Rooms", to: "/rooms" }, { label: room.title, to: `/rooms/${room.id}` }, { label: "Plays", to: `/rooms/${room.id}/plays` }, { label: proposal.title }]}
        title={proposal.title}
        subtitle={proposal.subtitle}
        action={<Button onClick={() => setApproveOpen(true)}>Approve</Button>}
      />

      <div className="rounded-card border-2 border-amber-border bg-amber-bg p-4">
        <div>
          <p className="text-[12.5px] font-semibold text-ink">
            Waiting on you for {proposal.waitingHours} · about ₦1.7M of decay so far
          </p>
          <p className="mt-1 text-[10.5px] leading-relaxed text-ink-2">{proposal.decayNote}</p>
        </div>
      </div>

      <div>
        <p className="font-mono text-[9.5px] font-medium tracking-[1.05px] text-ink-4 uppercase">
          Exactly what will happen
        </p>
        <div className="mt-2 overflow-x-auto rounded-card border border-line bg-paper">
          <table className="w-full min-w-[720px] text-left text-[12px]">
            <thead>
              <tr className="border-b border-line bg-paper-2">
                <th className={HEAD_CLASS}></th>
                <th className={HEAD_CLASS}>Setting</th>
                <th className={cn(HEAD_CLASS, "text-right")}>Source</th>
              </tr>
            </thead>
            <tbody>
              {proposal.settings.map((row) => (
                <tr key={row.label} className="border-b border-line last:border-0">
                  <td className="px-4 py-3 font-semibold text-ink-2">{row.label}</td>
                  <td className="px-4 py-3 text-ink-2">{row.value}</td>
                  <td className={cn("px-4 py-3 text-right font-mono text-[10.5px]", row.sourceTone === "ink" ? "text-ink-4" : TONE_TEXT_CLASS[row.sourceTone])}>
                    {row.source}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <div>
        <p className="font-mono text-[9.5px] font-medium tracking-[1.05px] text-ink-4 uppercase">
          What it is expected to do, and what would say it failed
        </p>
        <div className="mt-2">
          <ThreeCardRow cards={proposal.outlook} />
        </div>
      </div>

      <div className="flex gap-3">
        <Button onClick={() => setApproveOpen(true)}>Approve</Button>
        <Button variant="outline" onClick={() => setEditOpen(true)}>
          Edit
        </Button>
        <button type="button" className="text-[12px] font-semibold text-ink-3 hover:text-ink">
          Reject
        </button>
      </div>

      <ApproveReauthModal room={room} proposal={proposal} open={approveOpen} onOpenChange={setApproveOpen} />
      <EditPlayModal proposal={proposal} open={editOpen} onOpenChange={setEditOpen} />
    </div>
  );
};
