import * as React from "react";

import { ConfirmModal } from "@/components/confirm-modal";
import { Button } from "@/components/ui/button";
import { Chip } from "@/components/ui/chip";
import { cn } from "@/lib/utils";
import useCreateDissent from "@/features/rooms/use-create-dissent";
import useWithdrawDissent from "@/features/rooms/use-withdraw-dissent";
import { useAuth } from "@/utils/auth-context";
import type { RoomDecisionDissentDto } from "@/services/api/rooms/get-room-decision";
import { formatDayTime } from "@/pages/rooms/convening/format";
import { CollapsiblePanel } from "@/pages/rooms/room/decision/collapsible-panel";

function WithdrawDialog({
  objection,
  open,
  onOpenChange,
}: {
  objection: RoomDecisionDissentDto;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}) {
  const { withdrawDissent, isPending } = useWithdrawDissent({ onSuccess: () => onOpenChange(false) });

  return (
    <ConfirmModal
      open={open}
      onOpenChange={onOpenChange}
      title="Withdraw this objection?"
      description={`"${objection.wording}" Only you, as its author, can withdraw it. The wording stays on the record, marked as withdrawn.`}
      confirmLabel="Withdraw objection"
      pendingLabel="Withdrawing…"
      isPending={isPending}
      onConfirm={() => withdrawDissent(objection.id)}
    />
  );
}

function Objection({ objection, isAuthor }: { objection: RoomDecisionDissentDto; isAuthor: boolean }) {
  const [withdrawOpen, setWithdrawOpen] = React.useState(false);

  return (
    <li className={cn("px-5 py-4", isAuthor && !objection.withdrawn && "bg-ultra-bg/40")}>
      <p className={cn("text-[13px] text-ink", objection.withdrawn && "text-ink-3 line-through")}>
        “{objection.wording}”
      </p>
      {objection.aboutProposalTitle && (
        <p className="mt-1 text-[11.5px] text-ink-3">About: {objection.aboutProposalTitle}</p>
      )}
      <p className="mt-1.5 text-[11.5px] text-ink-3">
        {objection.byLabel}
        {isAuthor && " (you)"} <span className="ml-1 font-mono">{formatDayTime(objection.recordedAtUtc)}</span>
      </p>
      <div className="mt-2 flex flex-wrap items-center gap-2">
        {objection.withdrawn ? (
          <Chip>Withdrawn</Chip>
        ) : objection.borneOut === true ? (
          <Chip tone="teal">Borne out</Chip>
        ) : objection.borneOut === false ? (
          <Chip tone="amber">Shown wrong</Chip>
        ) : (
          <Chip className="border-dashed bg-transparent">Not yet judged</Chip>
        )}
        {isAuthor && !objection.withdrawn && (
          <Button type="button" variant="outline" size="sm" onClick={() => setWithdrawOpen(true)}>
            Withdraw
          </Button>
        )}
      </div>
      {withdrawOpen && <WithdrawDialog objection={objection} open={withdrawOpen} onOpenChange={setWithdrawOpen} />}
    </li>
  );
}

/** Objections to the decision (Room · Decision & dissent.png, "Objections"). */
export function ObjectionsPanel({ roomId, dissent }: { roomId: string; dissent: RoomDecisionDissentDto[] }) {
  const { user } = useAuth();
  const [wording, setWording] = React.useState("");
  const { createDissent, isPending } = useCreateDissent({ onSuccess: () => setWording("") });

  return (
    <CollapsiblePanel
      title="Objections"
      tone="amber"
      count={dissent.length}
      intro={
        <p className="border-b border-line px-5 py-3.5 text-[11.5px] leading-relaxed text-ink-3">
          An objection doesn't block the decision and isn't counted. One person owns the decision. Objections stay
          attached, get checked at close, and only their author can withdraw them.
        </p>
      }
      footer={
        <div className="px-5 py-4">
          <label htmlFor="objection-wording" className="block text-[12px] font-semibold text-ink">
            Record an objection
          </label>
          <textarea
            id="objection-wording"
            rows={3}
            value={wording}
            disabled={isPending}
            onChange={(event) => setWording(event.currentTarget.value)}
            placeholder="Say what you think will go wrong, in words you'll be happy to see judged later."
            className="mt-2 w-full resize-y rounded-panel border border-line bg-paper px-2.5 py-2 text-[12.5px] text-ink outline-none placeholder:text-ink-4 focus:border-ring disabled:opacity-60"
          />
          {/* ❌ "About a play (optional)" is left out: it needs the Room's plays (GET /rooms/{roomId}/plays),
              whose items have not been seen yet. Objections are recorded about the decision as a whole. */}
          <Button
            type="button"
            size="sm"
            className="mt-3"
            disabled={!wording.trim() || isPending}
            onClick={() => createDissent({ roomId, wording: wording.trim(), aboutProposalId: null })}
          >
            {isPending ? "Recording…" : "Record objection"}
          </Button>
        </div>
      }
    >
      {dissent.length === 0 ? (
        <p className="px-5 py-5 text-[12.5px] text-ink-3">No objections on the record.</p>
      ) : (
        <ul className="divide-y divide-line">
          {dissent.map((objection) => (
            <Objection key={objection.id} objection={objection} isAuthor={user?.id === objection.byUserId} />
          ))}
        </ul>
      )}
    </CollapsiblePanel>
  );
}
