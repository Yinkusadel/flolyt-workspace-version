import * as React from "react";
import { Lock } from "lucide-react";
import { Link } from "react-router-dom";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Chip, type ChipTone } from "@/components/ui/chip";
import { Skeleton } from "@/components/ui/skeleton";
import useCheckProposalCollision from "@/features/rooms/use-check-proposal-collision";
import { formatDayTime, humanize } from "@/pages/rooms/convening/format";
import type { RoomPlayDto } from "@/services/api/rooms/get-room-plays";

const VERDICT_TONE: Record<string, ChipTone> = {
  "would-breach": "rose",
  "same-window": "amber",
  clear: "teal",
};

const HEAD = "px-4 py-2.5 font-mono text-[9px] font-medium tracking-[0.8px] text-ink-4 uppercase";

function Tile({ label, value, note, tone }: { label: string; value: React.ReactNode; note?: string; tone?: "rose" }) {
  return (
    <div className={cn("rounded-card p-4", tone === "rose" ? "bg-rose-bg" : "bg-paper-2/70")}>
      <p className={cn("font-mono text-[9px] font-medium tracking-[0.8px] uppercase", tone === "rose" ? "text-rose" : "text-ink-4")}>{label}</p>
      <p className={cn("mt-1.5 font-mono text-[22px] font-semibold", tone === "rose" ? "text-rose" : "text-ink")}>{value}</p>
      {note && <p className={cn("mt-1 text-[11px] leading-snug", tone === "rose" ? "text-rose" : "text-ink-3")}>{note}</p>}
    </div>
  );
}

/**
 * "Who else will contact these people?": the selected play checked workspace-wide against every other Room's planned sends
 * (`POST /rooms/{roomId}/proposals/{proposalId}/collision-check`, a POST so the answer is never cached). It runs when a play is
 * selected and again on "Check again". `wouldBreach` and `clear` are documented as booleans but the design draws them as counts:
 * a number is shown as a count, a boolean as a verdict, until a real response settles it. Per the doc, `wouldBreach` is the only
 * fact here (read from what is already sent) and the rest is projection; the check itself enforces nothing.
 */
export function CollisionCard({ roomId, play }: { roomId: string; play: RoomPlayDto }) {
  const { checkCollision, isPending, isError, error, result } = useCheckProposalCollision();
  const run = React.useCallback(() => checkCollision({ roomId, proposalId: play.proposalId }), [checkCollision, roomId, play.proposalId]);

  React.useEffect(() => {
    run();
  }, [run]);

  const breach = result?.wouldBreach as unknown;
  const clear = result?.clear as unknown;

  return (
    <section className="overflow-hidden rounded-card border border-line bg-paper">
      <header className="flex flex-wrap items-start justify-between gap-3 border-b border-line px-5 py-4">
        <div className="min-w-0">
          <h3 className="text-[14px] font-semibold text-ink">Who else will contact these people?</h3>
          <p className="mt-0.5 truncate text-[11.5px] text-ink-3">{play.summary} · checked across the whole workspace</p>
        </div>
        <Button type="button" variant="outline" size="sm" disabled={isPending} onClick={run}>
          {isPending ? "Checking" : "Check again"}
        </Button>
      </header>

      {isPending && !result ? (
        <div className="space-y-3 p-5" aria-busy="true" aria-label="Checking for collisions">
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
            {[0, 1, 2, 3].map((i) => (
              <Skeleton key={i} className="h-24 rounded-card" />
            ))}
          </div>
          <Skeleton className="h-28 rounded-card" />
        </div>
      ) : isError && !result ? (
        <p className="px-5 py-6 text-[12.5px] text-rose">{error?.message || "The collision check failed."}</p>
      ) : result ? (
        <>
          <div className="grid grid-cols-2 gap-3 p-5 sm:grid-cols-4">
            <Tile label="This play reaches" value={play.reach === null ? "—" : play.reach.toLocaleString("en-US")} note="Stated, not checked" />
            <Tile label="Colliding" value={result.colliding.toLocaleString("en-US")} note="Distinct people" />
            {typeof breach === "number" ? (
              <Tile label="Would breach cap" value={breach.toLocaleString("en-US")} note="From messages already sent" tone={breach > 0 ? "rose" : undefined} />
            ) : (
              <Tile label="Would breach cap" value={breach ? "Yes" : "No"} note="From messages already sent" tone={breach ? "rose" : undefined} />
            )}
            {typeof clear === "number" ? (
              <Tile label="Clear" value={clear.toLocaleString("en-US")} />
            ) : (
              <Tile label="Clear" value={clear ? "Yes" : "No"} />
            )}
          </div>

          {result.others.length > 0 ? (
            <div className="overflow-x-auto border-t border-line">
              <table className="w-full min-w-[640px] border-collapse text-left">
                <thead className="bg-paper-2/60">
                  <tr>
                    <th className={HEAD}>Other room</th>
                    <th className={cn(HEAD, "text-right")}>Overlap</th>
                    <th className={HEAD}>Their send</th>
                    <th className={HEAD}>Ours</th>
                    <th className={cn(HEAD, "text-right")}>Gap</th>
                    <th className={HEAD}>Verdict</th>
                  </tr>
                </thead>
                <tbody>
                  {result.others.map((other, index) => (
                    <tr key={`${other.roomId ?? "restricted"}-${index}`} className="border-t border-line text-[12.5px]">
                      <td className="px-4 py-2.5">
                        {other.restricted || !other.roomTitle ? (
                          <span className="inline-flex items-center gap-1.5 text-ink-3 italic">
                            <Lock className="size-3" />
                            Restricted room
                          </span>
                        ) : other.roomId ? (
                          <Link to={`/rooms/${other.roomId}`} className="text-ultra hover:underline">
                            {other.roomTitle}
                          </Link>
                        ) : (
                          other.roomTitle
                        )}
                      </td>
                      <td className="px-4 py-2.5 text-right font-mono text-ink">{other.overlap.toLocaleString("en-US")}</td>
                      <td className="px-4 py-2.5 font-mono text-[12px] text-ink">
                        {other.theirSendAtUtc ? formatDayTime(other.theirSendAtUtc) : <span className="font-sans text-ink-3 italic">On approval</span>}
                      </td>
                      <td className="px-4 py-2.5 font-mono text-[12px] text-ink">{other.ourSendAtUtc ? formatDayTime(other.ourSendAtUtc) : "—"}</td>
                      <td className="px-4 py-2.5 text-right font-mono text-ink">
                        {other.gapHours === null ? <span className="font-sans text-ink-3 italic">Unknown</span> : `${other.gapHours} h`}
                      </td>
                      <td className="px-4 py-2.5">
                        <Chip tone={VERDICT_TONE[other.verdict] ?? "neutral"}>{humanize(other.verdict)}</Chip>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <p className="border-t border-line px-5 py-4 text-[12.5px] text-ink-3">No other Room is planning to contact these people.</p>
          )}

          {result.notResolvable > 0 && (
            <p className="border-t border-line px-5 py-3 text-[11.5px] text-ink-3">
              {result.notResolvable.toLocaleString("en-US")} could not be resolved, so they are not in these counts.
            </p>
          )}
          <p className="border-t border-line px-5 py-3 text-[11.5px] text-ink-3">
            This check enforces nothing itself. Frequency caps and opt-outs live in the send pipeline.
          </p>
        </>
      ) : null}
    </section>
  );
}
