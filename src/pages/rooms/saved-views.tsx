import * as React from "react";
import { Pencil, Trash2, Users, type LucideIcon } from "lucide-react";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Dialog,
  DialogBody,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useGetRoomViews } from "@/features/rooms/use-get-room-views";
import useCreateRoomView from "@/features/rooms/use-create-room-view";
import useUpdateRoomView from "@/features/rooms/use-update-room-view";
import useDeleteRoomView from "@/features/rooms/use-delete-room-view";
import type { RoomViewDto } from "@/services/api/rooms/get-room-views";
import type { CreateRoomViewFilterInput } from "@/services/api/rooms/create-room-view";
import {
  filtersEqual,
  toViewFilter,
  viewToFilters,
  type RoomsFilters,
} from "@/pages/rooms/use-rooms-filters";

const EYEBROW = "font-mono text-[9.5px] font-medium tracking-[1.05px] text-ink-4 uppercase";
const NAME_INPUT =
  "w-full rounded-control border-2 border-line bg-paper px-3.5 py-2.5 text-[12.5px] text-ink outline-none placeholder:text-ink-4";

/** A stored view's filter back into the shape PUT /rooms/views/{id} takes (nulls become absent). */
const storedFilterInput = (view: RoomViewDto): CreateRoomViewFilterInput => ({
  query: view.filter.query ?? undefined,
  state: view.filter.state ?? undefined,
  currency: view.filter.currency ?? undefined,
  stage: view.filter.stage ?? undefined,
  condition: view.filter.condition ?? undefined,
  owner: view.filter.owner ?? undefined,
  minAmountAtRisk: view.filter.minAmountAtRisk ?? undefined,
  includeArchived: view.filter.includeArchived,
});

/**
 * A small icon button that slides in beside the view's name when the chip is hovered (same
 * reveal as the prompt box's toggle chips) and shows a tooltip. Always visible on touch screens,
 * where there is no hover. The tooltip is a sibling of the button, so the button's own
 * overflow-hidden (which animates the width) cannot clip it.
 */
function ChipAction({
  icon: Icon,
  label,
  onClick,
}: {
  icon: LucideIcon;
  label: string;
  onClick: () => void;
}) {
  return (
    <span className="group/action relative flex">
      <button
        type="button"
        onClick={onClick}
        aria-label={label}
        className="flex size-7 max-w-0 shrink-0 items-center justify-center overflow-hidden rounded-full opacity-0 transition-all duration-200 ease-out group-hover/view:max-w-7 group-hover/view:opacity-100 hover:bg-black/10 focus-visible:max-w-7 focus-visible:opacity-100 [@media(hover:none)]:max-w-7 [@media(hover:none)]:opacity-100"
      >
        <Icon size={13} />
      </button>
      <span
        role="tooltip"
        className="pointer-events-none absolute bottom-full left-1/2 z-10 mb-2 -translate-x-1/2 rounded-lg bg-ink px-2.5 py-1.5 text-[11px] whitespace-nowrap text-paper opacity-0 shadow-lg transition-opacity group-hover/action:opacity-100"
      >
        {label}
      </span>
    </span>
  );
}

function ViewChip({
  view,
  active,
  onApply,
  onEdit,
  onDelete,
}: {
  view: RoomViewDto;
  active: boolean;
  onApply: () => void;
  onEdit: () => void;
  onDelete: () => void;
}) {
  return (
    <div
      className={cn(
        "group/view relative inline-flex items-center rounded-chip border text-[12px] transition-colors",
        active
          ? "border-primary bg-primary text-primary-foreground"
          : "border-line bg-paper text-ink-2 hover:border-ink-4"
      )}
    >
      <button
        type="button"
        aria-pressed={active}
        onClick={onApply}
        className="inline-flex items-center gap-2 rounded-chip py-1.5 pr-2 pl-3"
      >
        {view.sharedWithTeam && !view.mine && (
          <Users className={cn("size-3.5", active ? "text-primary-foreground" : "text-ink-3")} aria-label="Shared" />
        )}
        <span>{view.name}</span>
        <span
          className={cn(
            "rounded-full px-1.5 font-mono text-[10px] font-semibold",
            active ? "bg-white/20 text-primary-foreground" : "bg-paper-2 text-ink-2"
          )}
        >
          {view.roomCount}
        </span>
      </button>
      {view.mine ? (
        <div className="flex items-center pr-1">
          <ChipAction icon={Pencil} label="Edit view" onClick={onEdit} />
          <ChipAction icon={Trash2} label="Delete view" onClick={onDelete} />
        </div>
      ) : (
        <span className="pr-1" />
      )}
    </div>
  );
}

/** Saved views: GET /rooms/views. `roomCount` is run live by the server. Only a view's author can
 * edit or delete it (`mine`), so the hover actions appear on those chips alone. */
