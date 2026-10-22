import * as React from "react";
import { useSearchParams } from "react-router-dom";

import { Button } from "@/components/ui/button";
import { SearchableSelect, SearchableSelectSkeleton } from "@/components/ui/searchable-select";
import { Skeleton } from "@/components/ui/skeleton";
import { useGetRoomSubscriptions } from "@/features/rooms/use-get-room-subscriptions";
import useGetWorkspaceMembers from "@/features/workspace/use-get-workspace-members";
import { LoadTable } from "@/pages/rooms/my-load/load-table";

/** "You" in the picker: no `userId` is sent, which the endpoint reads as the caller. */
const ME = "__me__";

const TILE_LABEL = "font-mono text-[9px] font-medium tracking-[0.8px] text-ink-4 uppercase";

function Tile({ label, value, note }: { label: string; value: number; note: string }) {
  return (
    <div className="rounded-card border border-line bg-paper p-4">
      <p className={TILE_LABEL}>{label}</p>
      <p className="mt-2 font-mono text-[26px] leading-none font-semibold text-ink">{value}</p>
      <p className="mt-2 text-[11.5px] text-ink-3">{note}</p>
    </div>
  );
}

function Header({ title, children }: { title: string; children?: React.ReactNode }) {
  return (
    <div className="flex flex-wrap items-start justify-between gap-4">
      <div className="max-w-xl">
        <h1 className="text-[17px] font-semibold text-ink">{title}</h1>
        <p className="mt-1 text-[11.5px] text-ink-3">
          Check someone's load before assigning them another room. It's the best predictor of overload in the
          workspace.
        </p>
      </div>
      {children}
    </div>
  );
}

function LoadSkeleton({ title }: { title: string }) {
  return (
    <div className="space-y-6" aria-busy="true" aria-label="Loading the load">
      <Header title={title} />
      <div className="grid grid-cols-2 gap-3 md:grid-cols-3 xl:grid-cols-6">
        {Array.from({ length: 6 }).map((_, i) => (
          <Skeleton key={i} className="h-28 rounded-card" />
        ))}
      </div>
      <div className="rounded-card border border-line bg-paper">
        {Array.from({ length: 4 }).map((_, i) => (
          <div key={i} className="flex items-center gap-6 border-b border-line px-4 py-4 last:border-0">
            <Skeleton className="h-4 w-56" />
            <Skeleton className="h-4 w-28" />
            <Skeleton className="h-9 w-36" />
            <Skeleton className="ml-auto h-4 w-24" />
          </div>
        ))}
      </div>
    </div>
  );
}

/** The My load tab (My load · subscriptions.png), on GET /rooms/subscriptions. */
const MyLoadTab = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const person = searchParams.get("person");

  const me = useGetRoomSubscriptions();
  const other = useGetRoomSubscriptions({ userId: person ?? undefined }, { enabled: Boolean(person) });
  const members = useGetWorkspaceMembers();

  const myUserId = me.data?.data.userId;
  const personOptions = React.useMemo(
    () => [
      { value: ME, label: "You" },
      ...members.members
        // `data.userId` of the no-param call is the caller's own id, so "You" is not listed twice.
        .filter((m) => m.kind === "Human" && m.isActive && m.id !== myUserId)
        .map((m) => ({ value: m.id, label: m.displayName })),
    ],
    [members.members, myUserId]
  );

  const setPerson = (value: string) => {
    const next = new URLSearchParams(searchParams);
    if (value === ME) next.delete("person");
    else next.set("person", value);
    setSearchParams(next, { replace: true });
  };

  const viewingOther = Boolean(person);
  const query = viewingOther ? other : me;
  const personName = members.members.find((m) => m.id === person)?.displayName;
  const title = viewingOther ? `What ${personName ?? "this person"} is carrying` : "What you're carrying";

  const picker = (
    <div className="w-full sm:w-64">
      <label htmlFor="my-load-person" className="mb-1.5 block text-[11px] font-semibold text-ink-2">
        Showing
      </label>
      {members.isPending ? (
        <SearchableSelectSkeleton />
      ) : (
        <SearchableSelect
          id="my-load-person"
          options={personOptions}
          value={person ?? ME}
          onChange={setPerson}
          searchPlaceholder="Search people..."
          className="rounded-control bg-paper text-[12px]"
        />
      )}
    </div>
  );

  if (query.isPending) return <LoadSkeleton title={title} />;
  if (query.isError) {
    return (
      <div className="space-y-6">
        <Header title={title}>{picker}</Header>
        <div className="flex flex-wrap items-center gap-3 rounded-card border border-rose-border bg-rose-bg/40 px-4 py-3">
          <p className="text-[12px] text-rose">{query.error?.message || "Couldn't load this load."}</p>
          <Button type="button" variant="outline" size="sm" onClick={() => query.refetch()}>
            Retry
          </Button>
        </div>
      </div>
    );
  }

  const data = query.data.data;

  return (
    <div className="space-y-6">
      <Header title={title}>{picker}</Header>

      <div className="grid grid-cols-2 gap-3 md:grid-cols-3 xl:grid-cols-6">
        <Tile label="Watching" value={data.watching} note="Includes muted rooms" />
        <Tile label="Owns" value={data.owned} note="Can't be muted" />
        <Tile label="Reaching digest" value={data.reachingTheirDigest} note="A count; no digest is sent yet" />
        <Tile label="Muted" value={data.muted} note="Still searchable, still load" />
        <Tile label="Auto-added this month" value={data.autoAddedThisMonth} note="From mentions and rules" />
        <Tile label="Still wanted?" value={data.askingWhetherStillWanted} note="Not opened in 30 days" />
      </div>

      {data.rooms.length === 0 ? (
        <div className="rounded-card border border-dashed border-line bg-paper p-10 text-center">
          <p className="text-[13px] font-semibold text-ink">
            {viewingOther ? "Not watching any rooms" : "You're not watching any rooms"}
          </p>
          <p className="mt-1.5 text-[11.5px] text-ink-3">Rooms appear here when they own one or are added to one.</p>
        </div>
      ) : (
        <LoadTable rows={data.rooms} editable={!viewingOther} />
      )}
    </div>
  );
};

export default MyLoadTab;
