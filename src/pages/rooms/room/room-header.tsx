import * as React from "react";
import { Check, ChevronDown, Lock, MessageSquare, Zap } from "lucide-react";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Chip } from "@/components/ui/chip";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Skeleton } from "@/components/ui/skeleton";
import { formatWholeMoney } from "@/lib/format-measured-value";
import { useGetRoomSubscriptions } from "@/features/rooms/use-get-room-subscriptions";
import useSetRoomNotifyLevel from "@/features/rooms/use-set-room-notify-level";
import useUnwatchRoom from "@/features/rooms/use-unwatch-room";
import useWatchRoom from "@/features/rooms/use-watch-room";
import type { RoomDetailDto } from "@/services/api/rooms/get-room";

const STAT_LABEL = "font-mono text-[9px] font-medium tracking-[0.8px] text-ink-4 uppercase";

/** The three values `POST /rooms/{roomId}/notify-level` accepts. */
const NOTIFY_LEVELS = [
  { value: "everything", label: "Everything" },
  { value: "decisions-only", label: "Decisions only" },
  { value: "nothing", label: "Nothing" },
];

/** "2026-10-12T09:14:03Z" -> "09:14". */
const formatUtcTime = (iso: string) => new Date(iso).toISOString().slice(11, 16);

/**
 * The viewer's own subscription to this Room (`GET /rooms/subscriptions`): "Watching · everything" with the
 * three notify levels, and Stop watching. Not watching shows a plain Watch button. An owner can't mute: muting
 * would be resigning, so "Nothing" is disabled with the reason.
 */
function WatchingMenu({ roomId }: { roomId: string }) {
  const subscriptions = useGetRoomSubscriptions();
  const [open, setOpen] = React.useState(false);
  const { setRoomNotifyLevel, isPending: isSetting } = useSetRoomNotifyLevel({ onSuccess: () => setOpen(false) });
  const { unwatchRoom, isPending: isUnwatching } = useUnwatchRoom({ onSuccess: () => setOpen(false) });
  const { watchRoom, isPending: isWatching } = useWatchRoom();

  if (subscriptions.isPending) return <Skeleton className="h-8 w-44 rounded-control" />;
  // A failed subscriptions read must not break the header; the menu simply isn't offered.
  if (subscriptions.isError) return null;

  const row = subscriptions.data.data.rooms.find((candidate) => candidate.roomId === roomId);

  if (!row) {
    return (
      <Button type="button" variant="outline" size="sm" disabled={isWatching} onClick={() => watchRoom({ roomId })}>
        {isWatching ? "Watching…" : "Watch"}
      </Button>
    );
  }

  const levelLabel = NOTIFY_LEVELS.find((level) => level.value === row.notifyLevel)?.label ?? row.notifyLevel;
  const busy = isSetting || isUnwatching;

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button type="button" variant="outline" size="sm">
          Watching · {levelLabel.toLowerCase()}
          <ChevronDown className="size-3.5 text-ink-3" />
        </Button>
      </PopoverTrigger>
      <PopoverContent align="end" className="w-64 p-1.5">
        <p className="px-2.5 pt-1.5 pb-1 font-mono text-[9px] font-medium tracking-[0.8px] text-ink-4 uppercase">
          Notify me about
        </p>
        {NOTIFY_LEVELS.map((level) => {
          const blocked = level.value === "nothing" && !row.canMute;
          return (
            <button
              key={level.value}
              type="button"
              disabled={blocked || busy}
              onClick={() => level.value !== row.notifyLevel && setRoomNotifyLevel({ roomId, notifyLevel: level.value })}
              className={cn(
                "flex w-full items-center justify-between rounded-control px-2.5 py-2 text-left text-[12.5px] text-ink hover:bg-paper-2",
                (blocked || busy) && "cursor-not-allowed opacity-50 hover:bg-transparent"
              )}
            >
              {level.label}
              {level.value === row.notifyLevel && <Check className="size-3.5 text-ultra" />}
            </button>
          );
        })}
        {!row.canMute && (
          <p className="px-2.5 pt-1 pb-1.5 text-[11px] text-ink-3">
            Owners can't mute. Muting would be resigning; hand the room over instead.
          </p>
        )}
        {!row.ownsIt && (
          <div className="mt-1 border-t border-line pt-1">
            <button
              type="button"
              disabled={busy}
              onClick={() => unwatchRoom(roomId)}
              className="w-full rounded-control px-2.5 py-2 text-left text-[12.5px] text-ink hover:bg-paper-2 disabled:opacity-50"
            >
              Stop watching
            </button>
          </div>
        )}
      </PopoverContent>
    </Popover>
  );
}

