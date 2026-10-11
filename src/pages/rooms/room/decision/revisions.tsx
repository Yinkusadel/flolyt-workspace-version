import type { RoomDecisionRevisionDto } from "@/services/api/rooms/get-room-decision";
import { formatDayTime } from "@/pages/rooms/convening/format";

/** Append-only history of the decision (Room · Decision & dissent.png, "Revisions"). */
export function Revisions({ revisions }: { revisions: RoomDecisionRevisionDto[] }) {
  // Newest revision first, as in the design.
  const ordered = [...revisions].sort((a, b) => b.number - a.number);

  return (
    <section className="overflow-hidden rounded-card border border-line bg-paper">
      <div className="flex flex-wrap items-center justify-between gap-2 border-b border-line px-5 py-3.5">
        <h2 className="text-[13px] font-semibold text-ink">Revisions</h2>
        <p className="text-[11.5px] text-ink-3">Append-only. Each one says what it changed.</p>
      </div>
      {ordered.length === 0 ? (
        <p className="px-5 py-6 text-[12.5px] text-ink-3">No revisions yet.</p>
      ) : (
        <ul className="divide-y divide-line">
          {ordered.map((revision) => (
            <li key={revision.number} className="flex flex-wrap items-baseline justify-between gap-x-6 gap-y-1 px-5 py-3.5">
              <p className="min-w-0 flex-1 text-[12.5px] text-ink">
                <span className="mr-2 font-mono text-ink-3">{revision.number}</span>
                {revision.summary}
              </p>
              <p className="shrink-0 text-[11.5px] text-ink-3">
                {revision.byLabel} <span className="ml-1 font-mono">{formatDayTime(revision.atUtc)}</span>
              </p>
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}
