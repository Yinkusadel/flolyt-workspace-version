import * as React from "react";

import { cn } from "@/lib/utils";
import { Chip } from "@/components/ui/chip";
import type { SearchableSelectOption } from "@/components/ui/searchable-select";
import { useAuth } from "@/utils/auth-context";
import type { RoomConflictDto } from "@/services/api/rooms/get-room-conflicts";
import { formatDayTime } from "@/pages/rooms/convening/format";
import { ChoosePanel, EscalateCard, ThirdReadingCard } from "@/pages/rooms/room/conflicts/conflict-actions";
import { ReadingCard } from "@/pages/rooms/room/conflicts/reading-card";

/** A conflict still waiting on a person (Room · Conflicts.png, the red-bordered card). */
export function OpenConflict({
  conflict,
  nameOf,
  people,
}: {
  conflict: RoomConflictDto;
  nameOf: (userId: string) => string;
  /** Who a conflict can be escalated to (active people other than the viewer). */
  people: SearchableSelectOption[];
}) {
  const { user } = useAuth();
  const [choosingKey, setChoosingKey] = React.useState<string | null>(null);
  const choosing = conflict.readings.find((reading) => reading.key === choosingKey) ?? null;
  const waitingOnMe = user?.id === conflict.waitingOnUserId;

  return (
    <article className="rounded-card border border-rose-border bg-paper">
      <div className="space-y-4 p-5">
        <div>
          <div className="flex flex-wrap items-center gap-1.5">
            <Chip tone="rose">Open</Chip>
            {waitingOnMe ? (
              <span className="inline-flex rounded-chip bg-ink px-2 py-0.5 text-[9.5px] font-semibold whitespace-nowrap text-white">
                Waiting on you
              </span>
            ) : (
              <Chip>Waiting on {nameOf(conflict.waitingOnUserId)}</Chip>
            )}
          </div>
          <h3 className="mt-3 text-[16px] font-semibold text-ink">{conflict.summary}</h3>
          <p className="mt-1 text-[11.5px] text-ink-3">
            Raised by {conflict.raisedByLabel}{" "}
            <span className="ml-1 font-mono">{formatDayTime(conflict.raisedAtUtc)}</span>
          </p>
          {conflict.escalatedToUserId && (
            <p className="mt-1 text-[11.5px] text-ink-3">
              Escalated to {nameOf(conflict.escalatedToUserId)}
              {conflict.escalationReason ? `: “${conflict.escalationReason}”` : ""}
            </p>
          )}
        </div>

        {/* The "effects can't be compared" note lives behind the info icon beside "Raise a conflict..." */}
        <div className={cn("grid gap-4", conflict.readings.length > 1 && "md:grid-cols-2")}>
          {conflict.readings.map((reading) => (
            <ReadingCard
              key={reading.key}
              reading={reading}
              outcome="open"
              disabled={choosing !== null}
              onChoose={() => setChoosingKey(reading.key)}
            />
          ))}
        </div>

        {choosing && <ChoosePanel conflict={conflict} reading={choosing} onDone={() => setChoosingKey(null)} />}

        {/* items-start: each card keeps its own height, so a long question history never stretches Escalate. */}
        <div className="grid gap-4 md:grid-cols-2 md:items-start">
          <ThirdReadingCard conflict={conflict} />
          <EscalateCard conflict={conflict} people={people} />
        </div>
      </div>
    </article>
  );
}

/** A settled conflict: the chosen reading beside the one kept on the record, with the reason. */
export function SettledConflict({
  conflict,
  nameOf,
}: {
  conflict: RoomConflictDto;
  nameOf: (userId: string) => string;
}) {
  const settledBy = conflict.resolvedByLabel ?? (conflict.resolvedByUserId ? nameOf(conflict.resolvedByUserId) : null);

  return (
    <article className="rounded-card border border-line bg-paper p-5">
      <div className="flex flex-wrap items-baseline justify-between gap-2">
        <h3 className="text-[15px] font-semibold text-ink">{conflict.summary}</h3>
        <p className="text-[11.5px] text-ink-3">
          {settledBy ? `Settled by ${settledBy}` : "Settled"}
          {conflict.resolvedAtUtc && <span className="ml-1.5 font-mono">{formatDayTime(conflict.resolvedAtUtc)}</span>}
        </p>
      </div>
      <div className={cn("mt-4 grid gap-4", conflict.readings.length > 1 && "md:grid-cols-2")}>
        {conflict.readings.map((reading) => (
          <ReadingCard
            key={reading.key}
            reading={reading}
            outcome={reading.chosen || reading.key === conflict.chosenReadingKey ? "chosen" : "not-chosen"}
          />
        ))}
      </div>
      {conflict.resolutionNote && (
        <p className="mt-4 text-[12.5px] text-ink-2">
          <span className="text-ink-3">Why: </span>“{conflict.resolutionNote}”
        </p>
      )}
    </article>
  );
}