/**
 * The Room's identity and figures (Room · Briefing.png header), from `GET /api/v3/rooms/{roomId}`. Plain header, no
 * card. Held for later steps: Restrict... and Close room (their own flows),
 * and the "Worsened" chip on an automatic Room (from threat-monitoring).
 */
export function RoomHeader({ room, onOpenThread }: { room: RoomDetailDto; onOpenThread?: () => void }) {
  const live = room.currentAmountAtRisk;

  return (
    <header>
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div className="min-w-0">
          <h1 className="text-[20px] font-semibold text-ink">
            {room.title}
            <span className="ml-2.5 inline-flex flex-wrap items-center gap-1.5 align-middle">
              {room.isRecovering && <Chip tone="teal">Recovering</Chip>}
              <Chip>Opening {room.openingNumber}</Chip>
              {room.threatConfirmationId && (
                <Chip tone="ultra" className="gap-1">
                  <Zap className="size-3" />
                  Opened by Flolyt
                </Chip>
              )}
              {room.archivedAtUtc && <Chip>Archived</Chip>}
              {room.restricted && (
                <Chip className="gap-1">
                  <Lock className="size-3" />
                  Restricted
                </Chip>
              )}
            </span>
          </h1>
          <p className="mt-1.5 text-[12px] text-ink-3">
            Owner{" "}
            {room.ownerName ? (
              <span className="font-semibold text-ink">{room.ownerName}</span>
            ) : (
              <span className="italic">Unowned</span>
            )}
            <span className="mx-1.5">·</span>
            {room.stageLabel}
            <span className="mx-1.5">·</span>
            {room.conditionLabel}
            {room.market && (
              <>
                <span className="mx-1.5">·</span>
                {room.market}
              </>
            )}
            <span className="mx-1.5">·</span>
            <span className="font-mono">{room.currency}</span>
          </p>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          {onOpenThread && (
            <Button type="button" variant="outline" size="sm" onClick={onOpenThread}>
              <MessageSquare className="size-3.5" />
              Open thread
            </Button>
          )}
          <WatchingMenu roomId={room.id} />
        </div>
      </div>

      <div className="mt-4 flex flex-wrap items-end gap-x-9 gap-y-3">
        <div>
          <p className={STAT_LABEL}>People</p>
          <p className="mt-1 font-mono text-[18px] font-semibold text-ink">
            {room.population === null ? "—" : room.population.toLocaleString("en-US")}
          </p>
        </div>
        <div>
          <p className={STAT_LABEL}>At risk at open</p>
          <p className="mt-1 font-mono text-[18px] font-semibold text-ink">
            {room.amountAtRiskAtOpen === null ? "—" : formatWholeMoney(room.amountAtRiskAtOpen, room.currency)}
          </p>
        </div>
        <div>
          <p className={STAT_LABEL}>At risk now</p>
          {live === null ? (
            <p className="mt-1 text-[13px] leading-6.75 text-ink-3 italic">Live figure unavailable</p>
          ) : (
            <p className="mt-1 font-mono text-[18px] font-semibold text-ink">{formatWholeMoney(live, room.currency)}</p>
          )}
        </div>
        <p className="text-[11.5px] leading-6.75 text-ink-3">
          {live !== null && room.currentAmountComputedAtUtc
            ? `Live figure computed ${formatUtcTime(room.currentAmountComputedAtUtc)} UTC. `
            : ""}
          A change in this figure isn't a recovery claim.
        </p>
      </div>
    </header>
  );
}

/** Same footprint as the real header, shown while the Room loads. */
export function RoomHeaderSkeleton() {
  return (
    <div aria-busy="true" aria-label="Loading the room">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div className="space-y-2.5">
          <Skeleton className="h-6 w-80" />
          <Skeleton className="h-3.5 w-96 max-w-full" />
        </div>
        <Skeleton className="h-8 w-44 rounded-control" />
      </div>
      <div className="mt-4 flex gap-9">
        <Skeleton className="h-10 w-20" />
        <Skeleton className="h-10 w-32" />
        <Skeleton className="h-10 w-32" />
      </div>
    </div>
  );
}
