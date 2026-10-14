import * as React from "react";
import { Download } from "lucide-react";

import { cn } from "@/lib/utils";
import { PersonAvatar } from "@/components/person-avatar";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { agentInitialsFromName, initialsFromName } from "@/lib/initials";
import useExportRoomLog from "@/features/rooms/use-export-room-log";
import { useGetRoomLog } from "@/features/rooms/use-get-room-log";
import { formatDay } from "@/pages/rooms/convening/format";
import type { RoomLogEntryDto } from "@/services/api/rooms/get-room-log";

type Filter = "all" | "human" | "agent" | "system";

/** Entries drawn first, and added per click: the endpoint sends the whole log at once, this only keeps the page light. */
const PAGE = 25;

const HEAD = "px-5 py-2.5 text-[11.5px] font-medium text-ink-3";

const KIND_LABEL: Record<Filter, string> = { all: "All", human: "People", agent: "Agents", system: "Platform" };

/** The log's kinds as the page groups them. Only "Human" and "Agent" have been seen; anything else is the platform's own. */
const kindOf = (entry: RoomLogEntryDto): Exclude<Filter, "all"> => {
  const kind = entry.actorKind.toLowerCase();
  return kind === "human" ? "human" : kind === "agent" ? "agent" : "system";
};

/** "13 Oct 13:44" (UTC). */
const formatWhen = (iso: string) => `${formatDay(iso)} ${new Date(iso).toISOString().slice(11, 16)}`;

/** Initials for a person label such as "chad@yopmail.com · Administrator": the part before the "@" or the first words. */
const personInitials = (label: string) => initialsFromName(label.split(" · ")[0].split("@")[0].replace(/[._-]+/g, " "));

function LogSkeleton() {
  return (
    <div className="space-y-4" aria-busy="true" aria-label="Loading the log">
      <Skeleton className="h-7 w-72" />
      <Skeleton className="h-8 w-80 rounded-full" />
      <Skeleton className="h-96 rounded-card" />
    </div>
  );
}

/**
 * The Log tab (Room · Log.png), on `GET /rooms/{roomId}/log`: how the Room got here, oldest first, every entry naming who did it. The
 * pills filter by kind with the response's own counts. Each entry shows its action, what followed ("Followed: ...") and, when it recorded
 * one, the dissent in its own box. Actors are labelled as the backend labels them. Not shown: the design's pink tint on a failed run
 * (no field marks an entry as a failure).
 */
