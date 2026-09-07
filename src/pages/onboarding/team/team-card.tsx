import { Trash2, UserPlus } from "lucide-react";

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
    <div className="rounded-card border border-line bg-paper-2 p-5">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <p className="text-[15px] font-semibold text-ink">{team.name}</p>
          <p className="mt-1.5 text-[12px] text-ink-3">{team.description || "No description yet"}</p>
          <p className="mt-2 font-mono text-[10px] text-ink-4">Created {created}</p>
        </div>

        <div className="flex items-center gap-2">
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
    <div className="rounded-card border border-line bg-paper-2 p-5">
      <Skeleton className="h-4 w-40" />
      <Skeleton className="mt-2.5 h-3 w-64" />
      <Skeleton className="mt-2 h-2.5 w-24" />
    </div>
  );
}
