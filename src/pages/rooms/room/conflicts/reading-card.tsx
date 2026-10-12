import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Chip } from "@/components/ui/chip";
import { formatWholeMoney } from "@/lib/format-measured-value";
import type { RoomConflictReadingDto } from "@/services/api/rooms/get-room-conflicts";

/** `open`: still to be argued; `chosen` / `not-chosen`: how a settled conflict shows its two sides. */
export type ReadingOutcome = "open" | "chosen" | "not-chosen";

const STAT_LABEL = "font-mono text-[9px] font-medium tracking-[0.8px] text-ink-4 uppercase";

/** One side of a conflict (Room · Conflicts.png, "Reading A" / "Reading B"). */
export function ReadingCard({
  reading,
  outcome,
  onChoose,
  disabled,
}: {
  reading: RoomConflictReadingDto;
  outcome: ReadingOutcome;
  /** Present only on an open conflict; opens the "why this one?" panel. */
  onChoose?: () => void;
  disabled?: boolean;
}) {
  const priced = reading.expectedEffect !== null && reading.currency;
  const claims = reading.evidenceClaimIds.length;

  return (
    <div
      className={cn(
        "flex min-w-0 flex-col rounded-card border bg-paper p-4",
        outcome === "chosen" ? "border-teal" : "border-line",
        outcome === "not-chosen" && "bg-paper-2/60"
      )}
    >
      <div className="flex items-center justify-between gap-2">
        <p className="font-mono text-[11px] text-ink-3">{reading.label}</p>
        {outcome === "chosen" && <Chip tone="teal">Chosen</Chip>}
        {outcome === "not-chosen" && <Chip>Not chosen · kept on the record</Chip>}
      </div>

      <h4 className="mt-2 text-[14px] font-semibold text-ink">{reading.recommends}</h4>
      <p className="mt-1.5 text-[12.5px] leading-relaxed text-ink-2">
        <span className="text-ink-3">Because: </span>
        {reading.because}
      </p>

      <div className="mt-3 grid grid-cols-2 gap-2.5">
        <div className="rounded-panel bg-paper-2 p-3">
          <p className={STAT_LABEL}>Reach</p>
          <p className="mt-1 font-mono text-[13px] font-semibold text-ink">
            {reading.expectedReach !== null ? reading.expectedReach.toLocaleString("en-US") : "—"}
          </p>
        </div>
        <div className="rounded-panel bg-paper-2 p-3">
          <p className={STAT_LABEL}>Expected effect</p>
          {priced ? (
            <p className="mt-1 font-mono text-[13px] font-semibold text-ink">
              {formatWholeMoney(reading.expectedEffect as number, reading.currency as string)}
            </p>
          ) : (
            <>
              <p className="mt-1 text-[13px] text-ink-3 italic">Unpriced</p>
              {reading.effectUnavailableBecause && (
                <p className="mt-0.5 text-[11px] text-ink-3">{reading.effectUnavailableBecause}</p>
              )}
            </>
          )}
        </div>
      </div>

      {reading.longRunEffect && (
        <p className="mt-3 text-[12.5px] leading-relaxed text-ink-2">
          <span className="text-ink-3">Long-run: </span>
          {reading.longRunEffect}
        </p>
      )}

      {/* ❌ The design links "N supporting claims" to the Evidence tab; that tab is not built, so the
          count is plain text for now. */}
      <p className="mt-3 text-[12px] text-ink-3">
        {claims > 0 ? `${claims} supporting claim${claims === 1 ? "" : "s"}` : "No supporting claims recorded"}
      </p>

      {onChoose && (
        <div className="mt-auto pt-4">
          <Button type="button" variant="outline" size="sm" disabled={disabled} onClick={onChoose}>
            Choose {reading.label}...
          </Button>
        </div>
      )}
    </div>
  );
}
