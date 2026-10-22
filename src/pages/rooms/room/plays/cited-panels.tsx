import { Link } from "react-router-dom";

import { Chip } from "@/components/ui/chip";
import { Skeleton } from "@/components/ui/skeleton";
import { useGetCitedDissent } from "@/features/rooms/use-get-cited-dissent";
import { formatDay, humanize } from "@/pages/rooms/convening/format";

const CARD = "overflow-hidden rounded-card border border-line bg-paper";
const CARD_HEAD = "border-b border-line px-5 py-3.5 text-[14px] font-semibold text-ink";

function Quiet({ children }: { children: React.ReactNode }) {
  return <p className="px-5 py-4 text-[12.5px] text-ink-3">{children}</p>;
}

/**
 * The two boxes beside the collision check, both from one call (`GET /rooms/{roomId}/cited-dissent?proposalId=`):
 * "Objections already made" (`cited`, matched on the Room's coordinate: same-action is exact, same-leak is weaker) and
 * "Readings argued before" (`citedReadings`). The design's "About this leak" caption is not shown.
 */
export function CitedPanels({ roomId, proposalId }: { roomId: string; proposalId: string }) {
  const query = useGetCitedDissent(roomId, { proposalId });
  const cited = query.data?.data.cited ?? [];
  const readings = query.data?.data.citedReadings ?? [];

  if (query.isPending) {
    return (
      <div className="space-y-6" aria-busy="true" aria-label="Loading what was argued before">
        <Skeleton className="h-52 rounded-card" />
        <Skeleton className="h-40 rounded-card" />
      </div>
    );
  }
  if (query.isError) {
    return <p className="rounded-card border border-rose-border bg-rose-bg/40 px-4 py-3 text-[12px] text-rose">{query.error.message || "Couldn't load earlier objections."}</p>;
  }

  return (
    <div className="space-y-6">
      <section className={CARD}>
        <h3 className={CARD_HEAD}>Objections already made</h3>
        {cited.length === 0 ? (
          <Quiet>No earlier Room objected to this kind of play.</Quiet>
        ) : (
          <ul className="divide-y divide-line">
            {cited.map((objection) => (
              <li key={objection.id} className="px-5 py-4">
                <div className="flex flex-wrap gap-1.5">
                  <Chip tone={objection.tier === "same-action" ? "ultra" : "neutral"}>{humanize(objection.tier)}</Chip>
                  {objection.borneOut === true && <Chip tone="teal">Borne out</Chip>}
                  {objection.borneOut === false && <Chip tone="amber">Shown wrong</Chip>}
                </div>
                <p className="mt-2 text-[13px] leading-relaxed text-ink">“{objection.wording}”</p>
                <p className="mt-1.5 text-[11.5px] text-ink-3">
                  {objection.byLabel} · from{" "}
                  <Link to={`/rooms/${objection.fromRoomId}`} className="text-ultra hover:underline">
                    {objection.fromRoomTitle}
                  </Link>{" "}
                  · {humanize(objection.fromRoomStatus)}
                  {objection.fromRoomOutcomeKind ? `, ${humanize(objection.fromRoomOutcomeKind)}` : ""}
                </p>
              </li>
            ))}
          </ul>
        )}
      </section>

      <section className={CARD}>
        <h3 className={CARD_HEAD}>Readings argued before</h3>
        {readings.length === 0 ? (
          <Quiet>No earlier Room argued readings about this.</Quiet>
        ) : (
          <ul className="divide-y divide-line">
            {readings.map((reading) => (
              <li key={`${reading.conflictId}-${reading.label}`} className="px-5 py-4">
                <p className="text-[13px] font-semibold text-ink">{reading.recommends}</p>
                <p className="mt-1 text-[12px] leading-relaxed text-ink-3">{reading.because}</p>
                {reading.longRunEffect && <p className="mt-1 text-[12px] leading-relaxed text-ink-3">Long run: {reading.longRunEffect}</p>}
                {(reading.chosenInstead || reading.why) && (
                  <p className="mt-1.5 text-[12px] leading-relaxed text-ink-3">
                    Not chosen{reading.chosenInstead ? `: ${reading.chosenInstead}` : ""}
                    {reading.why ? `. “${reading.why}”` : ""}
                  </p>
                )}
                <p className="mt-1.5 text-[11.5px] text-ink-3">
                  <Link to={`/rooms/${reading.fromRoomId}`} className="text-ultra hover:underline">
                    {reading.fromRoomTitle}
                  </Link>
                  {reading.resolvedAtUtc ? ` · ${formatDay(reading.resolvedAtUtc)}` : ""}
                </p>
              </li>
            ))}
          </ul>
        )}
      </section>
    </div>
  );
}
