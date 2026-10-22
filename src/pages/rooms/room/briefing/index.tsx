import * as React from "react";
import { Link } from "react-router-dom";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Chip, type ChipTone } from "@/components/ui/chip";
import { Skeleton } from "@/components/ui/skeleton";
import { useGetRoomConflicts } from "@/features/rooms/use-get-room-conflicts";
import { useGetRoomDecision } from "@/features/rooms/use-get-room-decision";
import { useGetRoomEvidence } from "@/features/rooms/use-get-room-evidence";
import { useGetRoomInvestigation } from "@/features/rooms/use-get-room-investigation";
import { useGetRoomPlays } from "@/features/rooms/use-get-room-plays";
import { formatDay, formatMoney, humanize } from "@/pages/rooms/convening/format";

const LINK = "text-[12.5px] text-ultra hover:underline";

/** How many claims and plays the front page lists before pointing at the full tab. */
const PREVIEW = 3;

const gradeLabel = (grade: string) => humanize(grade.replace(/([a-z])([A-Z])/g, "$1 $2"));

function Card({
  title,
  aside,
  children,
}: {
  title: string;
  aside?: React.ReactNode;
  children: React.ReactNode;
}) {
  return (
    <section className="overflow-hidden rounded-card border border-line bg-paper">
      <header className="flex items-center justify-between gap-3 border-b border-line px-5 py-3.5">
        <h3 className="text-[15px] font-semibold text-ink">{title}</h3>
        {aside}
      </header>
      {children}
    </section>
  );
}

const CardSkeleton = ({ label }: { label: string }) => <Skeleton className="h-32 rounded-card" aria-busy="true" aria-label={label} />;

function CardError({ message, onRetry }: { message: string; onRetry: () => void }) {
  return (
    <div className="flex flex-wrap items-center gap-3 rounded-card border border-rose-border bg-rose-bg/40 px-4 py-3">
      <p className="text-[12px] text-rose">{message}</p>
      <Button type="button" variant="outline" size="sm" onClick={onRetry}>
        Retry
      </Button>
    </div>
  );
}

function WaitingRow({ tone, kind, text, to, action }: { tone: ChipTone; kind: string; text: string; to: string; action: string }) {
  return (
    <li className="flex flex-wrap items-center justify-between gap-3 border-t border-line px-5 py-3.5 first:border-t-0">
      <div className="flex min-w-0 flex-1 flex-wrap items-center gap-3">
        <Chip tone={tone}>{kind}</Chip>
        <span className="min-w-0 text-[13px] leading-snug wrap-break-word text-ink">{text}</span>
      </div>
      <Button asChild variant="outline" size="sm">
        <Link to={to}>{action}</Link>
      </Button>
    </li>
  );
}

