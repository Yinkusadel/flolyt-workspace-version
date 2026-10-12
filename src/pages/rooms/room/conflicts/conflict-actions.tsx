import * as React from "react";

import { Button } from "@/components/ui/button";
import { SearchableSelect, type SearchableSelectOption } from "@/components/ui/searchable-select";
import useChooseConflictReading from "@/features/rooms/use-choose-conflict-reading";
import useEscalateConflict from "@/features/rooms/use-escalate-conflict";
import useRequestThirdReading from "@/features/rooms/use-request-third-reading";
import type { RoomConflictDto, RoomConflictReadingDto } from "@/services/api/rooms/get-room-conflicts";
import { formatDayTime } from "@/pages/rooms/convening/format";

const AREA =
  "mt-1.5 w-full resize-y rounded-panel border border-line bg-paper px-2.5 py-2 text-[12.5px] text-ink outline-none placeholder:text-ink-4 focus:border-ring disabled:opacity-60";
const LABEL = "block text-[12px] font-semibold text-ink";

/** "Choosing reading B": the required reason, then settle. POST /rooms/conflicts/{id}/choose. */
export function ChoosePanel({
  conflict,
  reading,
  onDone,
}: {
  conflict: RoomConflictDto;
  reading: RoomConflictReadingDto;
  onDone: () => void;
}) {
  const [why, setWhy] = React.useState("");
  const { chooseConflictReading, isPending } = useChooseConflictReading({ onSuccess: onDone });

  return (
    <div className="rounded-card border border-ultra-border bg-ultra-bg p-4">
      <h4 className="text-[13px] font-semibold text-ink">Choosing {reading.label}</h4>
      <label htmlFor={`why-${conflict.id}`} className={`${LABEL} mt-3`}>
        Why this one?
      </label>
      <p className="mt-0.5 text-[11.5px] text-ink-3">
        Required. The reason is the only thing that explains the choice later.
      </p>
      <textarea
        id={`why-${conflict.id}`}
        rows={3}
        value={why}
        disabled={isPending}
        autoFocus
        onChange={(event) => setWhy(event.currentTarget.value)}
        placeholder="e.g. Fix the cause first; revisit the voucher if the falsifier on second-order rate fires."
        className={AREA}
      />
      <div className="mt-3 flex flex-wrap items-center gap-2">
        <Button
          type="button"
          size="sm"
          disabled={!why.trim() || isPending}
          onClick={() =>
            chooseConflictReading({ conflictId: conflict.id, readingKey: reading.key, why: why.trim() })
          }
        >
          {isPending ? "Settling…" : `Settle on ${reading.label}`}
        </Button>
        <Button type="button" variant="outline" size="sm" disabled={isPending} onClick={onDone}>
          Cancel
        </Button>
        <p className="text-[11.5px] text-ink-3">
          You can't record a compromise. The other reading stays on the record and is cited if this leak comes up
          again.
        </p>
      </div>
    </div>
  );
}

/** "Ask for a third reading": send the conflict back with a question. POST /rooms/conflicts/{id}/third-reading. */
export function ThirdReadingCard({ conflict }: { conflict: RoomConflictDto }) {
  const [question, setQuestion] = React.useState("");
  const { requestThirdReading, isPending } = useRequestThirdReading({ onSuccess: () => setQuestion("") });

  return (
    <section className="rounded-card border border-line bg-paper p-4">
      <h4 className="text-[13px] font-semibold text-ink">Ask for a third reading</h4>

      {conflict.thirdReadings.length > 0 && (
        // About three questions show at once (each is ~62px); the rest scroll inside the list, so a long history
        // never stretches this card (and the Escalate card beside it). The question box below stays fixed.
        <ul className="mt-3 max-h-52 space-y-2 overflow-y-auto overscroll-contain pr-1">
          {conflict.thirdReadings.map((third) => (
            <li key={`${third.askedAtUtc}-${third.question}`} className="rounded-panel bg-paper-2 p-3">
              <p className="text-[12.5px] text-ink">“{third.question}”</p>
              {/* ❌ Backend does NOT provide: the state of the run this question started (the design adds a
                  "Run in progress" chip); `runId` is the only hint and is often null. */}
              <p className="mt-1 text-[11.5px] text-ink-3">
                {third.askedByLabel} <span className="ml-1 font-mono">{formatDayTime(third.askedAtUtc)}</span>
              </p>
            </li>
          ))}
        </ul>
      )}

      <label htmlFor={`third-${conflict.id}`} className={`${LABEL} mt-3`}>
        Question
      </label>
      <textarea
        id={`third-${conflict.id}`}
        rows={3}
        value={question}
        disabled={isPending}
        onChange={(event) => setQuestion(event.currentTarget.value)}
        placeholder="What would settle it?"
        className={AREA}
      />
      <Button
        type="button"
        variant="outline"
        size="sm"
        className="mt-3"
        disabled={!question.trim() || isPending}
        onClick={() => requestThirdReading({ conflictId: conflict.id, question: question.trim(), runId: null })}
      >
        {isPending ? "Sending…" : "Send back with question"}
      </Button>
      <p className="mt-2.5 text-[11.5px] text-ink-3">The conflict stays open. Nothing is decided.</p>
    </section>
  );
}

/** "Escalate": move who decides, and only that. POST /rooms/conflicts/{id}/escalate. */
export function EscalateCard({
  conflict,
  people,
}: {
  conflict: RoomConflictDto;
  people: SearchableSelectOption[];
}) {
  const [toUserId, setToUserId] = React.useState<string | null>(null);
  const [why, setWhy] = React.useState("");
  const { escalateConflict, isPending } = useEscalateConflict({
    onSuccess: () => {
      setToUserId(null);
      setWhy("");
    },
  });

  return (
    <section className="rounded-card border border-line bg-paper p-4">
      <h4 className="text-[13px] font-semibold text-ink">Escalate</h4>
      <p className="mt-1 text-[12px] text-ink-3">
        This changes who decides, and nothing else. The owner, members and work stay. Both readings and their
        evidence go with it.
      </p>

      <label htmlFor={`esc-who-${conflict.id}`} className={`${LABEL} mt-3`}>
        Decide instead
      </label>
      <div className="mt-1.5">
        <SearchableSelect
          id={`esc-who-${conflict.id}`}
          options={people}
          value={toUserId}
          onChange={setToUserId}
          placeholder="Choose a person..."
          searchPlaceholder="Search people..."
          disabled={isPending}
          className="rounded-control bg-paper text-[12px]"
        />
      </div>

      <label htmlFor={`esc-why-${conflict.id}`} className={`${LABEL} mt-3`}>
        Which part couldn't you decide?
      </label>
      <p className="mt-0.5 text-[11.5px] text-ink-3">Required.</p>
      <textarea
        id={`esc-why-${conflict.id}`}
        rows={3}
        value={why}
        disabled={isPending}
        onChange={(event) => setWhy(event.currentTarget.value)}
        placeholder="e.g. Whether a delivery budget overrun is acceptable this quarter."
        className={AREA}
      />
      <Button
        type="button"
        variant="outline"
        size="sm"
        className="mt-3"
        disabled={!toUserId || !why.trim() || isPending}
        onClick={() => toUserId && escalateConflict({ conflictId: conflict.id, toUserId, why: why.trim() })}
      >
        {isPending ? "Escalating…" : "Escalate"}
      </Button>
    </section>
  );
}
