import { toast } from "sonner";

import { cn } from "@/lib/utils";
import { ActorAvatar, actorName, actorRole } from "@/pages/rooms/actor";
import type { RoomDetail } from "@/pages/rooms/types";

const CONSEQUENCE_TONE_CLASS: Record<NonNullable<RoomDetail["log"]>[number]["consequenceTone"] & string, string> = {
  amber: "text-amber",
  teal: "text-teal",
  ink: "text-ink-3",
};

/** Screen 30 (log tab) — see flolyt-kit-122/30-room-log-tab.svg. */
export function LogTab({ room }: { room: RoomDetail }) {
  const log = room.log ?? [];
  const attribution = room.logAttribution;

  return (
    <div className="space-y-6 overflow-y-auto p-6">
      <div className="flex items-baseline justify-between">
        <p className="font-mono text-[9.5px] font-medium tracking-[1.05px] text-ink-4 uppercase">
          Everything that happened in this room, and who did it
        </p>
        <button
          type="button"
          onClick={() => toast.info("Log export queued")}
          className="font-mono text-[9.5px] font-medium tracking-[1.05px] text-ink-4 uppercase hover:text-ink-2"
        >
          Export
        </button>
      </div>

      <div className="overflow-x-auto rounded-card border border-line bg-paper">
        <table className="w-full min-w-[720px] text-left text-[12px]">
          <thead>
            <tr className="border-b border-line">
              <th className="px-3 py-2.5 font-mono text-[9px] font-medium tracking-[0.85px] text-ink-4 uppercase">
                Time
              </th>
              <th className="px-3 py-2.5 font-mono text-[9px] font-medium tracking-[0.85px] text-ink-4 uppercase">
                Actor
              </th>
              <th className="px-3 py-2.5 font-mono text-[9px] font-medium tracking-[0.85px] text-ink-4 uppercase">
                Action
              </th>
              <th className="px-3 py-2.5 font-mono text-[9px] font-medium tracking-[0.85px] text-ink-4 uppercase">
                Consequence
              </th>
            </tr>
          </thead>
          <tbody>
            {log.map((entry, i) => (
              <tr key={i} className="border-b border-line last:border-0">
                <td className="px-3 py-3 align-top font-mono text-[10.5px] whitespace-nowrap text-ink-4">
                  {entry.time}
                </td>
                <td className="px-3 py-3 align-top whitespace-nowrap">
                  <span className="flex items-center gap-2">
                    <ActorAvatar actor={entry.actor} size="sm" />
                    <span
                      className={cn(
                        "text-[10.5px] font-semibold",
                        entry.actor.kind === "agent" ? "font-mono text-ultra uppercase" : "text-ink-2"
                      )}
                    >
                      {actorName(entry.actor)}
                      {actorRole(entry.actor, entry.roleLabel) && entry.actor.kind === "human"
                        ? ` · ${actorRole(entry.actor, entry.roleLabel)}`
                        : ""}
                    </span>
                  </span>
                </td>
                <td className="px-3 py-3 align-top text-ink">{entry.action}</td>
                <td
                  className={cn(
                    "px-3 py-3 align-top font-mono text-[10.5px] whitespace-nowrap",
                    entry.consequenceTone ? CONSEQUENCE_TONE_CLASS[entry.consequenceTone] : "text-ink-4"
                  )}
                >
                  {entry.consequence}
                </td>
              </tr>
            ))}
            {log.length === 0 && (
              <tr>
                <td colSpan={4} className="px-3 py-6 text-center text-ink-4">
                  Nothing logged yet.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {attribution && (
        <div className="rounded-card border border-line bg-paper-2 p-5">
          <p className="font-mono text-[9.5px] font-medium tracking-[1.05px] text-ink-4 uppercase">Attribution</p>
          <div className="mt-2.5 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <p className="max-w-lg text-[12px] leading-relaxed text-ink-2">
              Every line above names who acted. Agent actions are dashed and monospaced; human actions are solid.
              Nothing in this room happened anonymously.
            </p>
            <div className="shrink-0 text-right">
              <p className="text-[15px] font-semibold text-ink">{room.counts.log} entries</p>
              <p className="font-mono text-[10.5px] text-ink-4">
                {attribution.human} human · {attribution.agent} agent
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
