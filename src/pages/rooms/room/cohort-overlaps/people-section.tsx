import { Shuffle } from "lucide-react";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Chip, type ChipTone } from "@/components/ui/chip";
import { Skeleton } from "@/components/ui/skeleton";
import { useGetRoomCohort } from "@/features/rooms/use-get-room-cohort";
import { formatDay, formatDayTime, humanize } from "@/pages/rooms/convening/format";
import type { RoomCohortSampleCustomerDto } from "@/services/api/rooms/get-room-cohort";

const HEAD = "px-4 py-2.5 text-[11.5px] font-medium text-ink-3";

const count = (value: number | null) => (value === null ? "-" : value.toLocaleString("en-US"));

function Tile({ label, value, note, valueClass }: { label: string; value: number | null; note?: string; valueClass?: string }) {
  return (
    <div className="px-5 py-4">
      <p className="font-mono text-[10px] font-medium tracking-[0.8px] text-ink-3 uppercase">{label}</p>
      <p className={cn("mt-1.5 font-mono text-[26px] leading-none font-semibold text-ink", value === null ? "text-ink-4" : valueClass)}>{count(value)}</p>
      {note && <p className="mt-2 text-[11.5px] text-ink-3">{note}</p>}
    </div>
  );
}

/** Reachable, suppressed and capped as one bar; drawn only when the backend sent all three. */
function SplitBar({ total, reachable, suppressed, capped }: { total: number; reachable: number; suppressed: number; capped: number }) {
  const width = (value: number) => `${(value / total) * 100}%`;
  return (
    <div className="rounded-card border border-line bg-paper px-5 py-4">
      <div className="flex h-2.5 gap-0.5 overflow-hidden rounded-full bg-paper-2" role="img" aria-label="Reachable, suppressed and capped people">
        <div className="bg-teal" style={{ width: width(reachable) }} />
        <div className="bg-ink-2" style={{ width: width(suppressed) }} />
        <div className="bg-amber" style={{ width: width(capped) }} />
      </div>
      <div className="mt-2.5 flex flex-wrap gap-x-4 gap-y-1 text-[11.5px] text-ink-2">
        <span className="inline-flex items-center gap-1.5"><span className="size-2 rounded-sm bg-teal" />Reachable</span>
        <span className="inline-flex items-center gap-1.5"><span className="size-2 rounded-sm bg-ink-2" />Suppressed (counted first)</span>
        <span className="inline-flex items-center gap-1.5"><span className="size-2 rounded-sm bg-amber" />Capped</span>
      </div>
    </div>
  );
}

/** Contact state as the backend words it; the design's three states get a tone, any other value stays a plain grey chip. */
function ContactCell({ customer }: { customer: RoomCohortSampleCustomerDto }) {
  const key = customer.contactability.toLowerCase();
  const tone: ChipTone = key.includes("reach") ? "teal" : key.includes("cap") ? "amber" : "neutral";
  return (
    <span className="inline-flex flex-wrap items-center gap-2">
      <Chip tone={tone}>{humanize(customer.contactability)}</Chip>
      {customer.suppressionReason && <span className="text-[11.5px] text-ink-3">{humanize(customer.suppressionReason)}</span>}
    </span>
  );
}

function SampleRow({ customer }: { customer: RoomCohortSampleCustomerDto }) {
  return (
    <tr className="border-t border-line text-[12.5px]">
      <td className="px-4 py-3 text-ink">{customer.name}</td>
      <td className="px-4 py-3 font-mono text-[12px] text-ink-2">{customer.firstOrder ?? <span className="font-sans text-ink-3 italic">Not recorded</span>}</td>
      <td className="px-4 py-3 text-right font-mono text-[12px] text-ink-2">{customer.daysSinceFirstOrder ?? "-"}</td>
      <td className="px-4 py-3 font-mono text-[12px] text-ink-2">{customer.timeZoneId ?? "-"}</td>
      <td className="px-4 py-3">
        <ContactCell customer={customer} />
      </td>
    </tr>
  );
}

function PeopleSkeleton() {
  return (
    <div className="space-y-4" aria-busy="true" aria-label="Loading the people behind this room">
      <Skeleton className="h-28 rounded-card" />
      <Skeleton className="h-12 rounded-card" />
      <div className="grid gap-4 @4xl:grid-cols-[22rem_1fr]">
        <Skeleton className="h-52 rounded-card" />
        <Skeleton className="h-52 rounded-card" />
      </div>
    </div>
  );
}

/**
 * "The people behind this room" (Room · Cohort & overlaps.png), on `GET /rooms/{roomId}/cohort`: the four counts, the split bar, where they
 * are and the random draw. Built from the real response of 2026-10-16 (computed, 37 people) in which the three split counts are null and
 * `markets` and `sample` are empty, so those parts show their empty state until the backend fills them. Never zeros for a Room that has not been
 * computed: that state is said in words.
 */