/** Everything in the Room that still needs a person: open conflicts, a drafted decision, pending plays and returned obligations. */
function WaitingCard({ roomId }: { roomId: string }) {
  const conflicts = useGetRoomConflicts(roomId, { includeResolved: true });
  const decision = useGetRoomDecision(roomId);
  const plays = useGetRoomPlays(roomId, { includeDecided: true });

  if (conflicts.isPending || decision.isPending || plays.isPending) return <CardSkeleton label="Loading what is waiting" />;
  const failed = conflicts.isError ? conflicts : decision.isError ? decision : plays.isError ? plays : null;
  if (failed) return <CardError message={failed.error?.message || "Couldn't load what is waiting."} onRetry={() => failed.refetch()} />;

  const openConflicts = (conflicts.data?.data.conflicts ?? []).filter((conflict) => !conflict.isResolved);
  const draft = decision.data?.data;
  const decisionWaiting = Boolean(draft && draft.statement && !draft.decidedAtUtc);
  const pendingPlays = (plays.data?.data.plays ?? []).filter((play) => play.state === "pending");
  const obligations = plays.data?.data.returnedObligations ?? [];
  const total = openConflicts.length + (decisionWaiting ? 1 : 0) + pendingPlays.length + obligations.length;
  const base = `/rooms/${roomId}`;

  return (
    <Card title="Waiting on a person" aside={<span className="font-mono text-[12px] text-ink-3">{total}</span>}>
      {total === 0 ? (
        <p className="px-5 py-6 text-[12.5px] text-ink-3">Nothing is waiting in this Room.</p>
      ) : (
        <ul>
          {openConflicts.map((conflict) => (
            <WaitingRow key={conflict.id} tone="rose" kind="Conflict" text={conflict.summary} to={`${base}?tab=conflicts`} action="Choose a reading" />
          ))}
          {decisionWaiting && draft && (
            <WaitingRow
              tone="ultra"
              kind="Decision"
              // ❌ Backend does NOT provide: who drafted it as a name when a person drafts through the UI (`draftedByLabel` stays null), so the line says only "not yet decided".
              text={draft.draftedByLabel ? `Drafted by ${draft.draftedByLabel}, not yet decided` : "Drafted, not yet decided"}
              to={`${base}?tab=decision`}
              action="Review decision"
            />
          )}
          {pendingPlays.map((play) => (
            <WaitingRow
              key={play.proposalId}
              tone="neutral"
              kind="Play"
              text={`${play.summary}${play.reach !== null ? ` · ${play.reach.toLocaleString("en-US")} people` : ""}${play.waitingHours !== null ? ` · waiting ${Math.round(play.waitingHours)} h` : ""}`}
              to={`${base}?tab=plays`}
              action="Open play"
            />
          ))}
          {obligations.map((obligation) => (
            <WaitingRow
              key={obligation.id}
              tone="amber"
              kind="Obligation"
              text={`${obligation.description}${obligation.dueAtUtc ? ` · due ${formatDay(obligation.dueAtUtc)}` : ""}`}
              to={`${base}?tab=plays`}
              action="Open plays"
            />
          ))}
        </ul>
      )}
    </Card>
  );
}

/** The investigation's own summary line, with its turns and when it ended. A Room with no lead agent answers 404, so the card is simply left out. */
function ConclusionCard({ roomId }: { roomId: string }) {
  const query = useGetRoomInvestigation(roomId);
  const data = query.data?.data;
  if (query.isPending) return <CardSkeleton label="Loading the investigation summary" />;
  if (query.isError || !data || !data.summary) return null;
  return (
    <Card title="What the investigation found" aside={<Chip tone={data.status === "concluded" ? "teal" : "neutral"}>{humanize(data.status)}</Chip>}>
      <div className="px-5 py-4">
        <p className="text-[14px] leading-relaxed text-ink">{data.summary}</p>
        <p className="mt-3 flex flex-wrap items-center gap-x-4 gap-y-1 text-[12px] text-ink-3">
          <span>
            Used {data.turnsUsed} of {data.turnBudget} turns
          </span>
          {data.endedAtUtc && <span>Ended {formatDay(data.endedAtUtc)}</span>}
          <Link to={`/rooms/${roomId}?tab=agents-runs`} className={LINK}>
            See every step
          </Link>
        </p>
      </div>
    </Card>
  );
}

/** The Room's claims as one list: nothing in the response separates "observations" from "hypotheses", so they are not split. */
function ClaimsCard({ roomId }: { roomId: string }) {
  const query = useGetRoomEvidence(roomId);
  const data = query.data?.data;
  if (query.isPending) return <CardSkeleton label="Loading the claims" />;
  if (query.isError || !data) return <CardError message={query.error?.message || "Couldn't load the claims."} onRetry={() => query.refetch()} />;
  const shown = data.claims.slice(0, PREVIEW);
  return (
    <Card
      title="Claims"
      aside={
        <Link to={`/rooms/${roomId}?tab=evidence`} className={LINK}>
          All {data.totalClaims} in Evidence
        </Link>
      }
    >
      {shown.length === 0 ? (
        <p className="px-5 py-6 text-[12.5px] text-ink-3">No claims have been recorded on this Room yet.</p>
      ) : (
        <ul>
          {shown.map((claim) => (
            <li key={claim.claimId} className="flex items-start justify-between gap-4 border-t border-line px-5 py-3.5 first:border-t-0">
              <div className="min-w-0">
                <p className="text-[13px] leading-snug wrap-break-word text-ink">{claim.statement}</p>
                <p className="mt-1 text-[11.5px] text-ink-3">
                  {[claim.source, claim.window, claim.n !== null ? `n = ${claim.n.toLocaleString("en-US")}` : null].filter(Boolean).join(" · ")}
                </p>
              </div>
              <Chip className="shrink-0">{gradeLabel(claim.grade)}</Chip>
            </li>
          ))}
        </ul>
      )}
    </Card>
  );
}

