import { cn } from "@/lib/utils";
import { ProposalCard } from "@/pages/rooms/room/decision/proposal-card";
import type { Play, Proposal } from "@/pages/rooms/types";

const ACCENT_CLASS: Record<Play["status"], string> = {
  "in-progress": "bg-team-4",
  draft: "bg-ultra-border",
  deferred: "bg-line",
};

function PlayCard({ play }: { play: Play }) {
  return (
    <div className="relative overflow-hidden rounded-card border border-line bg-paper pl-3.5">
      <span className={cn("absolute inset-y-0 left-0 w-[3px]", ACCENT_CLASS[play.status])} aria-hidden />
      <div className="py-3.5 pr-3.5 pl-1">
        <span className="font-mono text-[9px] font-semibold tracking-[0.9px] text-ink-4 uppercase">
          {play.eyebrow}
        </span>
        <h4 className="mt-1.5 text-[13px] font-semibold text-ink">{play.title}</h4>
        {play.rows && (
          <dl className="mt-2.5 space-y-1.5">
            {play.rows.map((row) => (
              <div key={row.label} className="flex items-baseline justify-between gap-3">
                <dt className="text-[11px] text-ink-4">{row.label}</dt>
                <dd className="text-right text-[11px] font-medium text-ink-2">{row.value}</dd>
              </div>
            ))}
          </dl>
        )}
        {play.note && <p className="mt-2 text-[10.5px] text-ink-4">{play.note}</p>}
        {play.dissent && (
          <div className="mt-2.5 border-l-2 border-line pl-2.5">
            <p className="text-[10.5px] text-ink-3">
              Dissent — {play.dissent.who}: "{play.dissent.quote}"
            </p>
          </div>
        )}
      </div>
    </div>
  );
}

export function PlayBoard({
  proposals,
  plays,
  count,
  className,
}: {
  proposals: Proposal[];
  plays: Play[];
  count: number;
  className?: string;
}) {
  return (
    <div className={cn("flex h-full min-h-0 flex-col bg-paper-2", className)}>
      <div className="flex shrink-0 items-baseline justify-between border-b border-line px-3.5 py-3">
        <p className="text-[11px] font-semibold tracking-[0.45px] text-ink-2">PLAYS</p>
        <p className="font-mono text-[10px] text-ink-4">{count}</p>
      </div>
      <div className="min-h-0 flex-1 space-y-3 overflow-y-auto px-3.5 py-3.5">
        {proposals.map((proposal) => (
          <ProposalCard key={proposal.id} proposal={proposal} />
        ))}
        {plays.map((play) => (
          <PlayCard key={play.id} play={play} />
        ))}
        {proposals.length === 0 && plays.length === 0 && (
          <p className="px-1 text-[11px] text-ink-4">Nothing waiting on a play right now.</p>
        )}
      </div>
    </div>
  );
}
