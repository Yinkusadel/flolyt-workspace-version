import { Link } from "react-router-dom";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Chip } from "@/pages/lifecycle/stage/chip";
import { TONE_BG_CLASS, TONE_TEXT_CLASS } from "@/pages/rooms/tone";
import type { RoomDetail } from "@/pages/rooms/room/types";
import type { RoomOutcome, Tone } from "@/pages/rooms/types";

const HEAD_CLASS = "px-4 py-2.5 font-mono text-[8.5px] font-medium tracking-[0.8px] text-ink-4 uppercase";

const OUTCOME_TONE: Record<RoomOutcome, Tone> = {
  money_recovered: "teal",
  no_action_needed: "neutral",
  superseded: "ultra",
  disproven: "rose",
  unmeasurable: "amber",
};

const OUTCOME_LABEL: Record<RoomOutcome, string> = {
  money_recovered: "money recovered",
  no_action_needed: "no action needed",
  superseded: "superseded",
  disproven: "disproven",
  unmeasurable: "outcome unmeasurable",
};

/** R35 / R36 / R37 — a closed room, templated by its `outcome`. */
export function ClosedRoom({ room }: { room: RoomDetail }) {
  const outcome = room.outcome ?? "no_action_needed";
  const tone = OUTCOME_TONE[outcome];

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <h1 className="text-[17px] font-semibold text-ink">{room.title}</h1>
          <p className="mt-1 text-[11.5px] text-ink-3">{room.subtitle}</p>
        </div>
        <Button asChild variant="outline" className="shrink-0">
          <Link to={`/rooms/${room.id}/reopen`}>Reopen</Link>
        </Button>
      </div>

      <div className={cn("rounded-card border-2 p-4", TONE_BG_CLASS[tone])}>
        <p className="text-[12.5px] font-semibold text-ink">
          Closed by {room.owner?.name ?? "the room owner"} · {OUTCOME_LABEL[outcome]}
        </p>
        <p className="mt-1 text-[10.5px] leading-relaxed text-ink-2">{room.closeSummary}</p>
      </div>

      {room.closeFacts && (
        <div>
          <p className="font-mono text-[9.5px] font-medium tracking-[1.05px] text-ink-4 uppercase">
            What was found, and what happened next
          </p>
          <div className="mt-2 divide-y divide-line rounded-card border border-line bg-paper">
            {room.closeFacts.map((fact) => (
              <div key={fact.label} className="flex flex-wrap items-center justify-between gap-3 px-4 py-3 text-[12px]">
                <span className="text-ink-2">{fact.label}</span>
                <span className={cn("font-mono font-semibold", fact.tone === "ink" ? "text-ink" : TONE_TEXT_CLASS[fact.tone])}>
                  {fact.value}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}

      {room.closeLedger && (
        <div>
          <p className="font-mono text-[9.5px] font-medium tracking-[1.05px] text-ink-4 uppercase">
            What closing wrote, and where it went
          </p>
          <div className="mt-2 overflow-x-auto rounded-card border border-line bg-paper">
            <table className="w-full min-w-[760px] text-left text-[12px]">
              <thead>
                <tr className="border-b border-line bg-paper-2">
                  <th className={HEAD_CLASS}>What</th>
                  <th className={HEAD_CLASS}>Where it went</th>
                  <th className={HEAD_CLASS}>Value</th>
                  <th className={HEAD_CLASS}>Visible to</th>
                  <th className={cn(HEAD_CLASS, "text-right")}>State</th>
                </tr>
              </thead>
              <tbody>
                {room.closeLedger.map((row) => (
                  <tr key={row.what} className="border-b border-line last:border-0">
                    <td className="px-4 py-3 font-semibold text-ink-2">{row.what}</td>
                    <td className="px-4 py-3 text-ink-3">{row.where}</td>
                    <td className="px-4 py-3 font-mono text-ink">{row.value ?? "—"}</td>
                    <td className="px-4 py-3 text-ink-4">{row.visibleTo ?? "—"}</td>
                    <td className="px-4 py-3 text-right">
                      <Chip tone={row.state.tone}>{row.state.label}</Chip>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {room.closingNote && (
        <div className="rounded-card border border-teal-border bg-teal-bg p-4">
          <div>
            <p className="text-[12px] font-semibold text-ink">{room.closingNoteTitle}</p>
            <p className="mt-1 text-[10.5px] leading-relaxed text-ink-2">{room.closingNote}</p>
          </div>
        </div>
      )}
    </div>
  );
}
