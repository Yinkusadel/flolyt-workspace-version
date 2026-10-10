import * as React from "react";
import { Users } from "lucide-react";

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
import {
  filtersEqual,
  toViewFilter,
  viewToFilters,
  type RoomsFilters,
} from "@/pages/rooms/use-rooms-filters";

const EYEBROW = "font-mono text-[9.5px] font-medium tracking-[1.05px] text-ink-4 uppercase";

/** Saved views: GET /rooms/views. `roomCount` is run live by the server. Edit and delete (PUT and
 * DELETE) are not wired: the design has no affordance for them. */
export function SavedViews({
  filters,
  onApply,
}: {
  filters: RoomsFilters;
  onApply: (filters: RoomsFilters) => void;
}) {
  const { data, isPending, isError, refetch } = useGetRoomViews();
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

      {views.map((view) => {
        const active = filtersEqual(viewToFilters(view.filter), filters);
        return (
          <button
            key={view.id}
            type="button"
            aria-pressed={active}
            onClick={() => onApply(viewToFilters(view.filter))}
            className={cn(
              "inline-flex items-center gap-2 rounded-chip border bg-paper px-3 py-1.5 text-[12px] text-ink-2 transition-colors hover:border-ink-4",
              active ? "border-ultra text-ink" : "border-line"
            )}
          >
            {view.sharedWithTeam && !view.mine && <Users className="size-3.5 text-ink-3" aria-label="Shared" />}
            <span>{view.name}</span>
            <span className="rounded-full bg-paper-2 px-1.5 font-mono text-[10px] font-semibold text-ink-2">
              {view.roomCount}
            </span>
          </button>
        );
      })}
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