export const LogTab = ({ roomId }: { roomId: string }) => {
  const query = useGetRoomLog(roomId);
  const { download, isPending: isExporting } = useExportRoomLog();
  const [filter, setFilter] = React.useState<Filter>("all");
  const [shown, setShown] = React.useState(PAGE);

  const data = query.data?.data;
  const entries = React.useMemo(() => data?.entries ?? [], [data]);
  const filtered = React.useMemo(() => (filter === "all" ? entries : entries.filter((entry) => kindOf(entry) === filter)), [entries, filter]);

  // The same person keeps the same colour down the log: slots are handed out in order of first appearance.
  const teamByActor = React.useMemo(() => {
    const slots = new Map<string, 1 | 2 | 3 | 4>();
    for (const entry of entries) {
      if (kindOf(entry) === "human" && !slots.has(entry.actorId)) slots.set(entry.actorId, ((slots.size % 4) + 1) as 1 | 2 | 3 | 4);
    }
    return slots;
  }, [entries]);

  if (query.isPending) return <LogSkeleton />;
  if (query.isError || !data) {
    return (
      <div className="flex flex-wrap items-center gap-3 rounded-card border border-rose-border bg-rose-bg/40 px-4 py-3">
        <p className="text-[12px] text-rose">{query.error?.message || "Couldn't load the log."}</p>
        <Button type="button" variant="outline" size="sm" onClick={() => query.refetch()}>
          Retry
        </Button>
      </div>
    );
  }

  const counts: Record<Filter, number> = { all: data.totalEntries, human: data.humanEntries, agent: data.agentEntries, system: data.systemEntries };
  const visible = filtered.slice(0, shown);
  const remaining = filtered.length - visible.length;

  return (
    <div className="space-y-5">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <h2 className="text-[18px] font-semibold text-ink">How this room got here</h2>
          <p className="mt-0.5 text-[12px] text-ink-3">Oldest first. Every entry names who did it. Nothing in a room happens anonymously.</p>
        </div>
        <Button type="button" variant="outline" disabled={isExporting} onClick={() => download(roomId)}>
          <Download className="size-3.5" />
          {isExporting ? "Exporting" : "Export CSV"}
        </Button>
      </div>

      <div className="flex flex-wrap gap-2" role="tablist" aria-label="Filter the log by who acted">
        {(["all", "human", "agent", "system"] as const).map((key) => (
          <button
            key={key}
            type="button"
            role="tab"
            aria-selected={filter === key}
            onClick={() => {
              setFilter(key);
              setShown(PAGE);
            }}
            className={cn(
              "inline-flex items-center gap-1.5 rounded-full border px-3.5 py-1.5 text-[12.5px] font-medium",
              filter === key ? "border-ink bg-ink text-paper" : "border-line bg-paper text-ink hover:bg-paper-2"
            )}
          >
            {KIND_LABEL[key]}
            <span className={cn("font-mono text-[11px]", filter === key ? "text-paper/80" : "text-ink-3")}>{counts[key]}</span>
          </button>
        ))}
      </div>

      <div className="overflow-hidden rounded-card border border-line bg-paper">
        {visible.length === 0 ? (
          <p className="px-5 py-8 text-center text-[12.5px] text-ink-3">
            {entries.length === 0 ? "Nothing has happened in this room yet." : `No ${KIND_LABEL[filter].toLowerCase()} entries in this room.`}
          </p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full min-w-[760px] border-collapse text-left">
              <thead className="bg-paper-2/60">
                <tr>
                  <th className={cn(HEAD, "w-36")}>When (UTC)</th>
                  <th className={cn(HEAD, "w-72")}>Who</th>
                  <th className={HEAD}>What, and what followed</th>
                </tr>
              </thead>
              <tbody>
                {visible.map((entry, index) => {
                  const kind = kindOf(entry);
                  return (
                    <tr key={`${entry.occurredAtUtc}-${index}`} className="border-t border-line align-top">
                      <td className="px-5 py-4 font-mono text-[12px] whitespace-nowrap text-ink-2">{formatWhen(entry.occurredAtUtc)}</td>
                      <td className="px-5 py-4">
                        <span className="flex items-start gap-2.5">
                          {kind === "agent" ? (
                            <PersonAvatar kind="agent" size="lg" initials={agentInitialsFromName(entry.actorLabel)} className="bg-ultra-bg" />
                          ) : (
                            <PersonAvatar
                              kind="human"
                              size="lg"
                              team={teamByActor.get(entry.actorId) ?? 1}
                              initials={kind === "human" ? personInitials(entry.actorLabel) : "FL"}
                              className={kind === "system" ? "opacity-70" : undefined}
                            />
                          )}
                          <span className="min-w-0">
                            <span className="block text-[13px] font-semibold wrap-break-word text-ink">{entry.actorLabel}</span>
                            <span className="block text-[11.5px] text-ink-3">{kind === "human" ? "Person" : kind === "agent" ? "Agent" : "Platform"}</span>
                          </span>
                        </span>
                      </td>
                      <td className="px-5 py-4">
                        <p className="text-[13px] leading-relaxed wrap-break-word text-ink">{entry.action}</p>
                        {entry.consequence && <p className="mt-1 text-[12px] leading-relaxed wrap-break-word text-ink-3">Followed: {entry.consequence}</p>}
                        {entry.dissent && (
                          <div className="mt-2.5 rounded-card border border-amber-border bg-amber-bg/70 px-3.5 py-2.5">
                            <p className="font-mono text-[10px] font-semibold tracking-[0.8px] text-amber uppercase">Dissent</p>
                            <p className="mt-0.5 text-[12.5px] leading-relaxed wrap-break-word text-ink">“{entry.dissent}”</p>
                          </div>
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {remaining > 0 && (
        <div className="flex justify-center">
          <Button type="button" variant="outline" onClick={() => setShown((count) => count + PAGE)}>
            Show {Math.min(PAGE, remaining)} more {Math.min(PAGE, remaining) === 1 ? "entry" : "entries"}
            {remaining > PAGE ? ` (${remaining} left)` : ""}
          </Button>
        </div>
      )}
    </div>
  );
};