function PendingPlaysCard({ roomId }: { roomId: string }) {
  const query = useGetRoomPlays(roomId, { includeDecided: true });
  if (query.isPending) return <CardSkeleton label="Loading the pending plays" />;
  if (query.isError || !query.data) return <CardError message={query.error?.message || "Couldn't load the plays."} onRetry={() => query.refetch()} />;
  const pending = query.data.data.plays.filter((play) => play.state === "pending");
  return (
    <Card
      title="Pending plays"
      aside={
        <Link to={`/rooms/${roomId}?tab=plays`} className={LINK}>
          Open plays
        </Link>
      }
    >
      {pending.length === 0 ? (
        <p className="px-5 py-6 text-[12.5px] text-ink-3">No play is waiting for a decision.</p>
      ) : (
        <ul>
          {pending.slice(0, PREVIEW).map((play) => {
            const effect = play.currency ? formatMoney(play.effect, play.currency) : null;
            return (
              <li key={play.proposalId} className="border-t border-line px-5 py-3.5 first:border-t-0">
                <div className="flex items-start justify-between gap-3">
                  <p className="text-[13px] font-semibold text-ink">{play.summary}</p>
                  {play.figuresAreStated && <Chip tone="amber">Stated · not checked</Chip>}
                </div>
                <p className="mt-1 text-[11.5px] text-ink-3">
                  {[
                    play.reach !== null ? `Reaches ${play.reach.toLocaleString("en-US")}` : null,
                    effect ? `Effect ${effect}` : null,
                    play.decisionOwnerName ? `Decides: ${play.decisionOwnerName}` : null,
                    play.waitingHours !== null ? `Waiting ${Math.round(play.waitingHours)} h` : null,
                  ]
                    .filter(Boolean)
                    .join(" · ")}
                </p>
              </li>
            );
          })}
        </ul>
      )}
    </Card>
  );
}

function InvestigationCard({ roomId }: { roomId: string }) {
  const query = useGetRoomInvestigation(roomId);
  const data = query.data?.data;
  if (query.isPending) return <CardSkeleton label="Loading the investigation" />;
  if (query.isError || !data) return null;
  const share = data.turnBudget > 0 ? Math.min(100, (data.turnsUsed / data.turnBudget) * 100) : 0;
  return (
    <Card title="Investigation" aside={<Chip tone={data.status === "concluded" ? "teal" : "neutral"}>{humanize(data.status)}</Chip>}>
      <div className="px-5 py-4">
        <div className="flex items-baseline justify-between text-[12.5px] text-ink-2">
          <span>Turns used</span>
          <span className="font-mono text-ink">
            <span className="font-semibold">{data.turnsUsed}</span> / {data.turnBudget}
          </span>
        </div>
        <div className="mt-2 h-1.5 overflow-hidden rounded-full bg-paper-2">
          <div className="h-full rounded-full bg-ultra" style={{ width: `${share}%` }} />
        </div>
        <p className="mt-2.5 text-[11.5px] text-ink-3">
          {data.startedAtUtc ? `Started ${formatDay(data.startedAtUtc)}` : "Not started"}
          {data.endedAtUtc ? ` · ended ${formatDay(data.endedAtUtc)}` : ""}
        </p>
      </div>
    </Card>
  );
}

