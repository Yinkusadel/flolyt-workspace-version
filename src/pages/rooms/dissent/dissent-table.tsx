import * as React from "react";
import { Link } from "react-router-dom";

import { cn } from "@/lib/utils";
import { Chip } from "@/components/ui/chip";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/utils/auth-context";
import type { RoomAllDissentRowDto } from "@/services/api/rooms/get-all-dissent";
import { formatDayTime, humanize } from "@/pages/rooms/convening/format";
import { JudgeDialog } from "@/pages/rooms/dissent/judge-dialog";

const HEAD = "px-4 py-2.5 font-mono text-[9px] font-medium tracking-[0.8px] text-ink-4 uppercase";

function TurnedOut({ row, onJudge, isAuthor }: { row: RoomAllDissentRowDto; onJudge: () => void; isAuthor: boolean }) {
  if (row.withdrawn) {
    // ❌ Backend does NOT provide: withdrawnAtUtc (the design adds "By its author, 26 Sep").
    return <Chip>Withdrawn</Chip>;
  }
  if (row.borneOut === true) {
    // ❌ Backend does NOT provide: judgedAtUtc (the design adds "Judged 2 Oct").
    return <Chip tone="teal">Borne out</Chip>;
  }
  if (row.borneOut === false) {
    // ❌ Backend does NOT provide: judgedAtUtc (the design adds "Judged 28 Sep").
    return <Chip tone="amber">Shown wrong</Chip>;
  }
  return (
    <div className="flex flex-col items-start gap-2">
      <Chip className="border-dashed bg-transparent">Not yet judged</Chip>
      <Button type="button" variant="outline" size="sm" onClick={onJudge}>
        {isAuthor ? "Judge or withdraw..." : "Judge..."}
      </Button>
    </div>
  );
}

/** Every objection across the rooms the caller can see (Dissent ledger.png). */
export function DissentTable({ rows }: { rows: RoomAllDissentRowDto[] }) {
  const { user } = useAuth();
  const [target, setTarget] = React.useState<RoomAllDissentRowDto | null>(null);

  return (
    <>
      <div className="overflow-x-auto rounded-card border border-line bg-paper">
        <table className="w-full min-w-190 text-left text-[12.5px]">
          <thead>
            <tr className="border-b border-line bg-paper-2">
              <th className={cn(HEAD, "w-56")}>Turned out</th>
              <th className={HEAD}>Objection</th>
              <th className={cn(HEAD, "w-72")}>Room</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((row) => {
              const isAuthor = user?.id === row.byUserId;
              return (
                <tr
                  key={row.id}
                  className={cn("border-b border-line last:border-0", row.borneOut === false && "bg-amber-bg/40")}
                >
                  <td className="px-4 py-3.5 align-top">
                    <TurnedOut row={row} isAuthor={isAuthor} onJudge={() => setTarget(row)} />
                  </td>
                  <td className="px-4 py-3.5 align-top">
                    <p className={cn("text-[13px] text-ink", row.withdrawn && "text-ink-3 line-through")}>
                      “{row.wording}”
                    </p>
                    {/* ❌ Backend does NOT provide: aboutProposalId on this list (the design adds "about a play"). */}
                    <p className="mt-1.5 text-[11.5px] text-ink-3">
                      {row.byLabel} · recorded {formatDayTime(row.recordedAtUtc)}
                    </p>
                  </td>
                  <td className="px-4 py-3.5 align-top">
                    <Link
                      to={`/rooms/${row.roomId}`}
                      className={cn("font-semibold text-ultra hover:underline", row.withdrawn && "opacity-70")}
                    >
                      {row.roomTitle}
                    </Link>
                    <div className="mt-1.5">
                      <Chip>{humanize(row.roomStatus)}</Chip>
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {target && (
        <JudgeDialog
          row={target}
          canWithdraw={user?.id === target.byUserId}
          open={Boolean(target)}
          onOpenChange={(open) => !open && setTarget(null)}
        />
      )}
    </>
  );
}
