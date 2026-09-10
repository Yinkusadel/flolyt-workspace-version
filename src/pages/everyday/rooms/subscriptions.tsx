import { Link } from "react-router-dom";

import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { KpiCards, type Kpi } from "@/pages/everyday/lifecycle/stage/kpi-cards";
import { Chip } from "@/pages/everyday/lifecycle/stage/chip";
import { formatCompactMoney } from "@/pages/everyday/lifecycle/format-measured-value";
import { formatRoomActivity } from "@/pages/everyday/rooms/format";
import { useGetRoomSubscriptions } from "@/features/rooms/use-get-room-subscriptions";
import useSetRoomNotifyLevel from "@/features/rooms/use-set-room-notify-level";
import useUnwatchRoom from "@/features/rooms/use-unwatch-room";
import type { RoomSubscriptionRowDto } from "@/services/api/rooms/get-room-subscriptions";

const HEAD_CLASS = "px-4 py-2.5 font-mono text-[8.5px] font-medium tracking-[0.8px] text-ink-4 uppercase";

const NOTIFY_LEVELS = [
  { value: "everything", label: "everything" },
  { value: "decisions-only", label: "decisions only" },
  { value: "nothing", label: "nothing (muted)" },
];

const RULES = [
  { label: "You cannot mute a room you own", value: "muting your own room is resigning from it, and resigning has its own screen", tone: "text-amber" },
  { label: "Muted is not hidden", value: "it stays in your list, stays searchable, and still counts toward your load" },
  { label: "Being @-mentioned adds you, once", value: "one mention is not a subscription · you are added and told that you were" },
  { label: "Watching decays", value: "a room you have not opened in 30 days asks whether you still want it", tone: "text-teal" },
  { label: "Your load is visible to your lead", value: "22 rooms is high · it can be seen before you're assigned a 23rd", tone: "text-amber" },
];

function ChangeCell({ row }: { row: RoomSubscriptionRowDto }) {
  const { setRoomNotifyLevel, isPending: isSettingLevel } = useSetRoomNotifyLevel();
  const { unwatchRoom, isPending: isUnwatching } = useUnwatchRoom();

  if (!row.canMute) {
    return <Chip tone="amber">cannot mute · you own it</Chip>;
  }

  return (
    <div className="flex items-center gap-2">
      <select
        value={row.notifyLevel}
        disabled={isSettingLevel}
        onChange={(e) => setRoomNotifyLevel({ roomId: row.roomId, notifyLevel: e.currentTarget.value })}
        className="rounded-control border border-line bg-paper px-2 py-1 text-[10.5px] text-ink-2 outline-none"
      >
        {NOTIFY_LEVELS.map((level) => (
          <option key={level.value} value={level.value}>
            {level.label}
          </option>
        ))}
      </select>
      {!row.ownsIt && (
        <button
          type="button"
          disabled={isUnwatching}
          onClick={() => unwatchRoom(row.roomId)}
          className="text-[10.5px] text-ink-4 hover:text-ink"
        >
          Stop watching
        </button>
      )}
    </div>
  );
}

