import type { ReactNode } from "react";

import { cn } from "@/lib/utils";
import { ActorAvatar, actorName, actorRole } from "@/pages/rooms/actor";
import { EvidenceBadge } from "@/pages/rooms/evidence-badge";
import type { ThreadEntry } from "@/pages/rooms/types";

function ThreadMessageItem({ entry }: { entry: Extract<ThreadEntry, { kind: "message" }> }) {
  const isAgent = entry.actor.kind === "agent";
  const name = actorName(entry.actor);
  const role = actorRole(entry.actor, entry.roleLabel);

  return (
    <div className="flex gap-2.5">
      <ActorAvatar actor={entry.actor} size="sm" />
      <div className="min-w-0 flex-1">
        <div className="flex items-baseline justify-between gap-2">
          <span
            className={cn(
              "truncate text-[11px] font-semibold",
              isAgent ? "font-mono tracking-[0.6px] text-ultra uppercase" : "text-ink-2"
            )}
          >
            {name}
          </span>
          <span className="shrink-0 font-mono text-[9.5px] text-ink-4">
            {role ? `${role} · ` : ""}
            {entry.time}
          </span>
        </div>
        <div className="mt-1 space-y-0.5">
          {entry.lines.map((line, i) => (
            <p key={i} className="text-[12px] leading-snug text-ink-2">
              {line}
            </p>
          ))}
        </div>
        {(entry.evidenceTag || entry.signal) && (
          <div className="mt-1.5 flex flex-wrap items-center gap-1.5">
            {entry.evidenceTag && <EvidenceBadge grade={entry.evidenceTag.grade} />}
            {entry.evidenceTag?.amount && (
              <span className="rounded-chip border border-rose-border bg-rose-bg px-1.5 py-0.5 text-[9.5px] font-semibold text-rose">
                {entry.evidenceTag.amount}
              </span>
            )}
          </div>
        )}
        {entry.signal && (
          <p className="mt-1.5 flex items-center gap-1.5 font-mono text-[10px] text-ink-4">
            <span className="size-1.5 shrink-0 rounded-full bg-ultra" aria-hidden />
            {entry.signal}
          </p>
        )}
      </div>
    </div>
  );
}

function ThreadConflictCard({ entry }: { entry: Extract<ThreadEntry, { kind: "conflict" }> }) {
  return (
    <div className="flex gap-2.5">
      <ActorAvatar actor={{ kind: "agent", agent: entry.agent }} size="sm" />
      <div className="min-w-0 flex-1 overflow-hidden rounded-card border border-amber-border bg-paper pl-3">
        <div className="border-l-[3px] border-amber py-3 pr-3 pl-2.5 -ml-3">
          <h4 className="text-[11.5px] font-semibold text-ink">Two recommendations conflict. I'm not picking.</h4>
          <dl className="mt-2.5 space-y-1.5 border-t border-dashed border-line pt-2.5">
            {entry.options.map((option) => (
              <div key={option.team} className="flex items-baseline gap-2 text-[11px]">
                <dt className="w-16 shrink-0 font-semibold text-ink">{option.team}</dt>
                <dd className="text-ink-2">{option.summary}</dd>
              </div>
            ))}
          </dl>
          <p className="mt-2.5 text-[10.5px] font-semibold text-amber">{entry.ownerNote}</p>
        </div>
      </div>
    </div>
  );
}

export function ThreadRail({
  entries,
  peopleCount,
  agentsCount,
  className,
  footer,
}: {
  entries: ThreadEntry[];
  peopleCount: number;
  agentsCount: number;
  className?: string;
  footer?: ReactNode;
}) {
  return (
    <div className={cn("flex h-full min-h-0 flex-col bg-paper-2", className)}>
      <div className="flex shrink-0 items-baseline justify-between border-b border-line px-3.5 py-3">
        <p className="text-[11px] font-semibold tracking-[0.45px] text-ink-2">LIVE THREAD</p>
        <p className="font-mono text-[10px] text-ink-4">
          {peopleCount} {peopleCount === 1 ? "person" : "people"} · {agentsCount} {agentsCount === 1 ? "agent" : "agents"}
        </p>
      </div>
      <div className="min-h-0 flex-1 space-y-4 overflow-y-auto px-3.5 py-3.5">
        {entries.map((entry) =>
          entry.kind === "message" ? (
            <ThreadMessageItem key={entry.id} entry={entry} />
          ) : (
            <ThreadConflictCard key={entry.id} entry={entry} />
          )
        )}
      </div>
      {footer && <div className="shrink-0 border-t border-line">{footer}</div>}
    </div>
  );
}
