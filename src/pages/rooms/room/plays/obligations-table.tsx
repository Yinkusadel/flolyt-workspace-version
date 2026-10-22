import { cn } from "@/lib/utils";
import { Chip, type ChipTone } from "@/components/ui/chip";
import { formatDay, formatMoney, humanize } from "@/pages/rooms/convening/format";
import type { RoomPlayReturnedObligationDto } from "@/services/api/rooms/get-room-plays";

const HEAD = "px-4 py-2.5 font-mono text-[9px] font-medium tracking-[0.8px] text-ink-4 uppercase";

/** Known states get a tone; any other value stays a plain grey chip. */
const STATE_TONE: Record<string, ChipTone> = { asked: "neutral", accepted: "ultra", done: "teal" };

/**
 * "Obligations from this room": the follow-ups handed off when the Room closed that came back to it (`returnedObligations` in the
 * plays response). One named person each, never a team. Built from the documented shape only: the backend has not returned a
 * single real item yet, so the state values and block contents are unverified.
 */
export function ObligationsTable({ obligations }: { obligations: RoomPlayReturnedObligationDto[] }) {
  return (
    <section className="overflow-hidden rounded-card border border-line bg-paper">
      <header className="flex flex-wrap items-baseline justify-between gap-2 border-b border-line px-5 py-3.5">
        <h3 className="text-[14px] font-semibold text-ink">Obligations from this room</h3>
        <p className="text-[11.5px] text-ink-3">One named person each, never a team</p>
      </header>
      {obligations.length === 0 ? (
        <p className="px-5 py-4 text-[12.5px] text-ink-3">No obligation has come back to this Room.</p>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full min-w-[760px] border-collapse text-left">
            <thead className="bg-paper-2/60">
              <tr>
                <th className={HEAD}>Ask</th>
                <th className={HEAD}>From → to</th>
                <th className={HEAD}>State</th>
                <th className={HEAD}>Due</th>
                <th className={HEAD}>Blocks</th>
              </tr>
            </thead>
            <tbody>
              {obligations.map((item) => {
                const due = item.dueAtUtc ?? item.proposedDueAtUtc;
                return (
                  <tr key={item.id} className={cn("border-t border-line align-top text-[12.5px]", item.isOverdue && "bg-rose-bg/40")}>
                    <td className="px-4 py-3">
                      <p className="text-ink">{item.description}</p>
                      {item.repeatCount > 1 && <p className="mt-0.5 text-[11.5px] text-ink-3">Asked again · {item.repeatCount} times</p>}
                    </td>
                    <td className="px-4 py-3 text-ink">
                      {item.fromName} → <span className="font-semibold">{item.toName}</span>
                      {item.toHasLeft && <p className="mt-0.5 text-[11.5px] font-normal text-ink-3">{item.toName} has left the workspace</p>}
                    </td>
                    <td className="px-4 py-3">
                      {item.isOverdue ? (
                        <Chip tone="rose">Overdue{item.daysOverdue ? ` ${item.daysOverdue} ${item.daysOverdue === 1 ? "day" : "days"}` : ""}</Chip>
                      ) : (
                        <Chip tone={STATE_TONE[item.state] ?? "neutral"}>{humanize(item.state)}</Chip>
                      )}
                    </td>
                    <td className="px-4 py-3 font-mono text-[12px] text-ink">
                      {formatDay(due)}
                      {!item.dueAtUtc && <span className="ml-1.5 font-sans text-[11px] text-ink-3">proposed</span>}
                    </td>
                    <td className="px-4 py-3 text-ink">
                      {item.blocks.length === 0
                        ? "—"
                        : item.blocks.map((block, index) => (
                            <p key={`${block.reference ?? block.text}-${index}`}>
                              {block.text}
                              {block.amount !== null && block.currency ? ` · ${formatMoney(block.amount, block.currency)}` : ""}
                            </p>
                          ))}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </section>
  );
}
