import * as React from "react";

import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { useGetAllDissent } from "@/features/rooms/use-get-all-dissent";
import { toNumber } from "@/pages/rooms/convening/format";
import { DissentTable } from "@/pages/rooms/dissent/dissent-table";

const PAGE_SIZE = 50;

function Header({ children }: { children?: React.ReactNode }) {
  return (
    <div className="flex flex-wrap items-end justify-between gap-4">
      <div className="max-w-2xl">
        <h1 className="text-[17px] font-semibold text-ink">Dissent ledger</h1>
        <p className="mt-1 text-[11.5px] text-ink-3">
          Every objection across every room you can see, newest first. The column that matters is the first: did
          it turn out to be right? An objection shown to be wrong, still on the record, is worth more than a team
          where nobody writes anything down.
        </p>
      </div>
      {children}
    </div>
  );
}

function DissentSkeleton() {
  return (
    <div className="space-y-6" aria-busy="true" aria-label="Loading the dissent ledger">
      <Header />
      <div className="rounded-card border border-line bg-paper">
        {Array.from({ length: 5 }).map((_, i) => (
          <div key={i} className="flex items-start gap-6 border-b border-line px-4 py-4 last:border-0">
            <Skeleton className="h-6 w-28" />
            <div className="flex-1 space-y-2">
              <Skeleton className="h-3.5 w-3/4" />
              <Skeleton className="h-3 w-1/3" />
            </div>
            <div className="w-56 space-y-2">
              <Skeleton className="h-3.5 w-full" />
              <Skeleton className="h-5 w-20" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

/** The Dissent tab (Dissent ledger.png), on GET /rooms/dissent. */
const DissentTab = () => {
  const [includeWithdrawn, setIncludeWithdrawn] = React.useState(false);
  const [take, setTake] = React.useState(PAGE_SIZE);
  const query = useGetAllDissent({ includeWithdrawn, take });

  if (query.isPending) return <DissentSkeleton />;
  if (query.isError) {
    return (
      <div className="space-y-6">
        <Header />
        <div className="flex flex-wrap items-center gap-3 rounded-card border border-rose-border bg-rose-bg/40 px-4 py-3">
          <p className="text-[12px] text-rose">{query.error?.message || "Couldn't load the dissent ledger."}</p>
          <Button type="button" variant="outline" size="sm" onClick={() => query.refetch()}>
            Retry
          </Button>
        </div>
      </div>
    );
  }

  const { dissent, returned, truncated } = query.data.data;

  return (
    <div className="space-y-6">
      <Header>
        <label className="flex items-center gap-2 text-[12px] text-ink">
          <input
            type="checkbox"
            checked={includeWithdrawn}
            onChange={(event) => {
              setIncludeWithdrawn(event.currentTarget.checked);
              setTake(PAGE_SIZE);
            }}
            className="size-3.5 rounded border-line"
          />
          Include withdrawn
        </label>
      </Header>

      {dissent.length === 0 ? (
        <div className="rounded-card border border-dashed border-line bg-paper p-10 text-center">
          <p className="text-[13px] font-semibold text-ink">No objections on the record</p>
          <p className="mt-1.5 text-[11.5px] text-ink-3">
            Objections recorded in any room you can see appear here, newest first.
          </p>
        </div>
      ) : (
        <>
          <DissentTable rows={dissent} />
          <div className="flex flex-wrap items-center justify-between gap-3">
            <p className="text-[12px] text-ink-3">
              Showing the newest {toNumber(returned) ?? dissent.length}.{truncated ? " There are more." : ""}
            </p>
            {truncated && (
              <Button
                type="button"
                variant="outline"
                size="sm"
                disabled={query.isFetching}
                onClick={() => setTake((current) => current + PAGE_SIZE)}
              >
                {query.isFetching ? "Loading…" : `Show ${PAGE_SIZE} more`}
              </Button>
            )}
          </div>
        </>
      )}
    </div>
  );
};

export default DissentTab;
