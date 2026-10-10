import { Link } from "react-router-dom";
import { Lock, Zap } from "lucide-react";

import { cn } from "@/lib/utils";
import { Chip } from "@/components/ui/chip";
import { Button } from "@/components/ui/button";
import { PersonAvatar } from "@/components/person-avatar";
import { agentInitialsFromName } from "@/lib/initials";
import { formatRoomActivity } from "@/lib/format-activity";
import { formatWholeMoney } from "@/lib/format-measured-value";
import type { RoomListRowDto } from "@/services/api/rooms/get-rooms";
import { RESTRICT_REASON_LABEL, STOPPED_BECAUSE_LABEL } from "@/pages/rooms/labels";

const HEAD = "px-4 py-2.5 font-mono text-[9px] font-medium tracking-[0.8px] text-ink-4 uppercase";
const UUID = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

const daysSince = (iso: string | null) =>
  iso ? Math.max(0, Math.round((Date.now() - new Date(iso).getTime()) / 86_400_000)) : null;

/** "2026-10-10T09:14:03Z" -> "09:14". */
const formatUtcTime = (iso: string) => new Date(iso).toISOString().slice(11, 16);

/** formatRoomActivity gives "12 min" / "3 hrs" / "12 days"; the design reads "12 min ago". */
const activityText = (iso: string | null) => {
  const text = formatRoomActivity(iso);
  return /^\d+ (min|hrs?|days?)$/.test(text) ? `${text} ago` : text;
};

function RoomTitle({ room }: { room: RoomListRowDto }) {
  return (
    <Link
      to={`/rooms/${room.id}`}
      className="inline-flex items-center gap-1.5 font-semibold text-ultra hover:underline"
    >
      {room.restricted && <Lock className="size-3.5 shrink-0 text-ink-3" aria-label="Restricted" />}
      <span>{room.title}</span>
    </Link>
  );
}

function RoomFlags({ room }: { room: RoomListRowDto }) {
  const staleDays = daysSince(room.lastActivityAtUtc);
  const absorbed = room.absorbedRoomIds.length;
  return (
    <div className="mt-1.5 flex flex-wrap items-center gap-1.5">
      {room.isRecovering && <Chip tone="teal">Recovering</Chip>}
      {room.isRecovering && <Chip>Opening {room.openingNumber}</Chip>}
      {room.threatConfirmationId && (
        <Chip tone="ultra" className="gap-1">
          <Zap className="size-3" />
          Opened by Flolyt
        </Chip>
      )}
      {absorbed > 0 && <Chip>{`Absorbed ${absorbed} room${absorbed === 1 ? "" : "s"}`}</Chip>}
      {room.isStale && (
        <Chip tone="amber">
          {staleDays !== null ? `Stale ${staleDays} days` : "Stale"}
          {room.stoppedBecause ? ` · ${STOPPED_BECAUSE_LABEL[room.stoppedBecause] ?? room.stoppedBecause}` : ""}
        </Chip>
      )}
    </div>
  );
}

function OwnerCell({ room, onAssign }: { room: RoomListRowDto; onAssign: () => void }) {
  if (room.ownerName) return <span className="text-ink">{room.ownerName}</span>;
  const canAssign = !room.archivedAtUtc && !room.mergedIntoRoomId;
  return (
    <div>
      <p className="text-ink-3 italic">Unowned</p>
      {canAssign && (
        <button type="button" onClick={onAssign} className="text-[11.5px] font-semibold text-ultra hover:underline">
          Assign owner
        </button>
      )}
    </div>
  );
}

function AgentsCell({ room }: { room: RoomListRowDto }) {
  if (room.agents.length === 0) return <span className="text-ink-4">—</span>;
  return (
    <div className="flex -space-x-1.5">
      {room.agents.map((agent) => (
        <PersonAvatar
          key={agent.key}
          kind="agent"
          size="sm"
          initials={agentInitialsFromName(agent.displayName)}
          title={`${agent.displayName} · ${agent.role}`}
          className="bg-paper"
        />
      ))}
    </div>
  );
}

function AtRiskCell({ room }: { room: RoomListRowDto }) {
  const open = room.amountAtRiskAtOpen;
  const live = room.currentAmountAtRisk;

  if (room.mergedIntoRoomId) {
    return (
      <div className="text-right">
        {open !== null && <p className="font-mono text-ink-3">{formatWholeMoney(open, room.currency)}</p>}
        <p className="mt-0.5 text-[11px] text-ink-3">Counted in the surviving room</p>
      </div>
    );
  }

  return (
    <div className="text-right">
      {open !== null && <p className="font-mono text-ink-3">{formatWholeMoney(open, room.currency)}</p>}
      {live !== null ? (
        <>
          <p className="font-mono font-semibold text-ink">{formatWholeMoney(live, room.currency)}</p>
          {room.currentAmountComputedAtUtc && (
            <p className="mt-0.5 text-[11px] text-ink-3">live · {formatUtcTime(room.currentAmountComputedAtUtc)} UTC</p>
          )}
        </>
      ) : (
        <p className="mt-0.5 text-[11px] text-ink-3 italic">Live figure unavailable</p>
      )}
      {open === null && live === null && <p className="text-ink-4">—</p>}
    </div>
  );
}

