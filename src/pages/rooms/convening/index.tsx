import * as React from "react";

import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { useGetConveningProposals } from "@/features/rooms/use-get-convening-proposals";
import { DecidedTable } from "@/pages/rooms/convening/decided-table";
import { ProposalCard } from "@/pages/rooms/convening/proposal-card";
import { WithheldColumn } from "@/pages/rooms/convening/withheld-column";
import { toNumber } from "@/pages/rooms/convening/format";

function Header({ children }: { children?: React.ReactNode }) {
  return (
    <div className="flex flex-wrap items-start justify-between gap-4">
      <div className="max-w-xl">
        <h1 className="text-[17px] font-semibold text-ink">Convening</h1>
        <p className="mt-1 text-[11.5px] text-ink-3">
          What Flolyt noticed and thinks is worth a room. Any member can accept; the room opens in the proposed
          owner's name, not yours.
        </p>
      </div>
      {children}
    </div>
  );
}

/** "Raised this week 5 of 6 cap": how full the weekly cap is. */
function CapCard({ raised, cap }: { raised: number; cap: number }) {
  const width = cap > 0 ? Math.min(100, (raised / cap) * 100) : 0;
  return (
    <div className="w-full rounded-card border border-line bg-paper p-4 sm:w-96">
      <div className="flex items-baseline justify-between gap-3">
        <p className="text-[12.5px] font-semibold text-ink">Raised this week</p>
        <p className="font-mono text-[12px] font-semibold text-ink">
          {raised} of {cap} cap
        </p>
      </div>
      <div
        className="mt-3 h-1.5 overflow-hidden rounded-full bg-paper-2"
        role="progressbar"
        aria-valuemin={0}
        aria-valuemax={cap}
        aria-valuenow={raised}
      >
        <div className="h-full rounded-full bg-amber" style={{ width: `${width}%` }} />
      </div>
      <p className="mt-3 text-[11.5px] text-ink-3">
        Once the cap is hit, new detections go to Withheld, so a quiet queue isn't a quiet week.
      </p>
    </div>
  );
}

function ConveningSkeleton() {
  return (
    <div className="space-y-6" aria-busy="true" aria-label="Loading convening">
      <Header>
        <Skeleton className="h-28 w-full rounded-card sm:w-96" />
      </Header>
      <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_380px]">
        <div className="space-y-4">
          <Skeleton className="h-6 w-48" />
          <Skeleton className="h-64 rounded-card" />
          <Skeleton className="h-64 rounded-card" />
        </div>
        <div className="space-y-4">
          <Skeleton className="h-6 w-32" />
          <Skeleton className="h-72 rounded-card" />
        </div>
      </div>
    </div>
  );
}

/** The Convening tab (Convening queue.png). One call feeds all three lists and the cap. */
const ConveningTab = () => {
  // Same params as the tab bar's badge, so both read one cached request.
  const query = useGetConveningProposals({ includeDecided: true });
  const [showDecided, setShowDecided] = React.useState(true);

  if (query.isPending) return <ConveningSkeleton />;
  if (query.isError) {
    return (
      <div className="space-y-6">
        <Header />
        <div className="flex flex-wrap items-center gap-3 rounded-card border border-rose-border bg-rose-bg/40 px-4 py-3">
          <p className="text-[12px] text-rose">{query.error?.message || "Couldn't load the convening queue."}</p>
          <Button type="button" variant="outline" size="sm" onClick={() => query.refetch()}>
            Retry
          </Button>
        </div>
      </div>
    );
  }

  const { waiting, decided, withheld, withheldNotShown, raisedThisWeek, weeklyCap } = query.data.data;

  return (
    <div className="space-y-8">
      <Header>
        <CapCard raised={toNumber(raisedThisWeek) ?? 0} cap={toNumber(weeklyCap) ?? 0} />
      </Header>

      <div className="grid items-start gap-8 lg:grid-cols-[minmax(0,1fr)_380px]">
        <section>
          <div className="flex items-baseline gap-2">
            <h2 className="text-[15px] font-semibold text-ink">Waiting for a decision</h2>
            <span className="font-mono text-[11px] text-ink-3">{waiting.length}</span>
          </div>
          {waiting.length === 0 ? (
            <div className="mt-4 rounded-card border border-dashed border-line bg-paper p-10 text-center">
              <p className="text-[13px] font-semibold text-ink">Nothing is waiting for a decision</p>
              <p className="mt-1.5 text-[11.5px] text-ink-3">
                New proposals appear here as Flolyt raises them. Check Withheld for detections that couldn't go
                further.
              </p>
            </div>
          ) : (
            <div className="mt-4 space-y-4">
              {waiting.map((proposal) => (
                <ProposalCard key={proposal.id} proposal={proposal} />
              ))}
            </div>
          )}
        </section>

        <WithheldColumn withheld={withheld} notShown={toNumber(withheldNotShown) ?? 0} />
      </div>

      <section>
        <div className="flex items-center justify-between gap-3">
          <div className="flex items-baseline gap-2">
            <h2 className="text-[15px] font-semibold text-ink">Decided</h2>
            <span className="text-[11.5px] text-ink-3">History</span>
          </div>
          <label className="flex items-center gap-2 text-[12px] text-ink">
            <input
              type="checkbox"
              checked={showDecided}
              onChange={(event) => setShowDecided(event.currentTarget.checked)}
              className="size-3.5 rounded border-line"
            />
            Show decided
          </label>
        </div>
        {showDecided && (
          <div className="mt-4">
            <DecidedTable decided={decided} />
          </div>
        )}
      </section>
    </div>
  );
};

export default ConveningTab;
