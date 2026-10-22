import type { RoomConflictDto } from "@/services/api/rooms/get-room-conflicts";

export interface ConflictNotice {
  key: string;
  /** Which conflict the note is about, since several can be open at once. */
  conflict: string;
  text: string;
}

/**
 * Why the two effect figures of an open conflict can't be read against each other. The API sends only
 * `comparableEffect: false`; its docs say that means one reading is unpriced or the two are in different
 * currencies, so the sentence is built from the readings' own fields (the unpriced reading's reason, or the
 * currencies), never from arithmetic.
 */
function reasonFor(conflict: RoomConflictDto): string {
  const unpriced = conflict.readings.filter((reading) => reading.expectedEffect === null || !reading.currency);
  if (unpriced.length > 0) {
    const parts = unpriced.map(
      (reading) => `${reading.label} can't be priced: ${reading.effectUnavailableBecause ?? "no reason was given"}`
    );
    return `${parts.join(". ")}. The two figures are separate facts, not a difference. Unpriced doesn't mean zero.`;
  }
  const currencies = [...new Set(conflict.readings.map((reading) => reading.currency))];
  if (currencies.length > 1) {
    return `The readings are in different currencies (${currencies.join(" and ")}), so each figure stands alone and they are never combined.`;
  }
  return "The two effect figures can't be read against each other.";
}

/** One note per open conflict whose effects can't be compared. */
export function buildConflictNotices(conflicts: RoomConflictDto[]): ConflictNotice[] {
  return conflicts
    .filter((conflict) => !conflict.isResolved && !conflict.comparableEffect)
    .map((conflict) => ({ key: conflict.id, conflict: conflict.summary, text: reasonFor(conflict) }));
}

/** The notes shown when the info icon is opened. */
export function ConflictNotices({ notices }: { notices: ConflictNotice[] }) {
  return (
    <div className="space-y-2">
      {notices.map((notice) => (
        <p
          key={notice.key}
          className="rounded-panel border border-amber-border bg-amber-bg px-3.5 py-3 text-[12.5px] leading-relaxed text-ink"
        >
          <span className="font-semibold">These effects can't be compared.</span>{" "}
          <span className="text-ink-3">{notice.conflict}</span>
          <br />
          {notice.text}
        </p>
      ))}
    </div>
  );
}