/** R40 — Room subscriptions (`/rooms/subscriptions`) — a top-level cross-room surface. */
const RoomSubscriptions = () => {
  const { data, isPending, isError, error, refetch } = useGetRoomSubscriptions();

  if (isPending) {
    return (
      <div className="space-y-6">
        <Skeleton className="h-6 w-40" />
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-4">
          {Array.from({ length: 4 }).map((_, i) => (
            <Skeleton key={i} className="h-20 rounded-card" />
          ))}
        </div>
        {Array.from({ length: 4 }).map((_, i) => (
          <Skeleton key={i} className="h-12 w-full rounded-card" />
        ))}
      </div>
    );
  }

  if (isError || !data) {
    return (
      <div className="space-y-4">
        <h1 className="text-[17px] font-semibold text-ink">What you watch</h1>
        <div className="flex flex-wrap items-center gap-3 rounded-card border border-rose-border bg-rose-bg/40 px-4 py-3">
          <p className="text-[12px] text-rose">{error?.message ?? "Couldn't load your subscriptions."}</p>
          <Button type="button" variant="outline" size="sm" onClick={() => refetch()}>
            Retry
          </Button>
        </div>
      </div>
    );
  }

  const sub = data.data;
  const STATS: Kpi[] = [
    { eyebrow: "You are watching", value: `${sub.watching} rooms`, note: `${sub.owned} you own, ${sub.watching - sub.owned} you do not` },
    { eyebrow: "Reaching your digest", value: `${sub.reachingTheirDigest}`, tone: "teal", note: "the rest are silent" },
    { eyebrow: "Auto-added this month", value: `${sub.autoAddedThisMonth}`, note: "you were @-mentioned" },
    { eyebrow: "Muted by you", value: `${sub.muted}`, note: "still visible, never notified" },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-[17px] font-semibold text-ink">What you watch</h1>
        <p className="mt-1 text-[11.5px] text-ink-3">
          {sub.watching} rooms · {sub.reachingTheirDigest} reach your digest · {sub.muted} muted and still visible
        </p>
      </div>

      <KpiCards items={STATS} />

      <div>
        <p className="font-mono text-[9.5px] font-medium tracking-[1.05px] text-ink-4 uppercase">
          What you watch, and how loudly
        </p>
        {sub.rooms.length === 0 ? (
          <div className="mt-2 rounded-card border border-dashed border-line bg-paper p-6 text-center text-[11.5px] text-ink-3">
            Nothing watched yet.
          </div>
        ) : (
          <div className="mt-2 overflow-x-auto rounded-card border border-line bg-paper">
            <table className="w-full min-w-[820px] text-left text-[12.5px]">
              <thead>
                <tr className="border-b border-line bg-paper-2">
                  <th className={HEAD_CLASS}>Room</th>
                  <th className={HEAD_CLASS}>Why you are on it</th>
                  <th className={HEAD_CLASS}>At risk</th>
                  <th className={HEAD_CLASS}>Notifies you</th>
                  <th className={HEAD_CLASS}>Since</th>
                  <th className={HEAD_CLASS}>Change</th>
                </tr>
              </thead>
              <tbody>
                {sub.rooms.map((row) => (
                  <tr key={row.roomId} className="border-b border-line last:border-0 hover:bg-paper-2">
                    <td className="px-4 py-3.5">
                      <Link to={`/rooms/${row.roomId}`} className="font-semibold text-ultra hover:underline">
                        {row.title}
                      </Link>
                    </td>
                    <td className="px-4 py-3.5 text-ink-3">{row.ownsIt ? "You own it" : (row.reason ?? "—")}</td>
                    <td className="px-4 py-3.5">
                      {row.amountAtRisk === null ? (
                        <span className="text-[10.5px] text-ink-4">unavailable</span>
                      ) : (
                        <Chip tone="rose">{formatCompactMoney(row.amountAtRisk, row.currency ?? "NGN")}</Chip>
                      )}
                    </td>
                    <td className="px-4 py-3.5 text-ink-4">{row.notifyLevel.replace("-", " ")}</td>
                    <td className="px-4 py-3.5 font-mono text-ink-4">{formatRoomActivity(row.sinceUtc)}</td>
                    <td className="px-4 py-3.5">
                      <ChangeCell row={row} />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      <div>
        <p className="font-mono text-[9.5px] font-medium tracking-[1.05px] text-ink-4 uppercase">The rules</p>
        <div className="mt-2 divide-y divide-line rounded-card border border-line bg-paper">
          {RULES.map((rule) => (
            <div key={rule.label} className="flex flex-wrap items-center justify-between gap-3 px-4 py-3 text-[12px]">
              <span className="text-ink-2">{rule.label}</span>
              <span className={`text-right ${rule.tone ?? "text-ink-3"}`}>{rule.value}</span>
            </div>
          ))}
        </div>
      </div>

      <div className="rounded-card border border-teal-border bg-teal-bg p-4">
        <div>
          <p className="text-[12px] font-semibold text-ink">At scale, attention is the scarce thing</p>
          <p className="mt-1 text-[10.5px] leading-relaxed text-ink-2">
            Nobody can watch everything and nobody should. This is the only place a person sees the full shape of
            what they have signed up to hear about, and quietly, it is the best predictor of who is about to be
            overloaded.
          </p>
        </div>
      </div>
    </div>
  );
};

export default RoomSubscriptions;
