import { Link } from "react-router-dom";
import { Lock } from "lucide-react";

import { cn } from "@/lib/utils";
import { Chip } from "@/components/ui/chip";
import { Button } from "@/components/ui/button";
import { SearchableSelect } from "@/components/ui/searchable-select";
import { formatRoomActivity } from "@/lib/format-activity";
import { formatWholeMoney } from "@/lib/format-measured-value";
import useSetRoomNotifyLevel from "@/features/rooms/use-set-room-notify-level";
import useUnwatchRoom from "@/features/rooms/use-unwatch-room";
import type { RoomSubscriptionRowDto } from "@/services/api/rooms/get-room-subscriptions";
import { formatDay, humanize } from "@/pages/rooms/convening/format";

const HEAD = "px-4 py-2.5 font-mono text-[9px] font-medium tracking-[0.8px] text-ink-4 uppercase";

/** The three values POST /rooms/{roomId}/notify-level accepts. */
const NOTIFY_LEVELS = [
  { value: "everything", label: "Everything" },
  { value: "decisions-only", label: "Decisions only" },
  { value: "nothing", label: "Nothing" },
];

const levelLabel = (level: string) => NOTIFY_LEVELS.find((l) => l.value === level)?.label ?? humanize(level);

/** formatRoomActivity gives "12 min" / "3 hrs" / "12 days"; reads better as "12 min ago". */
const lastOpenedText = (iso: string | null) => {
  const text = formatRoomActivity(iso);
  if (/^\d+ (min|hrs?|days?)$/.test(text)) return `${text} ago`;
  // Past 30 days formatRoomActivity gives "Sep 6"; the Since column reads "6 Sep", so match it.
  return iso && /^[A-Z][a-z]{2} \d+/.test(text) ? formatDay(iso) : text;
};

function NotificationsCell({ row, editable }: { row: RoomSubscriptionRowDto; editable: boolean }) {
  const { setRoomNotifyLevel, isPending } = useSetRoomNotifyLevel();
  const muted = row.notifyLevel === "nothing";

  // Somebody else's load is read-only: the notify-level endpoint only ever changes the caller's own.
  if (!editable) {
    return (
      <div className="flex items-center gap-2">
        <span className="text-ink-2">{levelLabel(row.notifyLevel)}</span>
        {muted && <Chip>Muted</Chip>}
      </div>
    );
  }

  return (
    <div className="max-w-40">
      <SearchableSelect
        options={NOTIFY_LEVELS}
        value={row.notifyLevel}
        onChange={(notifyLevel) => setRoomNotifyLevel({ roomId: row.roomId, notifyLevel })}
        disabled={!row.canMute || isPending}
        searchPlaceholder="Search levels..."
        className="rounded-control bg-paper text-[12px]"
      />
      {muted && (
        <div className="mt-1.5">
          <Chip>Muted</Chip>
        </div>
      )}
      {!row.canMute && (
        <p className="mt-1.5 w-72 text-[11.5px] text-ink-3">
          Owners can't mute. Muting would be resigning; hand the room over instead.
        </p>
      )}
    </div>
  );
}

function RoomCell({ row, editable }: { row: RoomSubscriptionRowDto; editable: boolean }) {
  const { unwatchRoom, isPending } = useUnwatchRoom();

  return (
    <div>
      <Link
        to={`/rooms/${row.roomId}`}
        className="inline-flex items-center gap-1.5 font-semibold text-ultra hover:underline"
      >
        {row.restricted && <Lock className="size-3.5 shrink-0 text-ink-3" aria-label="Restricted" />}
        <span>{row.title}</span>
      </Link>
      {row.ownsIt && (
        <div className="mt-1.5">
          <span className="inline-flex rounded-chip bg-ink px-2 py-0.5 text-[9.5px] font-semibold text-white">Owner</span>
        </div>
      )}
      {row.asksWhetherStillWanted && (
        <div className="mt-2 flex flex-wrap items-center gap-2">
          <p className="text-[11.5px] font-semibold text-amber">Not opened in 30 days. Still want this?</p>
          {/* ❌ Backend does NOT provide: a "keep watching" action (POST /watch is documented only as
              re-adding someone who unwatched; nothing says it clears this question). Button held. */}
          {editable && !row.ownsIt && (
            <Button type="button" variant="outline" size="sm" disabled={isPending} onClick={() => unwatchRoom(row.roomId)}>
              {isPending ? "Unwatching…" : "Unwatch"}
            </Button>
          )}
        </div>
      )}
    </div>
  );
}

/** What one person watches, and how loudly (My load · subscriptions.png). */
export function LoadTable({ rows, editable }: { rows: RoomSubscriptionRowDto[]; editable: boolean }) {
  return (
    <div className="overflow-x-auto rounded-card border border-line bg-paper">
      <table className="w-full min-w-225 text-left text-[12.5px]">
        <thead>
          <tr className="border-b border-line bg-paper-2">
            <th className={HEAD}>Room</th>
            <th className={HEAD}>Why they're here</th>
            <th className={HEAD}>Notifications</th>
            <th className={cn(HEAD, "text-right")}>At risk</th>
            <th className={HEAD}>Since</th>
            <th className={HEAD}>Last opened</th>
          </tr>
        </thead>
        <tbody>
          {rows.map((row) => (
            <tr
              key={row.roomId}
              className={cn("border-b border-line last:border-0", row.asksWhetherStillWanted && "bg-amber-bg/40")}
            >
              <td className="px-4 py-3.5 align-top">
                <RoomCell row={row} editable={editable} />
              </td>
              <td className="px-4 py-3.5 align-top text-ink-2">{row.reason ? humanize(row.reason) : "—"}</td>
              <td className="px-4 py-3.5 align-top">
                <NotificationsCell row={row} editable={editable} />
              </td>
              <td className="px-4 py-3.5 text-right align-top font-mono whitespace-nowrap text-ink">
                {row.amountAtRisk !== null && row.currency ? (
                  formatWholeMoney(row.amountAtRisk, row.currency)
                ) : (
                  <span className="text-ink-4">—</span>
                )}
              </td>
              <td className="px-4 py-3.5 align-top whitespace-nowrap text-ink-3">{formatDay(row.sinceUtc)}</td>
              <td className="px-4 py-3.5 align-top whitespace-nowrap text-ink-3">{lastOpenedText(row.lastOpenedAtUtc)}</td>
            </tr>
          ))}
        </tbody>
      </table>
      <p className="border-t border-line px-4 py-3 text-[11.5px] text-ink-3">
        Nobody is unsubscribed by time. After 30 days unopened the room just asks. Someone who unwatches isn't
        re-added by a mention or a rule.
      </p>
    </div>
  );
}
