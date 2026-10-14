import { cn } from "@/lib/utils";
import { Chip, type ChipTone } from "@/components/ui/chip";
import { formatMoney, humanize } from "@/pages/rooms/convening/format";
import type { RoomPlayDto } from "@/services/api/rooms/get-room-plays";

/** Known play states get a tone; any other value the backend sends stays a plain grey chip. */
const STATE_TONE: Record<string, ChipTone> = {
  pending: "ultra",
  deferred: "amber",
  done: "teal",
  rejected: "neutral",
};

const HEAD = "px-4 py-2.5 font-mono text-[9px] font-medium tracking-[0.8px] text-ink-4 uppercase";

const formatHours = (hours: number) => `${Number.isInteger(hours) ? hours : hours.toFixed(1)} h`;

/**
 * The Room's plays (Room · Plays & collisions.png): what each proposal is, where it stands, who decides and how long it has waited.
 * Reach and effect are stated by whoever proposed the play and checked by nothing, so every row says so.
 * Not shown: the design's campaign link on a done play (only `campaignId` is sent, no campaign page to open).
 */
export function PlaysTable({
  plays,
  selectedId,
  onSelect,
}: {
  plays: RoomPlayDto[];
  selectedId: string | null;
  onSelect: (proposalId: string) => void;
}) {
  return (
    <div className="overflow-x-auto rounded-card border border-line bg-paper">
      <table className="w-full min-w-[820px] border-collapse text-left">
        <thead className="border-b border-line bg-paper-2/60">
          <tr>
            <th className={HEAD}>Play</th>
            <th className={HEAD}>State</th>
            <th className={cn(HEAD, "text-right")}>Reach</th>
            <th className={cn(HEAD, "text-right")}>Effect</th>
            <th className={HEAD}>Figures</th>
            <th className={HEAD}>Decides</th>
            <th className={cn(HEAD, "text-right")}>Waiting</th>
          </tr>
        </thead>
        <tbody>
          {plays.map((play) => {
            const selected = play.proposalId === selectedId;
            const effect = play.effect === null || play.currency === null ? null : formatMoney(play.effect, play.currency);
            return (
              <tr
                key={play.proposalId}
                onClick={() => onSelect(play.proposalId)}
                className={cn("cursor-pointer border-b border-line align-top last:border-b-0 hover:bg-paper-2/50", selected && "bg-ultra-bg/50")}
              >
                <td className="px-4 py-3">
                  <button
                    type="button"
                    aria-pressed={selected}
                    onClick={() => onSelect(play.proposalId)}
                    className="block text-left text-[13px] font-semibold text-ink"
                  >
                    {play.summary}
                  </button>
                  <p className="mt-0.5 font-mono text-[10.5px] text-ink-3">{play.toolName}</p>
                </td>
                <td className="px-4 py-3">
                  <Chip tone={STATE_TONE[play.state] ?? "neutral"}>{humanize(play.state)}</Chip>
                  {play.deferredBecause && <p className="mt-1.5 max-w-[16rem] text-[11.5px] leading-snug text-ink-3">{play.deferredBecause}</p>}
                </td>
                <td className="px-4 py-3 text-right font-mono text-[12.5px] text-ink">
                  {play.reach === null ? "—" : play.reach.toLocaleString("en-US")}
                </td>
                <td className="px-4 py-3 text-right font-mono text-[12.5px] text-ink">
                  {effect ?? <span className="font-sans text-[12px] text-ink-3 italic">Unpriced</span>}
                </td>
                <td className="px-4 py-3">
                  {play.figuresAreStated ? <Chip tone="amber">Stated · not checked</Chip> : <span className="text-[12px] text-ink-3">—</span>}
                  {play.basis && <p className="mt-1.5 text-[11.5px] text-ink-3">Basis: {play.basis}</p>}
                </td>
                <td className="px-4 py-3 text-[12.5px] text-ink">{play.decisionOwnerName ?? "—"}</td>
                <td className="px-4 py-3 text-right font-mono text-[12.5px] text-ink">
                  {play.state === "pending" && play.waitingHours !== null ? formatHours(play.waitingHours) : "—"}
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
