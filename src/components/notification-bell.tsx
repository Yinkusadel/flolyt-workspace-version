import { Bell } from "lucide-react";
import { Link } from "react-router-dom";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useGetHome } from "@/features/home/use-get-home";
import { splitHomeCardsByKind } from "@/features/home/group-home-cards";
import type { HomeCard } from "@/services/api/home/get-home";

function NotificationRow({ card }: { card: HomeCard }) {
  const titleClass = "line-clamp-2 text-[12px] leading-snug font-medium";
  return (
    <div className="px-2 py-2.5 first:pt-1.5 last:pb-1.5">
      {card.href ? (
        <Link to={card.href} className={cn(titleClass, "text-ultra hover:underline")}>
          {card.title}
        </Link>
      ) : (
        <p className={cn(titleClass, "text-ink-2")}>{card.title}</p>
      )}
      {card.detail && (
        <p className="mt-1 line-clamp-1 text-[10.5px] leading-snug text-ink-4">{card.detail}</p>
      )}
    </div>
  );
}

/**
 * Topbar notification bell — the "workspace" half of `GET /home`'s `cards[]` (everything that
 * isn't `kind: "action"`; see [[splitHomeCardsByKind]]) used to be its own carousel card on the
 * home page. Moved here so workspace updates are reachable from every screen, not just home.
 */
export function NotificationBell() {
  const { data, isPending, isError } = useGetHome();
  const workspace = splitHomeCardsByKind(data?.data.cards ?? []).workspace;
  const hasUpdates = !isPending && !isError && workspace.length > 0;

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          type="button"
          variant="ghost"
          size="icon-sm"
          className="relative text-ink-3 hover:text-ink"
          aria-label={hasUpdates ? `Workspace notifications (${workspace.length} unread)` : "Workspace notifications"}
        >
          <Bell className="size-4" />
          {hasUpdates && (
            <span
              aria-hidden
              className="absolute top-1 right-1 size-1.5 rounded-full bg-ultra ring-2 ring-paper"
            />
          )}
        </Button>
      </DropdownMenuTrigger>

      <DropdownMenuContent className="w-80 p-0">
        <DropdownMenuLabel className="px-3 py-2.5 font-normal">
          <p className="text-[12.5px] font-semibold text-ink">Workspace</p>
          <p className="mt-0.5 text-[11px] text-ink-3">
            {isPending
              ? "Loading…"
              : isError
                ? "Couldn't load workspace updates"
                : workspace.length > 0
                  ? `${workspace.length} update${workspace.length === 1 ? "" : "s"}`
                  : "Nothing new right now"}
          </p>
        </DropdownMenuLabel>

        <DropdownMenuSeparator className="mx-0" />

        {isPending ? (
          <div className="space-y-2 p-3">
            <Skeleton className="h-3 w-3/4" />
            <Skeleton className="h-3 w-1/2" />
            <Skeleton className="h-3 w-2/3" />
          </div>
        ) : isError ? (
          <p className="px-3 py-4 text-center text-[11.5px] text-ink-4">
            Something went wrong loading your workspace updates.
          </p>
        ) : workspace.length === 0 ? (
          <p className="px-3 py-4 text-center text-[11.5px] text-ink-4">
            Nothing from your workspace right now.
          </p>
        ) : (
          <div className="max-h-80 divide-y divide-line overflow-y-auto px-1">
            {workspace.map((card) => (
              // `card.key` is a category key (e.g. "system"), shared by every card of that kind
              // — not a per-row id — so it can't be the React key on its own.
              <NotificationRow key={card.sourceId ?? `${card.key}-${card.asOfUtc}`} card={card} />
            ))}
          </div>
        )}

        <DropdownMenuSeparator className="mx-0" />

        <div className="p-1">
          <Button asChild variant="ghost" size="sm" className="w-full justify-center">
            <Link to="/data-sources">Manage data sources</Link>
          </Button>
        </div>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
