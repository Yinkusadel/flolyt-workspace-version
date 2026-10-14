import * as React from "react";
import { Lock } from "lucide-react";

import { cn } from "@/lib/utils";
import { ConfirmModal } from "@/components/confirm-modal";
import { Button } from "@/components/ui/button";
import useRestrictRoom from "@/features/rooms/use-restrict-room";
import useUnrestrictRoom from "@/features/rooms/use-unrestrict-room";
import { formatDay, humanize } from "@/pages/rooms/convening/format";
import type { RoomListRestrictedDto } from "@/services/api/rooms/get-rooms";

/** The only four reasons the backend accepts, by design: an arbitrary reason is how a shared workspace quietly becomes several private ones. */
const REASONS = [
  { value: "pricing-before-announcement", label: "Pricing before announcement" },
  { value: "individual-employment", label: "Individual employment" },
  { value: "active-legal-matter", label: "Active legal matter" },
  { value: "acquisition", label: "Acquisition" },
];

/**
 * "Restrict this room" (Room · People & guardrails.png, the bottom box; the only place it lives: the header carries no Restrict button).
 * Restricting closes the Room to everyone not already inside it. It stays LISTED for everyone with its name, the reason, who restricted it
 * and how many people are inside, because a Room nobody can find looks the same as one that doesn't exist. A restricted Room shows its state
 * and a way to open it back up. Anyone may try; the backend refuses where it must and its message is shown.
 */
export function RestrictBox({
  roomId,
  restricted,
  nameForUser,
  canEdit,
}: {
  roomId: string;
  restricted: RoomListRestrictedDto | null;
  nameForUser: (userId: string) => string | null;
  canEdit: boolean;
}) {
  const [reason, setReason] = React.useState<string | null>(null);
  const [confirmRestrict, setConfirmRestrict] = React.useState(false);
  const [confirmOpen, setConfirmOpen] = React.useState(false);

  const { restrictRoom, isPending: isRestricting } = useRestrictRoom({
    onSuccess: () => {
      setConfirmRestrict(false);
      setReason(null);
    },
  });
  const { unrestrictRoom, isPending: isOpening } = useUnrestrictRoom({ onSuccess: () => setConfirmOpen(false) });

  const reasonLabel = (value: string) => REASONS.find((item) => item.value === value)?.label ?? humanize(value);

  return (
    <section className="overflow-hidden rounded-card border border-line bg-paper">
      <header className="flex flex-wrap items-baseline justify-between gap-2 border-b border-line px-5 py-4">
        <h3 className="text-[15px] font-semibold text-ink">Restrict this room</h3>
        <p className="text-[11.5px] text-ink-3">Closes it to everyone not listed above</p>
      </header>

      {restricted ? (
        <div className="space-y-3 px-5 py-4">
          <p className="flex items-center gap-2 text-[13px] font-semibold text-ink">
            <Lock className="size-4 text-ink-3" />
            Restricted: {reasonLabel(restricted.reason)}
          </p>
          <p className="text-[12px] leading-relaxed text-ink-3">
            {nameForUser(restricted.restrictedBy) ? `Restricted by ${nameForUser(restricted.restrictedBy)}` : "Restricted"} on {formatDay(restricted.restrictedAtUtc)}.{" "}
            {restricted.peopleInside.toLocaleString("en-US")} {restricted.peopleInside === 1 ? "person is" : "people are"} inside. The room stays listed for everyone.
          </p>
          {canEdit && (
            <Button type="button" variant="outline" onClick={() => setConfirmOpen(true)}>
              Open it back up
            </Button>
          )}
        </div>
      ) : (
        <div className="space-y-4 px-5 py-4">
          <div role="radiogroup" aria-label="Reason for restricting" className="grid gap-3 sm:grid-cols-2 @5xl:grid-cols-4">
            {REASONS.map((item) => (
              <label
                key={item.value}
                className={cn(
                  "flex cursor-pointer items-center gap-2.5 rounded-card border px-4 py-3 text-[12.5px] font-semibold text-ink",
                  reason === item.value ? "border-ultra bg-ultra-bg/40" : "border-line hover:bg-paper-2/50",
                  !canEdit && "pointer-events-none opacity-60"
                )}
              >
                <input type="radio" name="restrict-reason" value={item.value} checked={reason === item.value} onChange={() => setReason(item.value)} className="size-4 accent-ultra" />
                {item.label}
              </label>
            ))}
          </div>
          <p className="text-[11.5px] leading-relaxed text-ink-3">
            There are only these four reasons. The room stays listed for everyone, with its name, the reason, who restricted it and how many people are inside, because a room
            nobody can find looks the same as one that doesn't exist.
          </p>
          {canEdit && (
            <Button type="button" variant="outline" disabled={!reason} onClick={() => setConfirmRestrict(true)}>
              Restrict room
            </Button>
          )}
        </div>
      )}

      <ConfirmModal
        open={confirmRestrict}
        onOpenChange={setConfirmRestrict}
        title="Restrict this Room?"
        description={`${reason ? `Reason: ${reasonLabel(reason)}. ` : ""}It will close to everyone who is not already inside. The Room stays listed for everyone, with its name, the reason, who restricted it and how many people are inside.`}
        confirmLabel="Restrict room"
        pendingLabel="Restricting"
        isPending={isRestricting}
        onConfirm={() => reason && restrictRoom({ roomId, reason })}
      />
      <ConfirmModal
        open={confirmOpen}
        onOpenChange={setConfirmOpen}
        title="Open this Room back up?"
        description="It will be open to the workspace again."
        confirmLabel="Open it back up"
        pendingLabel="Opening"
        isPending={isOpening}
        onConfirm={() => unrestrictRoom(roomId)}
      />
    </section>
  );
}
