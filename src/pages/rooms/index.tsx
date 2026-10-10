import * as React from "react";
import { Link } from "react-router-dom";
import { SlidersHorizontal } from "lucide-react";

import { cn } from "@/lib/utils";

import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { useGetRooms } from "@/features/rooms/use-get-rooms";
import type { RoomListRowDto } from "@/services/api/rooms/get-rooms";
import { AssignOwnerModal } from "@/pages/rooms/modals/assign-owner-modal";
import { FilterCard, type FilterOption, type FilterOptions } from "@/pages/rooms/filter-card";
import { SaveViewDialog, SavedViews } from "@/pages/rooms/saved-views";
import { StatTiles } from "@/pages/rooms/stat-tiles";
import { RoomsEmpty, RoomsTable } from "@/pages/rooms/rooms-table";
import {
  countActiveFilters,
  isDefaultFilters,
  toRoomsParams,
  useRoomsFilters,
} from "@/pages/rooms/use-rooms-filters";

/** Distinct options for a filter, read from the workspace's own rooms (the API has no option lists). */
function distinct(
  rooms: RoomListRowDto[],
  pick: (room: RoomListRowDto) => FilterOption | null
): FilterOption[] {
  const seen = new Map<string, FilterOption>();
  for (const room of rooms) {
    const option = pick(room);
    if (option && !seen.has(option.value)) seen.set(option.value, option);
  }
  return [...seen.values()].sort((a, b) => a.label.localeCompare(b.label));
}

function buildOptions(rooms: RoomListRowDto[]): FilterOptions {
  return {
    currencies: distinct(rooms, (r) => (r.currency ? { value: r.currency, label: r.currency } : null)),
    stages: distinct(rooms, (r) => (r.stage ? { value: r.stage, label: r.stageLabel || r.stage } : null)),
    conditions: distinct(rooms, (r) =>
      r.condition ? { value: r.condition, label: r.conditionLabel || r.condition } : null
    ),
    owners: distinct(rooms, (r) =>
      r.ownerMemberId && r.ownerName ? { value: r.ownerMemberId, label: r.ownerName } : null
    ),
  };
}

function Header({ action }: { action?: React.ReactNode }) {
  return (
    <div className="flex items-start justify-between gap-3">
      <div>
        <h1 className="text-[17px] font-semibold text-ink">Rooms</h1>
        <p className="mt-1 text-[11.5px] text-ink-3">
          Every leak somebody is working on, newest first. Every filter is in the link, so a filtered view can be
          shared.
        </p>
      </div>
      {action}
    </div>
  );
}

/** Shows or hides the filter card. While hidden, a badge says how many filters are still applied. */
function FiltersToggle({
  open,
  activeCount,
  onToggle,
}: {
  open: boolean;
  activeCount: number;
  onToggle: () => void;
}) {
  return (
    <Button
      type="button"
      variant="outline"
      size="sm"
      className="shrink-0"
      aria-expanded={open}
      aria-controls="rooms-filters"
      onClick={onToggle}
    >
      <SlidersHorizontal size={14} />
      {open ? "Hide filters" : "Show filters"}
      {!open && activeCount > 0 && (
        <span className="rounded-full bg-primary px-1.5 font-mono text-[10px] font-semibold text-primary-foreground">
          {activeCount}
        </span>
      )}
    </Button>
  );
}

function RoomsSkeleton() {
  return (
    <div className="space-y-6" aria-busy="true" aria-label="Loading rooms">
      <Header />
      <div className="grid grid-cols-2 gap-3 lg:grid-cols-5">
        {Array.from({ length: 5 }).map((_, i) => (
          <Skeleton key={i} className="h-26 rounded-card" />
        ))}
      </div>
      <Skeleton className="h-42.5 rounded-card" />
      <div className="rounded-card border border-line bg-paper">
        {Array.from({ length: 5 }).map((_, i) => (
          <div key={i} className="flex items-center gap-4 border-b border-line px-4 py-4 last:border-0">
            <div className="flex-1 space-y-2">
              <Skeleton className="h-3.5 w-1/2" />
              <Skeleton className="h-3 w-1/3" />
            </div>
            <Skeleton className="h-3.5 w-20" />
            <Skeleton className="h-3.5 w-24" />
            <Skeleton className="h-3.5 w-28" />
          </div>
        ))}
      </div>
    </div>
  );
}