export function SavedViews({
  filters,
  onApply,
}: {
  filters: RoomsFilters;
  onApply: (filters: RoomsFilters) => void;
}) {
  const { data, isPending, isError, refetch } = useGetRoomViews();
  const [editing, setEditing] = React.useState<RoomViewDto | null>(null);
  const [deleting, setDeleting] = React.useState<RoomViewDto | null>(null);
  const views = data?.data ?? [];

  return (
    <div className="flex flex-wrap items-center gap-2">
      <span className={cn(EYEBROW, "mr-1")}>Saved views</span>

      {isPending && (
        <>
          <Skeleton className="h-8 w-36 rounded-chip" />
          <Skeleton className="h-8 w-32 rounded-chip" />
        </>
      )}

      {isError && (
        <span className="inline-flex items-center gap-2 rounded-chip border border-rose-border bg-rose-bg/40 px-3 py-1.5 text-[11.5px] text-rose">
          Couldn&apos;t load saved views
          <button type="button" onClick={() => refetch()} className="font-semibold underline">
            Retry
          </button>
        </span>
      )}

      {!isPending && !isError && views.length === 0 && (
        <span className="inline-flex rounded-chip border border-dashed border-line px-3 py-1.5 text-[11.5px] text-ink-3">
          None yet. Set some filters and use &quot;Save as view...&quot;
        </span>
      )}

      {views.map((view) => (
        <ViewChip
          key={view.id}
          view={view}
          active={filtersEqual(viewToFilters(view.filter), filters)}
          onApply={() => onApply(viewToFilters(view.filter))}
          onEdit={() => setEditing(view)}
          onDelete={() => setDeleting(view)}
        />
      ))}

      {editing && (
        <EditViewDialog
          key={editing.id}
          view={editing}
          filters={filters}
          open
          onOpenChange={(open) => !open && setEditing(null)}
        />
      )}
      {deleting && (
        <DeleteViewDialog
          view={deleting}
          open
          onOpenChange={(open) => !open && setDeleting(null)}
        />
      )}
    </div>
  );
}

export function SaveViewDialog({
  open,
  onOpenChange,
  filters,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  filters: RoomsFilters;
}) {
  const [name, setName] = React.useState("");
  const [shared, setShared] = React.useState(false);
  const { createRoomView, isPending } = useCreateRoomView({
    onSuccess: () => {
      setName("");
      setShared(false);
      onOpenChange(false);
    },
  });

  const save = () => {
    if (!name.trim()) return;
    createRoomView({ name: name.trim(), filter: toViewFilter(filters), sharedWithTeam: shared });
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Save this view</DialogTitle>
          <DialogDescription>Every filter currently in the link is saved with it.</DialogDescription>
        </DialogHeader>
        <DialogBody className="space-y-4 px-5 py-5 sm:px-7 sm:py-6">
          <input
            value={name}
            onChange={(e) => setName(e.currentTarget.value)}
            placeholder="View name"
            className={NAME_INPUT}
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
            <button
              type="button"
              onClick={() => onOpenChange(false)}
              className="text-[12px] font-semibold text-ink-3 hover:text-ink"
            >
              Cancel
            </button>
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

/** PUT /rooms/views/{id}: rename, re-share, and optionally replace the stored filters with the
 * ones currently applied. */
function EditViewDialog({
  view,
  filters,
  open,
  onOpenChange,
}: {
  view: RoomViewDto;
  filters: RoomsFilters;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}) {
  const [name, setName] = React.useState(view.name);
  const [shared, setShared] = React.useState(view.sharedWithTeam);
  const [useCurrent, setUseCurrent] = React.useState(false);
  const { updateRoomView, isPending } = useUpdateRoomView({ onSuccess: () => onOpenChange(false) });
  const sameFilters = filtersEqual(viewToFilters(view.filter), filters);

  const save = () => {
    if (!name.trim()) return;
    updateRoomView({
      viewId: view.id,
      name: name.trim(),
      filter: useCurrent ? toViewFilter(filters) : storedFilterInput(view),
      sharedWithTeam: shared,
    });
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Edit this view</DialogTitle>
          <DialogDescription>Only you can change or delete a view you saved.</DialogDescription>
        </DialogHeader>
        <DialogBody className="space-y-4 px-5 py-5 sm:px-7 sm:py-6">
          <input
            value={name}
            onChange={(e) => setName(e.currentTarget.value)}
            placeholder="View name"
            className={NAME_INPUT}
          />
          <label className="flex items-center gap-2 text-[11.5px] text-ink-2">
            <input type="checkbox" checked={shared} onChange={(e) => setShared(e.currentTarget.checked)} />
            Share with the team
          </label>
          <label className={cn("flex items-start gap-2 text-[11.5px]", sameFilters ? "text-ink-4" : "text-ink-2")}>
            <input
              type="checkbox"
              className="mt-0.5"
              checked={useCurrent}
              disabled={sameFilters}
              onChange={(e) => setUseCurrent(e.currentTarget.checked)}
            />
            <span>
              Replace this view&apos;s filters with the ones applied now
              {sameFilters && <span className="block text-[11px]">They already match.</span>}
            </span>
          </label>
        </DialogBody>
        <DialogFooter>
          <div className="flex items-center gap-4">
            <Button type="button" onClick={save} disabled={!name.trim() || isPending}>
              {isPending ? "Saving…" : "Save changes"}
            </Button>
            <button
              type="button"
              onClick={() => onOpenChange(false)}
              className="text-[12px] font-semibold text-ink-3 hover:text-ink"
            >
              Cancel
            </button>
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

/** DELETE /rooms/views/{id}. Deleting a view never touches any Room. */
function DeleteViewDialog({
  view,
  open,
  onOpenChange,
}: {
  view: RoomViewDto;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}) {
  const { deleteRoomView, isPending } = useDeleteRoomView({ onSuccess: () => onOpenChange(false) });

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Delete this view?</DialogTitle>
          <DialogDescription>
            &quot;{view.name}&quot; is removed
            {view.sharedWithTeam ? " for everyone it was shared with" : ""}. No Room is affected.
          </DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <div className="flex items-center gap-4">
            <Button
              type="button"
              variant="destructive"
              onClick={() => deleteRoomView(view.id)}
              disabled={isPending}
            >
              {isPending ? "Deleting…" : "Delete view"}
            </Button>
            <button
              type="button"
              onClick={() => onOpenChange(false)}
              className="text-[12px] font-semibold text-ink-3 hover:text-ink"
            >
              Cancel
            </button>
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