function WaitingCell({ room }: { room: RoomListRowDto }) {
  if (room.pendingDecisions === 0 && !room.needsYou) return <Chip>None</Chip>;
  return (
    <div className="flex flex-col items-start gap-1">
      {room.pendingDecisions > 0 && <Chip tone="ultra">{room.pendingDecisions} pending</Chip>}
      {room.needsYou && (
        <span className="inline-flex rounded-chip bg-ink px-2 py-0.5 text-[9.5px] font-semibold whitespace-nowrap text-white">
          Needs you
        </span>
      )}
    </div>
  );
}

function RestrictedRow({ room }: { room: RoomListRowDto }) {
  const restricted = room.restricted!;
  const reason = RESTRICT_REASON_LABEL[restricted.reason] ?? restricted.reason;
  // `restrictedBy` is shown only when it reads as a name; an id would mean nothing here.
  const by = restricted.restrictedBy && !UUID.test(restricted.restrictedBy) ? ` · by ${restricted.restrictedBy}` : "";
  return (
    <tr className="border-b border-line last:border-0">
      <td className="px-4 py-3.5 align-top">
        <RoomTitle room={room} />
        <p className="mt-1 text-[11.5px] text-ink-3">
          {`Restricted: ${reason}${by} · ${restricted.peopleInside} people inside`}
        </p>
      </td>
      <td className="px-4 py-3.5 align-top whitespace-nowrap text-ink-2">{room.stageLabel}</td>
      <td colSpan={5} className="px-4 py-3.5 align-top text-ink-3 italic">
        Visible to the {restricted.peopleInside} people inside only. Its name and reason stay listed so it can be
        found.
      </td>
      <td className="px-4 py-3.5 align-top whitespace-nowrap text-ink-3">{activityText(room.lastActivityAtUtc)}</td>
    </tr>
  );
}

export function RoomsTable({
  rooms,
  titleById,
  onAssignOwner,
}: {
  rooms: RoomListRowDto[];
  /** Every room's title by id, so a merged row can name the room it was merged into. */
  titleById: Map<string, string>;
  onAssignOwner: (room: RoomListRowDto) => void;
}) {
  return (
    <div className="overflow-x-auto rounded-card border border-line bg-paper">
      <table className="w-full min-w-[1040px] text-left text-[12.5px]">
        <thead>
          <tr className="border-b border-line bg-paper-2">
            <th className={HEAD}>Room</th>
            <th className={HEAD}>Stage</th>
            <th className={HEAD}>Owner</th>
            <th className={HEAD}>Agents</th>
            <th className={cn(HEAD, "text-right")}>At risk · open → live</th>
            <th className={cn(HEAD, "text-right")}>People</th>
            <th className={HEAD}>Waiting</th>
            <th className={HEAD}>Activity</th>
          </tr>
        </thead>
        <tbody>
          {rooms.map((room) => {
            if (room.restricted) return <RestrictedRow key={room.id} room={room} />;

            const mergedInto = room.mergedIntoRoomId
              ? (titleById.get(room.mergedIntoRoomId) ?? "another room")
              : null;

            return (
              <tr
                key={room.id}
                className={cn(
                  "border-b border-line last:border-0",
                  room.isStale && "bg-amber-bg/40",
                  !room.isStale && room.needsYou && "bg-ultra-bg/40"
                )}
              >
                <td className="px-4 py-3.5 align-top">
                  <RoomTitle room={room} />
                  <p className="mt-1 text-[11.5px] text-ink-3">{room.conditionLabel}</p>
                  {mergedInto ? (
                    <p className="mt-1 text-[11.5px] text-ink-3">
                      Merged into{" "}
                      <Link to={`/rooms/${room.mergedIntoRoomId}`} className="text-ultra hover:underline">
                        {mergedInto}
                      </Link>{" "}
                      · still readable here
                    </p>
                  ) : (
                    <RoomFlags room={room} />
                  )}
                </td>
                <td className="px-4 py-3.5 align-top whitespace-nowrap text-ink-2">{room.stageLabel}</td>
                <td className="px-4 py-3.5 align-top whitespace-nowrap">
                  <OwnerCell room={room} onAssign={() => onAssignOwner(room)} />
                </td>
                <td className="px-4 py-3.5 align-top">
                  <AgentsCell room={room} />
                </td>
                <td className="px-4 py-3.5 align-top whitespace-nowrap">
                  <AtRiskCell room={room} />
                </td>
                <td className="px-4 py-3.5 text-right align-top font-mono whitespace-nowrap text-ink">
                  {room.population === null ? "—" : room.population.toLocaleString("en-US")}
                </td>
                <td className="px-4 py-3.5 align-top">
                  <WaitingCell room={room} />
                </td>
                <td className="px-4 py-3.5 align-top whitespace-nowrap text-ink-3">
                  {activityText(room.lastActivityAtUtc)}
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}

export function RoomsEmpty({ filtered, onClear }: { filtered: boolean; onClear: () => void }) {
  return (
    <div className="rounded-card border border-dashed border-line bg-paper p-10 text-center">
      <p className="text-[13px] font-semibold text-ink">
        {filtered ? "No rooms match these filters" : "No rooms in this state"}
      </p>
      <p className="mt-1.5 text-[11.5px] text-ink-3">
        {filtered ? "Clear a filter or try another saved view." : "Pick another state tile above."}
      </p>
      {filtered && (
        <Button type="button" variant="outline" size="sm" className="mt-4" onClick={onClear}>
          Clear filters
        </Button>
      )}
    </div>
  );
}
