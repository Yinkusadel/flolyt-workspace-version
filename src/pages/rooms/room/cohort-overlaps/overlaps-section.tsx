import * as React from "react";
import { Link } from "react-router-dom";
import { useQueryClient } from "@tanstack/react-query";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Chip } from "@/components/ui/chip";
import { Skeleton } from "@/components/ui/skeleton";
import { ConfirmModal } from "@/components/confirm-modal";
import { Dialog, DialogBody, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { useGetMergeCandidates, MERGE_CANDIDATES_QUERY_KEY } from "@/features/rooms/use-get-merge-candidates";
import useLinkRoom from "@/features/rooms/use-link-room";
import useUnlinkRoom from "@/features/rooms/use-unlink-room";
import useMergeRoom from "@/features/rooms/use-merge-room";
import useUnmergeRoom from "@/features/rooms/use-unmerge-room";
import { formatDay, formatMoney, humanize } from "@/pages/rooms/convening/format";
import type { RoomMergeCandidateDto } from "@/services/api/rooms/get-merge-candidates";
import type { RoomDetailDto } from "@/services/api/rooms/get-room";

const FIELD_LABEL = "mb-1.5 block text-[11px] font-semibold text-ink-2";
const AREA =
  "w-full resize-y rounded-panel border border-line bg-paper-2 px-2.5 py-2 text-[12.5px] text-ink outline-none placeholder:text-ink-4 focus:border-ring disabled:opacity-60";

type Action = { kind: "link" | "merge" | "unlink" | "unmerge"; candidate: RoomMergeCandidateDto } | null;

function Stat({ label, value, note, tone }: { label: string; value: React.ReactNode; note?: string; tone?: "amber" }) {
  return (
    <div className={cn("rounded-panel px-4 py-3.5", tone === "amber" ? "border border-amber-border bg-amber-bg/60" : "bg-paper-2")}>
      <p className={cn("font-mono text-[10px] font-medium tracking-[0.8px] uppercase", tone === "amber" ? "text-amber" : "text-ink-3")}>{label}</p>
      <p className="mt-1.5 font-mono text-[19px] leading-tight font-semibold text-ink">{value}</p>
      {note && <p className="mt-1 text-[11.5px] text-ink-3">{note}</p>}
    </div>
  );
}

function LinkDialog({ room, candidate, onClose }: { room: RoomDetailDto; candidate: RoomMergeCandidateDto; onClose: () => void }) {
  const [why, setWhy] = React.useState("");
  const { linkRoom, isPending } = useLinkRoom({ onSuccess: onClose });
  return (
    <Dialog open onOpenChange={(next) => !isPending && !next && onClose()}>
      <DialogContent className="max-w-lg">
        <DialogHeader>
          <DialogTitle>Link to {candidate.title}</DialogTitle>
          <DialogDescription>
            Both rooms stay open with their own owner, decision and close. The link is written into both so neither owner is blind to the other.
          </DialogDescription>
        </DialogHeader>
        <DialogBody className="px-5 py-5 sm:px-7 sm:py-6">
          <label htmlFor="link-why" className={FIELD_LABEL}>
            Why are they linked (required)
          </label>
          <textarea
            id="link-why"
            rows={3}
            value={why}
            disabled={isPending}
            onChange={(event) => setWhy(event.currentTarget.value)}
            placeholder="e.g. Same people, different currency; keep separate owners."
            className={AREA}
          />
        </DialogBody>
        <DialogFooter>
          <div className="flex items-center gap-4">
            <Button type="button" disabled={isPending || !why.trim()} onClick={() => linkRoom({ roomId: room.id, otherRoomId: candidate.roomId, why: why.trim() })}>
              {isPending ? "Linking…" : "Link rooms"}
            </Button>
            <button type="button" disabled={isPending} onClick={onClose} className="text-[12px] font-semibold text-ink-3 hover:text-ink">
              Cancel
            </button>
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

/** Merges the OTHER room into this one ("Merge into this room"): the other room is the one that gets folded, this room survives. */
function MergeDialog({ room, candidate, onClose }: { room: RoomDetailDto; candidate: RoomMergeCandidateDto; onClose: () => void }) {
  const queryClient = useQueryClient();
  const owners = [
    room.ownerMemberId ? { id: room.ownerMemberId, label: room.ownerName ? `${room.ownerName}, owner of this room` : "The owner of this room" } : null,
    // ❌ Backend does NOT provide: the other room's owner name (only `ownerMemberId` on a merge candidate).
    candidate.ownerMemberId && candidate.ownerMemberId !== room.ownerMemberId ? { id: candidate.ownerMemberId, label: `The owner of ${candidate.title}` } : null,
  ].filter((owner): owner is { id: string; label: string } => owner !== null);
  const [ownerId, setOwnerId] = React.useState(owners[0]?.id ?? "");
  const { mergeRoom, isPending } = useMergeRoom({
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: MERGE_CANDIDATES_QUERY_KEY(room.id) });
      onClose();
    },
  });
  return (
    <Dialog open onOpenChange={(next) => !isPending && !next && onClose()}>
      <DialogContent className="max-w-lg">
        <DialogHeader>
          <DialogTitle>Merge {candidate.title} into this room</DialogTitle>
          <DialogDescription>
            Nothing is deleted: both decisions, threads and logs stay readable, and {candidate.title} stays open at its own address. Only a pointer changes so
            the figures stop counting the same people twice. Choose who owns the merged room; the other owner becomes a participant.
          </DialogDescription>
        </DialogHeader>
        <DialogBody className="px-5 py-5 sm:px-7 sm:py-6">
          <fieldset disabled={isPending} className="space-y-2">
            <legend className={FIELD_LABEL}>Owner of the merged room</legend>
            {owners.map((owner) => (
              <label key={owner.id} className="flex cursor-pointer items-center gap-2.5 rounded-panel border border-line px-3 py-2.5 text-[12.5px] text-ink has-checked:border-ultra has-checked:bg-ultra-bg/40">
                <input type="radio" name="merge-owner" checked={ownerId === owner.id} onChange={() => setOwnerId(owner.id)} />
                {owner.label}
              </label>
            ))}
            {owners.length === 0 && <p className="text-[12px] text-ink-3">Neither room has an owner to choose.</p>}
          </fieldset>
        </DialogBody>
        <DialogFooter>
          <div className="flex items-center gap-4">
            <Button
              type="button"
              disabled={isPending || !ownerId}
              onClick={() => mergeRoom({ roomId: candidate.roomId, survivingRoomId: room.id, ownerMemberId: ownerId })}
            >
              {isPending ? "Merging…" : "Merge rooms"}
            </Button>
            <button type="button" disabled={isPending} onClick={onClose} className="text-[12px] font-semibold text-ink-3 hover:text-ink">
              Cancel
            </button>
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

function OverlapCard({ room, candidate, canEdit, onAction }: { room: RoomDetailDto; candidate: RoomMergeCandidateDto; canEdit: boolean; onAction: (action: NonNullable<Action>) => void }) {
  const hasMoney = candidate.oursForShared !== null || candidate.theirsForShared !== null;
  const money = (value: number | null) => (candidate.currency ? formatMoney(value, candidate.currency) : null) ?? "-";
  const sameCurrency = !candidate.currency || candidate.currency === room.currency;

  return (
    <li className="rounded-card border border-line bg-paper px-5 py-5">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <Link to={`/rooms/${candidate.roomId}`} className="text-[15px] font-semibold text-ultra hover:underline">
            {candidate.title}
          </Link>
          {/* ❌ Backend does NOT provide: the other room's owner name (only `ownerMemberId`), so no owner leads this line. */}
          <p className="mt-1 text-[12px] text-ink-3">
            {[humanize(candidate.stageLabel), humanize(candidate.conditionKey), candidate.currency, `Opened ${formatDay(candidate.theirOpenedAtUtc)}`].filter(Boolean).join(" · ")}
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
          <Chip tone={candidate.sameCondition ? "ultra" : "neutral"}>{candidate.sameCondition ? "Same condition" : "Different condition"}</Chip>
          {candidate.alreadyLinked && <Chip tone="teal">Linked</Chip>}
        </div>
      </div>

      <div className="mt-4 grid gap-3 sm:grid-cols-2 @4xl:grid-cols-4">
        <Stat
          label="Shared people"
          value={candidate.sharedCustomers.toLocaleString("en-US")}
          note={`of ${room.population?.toLocaleString("en-US") ?? "-"} here${candidate.theirPopulation !== null ? ` · ${candidate.theirPopulation.toLocaleString("en-US")} there` : ""}`}
        />
        {hasMoney ? (
          <>
            <Stat label="Ours say they're worth" value={money(candidate.oursForShared)} />
            <Stat label="Theirs say" value={money(candidate.theirsForShared)} />
            <Stat
              label="Counted twice"
              tone="amber"
              value={candidate.countedTwiceAtLeast === null ? "-" : `at least ${money(candidate.countedTwiceAtLeast)}`}
              note="A floor, not a total"
            />
          </>
        ) : (
          <div className="rounded-panel bg-paper-2 px-4 py-3.5 sm:col-span-1 @4xl:col-span-3">
            <p className="font-mono text-[10px] font-medium tracking-[0.8px] text-ink-3 uppercase">Money</p>
            <p className="mt-1.5 text-[12.5px] text-ink-3 italic">
              Not shown.{" "}
              {!sameCurrency && candidate.currency ? `This room is in ${room.currency} and that one is in ${candidate.currency}, and currencies are never blended. ` : ""}
              Only the headcount applies.
            </p>
          </div>
        )}
      </div>

      {canEdit && (
        <div className="mt-4 flex flex-wrap gap-2">
          {candidate.alreadyLinked ? (
            // ❌ Backend does NOT provide: who linked the rooms, when, and the reason they gave (the design's "Linked 3 Oct by Tolu: ...").
            <Button type="button" variant="outline" size="sm" onClick={() => onAction({ kind: "unlink", candidate })}>
              Unlink
            </Button>
          ) : (
            <>
              <Button type="button" variant="outline" size="sm" onClick={() => onAction({ kind: "link", candidate })}>
                Link rooms…
              </Button>
              <Button type="button" variant="outline" size="sm" onClick={() => onAction({ kind: "merge", candidate })}>
                Merge into this room…
              </Button>
            </>
          )}
        </div>
      )}
    </li>
  );
}

/** A room already folded in. The merge date and who joined are not sent, so the card says only what is known. */
function AbsorbedCard({ candidate, canEdit, onAction }: { candidate: RoomMergeCandidateDto; canEdit: boolean; onAction: (action: NonNullable<Action>) => void }) {
  return (
    <li className="flex flex-wrap items-center justify-between gap-3 rounded-card border border-line bg-paper px-5 py-4">
      <div>
        <p className="text-[13.5px] font-semibold text-ink">
          Absorbed:{" "}
          <Link to={`/rooms/${candidate.roomId}`} className="text-ultra hover:underline">
            {candidate.title}
          </Link>
        </p>
        {/* ❌ Backend does NOT provide: when the room was merged and who became a participant (the design adds "Merged in 3 Oct" and a name). */}
        <p className="mt-1 text-[12px] text-ink-3">Its decision, thread and log are still readable at its own address.</p>
      </div>
      {canEdit && (
        <Button type="button" variant="outline" size="sm" onClick={() => onAction({ kind: "unmerge", candidate })}>
          Unmerge
        </Button>
      )}
    </li>
  );
}

/**
 * "Other rooms working on the same people" (Room · Cohort & overlaps.png), on `GET /rooms/{roomId}/merge-candidates` plus link, unlink, merge and
 * unmerge. Built from the real response of 2026-10-16 (no candidates, `comparison_scope_unavailable`): the cards, the cross-currency note and
 * every write are from the docs and the design and have NEVER run against real data, so they stay UNVERIFIED until a Room has an overlap.
 * Not shown: the other owner's name, when and why a link was made, when a room was merged (none are sent).
 */
export function OverlapsSection({ room, canEdit }: { room: RoomDetailDto; canEdit: boolean }) {
  const query = useGetMergeCandidates(room.id);
  const queryClient = useQueryClient();
  const [action, setAction] = React.useState<Action>(null);
  const close = () => setAction(null);
  const unlink = useUnlinkRoom({ onSuccess: close });
  const unmerge = useUnmergeRoom({
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: MERGE_CANDIDATES_QUERY_KEY(room.id) });
      close();
    },
  });
  const data = query.data?.data;

  return (
    <section>
      <h2 className="text-[18px] font-semibold text-ink">Other rooms working on the same people</h2>
      <p className="mt-1 text-[12.5px] text-ink-3">
        This isn't a recommendation to merge. Linking is just as valid, and the collision check already stops two rooms messaging the same people. Restricted rooms don't
        appear here.
      </p>

      <div className="mt-4">
        {query.isPending ? (
          <Skeleton className="h-40 rounded-card" aria-busy="true" aria-label="Loading the overlapping rooms" />
        ) : query.isError || !data ? (
          <div className="flex flex-wrap items-center gap-3 rounded-card border border-rose-border bg-rose-bg/40 px-4 py-3">
            <p className="text-[12px] text-rose">{query.error?.message || "Couldn't load the overlapping rooms."}</p>
            <Button type="button" variant="outline" size="sm" onClick={() => query.refetch()}>
              Retry
            </Button>
          </div>
        ) : data.candidates.length === 0 ? (
          <div className="rounded-card border border-line bg-paper px-5 py-6">
            {data.notYetComputed ? (
              <p className="text-[12.5px] text-ink-2">Overlaps have not been computed for this room yet.</p>
            ) : data.comparison && data.comparison.availability !== "available" && data.comparison.limitations.length > 0 ? (
              <>
                <p className="text-[13.5px] font-semibold text-ink">Overlaps can't be compared for this room yet</p>
                {data.comparison.limitations.map((limit) => (
                  <p key={limit.code} className="mt-1 text-[12.5px] text-ink-2">
                    {limit.message}
                  </p>
                ))}
              </>
            ) : (
              <p className="text-[12.5px] text-ink-2">No other room is working on the same people.</p>
            )}
          </div>
        ) : (
          <ul className="space-y-4">
            {data.candidates.map((candidate) =>
              candidate.alreadyMerged ? (
                <AbsorbedCard key={candidate.roomId} candidate={candidate} canEdit={canEdit} onAction={setAction} />
              ) : (
                <OverlapCard key={candidate.roomId} room={room} candidate={candidate} canEdit={canEdit} onAction={setAction} />
              )
            )}
          </ul>
        )}
      </div>

      {action?.kind === "link" && <LinkDialog room={room} candidate={action.candidate} onClose={close} />}
      {action?.kind === "merge" && <MergeDialog room={room} candidate={action.candidate} onClose={close} />}
      <ConfirmModal
        open={action?.kind === "unlink"}
        onOpenChange={(open) => !open && close()}
        title="Unlink these rooms?"
        description={`${action?.candidate.title ?? "The room"} and this room will no longer be worked as related. It doesn't say they never overlapped.`}
        confirmLabel="Unlink"
        pendingLabel="Unlinking…"
        isPending={unlink.isPending}
        onConfirm={() => action && unlink.unlinkRoom({ roomId: room.id, otherRoomId: action.candidate.roomId })}
      />
      <ConfirmModal
        open={action?.kind === "unmerge"}
        onOpenChange={(open) => !open && close()}
        title="Unmerge this room?"
        description={`${action?.candidate.title ?? "The room"} will be separate again. Its owner is not restored; reassigning is a separate step.`}
        confirmLabel="Unmerge"
        pendingLabel="Unmerging…"
        isPending={unmerge.isPending}
        onConfirm={() => action && unmerge.unmergeRoom(action.candidate.roomId)}
      />
    </section>
  );
}