export function PeopleSection({ roomId }: { roomId: string }) {
  const query = useGetRoomCohort(roomId);
  const data = query.data?.data;

  if (query.isPending) return <PeopleSkeleton />;
  if (query.isError || !data) {
    return (
      <div className="flex flex-wrap items-center gap-3 rounded-card border border-rose-border bg-rose-bg/40 px-4 py-3">
        <p className="text-[12px] text-rose">{query.error?.message || "Couldn't load the people behind this room."}</p>
        <Button type="button" variant="outline" size="sm" onClick={() => query.refetch()}>
          Retry
        </Button>
      </div>
    );
  }

  const membership = data.membership;
  const limitations = membership?.limitations ?? [];
  const markets = [...data.markets].sort((a, b) => b.customerCount - a.customerCount);
  const topMarket = markets[0]?.customerCount ?? 0;
  const splitKnown = data.totalCount > 0 && data.reachableCount !== null && data.suppressedCount !== null && data.cappedCount !== null;

  return (
    <section>
      <h2 className="text-[18px] font-semibold text-ink">The people behind this room</h2>

      {data.notYetComputed ? (
        <div className="mt-3 rounded-card border border-line bg-paper px-5 py-6">
          <p className="text-[13.5px] font-semibold text-ink">This room's people have not been counted yet</p>
          <p className="mt-1 text-[12.5px] text-ink-2">
            The room opened between counting passes, so it has no cohort yet.
            {data.absentBecause && <span className="ml-1 font-mono text-[11.5px] text-ink-3">({data.absentBecause})</span>}
          </p>
        </div>
      ) : (
        <>
          <p className="mt-1 text-[12.5px] text-ink-3">
            {data.computedAtUtc ? `Computed ${formatDayTime(data.computedAtUtc)}; it can be up to 15 minutes old.` : "It can be up to 15 minutes old."}
            {membership && (
              <>
                {" "}
                {membership.resolvedCount.toLocaleString("en-US")} of {membership.totalCount.toLocaleString("en-US")} {membership.unit} resolved
                {membership.provenance.asOfUtc ? `, as of ${formatDay(membership.provenance.asOfUtc)}` : ""}.
              </>
            )}
          </p>

          {limitations.length > 0 && (
            <ul className="mt-3 space-y-1 rounded-card border border-amber-border bg-amber-bg/60 px-4 py-3 text-[12px] text-ink-2">
              {limitations.map((limit) => (
                <li key={limit.code}>{limit.message}</li>
              ))}
            </ul>
          )}

          <div className="mt-4 grid divide-y divide-line overflow-hidden rounded-card border border-line bg-paper sm:grid-cols-2 sm:divide-y-0 @4xl:grid-cols-4 @4xl:divide-x">
            <Tile label="Total" value={data.totalCount} />
            {/* ❌ Backend does NOT provide: reachableCount, suppressedCount, cappedCount (sent as null on 2026-10-16). */}
            <Tile label="Reachable" value={data.reachableCount} valueClass="text-teal" />
            <Tile label="Suppressed" value={data.suppressedCount} note="Their own choice; doesn't expire" />
            <Tile label="At frequency cap" value={data.cappedCount} note="Temporary" />
          </div>

          {splitKnown && (
            <div className="mt-3">
              <SplitBar total={data.totalCount} reachable={data.reachableCount!} suppressed={data.suppressedCount!} capped={data.cappedCount!} />
            </div>
          )}

          <div className="mt-4 grid gap-4 @4xl:grid-cols-[22rem_1fr]">
            <div className="rounded-card border border-line bg-paper">
              <h3 className="border-b border-line px-5 py-4 text-[15px] font-semibold text-ink">Where they are</h3>
              {/* ❌ Backend does NOT provide: markets (an empty list on 2026-10-16). */}
              {markets.length === 0 ? (
                <p className="px-5 py-6 text-[12.5px] text-ink-3">No breakdown by time zone has been sent for this room yet.</p>
              ) : (
                <ul className="space-y-3.5 px-5 py-4">
                  {markets.map((market) => (
                    <li key={market.timeZoneId}>
                      <div className="flex items-baseline justify-between gap-3 font-mono text-[12px] text-ink">
                        <span>{market.timeZoneId}</span>
                        <span>{market.customerCount.toLocaleString("en-US")}</span>
                      </div>
                      <div className="mt-1.5 h-1.5 overflow-hidden rounded-full bg-paper-2">
                        <div className="h-full rounded-full bg-ultra" style={{ width: `${topMarket > 0 ? (market.customerCount / topMarket) * 100 : 0}%` }} />
                      </div>
                    </li>
                  ))}
                </ul>
              )}
            </div>

            <div className="overflow-hidden rounded-card border border-line bg-paper">
              <header className="flex flex-wrap items-start justify-between gap-3 px-5 py-4">
                <div>
                  <h3 className="text-[15px] font-semibold text-ink">Twelve at random</h3>
                  <p className="mt-0.5 text-[12.5px] text-ink-3">A sanity check, not evidence. There's no paging or export.</p>
                </div>
                <Button type="button" variant="outline" size="sm" disabled={query.isFetching} onClick={() => query.refetch()}>
                  <Shuffle className="size-3.5" aria-hidden />
                  {query.isFetching ? "Drawing…" : "Reshuffle"}
                </Button>
              </header>
              {/* ❌ Backend does NOT provide: sample (an empty list on 2026-10-16). `subjectSample` carries ids and evidence counts only, no name, order, time zone or contact state. */}
              {data.sample.length === 0 ? (
                <p className="border-t border-line px-5 py-6 text-[12.5px] text-ink-3">
                  {data.subjectSample.length > 0
                    ? `${data.subjectSample.length} accounts were drawn, but the backend sends only their ids and evidence counts, no names or details yet.`
                    : "No people have been drawn for this room yet."}
                </p>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full min-w-[640px] border-collapse text-left">
                    <thead className="bg-paper-2/60">
                      <tr>
                        <th className={HEAD}>Customer</th>
                        <th className={HEAD}>First order</th>
                        <th className={cn(HEAD, "text-right")}>Days since</th>
                        <th className={HEAD}>Time zone</th>
                        <th className={HEAD}>Contact</th>
                      </tr>
                    </thead>
                    <tbody>
                      {data.sample.map((customer) => (
                        <SampleRow key={customer.customerId} customer={customer} />
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </div>
        </>
      )}
    </section>
  );
}
