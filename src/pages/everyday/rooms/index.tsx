import * as React from "react";
import { Link, useSearchParams } from "react-router-dom";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Chip } from "@/pages/everyday/lifecycle/stage/chip";
import { KpiCards, type Kpi } from "@/pages/everyday/lifecycle/stage/kpi-cards";
import { ActorAvatar } from "@/pages/everyday/rooms/actor";
import { PersonAvatar } from "@/components/person-avatar";
import { OTHER_STATES_EXPLAINERS } from "@/pages/everyday/rooms/index-content";
import { mapRoomListRow } from "@/pages/everyday/rooms/room-list-adapter";
import { TONE_TEXT_CLASS } from "@/pages/everyday/rooms/tone";
import { AssignOwnerModal } from "@/pages/everyday/rooms/modals/assign-owner-modal";
import { useGetRooms } from "@/features/rooms/use-get-rooms";
import { useGetRoomViews } from "@/features/rooms/use-get-room-views";
import useCreateRoomView from "@/features/rooms/use-create-room-view";
import type { RoomListRowDto } from "@/services/api/rooms/get-rooms";
import type { RoomListRow, RoomListState } from "@/pages/everyday/rooms/types";
import {
  Dialog,
  DialogBody,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

const HEAD_CLASS = "px-4 py-2.5 font-mono text-[8.5px] font-medium tracking-[0.8px] text-ink-4 uppercase";

// ---------------------------------------------------------------------------
// Owner cell — a live "No owner" chip opens the assign-owner picker; an owned
// row renders a plain neutral avatar (GET /rooms gives no department, so no
// department-coded color here — see docs/rooms/wiring-roadmap.md).
// ---------------------------------------------------------------------------

function OwnerCell({ room, onAssign }: { room: RoomListRow; onAssign: () => void }) {
  if (room.owner) {
    return (
      <div className="flex items-center gap-1.5">
        <PersonAvatar kind="human" initials={room.owner.initials} size="sm" />
        <span className="text-ink-2">{room.owner.name.split(" ")[0]}</span>
      </div>
    );
  }
  return (
    <button type="button" onClick={onAssign}>
      <Chip tone="amber">No owner</Chip>
    </button>
  );
}

function EmptyState() {
  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <h1 className="text-[17px] font-semibold text-ink">Rooms</h1>
          <p className="mt-1 text-[11.5px] text-ink-3">Nothing open yet</p>
        </div>
        <Button asChild className="shrink-0">
          <Link to="/rooms/new">New room</Link>
        </Button>
      </div>

      <div className="rounded-card border border-dashed border-line bg-paper p-10 text-center">
        <h2 className="text-[16px] font-semibold text-ink">No rooms yet</h2>
        <p className="mx-auto mt-2.5 max-w-md text-[11.5px] leading-relaxed text-ink-3">
          Agents open rooms on their own once they find something worth a decision. You should not have to go
          looking for the first one.
        </p>
        <div className="mt-5 flex flex-wrap items-center justify-center gap-3">
          <Button asChild>
            <Link to="/rooms/new">Open one yourself</Link>
          </Button>
          <Button asChild variant="outline">
            <Link to="/ai-teammates">See what agents watch</Link>
          </Button>
        </div>
        <p className="mt-4 text-[10px] text-ink-4">
          You do not need to create a room to get value. Most people here never create one.
        </p>
      </div>

      {/*
        Both the old "What is happening while you wait" per-source read-progress table AND the
        teal callout that used to sit below it were removed — neither has an endpoint behind it.
        The table: GET /datasources/connected gives real connected/not-connected status + a
        running sync record count, but nothing gives a rows-read-of-total fraction, a "first full
        read" ETA, or which agents are waiting on a source (that's rooms/agent knowledge the
        datasources domain wouldn't have). The callout: its own text explicitly referenced "a
        finish time" and "the two unconnected sources" from that table — once the table was gone,
        the callout was describing UI that no longer existed, which is worse than just missing
        data. The header subtitle above and the "Most rooms open on their own..." body copy were
        also trimmed of their invented specifics ("three sources still reading", "first room
        expected this afternoon", "within a few hours", "one afternoon") for the same reason.
        See docs/rooms/wiring-roadmap.md's Phase 1 notes.
      */}
    </div>
  );
}