function GapsAndFalsifiers({ roomId }: { roomId: string }) {
  const query = useGetRoomEvidence(roomId);
  const data = query.data?.data;
  if (query.isPending) return <CardSkeleton label="Loading the gaps" />;
  if (query.isError || !data) return null;
  return (
    <>
      {data.gaps.length > 0 && (
        <Card title="Gaps">
          <ul>
            {data.gaps.map((gap) => (
              <li key={gap.missingSource} className="flex items-center justify-between gap-3 border-t border-line px-5 py-3.5 first:border-t-0">
                <span className="text-[13px] font-semibold text-ink">{gap.missingSource}</span>
                <Chip tone="amber">
                  Blocks {gap.claimsBlocked.toLocaleString("en-US")} {gap.claimsBlocked === 1 ? "claim" : "claims"}
                </Chip>
              </li>
            ))}
          </ul>
        </Card>
      )}
      <Card
        title="What would change this"
        aside={
          <Link to={`/rooms/${roomId}?tab=decision`} className={LINK}>
            Edit in Decision
          </Link>
        }
      >
        {data.falsifiers.length === 0 ? (
          <p className="px-5 py-6 text-[12.5px] text-ink-3">No condition has been named yet.</p>
        ) : (
          <ul>
            {data.falsifiers.map((falsifier, index) => (
              <li key={`${falsifier.addedAtUtc}-${index}`} className={cn("border-t border-line px-5 py-3.5 text-[13px] leading-relaxed text-ink first:border-t-0", falsifier.metAtUtc && "bg-amber-bg/50")}>
                <span className="font-semibold">If</span> {falsifier.condition}, <span className="font-semibold">then</span> <span className="text-ink-3">{falsifier.thenWhat}</span>
                {falsifier.metAtUtc && (
                  <span className="mt-2 block">
                    <Chip tone="amber">Met {formatDay(falsifier.metAtUtc)}</Chip>
                  </span>
                )}
              </li>
            ))}
          </ul>
        )}
      </Card>
    </>
  );
}

function DecisionCard({ roomId }: { roomId: string }) {
  const query = useGetRoomDecision(roomId);
  const data = query.data?.data;
  if (query.isPending) return <CardSkeleton label="Loading the decision" />;
  if (query.isError || !data) return <CardError message={query.error?.message || "Couldn't load the decision."} onRetry={() => query.refetch()} />;
  const decided = Boolean(data.decidedAtUtc);
  return (
    <Card title="Decision as it stands" aside={data.statement ? <Chip tone={decided ? "teal" : "ultra"}>{decided ? "Decided" : "Drafted"}</Chip> : undefined}>
      <div className="px-5 py-4">
        {data.statement ? (
          <p className="text-[13.5px] leading-relaxed text-ink">{data.statement}</p>
        ) : (
          <p className="text-[12.5px] text-ink-3">No decision has been drafted yet.</p>
        )}
        {data.statement && (
          <p className="mt-2 text-[11.5px] text-ink-3">
            Revision {data.revisions.length}
            {data.dissent.length > 0 ? ` · ${data.dissent.length} ${data.dissent.length === 1 ? "objection" : "objections"} on the record` : ""}
          </p>
        )}
        <Button asChild variant="outline" size="sm" className="mt-3">
          <Link to={`/rooms/${roomId}?tab=decision`}>Open decision</Link>
        </Button>
      </div>
    </Card>
  );
}

/**
 * The Briefing tab (Room · Briefing.png): the Room's front page, composed from the endpoints behind the other tabs (conflicts, decision, plays,
 * evidence, investigation); no endpoint of its own exists. Built with what the API returns, not strictly to the design. Left out: the design's
 * "Read this first" sentence (nothing sends one), the split of claims into "Observations" and "Hypotheses" (no field tells them apart, so one
 * "Claims" list), a per-person "Waiting on you" filter (the open items are listed for everyone), and the "Connect source" button on a gap (no
 * route is known). Never seen with data on the user's Rooms: claims, gaps, plays, obligations and objections are empty today.
 */
export const BriefingTab = ({ roomId }: { roomId: string }) => (
  <div className="grid items-start gap-5 @4xl:grid-cols-[minmax(0,1fr)_21rem]">
    <div className="min-w-0 space-y-5">
      <WaitingCard roomId={roomId} />
      <ConclusionCard roomId={roomId} />
      <ClaimsCard roomId={roomId} />
      <PendingPlaysCard roomId={roomId} />
    </div>
    <div className="min-w-0 space-y-5">
      <InvestigationCard roomId={roomId} />
      <GapsAndFalsifiers roomId={roomId} />
      <DecisionCard roomId={roomId} />
    </div>
  </div>
);
