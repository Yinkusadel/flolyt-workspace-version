import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Chip } from "@/pages/lifecycle/stage/chip";
import { ActorAvatar } from "@/pages/rooms/actor";
import { TONE_TEXT_CLASS } from "@/pages/rooms/tone";
import type { RoomDetail } from "@/pages/rooms/room/types";

const HEAD_CLASS = "px-4 py-2.5 font-mono text-[8.5px] font-medium tracking-[0.8px] text-ink-4 uppercase";

/** R38 — a reopened room, `status: "recovering"`. */
export function ReopenedRoom({ room }: { room: RoomDetail }) {
  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <h1 className="text-[17px] font-semibold text-ink">{room.title}</h1>
          <p className="mt-1 text-[11.5px] text-ink-3">{room.subtitle}</p>
        </div>
        <Button variant="outline" className="shrink-0">
          See the first opening
        </Button>
      </div>

      <div className="flex gap-3 rounded-card border-2 border-ultra-border bg-ultra-bg p-4">
        {room.owner && <ActorAvatar actor={{ kind: "human", person: room.owner }} size="default" />}
        <div>
          <p className="text-[12.5px] font-semibold text-ink">{room.headline}</p>
          <p className="mt-1 text-[10.5px] leading-relaxed text-ink-2">
            The prior decision, its evidence and its outcome are all still here — this is a second opening, not a
            new room.
          </p>
        </div>
      </div>

      {room.reopenedCompare && (
        <div>
          <p className="font-mono text-[9.5px] font-medium tracking-[1.05px] text-ink-4 uppercase">
            Both openings, side by side
          </p>
          <div className="mt-2 overflow-x-auto rounded-card border border-line bg-paper">
            <table className="w-full min-w-[760px] text-left text-[12px]">
              <thead>
                <tr className="border-b border-line bg-paper-2">
                  <th className={HEAD_CLASS}></th>
                  <th className={HEAD_CLASS}>First opening</th>
                  <th className={HEAD_CLASS}>Second opening</th>
                  <th className={cn(HEAD_CLASS, "text-right")}>Changed?</th>
                </tr>
              </thead>
              <tbody>
                {room.reopenedCompare.map((row) => (
                  <tr key={row.label} className="border-b border-line last:border-0">
                    <td className="px-4 py-3 font-semibold text-ink-2">{row.label}</td>
                    <td className="px-4 py-3 text-ink-2">{row.first}</td>
                    <td className="px-4 py-3 text-ink-2">{row.second}</td>
                    <td className="px-4 py-3 text-right">
                      <Chip tone={row.changedTone}>{row.changed}</Chip>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {room.reopenedCarries && (
        <div>
          <p className="font-mono text-[9.5px] font-medium tracking-[1.05px] text-ink-4 uppercase">
            What a second opening carries with it
          </p>
          <div className="mt-2 divide-y divide-line rounded-card border border-line bg-paper">
            {room.reopenedCarries.map((row) => (
              <div key={row.label} className="flex flex-wrap items-center justify-between gap-3 px-4 py-3 text-[12px]">
                <span className="text-ink-2">{row.label}</span>
                <span className={cn("text-right font-mono", row.tone === "ink" ? "text-ink-3" : TONE_TEXT_CLASS[row.tone])}>
                  {row.value}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