function FirstRoomBanner({ room, onAssign }: { room: RoomListRowDto; onAssign: () => void }) {
  const firstAgent = room.agents[0]?.displayName;
  return (
    <div className="rounded-card border-2 border-ultra-border bg-ultra-bg p-5">
      <div className="min-w-0 flex-1">
        <p className="text-[14px] font-semibold text-ink">
          {firstAgent ? `${firstAgent} opened your first room` : "An agent opened your first room"}
        </p>
        <p className="mt-1.5 text-[11px] text-ink-2">
          Nobody asked it to. It read the customer base, found a cohort behaving differently from every cohort
          before it, and opened a room about it.
        </p>
        <p className="mt-1 text-[11px] text-ink-2">
          The room has no owner yet. It will keep working either way, but it cannot act on anything without one.
        </p>
        <div className="mt-3 flex gap-2.5">
          <Button asChild size="sm">
            <Link to={`/rooms/${room.id}`}>Open the room</Link>
          </Button>
          <Button variant="outline" size="sm" onClick={onAssign}>
            Assign an owner
          </Button>
        </div>
      </div>
    </div>
  );
}

function StateTabs({ counts, active }: { counts: Record<RoomListState, number>; active: RoomListState }) {
  const tabs: { key: RoomListState; label: string }[] = [
    { key: "open", label: "Open" },
    { key: "recovering", label: "Recovering" },
    { key: "stale", label: "Stale" },
    { key: "archived", label: "Archived" },
  ];
  return (
    <div className="-mx-4 overflow-x-auto border-b border-line px-4 sm:mx-0 sm:px-0">
      <div className="flex items-center gap-1">
        {tabs.map((tab) => (
          <Link
            key={tab.key}
            to={tab.key === "open" ? "/rooms" : `/rooms?state=${tab.key}`}
            className={cn(
              "shrink-0 rounded-t-panel border-b-2 px-3 py-2.5 text-[11.5px] whitespace-nowrap",
              active === tab.key
                ? "border-ink font-semibold text-ink"
                : "border-transparent font-normal text-ink-3 hover:text-ink-2"
            )}
          >
            {tab.label} · {counts[tab.key]}
          </Link>
        ))}
      </div>
    </div>
  );
}

function RoomTableRow({ room, onAssignOwner }: { room: RoomListRow; onAssignOwner: (room: RoomListRow) => void }) {
  return (
    <tr className="border-b border-line last:border-0 hover:bg-paper-2">
      <td className="px-4 py-3.5">
        <Link to={`/rooms/${room.id}`} className="font-semibold whitespace-nowrap text-ultra hover:underline">
          {room.title}
        </Link>
      </td>
      <td className="px-4 py-3.5 whitespace-nowrap">
        <span className="inline-flex rounded-chip border border-line bg-paper-2 px-2 py-0.5 text-[10.5px] font-medium text-ink-3">
          {room.condition}
        </span>
      </td>
      <td className="px-4 py-3.5 font-mono whitespace-nowrap text-ink">{room.population}</td>
      <td
        className={cn(
          "px-4 py-3.5 font-mono font-semibold whitespace-nowrap",
          room.atRisk === null ? "text-amber" : room.atRiskTone ? TONE_TEXT_CLASS[room.atRiskTone] : "text-ink"
        )}
      >
        {room.atRisk ?? "unavailable"}
      </td>
      <td className="px-4 py-3.5 whitespace-nowrap">
        <OwnerCell room={room} onAssign={() => onAssignOwner(room)} />
      </td>
      <td className="px-4 py-3.5 whitespace-nowrap">
        <div className="flex -space-x-1.5">
          {room.working.map((agent) => (
            <ActorAvatar key={agent.initials} actor={{ kind: "agent", agent }} size="sm" />
          ))}
        </div>
      </td>
      <td
        className={cn(
          "px-4 py-3.5 text-right font-mono whitespace-nowrap",
          room.lastTone ? TONE_TEXT_CLASS[room.lastTone] : "text-ink-4"
        )}
      >
        {room.last}
      </td>
      <td className="px-4 py-3.5 text-right whitespace-nowrap">
        <Chip tone={room.stateTone}>{room.stateLabel}</Chip>
      </td>
    </tr>
  );
}