function ErrorCard({ message, onRetry }: { message?: string; onRetry: () => void }) {
  return (
    <div className="flex flex-wrap items-center gap-3 rounded-card border border-rose-border bg-rose-bg/40 px-4 py-3">
      <p className="text-[12px] text-rose">{message || "Couldn't load rooms."}</p>
      <Button type="button" variant="outline" size="sm" onClick={onRetry}>
        Retry
      </Button>
    </div>
  );
}

/** `/rooms`: the Rooms list. Rebuilt from the new design (Rooms · index.png). */
const Rooms = () => {
  const { filters, update, replaceAll, clear } = useRoomsFilters();
  const [filtersOpen, setFiltersOpen] = React.useState(true);
  const [saveOpen, setSaveOpen] = React.useState(false);
  const [assignTarget, setAssignTarget] = React.useState<RoomListRowDto | null>(null);

  // The whole workspace, archived included. The tiles' counts, the filter option lists and the
  // names of merge targets all describe the workspace, not whatever the filters narrowed to.
  const base = useGetRooms({ includeArchived: true });
  const list = useGetRooms(toRoomsParams(filters));

  const baseRooms = React.useMemo(() => base.data?.data.rooms ?? [], [base.data]);
  const options = React.useMemo(() => buildOptions(baseRooms), [baseRooms]);
  const titleById = React.useMemo(() => new Map(baseRooms.map((r) => [r.id, r.title])), [baseRooms]);

  if (base.isPending) return <RoomsSkeleton />;
  if (base.isError) {
    return (
      <div className="space-y-6">
        <Header />
        <ErrorCard message={base.error?.message} onRetry={() => base.refetch()} />
      </div>
    );
  }

  const counts = base.data.data;

  if (counts.total === 0) {
    return (
      <div className="space-y-6">
        <Header />
        <div className="rounded-card border border-dashed border-line bg-paper p-10 text-center">
          <p className="text-[13px] font-semibold text-ink">No rooms yet</p>
          <p className="mt-1.5 text-[11.5px] text-ink-3">
            A room opens when a leak is worth working on, for example one opened from the Leakage Map.
          </p>
          <Button asChild variant="outline" size="sm" className="mt-4">
            <Link to="/leakage-map">Open the Leakage Map</Link>
          </Button>
        </div>
      </div>
    );
  }

  const rooms = list.data?.data.rooms ?? [];

  return (
    <div className="space-y-6">
      <Header
        action={
          <FiltersToggle
            open={filtersOpen}
            activeCount={countActiveFilters(filters)}
            onToggle={() => setFiltersOpen((open) => !open)}
          />
        }
      />

      <StatTiles
        counts={counts}
        amountBehindStale={counts.amountBehindStale}
        active={filters.state}
        onSelect={(state) => update({ state })}
      />

      {/* Slides open and shut by animating the grid row between 0fr and 1fr (no fixed height
          needed). `invisible` while shut keeps the hidden controls out of the tab order; the top
          padding lives inside so a shut card leaves no extra gap. */}
      <div
        id="rooms-filters"
        aria-hidden={!filtersOpen}
        className={cn(
          "mt-0! grid transition-[grid-template-rows,opacity,visibility] duration-300 ease-out",
          filtersOpen ? "visible grid-rows-[1fr] opacity-100" : "invisible grid-rows-[0fr] opacity-0"
        )}
      >
        <div className="overflow-hidden">
          <div className="pt-6">
            <FilterCard
              filters={filters}
              options={options}
              optionsLoading={false}
              onChange={update}
              onClear={clear}
              onSaveView={() => setSaveOpen(true)}
            />
          </div>
        </div>
      </div>

      <SavedViews filters={filters} onApply={replaceAll} />

      {list.isPending ? (
        <Skeleton className="h-80 rounded-card" aria-busy="true" aria-label="Loading rooms" />
      ) : list.isError ? (
        <ErrorCard message={list.error?.message} onRetry={() => list.refetch()} />
      ) : rooms.length === 0 ? (
        <RoomsEmpty filtered={!isDefaultFilters(filters)} onClear={clear} />
      ) : (
        <RoomsTable rooms={rooms} titleById={titleById} onAssignOwner={setAssignTarget} />
      )}

      <SaveViewDialog open={saveOpen} onOpenChange={setSaveOpen} filters={filters} />

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
