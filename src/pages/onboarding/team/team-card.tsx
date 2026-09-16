import { Trash2, UserPlus, Users } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import type { TeamDto } from "@/services/api/teams/get-teams";

export function TeamCard({
  team,
  onInvite,
  onDelete,
}: {
  team: TeamDto;
  onInvite: () => void;
  onDelete: () => void;
}) {
  const created = new Date(team.dateCreated).toLocaleDateString(undefined, {
    month: "short",
    day: "numeric",
    year: "numeric",
  });

  return (
    <div className="rounded-card border border-line bg-paper p-4 transition-all duration-200 hover:border-ink-4 hover:shadow-md sm:p-5">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div className="flex min-w-0 items-center gap-3.5">
          <div className="flex size-10 shrink-0 items-center justify-center rounded-control border border-line bg-paper-2">
            <Users className="size-4.5 text-ink-3" aria-hidden />
          </div>

          <div className="min-w-0">
            <p className="truncate text-[14px] font-semibold text-ink">{team.name}</p>
            <p className="mt-0.5 truncate text-[12px] text-ink-3">{team.description || "No description yet"}</p>
            <p className="mt-1.5 font-mono text-[9.5px] tracking-[0.06em] text-ink-4 uppercase">Created {created}</p>
          </div>
        </div>

        <div className="flex shrink-0 items-center gap-2">
          <Button type="button" variant="outline" onClick={onInvite} className="gap-1.5">
            <UserPlus className="size-3.5" />
            Invite team member
          </Button>
          <Button
            type="button"
            variant="ghost"
            size="icon"
            onClick={onDelete}
            aria-label="Delete team"
            className="text-ink-3 hover:text-destructive"
          >
            <Trash2 className="size-3.5" />
          </Button>
        </div>
      </div>
    </div>
  );
}

export function TeamCardSkeleton() {
  return (
    <div className="flex items-center gap-3.5 rounded-card border border-line bg-paper p-4 sm:p-5">
      <Skeleton className="size-10 shrink-0 rounded-control" />
      <div className="min-w-0 flex-1 space-y-1.5">
        <Skeleton className="h-3.5 w-40" />
        <Skeleton className="h-3 w-64" />
        <Skeleton className="h-2.5 w-24" />
      </div>
    </div>
  );
}