function MainTable({ rooms, onAssignOwner }: { rooms: RoomListRow[]; onAssignOwner: (room: RoomListRow) => void }) {
  return (
    <div className="overflow-x-auto rounded-card border border-line bg-paper">
      <table className="w-full min-w-[900px] text-left text-[12.5px]">
        <thead>
          <tr className="border-b border-line bg-paper-2">
            <th className={HEAD_CLASS}>Room</th>
            <th className={HEAD_CLASS}>Condition</th>
            <th className={HEAD_CLASS}>Population</th>
            <th className={HEAD_CLASS}>At risk</th>
            <th className={HEAD_CLASS}>Owner</th>
            <th className={HEAD_CLASS}>Working</th>
            <th className={cn(HEAD_CLASS, "text-right")}>Last</th>
            <th className={cn(HEAD_CLASS, "text-right")}>State</th>
          </tr>
        </thead>
        <tbody>
          {rooms.map((room) => (
            <RoomTableRow key={room.id} room={room} onAssignOwner={onAssignOwner} />
          ))}
        </tbody>
      </table>
    </div>
  );
}

function StaleTable({ rooms, onAssignOwner }: { rooms: RoomListRow[]; onAssignOwner: (room: RoomListRow) => void }) {
  return (
    <div className="overflow-x-auto rounded-card border border-line bg-paper">
      <table className="w-full min-w-[860px] text-left text-[12.5px]">
        <thead>
          <tr className="border-b border-line bg-paper-2">
            <th className={HEAD_CLASS}>Room</th>
            <th className={HEAD_CLASS}>At risk</th>
            <th className={HEAD_CLASS}>Untouched</th>
            <th className={HEAD_CLASS}>Owner</th>
            <th className={HEAD_CLASS}>Why it stopped</th>
            <th className={cn(HEAD_CLASS, "text-right")}>Suggested</th>
          </tr>
        </thead>
        <tbody>
          {rooms.map((room) => (
            <tr key={room.id} className="border-b border-line last:border-0 hover:bg-paper-2">
              <td className="px-4 py-3.5">
                <Link to={`/rooms/${room.id}`} className="font-semibold whitespace-nowrap text-ultra hover:underline">
                  {room.title}
                </Link>
              </td>
              <td
                className={cn(
                  "px-4 py-3.5 font-mono whitespace-nowrap",
                  room.atRisk === null ? "text-amber" : room.atRiskTone ? TONE_TEXT_CLASS[room.atRiskTone] : "text-ink"
                )}
              >
                {room.atRisk ?? "unavailable"}
              </td>
              <td className="px-4 py-3.5 font-mono whitespace-nowrap text-rose">{room.untouchedDays ?? "—"} days</td>
              <td className="px-4 py-3.5 whitespace-nowrap">
                <OwnerCell room={room} onAssign={() => onAssignOwner(room)} />
              </td>
              <td className="px-4 py-3.5 text-ink-2">{room.whyStopped ?? "—"}</td>
              <td className="px-4 py-3.5 text-right whitespace-nowrap">
                {room.suggested && <Chip tone={room.suggested.tone}>{room.suggested.label}</Chip>}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

function StateExplainers() {
  return (
    <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
      {OTHER_STATES_EXPLAINERS.map((card) => (
        <div key={card.eyebrow} className="flex flex-col justify-between rounded-card border border-line bg-paper p-4">
          <div>
            <p className="font-mono text-[8.5px] font-medium tracking-[0.85px] text-ink-4 uppercase">
              {card.eyebrow}
            </p>
            <p className="mt-1.5 text-[12.5px] font-semibold text-ink">{card.heading}</p>
            <p className="mt-1.5 text-[10.5px] leading-relaxed text-ink-3">{card.body}</p>
          </div>
          <p className={cn("mt-3 border-t border-line pt-2.5 text-[10px] font-semibold", TONE_TEXT_CLASS[card.tone])}>
            {card.tag}
          </p>
        </div>
      ))}
    </div>
  );
}

// ---------------------------------------------------------------------------
// Saved views — GET/POST /rooms/views. Only create + read are wired: the mock
// never had an edit/delete affordance either, so PUT/DELETE stay unwired
// until a real UI target exists (see docs/rooms/wiring-roadmap.md).
// ---------------------------------------------------------------------------

function SaveViewModal({
  open,
  onOpenChange,
  q,
  state,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  q: string;
  state: RoomListState | null;
}) {
  const [name, setName] = React.useState("");
  const [shared, setShared] = React.useState(false);
  const { createRoomView, isPending } = useCreateRoomView({ onSuccess: () => onOpenChange(false) });

  const save = () => {
    if (!name.trim()) return;
    createRoomView({
      name: name.trim(),
      filter: { query: q || undefined, state: state ?? undefined },
      sharedWithTeam: shared,
    });
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Save this view</DialogTitle>
          <DialogDescription>Every filter in the URL is saved with it</DialogDescription>
        </DialogHeader>
        <DialogBody className="space-y-4 px-5 py-5 sm:px-7 sm:py-6">
          <input
            value={name}
            onChange={(e) => setName(e.currentTarget.value)}
            placeholder="View name"
            className="w-full rounded-control border-2 border-line bg-paper px-3.5 py-2.5 text-[12.5px] text-ink outline-none placeholder:text-ink-4"
          />
          <label className="flex items-center gap-2 text-[11.5px] text-ink-2">
            <input type="checkbox" checked={shared} onChange={(e) => setShared(e.currentTarget.checked)} />
            Share with the team
          </label>
        </DialogBody>
        <DialogFooter>
          <div className="flex items-center gap-4">
            <Button type="button" onClick={save} disabled={!name.trim() || isPending}>
              {isPending ? "Saving…" : "Save"}
            </Button>
            <button type="button" onClick={() => onOpenChange(false)} className="text-[12px] font-semibold text-ink-3 hover:text-ink">
              Cancel
            </button>
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

function SearchView({ q }: { q: string }) {
  const [saveOpen, setSaveOpen] = React.useState(false);
  const { data, isPending, isError, error } = useGetRooms({ q });
  const { data: viewsData } = useGetRoomViews();
  const rooms = data?.data.rooms ?? [];
  const mapped = rooms.map((r) => mapRoomListRow(r, "open"));
  const views = viewsData?.data ?? [];

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <h1 className="text-[17px] font-semibold text-ink">Rooms</h1>
          <p className="mt-1 text-[11.5px] text-ink-3">
            {isPending ? "Searching…" : `${data?.data.total ?? 0} open across every team · searching "${q}"`}
          </p>
        </div>
        <Button className="shrink-0" onClick={() => setSaveOpen(true)}>
          Save this view
        </Button>
      </div>

      <div className="flex flex-wrap items-center gap-2">
        <div className="flex min-w-[240px] flex-1 items-center rounded-control border-2 border-line bg-paper px-3.5 py-2">
          <span className="text-[12px] font-semibold text-ink">{q}</span>
          <span className="ml-auto font-mono text-[10px] text-ink-4">{mapped.length} rooms</span>
        </div>
      </div>

      {views.length > 0 && (
        <div>
          <p className="font-mono text-[9.5px] font-medium tracking-[1.05px] text-ink-4 uppercase">
            Saved views · yours, and your team's
          </p>
          <div className="mt-2 grid grid-cols-1 gap-3 sm:grid-cols-3 lg:grid-cols-5">
            {views.map((view) => (
              <Link
                key={view.id}
                to={`/rooms${view.filter.query ? `?q=${encodeURIComponent(view.filter.query)}` : view.filter.state ? `?state=${view.filter.state}` : ""}`}
                className="rounded-card border border-line bg-paper p-3.5 text-left"
              >
                <p className="text-[11.5px] font-semibold text-ink">{view.name}</p>
                <p className="mt-1 font-mono text-[10px] text-ink-4">{view.roomCount} rooms</p>
              </Link>
            ))}
          </div>
        </div>
      )}

      {isError && (
        <div className="rounded-card border border-rose-border bg-rose-bg/40 p-4 text-[12px] text-rose">
          {error?.message ?? "Couldn't search rooms."}
        </div>
      )}

      {isPending && (
        <div className="space-y-2">
          {Array.from({ length: 4 }).map((_, i) => (
            <Skeleton key={i} className="h-12 w-full rounded-card" />
          ))}
        </div>
      )}

      {!isPending && !isError && (
        <div>
          <p className="font-mono text-[9.5px] font-medium tracking-[1.05px] text-ink-4 uppercase">
            {mapped.length} results
          </p>
          <div className="mt-2 overflow-x-auto rounded-card border border-line bg-paper">
            <table className="w-full min-w-[900px] text-left text-[12.5px]">
              <thead>
                <tr className="border-b border-line bg-paper-2">
                  <th className={HEAD_CLASS}>Room</th>
                  <th className={HEAD_CLASS}>Stage</th>
                  <th className={cn(HEAD_CLASS, "text-right")}>At risk</th>
                  <th className={HEAD_CLASS}>Owner</th>
                  <th className={cn(HEAD_CLASS, "text-right")}>Last activity</th>
                  <th className={cn(HEAD_CLASS, "text-right")}>State</th>
                </tr>
              </thead>
              <tbody>
                {mapped.map((room) => (
                  <tr key={room.id} className="border-b border-line last:border-0 hover:bg-paper-2">
                    <td className="px-4 py-3.5">
                      <Link to={`/rooms/${room.id}`} className="font-semibold whitespace-nowrap text-ultra hover:underline">
                        {room.title}
                      </Link>
                    </td>
                    <td className="px-4 py-3.5 text-ink-2">{room.stage}</td>
                    <td
                      className={cn(
                        "px-4 py-3.5 text-right font-mono",
                        room.atRisk === null ? "text-amber" : room.atRiskTone ? TONE_TEXT_CLASS[room.atRiskTone] : "text-ink"
                      )}
                    >
                      {room.atRisk ?? "unavailable"}
                    </td>
                    <td className="px-4 py-3.5 whitespace-nowrap">
                      {room.owner ? (
                        <div className="flex items-center gap-1.5">
                          <PersonAvatar kind="human" initials={room.owner.initials} size="sm" />
                          <span className="text-ink-2">{room.owner.name.split(" ")[0]}</span>
                        </div>
                      ) : (
                        <Chip tone="amber">No owner</Chip>
                      )}
                    </td>
                    <td
                      className={cn(
                        "px-4 py-3.5 text-right font-mono",
                        room.lastTone ? TONE_TEXT_CLASS[room.lastTone] : "text-ink-4"
                      )}
                    >
                      {room.last}
                    </td>
                    <td className="px-4 py-3.5 text-right">
                      <Chip tone={room.stateTone}>{room.stateLabel}</Chip>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      <div className="rounded-card border border-teal-border bg-teal-bg p-4">
        <div>
          <p className="text-[12px] font-semibold text-ink">Every filter is in the URL, so a filtered view is a link</p>
          <p className="mt-1 text-[10.5px] leading-relaxed text-ink-2">
            The index is a search surface first and a list second. "Kenya, unowned, above ₦25M" is something you
            paste into Slack rather than describe.
          </p>
        </div>
      </div>

      <SaveViewModal open={saveOpen} onOpenChange={setSaveOpen} q={q} state={null} />
    </div>
  );
}

// ---------------------------------------------------------------------------

function IndexSkeleton() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <Skeleton className="h-6 w-32" />
        <Skeleton className="h-9 w-28 rounded-control" />
      </div>
      <Skeleton className="h-9 w-full rounded-card" />
      {Array.from({ length: 5 }).map((_, i) => (
        <Skeleton key={i} className="h-12 w-full rounded-card" />
      ))}
    </div>
  );
}

function IndexError({ message, onRetry }: { message?: string; onRetry: () => void }) {
  return (
    <div className="space-y-4">
      <h1 className="text-[17px] font-semibold text-ink">Rooms</h1>
      <div className="flex flex-wrap items-center gap-3 rounded-card border border-rose-border bg-rose-bg/40 px-4 py-3">
        <p className="text-[12px] text-rose">{message ?? "Couldn't load rooms."}</p>
        <Button type="button" variant="outline" size="sm" onClick={onRetry}>
          Retry
        </Button>
      </div>
    </div>
  );
}

/** R01–R05 — the Rooms index. All five states share one route (`/rooms`), branching on data shape and `?q=`/`?state=`. */
const Rooms = () => {
  const [searchParams] = useSearchParams();
  const q = searchParams.get("q");
  const state = (searchParams.get("state") as RoomListState | null) ?? "open";
  const [assignTarget, setAssignTarget] = React.useState<RoomListRow | null>(null);

  // Independent of the active tab — decides the R01/R02 branches, which are about the whole
  // workspace, not whichever tab happens to be selected.
  const totalQuery = useGetRooms({ includeArchived: true });
  // The active tab's own filtered list. `state`'s own values (open/recovering/stale/archived)
  // match GET /rooms's `state` query param exactly.
  const listQuery = useGetRooms(q ? undefined : { state });

  if (totalQuery.isPending) return <IndexSkeleton />;
  if (totalQuery.isError) {
    return <IndexError message={totalQuery.error?.message} onRetry={() => totalQuery.refetch()} />;
  }

  const total = totalQuery.data?.data.total ?? 0;
  const firstRoom = totalQuery.data?.data.rooms[0];

  if (total === 0) {
    return <EmptyState />;
  }

  if (total === 1 && firstRoom && !firstRoom.ownerMemberId) {
    return (
      <div className="space-y-6">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
          <div>
            <h1 className="text-[17px] font-semibold text-ink">Rooms</h1>
            <p className="mt-1 text-[11.5px] text-ink-3">One room · opened by an agent · nobody assigned</p>
          </div>
          <Button asChild className="shrink-0">
            <Link to="/rooms/new">New room</Link>
          </Button>
        </div>
        <FirstRoomBanner
          room={firstRoom}
          onAssign={() => setAssignTarget(mapRoomListRow(firstRoom, "open"))}
        />
        {assignTarget && (
          <AssignOwnerModal
            roomId={assignTarget.id}
            roomTitle={assignTarget.title}
            open={Boolean(assignTarget)}
            onOpenChange={(open) => !open && setAssignTarget(null)}
          />
        )}
      </div>
    );
  }

  if (q) {
    return <SearchView q={q} />;
  }

  if (listQuery.isPending) return <IndexSkeleton />;
  if (listQuery.isError) {
    return <IndexError message={listQuery.error?.message} onRetry={() => listQuery.refetch()} />;
  }

  const counts: Record<RoomListState, number> = {
    open: totalQuery.data?.data.open ?? 0,
    recovering: totalQuery.data?.data.recovering ?? 0,
    stale: totalQuery.data?.data.stale ?? 0,
    archived: totalQuery.data?.data.archived ?? 0,
  };
  const shown = (listQuery.data?.data.rooms ?? []).map((r) => mapRoomListRow(r, state));
  const needsYou = shown.filter((r) => r.stateLabel === "needs you").length;
  const unowned = shown.filter((r) => !r.owner).length;
  const agentOpened = shown.filter((r) => !r.owner).length;

  const staleStats: Kpi[] =
    state === "stale"
      ? [
          { eyebrow: "Untouched 14+ days", value: `${counts.stale} rooms`, tone: "amber" },
          { eyebrow: "With no owner", value: `${shown.filter((r) => !r.owner).length}`, tone: "rose" },
          {
            eyebrow: "Oldest",
            value: `${Math.max(...shown.map((r) => r.untouchedDays ?? 0), 0)} days`,
            tone: "rose",
          },
        ]
      : [];

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <h1 className="text-[17px] font-semibold text-ink">Rooms</h1>
          <p className="mt-1 text-[11.5px] text-ink-3">
            {counts.open} open · {agentOpened} opened by agents · {unowned} with no owner
          </p>
        </div>
        <Button asChild className="shrink-0">
          <Link to="/rooms/new">New room</Link>
        </Button>
      </div>

      <StateTabs counts={counts} active={state} />

      {state === "stale" && (
        <>
          <KpiCards items={staleStats} />
          <p className="font-mono text-[9.5px] font-medium tracking-[1.05px] text-ink-4 uppercase">
            Why each one stopped, which is not the same question as who to blame
          </p>
          <StaleTable rooms={shown} onAssignOwner={setAssignTarget} />
          <p className="font-mono text-[9.5px] font-medium tracking-[1.05px] text-ink-4 uppercase">
            The other two states, and what they mean
          </p>
          <StateExplainers />
        </>
      )}

      {state !== "stale" && (
        <>
          <MainTable rooms={shown} onAssignOwner={setAssignTarget} />
          {state === "open" && (
            <div className="grid grid-cols-1 gap-y-2 rounded-card border border-line bg-paper p-4 text-[11.5px] sm:grid-cols-2">
              <p className="text-ink-2">Opened by an agent</p>
              <p className="text-right font-mono text-ink-4">
                {agentOpened} of {counts.open}
              </p>
              <p className="text-ink-2">Needing a decision from someone</p>
              <p className="text-right font-mono text-amber">{needsYou} · shown as the amber badge in the sidebar</p>
              <p className="text-ink-2">With no owner</p>
              <p className="text-right font-mono text-rose">{unowned}</p>
            </div>
          )}
          {(state === "recovering" || state === "archived") && <StateExplainers />}
        </>
      )}

      {state === "open" && (
        <div className="rounded-card border border-line bg-paper-2 p-4">
          <div>
            <p className="text-[12px] font-semibold text-ink">A room is about a cohort, not a customer</p>
            <p className="mt-1 text-[10.5px] leading-relaxed text-ink-2">
              Every row is a condition a group of people is in, not an account, not a ticket, not a campaign. That
              is what lets several teams work in one place without wondering why they were invited.
            </p>
          </div>
        </div>
      )}

      {assignTarget && (
        <AssignOwnerModal
          roomId={assignTarget.id}
          roomTitle={assignTarget.title}
          open={Boolean(assignTarget)}
          onOpenChange={(open) => !open && setAssignTarget(null)}
        />
      )}
    </div>
  );
};

export default Rooms;
