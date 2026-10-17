import * as React from "react";
import { Link } from "react-router-dom";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Chip, type ChipTone } from "@/components/ui/chip";
import { Skeleton } from "@/components/ui/skeleton";
import { useGetRoomEvidence } from "@/features/rooms/use-get-room-evidence";
import { formatDay, humanize } from "@/pages/rooms/convening/format";
import type { RoomEvidenceClaimDto } from "@/services/api/rooms/get-room-evidence";

/** Claims drawn first, and added per click. */
const PAGE = 8;

const HEAD = "px-5 py-2.5 text-[11.5px] font-medium text-ink-3";

/** "InsufficientEvidence" or "StrongAssociation" as words ("Insufficient evidence"); other spellings go through the shared `humanize`. */
const gradeLabel = (grade: string) => humanize(grade.replace(/([a-z])([A-Z])/g, "$1 $2"));

/**
 * A grade's chip. The docs only name `InsufficientEvidence`; the design adds Causal, Strong association and Weak association, so a grade is
 * matched loosely (case and separators ignored) and anything else reads as plain words on a grey chip. An insufficient grade gets the
 * dashed outline the design uses: a claim the room cannot stand on yet.
 */
function GradeChip({ grade }: { grade: string }) {
  const key = grade.toLowerCase().replace(/[^a-z]/g, "");
  if (key.includes("insufficient")) {
    return (
      <span className="inline-flex items-center rounded-chip border border-dashed border-ink-4 px-2 py-0.5 text-[9.5px] font-semibold whitespace-nowrap text-ink-3">
        {gradeLabel(grade)}
      </span>
    );
  }
  const tone: ChipTone = key.includes("causal") ? "teal" : key.includes("strong") ? "ultra" : "neutral";
  return <Chip tone={tone}>{gradeLabel(grade)}</Chip>;
}

function EvidenceSkeleton() {
  return (
    <div className="space-y-6" aria-busy="true" aria-label="Loading the evidence">
      <Skeleton className="h-80 rounded-card" />
      <Skeleton className="h-40 rounded-card" />
    </div>
  );
}

function ClaimRow({ claim }: { claim: RoomEvidenceClaimDto }) {
  return (
    <tr className="border-t border-line align-top text-[12.5px]">
      <td className="px-5 py-3.5">
        <GradeChip grade={claim.grade} />
      </td>
      <td className="px-5 py-3.5">
        <p className="leading-relaxed wrap-break-word text-ink">{claim.statement}</p>
        {claim.missingSource && (
          <span className="mt-1.5 inline-flex rounded-chip border border-amber-border bg-amber-bg px-2 py-0.5 text-[10.5px] font-semibold text-amber">
            Missing: {claim.missingSource}
          </span>
        )}
      </td>
      <td className="px-5 py-3.5 text-ink-2">{claim.source ?? "—"}</td>
      <td className="px-5 py-3.5 font-mono text-[12px] whitespace-nowrap text-ink-2">{claim.window || "—"}</td>
      <td className="px-5 py-3.5 text-right font-mono text-[12px] text-ink-2">{claim.n === null ? "—" : claim.n.toLocaleString("en-US")}</td>
    </tr>
  );
}

/**
 * The Evidence tab (Room · Evidence.png), on `GET /rooms/{roomId}/evidence`: what each claim stands on, the connections that would settle
 * the weak ones, and what would change the recommendation. Claims arrive strongest and freshest first and are not re-sorted. Built from the
 * real response of 2026-10-14 (no claims, no gaps, three falsifiers, two met) and the documented claim and gap shapes: the claims table
 * and "One connection away" have NEVER been seen with real data, so their layout, the grade values and the filter pills (built from the
 * grades actually present) are still to confirm. Left out: the design's "Trace: N tool calls" (no field carries it) and the "Connect"
 * buttons on a gap (no route is known).
 */
