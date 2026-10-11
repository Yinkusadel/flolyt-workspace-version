import { Link } from "react-router-dom";

import { cn } from "@/lib/utils";
import { Chip } from "@/components/ui/chip";
import type { ConveningProposalDto } from "@/services/api/rooms/get-convening-proposals";
import { formatDay, formatMoney, humanize } from "@/pages/rooms/convening/format";

const HEAD = "px-4 py-2.5 font-mono text-[9px] font-medium tracking-[0.8px] text-ink-4 uppercase";

/** Past proposals (Convening queue.png, "Decided · History"). */
export function DecidedTable({ decided }: { decided: ConveningProposalDto[] }) {
  if (decided.length === 0) {
    return (
      <div className="rounded-card border border-dashed border-line bg-paper p-8 text-center">
        <p className="text-[12.5px] font-semibold text-ink">Nothing decided yet</p>
        <p className="mt-1 text-[11.5px] text-ink-3">Accepted and declined proposals are kept here.</p>
      </div>
    );
  }

  return (
    <div className="overflow-x-auto rounded-card border border-line bg-paper">
      <table className="w-full min-w-[640px] text-left text-[12.5px]">
        <thead>
          <tr className="border-b border-line bg-paper-2">
            <th className={HEAD}>Proposal</th>
            <th className={HEAD}>Outcome</th>
            <th className={cn(HEAD, "text-right")}>At risk</th>
            <th className={cn(HEAD, "text-right")}>Raised</th>
          </tr>
        </thead>
        <tbody>
          {decided.map((proposal) => {
            const amount = formatMoney(proposal.amountAtRisk, proposal.currency);
            return (
              <tr key={proposal.id} className="border-b border-line last:border-0">
                <td className="px-4 py-3.5 align-top text-ink">{proposal.title}</td>
                <td className="px-4 py-3.5 align-top">
                  <div className="flex flex-wrap items-center gap-2">
                    <Chip>{humanize(proposal.outcome)}</Chip>
                    {proposal.roomId && (
                      <Link to={`/rooms/${proposal.roomId}`} className="font-semibold text-ultra hover:underline">
                        Open room
                      </Link>
                    )}
                  </div>
                  {/* ❌ Backend does NOT provide: declineReason, decidedByName (decided items carry neither). */}
                </td>
                <td className="px-4 py-3.5 text-right align-top font-mono whitespace-nowrap text-ink">
                  {amount ?? <span className="text-ink-4">—</span>}
                </td>
                <td className="px-4 py-3.5 text-right align-top whitespace-nowrap text-ink-3">
                  {formatDay(proposal.raisedAtUtc)}
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
