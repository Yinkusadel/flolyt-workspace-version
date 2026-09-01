import { cn } from "@/lib/utils";
import { Chip } from "@/pages/everyday/lifecycle/stage/chip";
import { ActorAvatar } from "@/pages/everyday/rooms/actor";
import { TONE_TEXT_CLASS } from "@/pages/everyday/rooms/tone";
import { AUDIENCE_FILTERS, DROPOUT_ROWS, SIMILAR_ROOMS } from "@/pages/everyday/rooms/new/new-room-data";

const HEAD_CLASS = "px-4 py-2.5 font-mono text-[8.5px] font-medium tracking-[0.8px] text-ink-4 uppercase";

/** R07 — New room · who is in it. */
export function StepAudience() {
  return (
    <div className="space-y-5">
      <div>
        <p className="font-mono text-[9.5px] font-medium tracking-[1.05px] text-ink-4 uppercase">Who is in it</p>
        <div className="mt-2 overflow-x-auto rounded-card border border-line bg-paper">
          <div className="min-w-[480px] divide-y divide-line">
            {AUDIENCE_FILTERS.map((row) => (
              <div key={row.field} className="flex items-center gap-3 px-4 py-3 text-[12px]">
                <span className="font-semibold text-ink">{row.field}</span>
                <span className="font-mono text-ink-4">{row.operator}</span>
                <span className="ml-auto font-mono font-semibold text-ink-2">{row.value}</span>
              </div>
            ))}
            <div className="px-4 py-3 text-[12px] font-semibold text-ultra">+ Add a condition</div>
          </div>
        </div>
      </div>

      <div className="rounded-card border-2 border-ultra-border bg-ultra-bg p-5">
        <p className="text-[16px] font-semibold text-ultra">148,000 customers · ₦412M at stake</p>
        <p className="mt-1.5 text-[11px] text-ink-2">Counted against the orders feed, refreshed 6 minutes ago</p>
        <p className="mt-0.5 text-[10.5px] text-ink-3">Recount as you type · this is a live query, not a saved list</p>
      </div>

      <div>
        <p className="font-mono text-[9.5px] font-medium tracking-[1.05px] text-ink-4 uppercase">
          Rooms that already exist about something similar
        </p>
        <div className="mt-2 overflow-x-auto rounded-card border border-line bg-paper">
          <table className="w-full min-w-[720px] text-left text-[12px]">
            <thead>
              <tr className="border-b border-line bg-paper-2">
                <th className={HEAD_CLASS}>Room</th>
                <th className={HEAD_CLASS}>Population</th>
                <th className={HEAD_CLASS}>Overlap with yours</th>
                <th className={HEAD_CLASS}>Owner</th>
                <th className={HEAD_CLASS}>State</th>
                <th className={HEAD_CLASS}>Action</th>
              </tr>
            </thead>
            <tbody>
              {SIMILAR_ROOMS.map((room) => (
                <tr key={room.title} className="border-b border-line last:border-0">
                  <td className="px-4 py-3 font-semibold text-ink-2">{room.title}</td>
                  <td className="px-4 py-3 font-mono text-ink">{room.population}</td>
                  <td className="px-4 py-3">
                    <Chip tone={room.overlapTone}>{room.overlap}</Chip>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-1.5">
                      <ActorAvatar actor={{ kind: "human", person: room.owner }} size="sm" />
                      <span className="text-ink-2">{room.owner.name.split(" ")[0]}</span>
                    </div>
                  </td>
                  <td className="px-4 py-3">
                    <Chip tone={room.stateTone}>{room.state}</Chip>
                  </td>
                  <td className="px-4 py-3">
                    <Chip tone={room.actionTone}>{room.action}</Chip>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <div>
        <p className="font-mono text-[9.5px] font-medium tracking-[1.05px] text-ink-4 uppercase">
          Who drops out, and why · shown now rather than at send
        </p>
        <div className="mt-2 overflow-x-auto rounded-card border border-line bg-paper">
          <div className="min-w-[560px] divide-y divide-line">
            {DROPOUT_ROWS.map((row) => (
              <div key={row.label} className="flex items-center gap-3 px-4 py-3 text-[12px]">
                <span className="text-ink-2">{row.label}</span>
                <span className={cn("ml-auto font-mono font-semibold whitespace-nowrap", TONE_TEXT_CLASS[row.tone])}>
                  {row.customers}
                </span>
                {row.why && <span className={cn("w-64 shrink-0 text-right font-mono text-[10.5px]", TONE_TEXT_CLASS[row.whyTone])}>{row.why}</span>}
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="rounded-card border border-rose-border bg-rose-bg p-4">
        <div>
          <p className="text-[12px] font-semibold text-ink">The room will say 100,000, not 148,000</p>
          <p className="mt-1 text-[10.5px] leading-relaxed text-ink-2">
            A room that opens on the larger number and sends to the smaller one produces a campaign that worked
            being reviewed as one that failed. The exclusions are known now, so the room carries the reachable
            figure from the first minute — and the customers who cannot be reached are still listed, because they
            are a finding of their own.
          </p>
        </div>
      </div>
    </div>
  );
}