export const EvidenceTab = ({ roomId }: { roomId: string }) => {
  const query = useGetRoomEvidence(roomId);
  const [filter, setFilter] = React.useState<string>("all");
  const [shown, setShown] = React.useState(PAGE);

  const data = query.data?.data;
  const claims = React.useMemo(() => data?.claims ?? [], [data]);
  const grades = React.useMemo(() => [...new Set(claims.map((claim) => claim.grade))], [claims]);
  const filtered = filter === "all" ? claims : claims.filter((claim) => claim.grade === filter);

  if (query.isPending) return <EvidenceSkeleton />;
  if (query.isError || !data) {
    return (
      <div className="flex flex-wrap items-center gap-3 rounded-card border border-rose-border bg-rose-bg/40 px-4 py-3">
        <p className="text-[12px] text-rose">{query.error?.message || "Couldn't load the evidence."}</p>
        <Button type="button" variant="outline" size="sm" onClick={() => query.refetch()}>
          Retry
        </Button>
      </div>
    );
  }

  const visible = filtered.slice(0, shown);
  const remaining = filtered.length - visible.length;

  return (
    <div className="space-y-6">
      {data.gaps.length > 0 && (
        <section>
          <h2 className="text-[16px] font-semibold text-ink">One connection away</h2>
          <ul className="mt-3 grid gap-3 sm:grid-cols-2">
            {data.gaps.map((gap, index) => (
              <li
                key={gap.missingSource}
                className={cn("rounded-card border px-5 py-4", index === 0 ? "border-amber-border bg-amber-bg/60" : "border-line bg-paper")}
              >
                <p className="text-[14px] font-semibold text-ink">{gap.missingSource}</p>
                <p className="mt-0.5 text-[12.5px] text-ink-2">
                  Would resolve <span className="font-semibold text-ink">{gap.claimsBlocked.toLocaleString("en-US")}</span>{" "}
                  {gap.claimsBlocked === 1 ? "claim" : "claims"} marked insufficient
                </p>
              </li>
            ))}
          </ul>
        </section>
      )}

      <section className="overflow-hidden rounded-card border border-line bg-paper">
        <header className="flex flex-wrap items-center justify-between gap-3 px-5 py-4">
          <h3 className="text-[15px] font-semibold text-ink">
            Claims <span className="ml-1 font-normal text-ink-3">{data.totalClaims}</span>
          </h3>
          {grades.length > 1 && (
            <div className="flex flex-wrap gap-2" role="tablist" aria-label="Filter the claims by grade">
              {["all", ...grades].map((key) => (
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
                    "rounded-full border px-3.5 py-1.5 text-[12.5px] font-medium",
                    filter === key ? "border-ink bg-ink text-paper" : "border-line bg-paper text-ink hover:bg-paper-2"
                  )}
                >
                  {key === "all" ? "All" : gradeLabel(key)}
                </button>
              ))}
            </div>
          )}
        </header>
        <p className="border-t border-line px-5 py-2.5 text-[12px] text-ink-3">
          Strongest and freshest first. Includes what the workspace already believed about this leak, not only what this room found.
        </p>

        {claims.length === 0 ? (
          <p className="border-t border-line px-5 py-8 text-center text-[12.5px] text-ink-3">No claims have been recorded on this Room yet.</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full min-w-[760px] border-collapse text-left">
              <thead className="bg-paper-2/60">
                <tr>
                  <th className={cn(HEAD, "w-44")}>Grade</th>
                  <th className={HEAD}>Claim</th>
                  <th className={cn(HEAD, "w-48")}>Source</th>
                  <th className={cn(HEAD, "w-44")}>Window</th>
                  <th className={cn(HEAD, "w-24 text-right")}>n</th>
                </tr>
              </thead>
              <tbody>
                {visible.map((claim) => (
                  <ClaimRow key={claim.claimId} claim={claim} />
                ))}
              </tbody>
            </table>
          </div>
        )}
        {remaining > 0 && (
          <div className="border-t border-line px-5 py-3">
            <Button type="button" variant="outline" size="sm" onClick={() => setShown((count) => count + PAGE)}>
              Show {Math.min(PAGE, remaining)} more
            </Button>
          </div>
        )}
      </section>

      <section className="overflow-hidden rounded-card border border-line bg-paper">
        <header className="flex flex-wrap items-center justify-between gap-3 border-b border-line px-5 py-4">
          <h3 className="text-[15px] font-semibold text-ink">What would change the recommendation</h3>
          <Link to={`/rooms/${roomId}?tab=decision`} className="text-[12.5px] text-ultra hover:underline">
            Edit in Decision
          </Link>
        </header>
        {data.falsifiers.length === 0 ? (
          <p className="px-5 py-6 text-[12.5px] text-ink-3">No condition has been named yet. Name one in the Decision tab.</p>
        ) : (
          <ul className="grid divide-y divide-line sm:grid-cols-2 sm:divide-x sm:divide-y-0 @5xl:grid-cols-3">
            {data.falsifiers.map((falsifier, index) => (
              <li key={`${falsifier.addedAtUtc}-${index}`} className={cn("px-5 py-4 text-[13px] leading-relaxed text-ink", falsifier.metAtUtc && "bg-amber-bg/50")}>
                <span className="font-semibold">If</span> {falsifier.condition}, <span className="font-semibold">then</span>{" "}
                <span className="text-ink-3">{falsifier.thenWhat}</span>
                {falsifier.metAtUtc && (
                  <span className="mt-2 block">
                    <Chip tone="amber">Met {formatDay(falsifier.metAtUtc)}</Chip>
                  </span>
                )}
              </li>
            ))}
          </ul>
        )}
      </section>
    </div>
  );
};
