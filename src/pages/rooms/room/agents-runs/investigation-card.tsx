import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Chip, type ChipTone } from "@/components/ui/chip";
import { Skeleton } from "@/components/ui/skeleton";
import { useGetRoomInvestigation } from "@/features/rooms/use-get-room-investigation";
import { formatDay, humanize } from "@/pages/rooms/convening/format";

const STATUS_TONE: Record<string, ChipTone> = { concluded: "teal", running: "ultra", paused: "amber", stopped: "amber" };

const time = (iso: string) => iso.slice(11, 16);

/** "13 Oct 13:44 - 13:47 UTC" (same day), "13 Oct 13:44 - 14 Oct 02:10 UTC" otherwise, or "Started 13 Oct 13:44 UTC" while it runs. */
function formatSpan(startedAt: string | null, endedAt: string | null) {
  if (!startedAt) return null;
  const start = `${formatDay(startedAt)} ${time(startedAt)}`;
  if (!endedAt) return `Started ${start} UTC`;
  const sameDay = startedAt.slice(0, 10) === endedAt.slice(0, 10);
  return `${start} – ${sameDay ? "" : `${formatDay(endedAt)} `}${time(endedAt)} UTC`;
}

const KIND_LABEL: Record<string, string> = { lead: "Lead", coordinate: "Coordinate", ask: "Ask" };

/**
 * The Room's investigation (Room · Agents & runs.png, Investigation), from `GET /rooms/{roomId}/investigation`: its status and one-line
 * state, the summary, how many of the turns were used, and the steps taken. Not shown: a pause control (`canPause` is sent but no
 * route is documented) and the design's note about a run "outside the budget" (nothing provides it). A Room with no lead agent answers
 * 404 with its own explanation, shown here as the card's text. A coordinate or ask step can have no end time after its run finished
 * (ticket #57), so a missing end time is only shown as "no end time", never as "still running".
 */
export function InvestigationCard({ roomId, nameForAgent }: { roomId: string; nameForAgent: (agentKey: string) => string | null }) {
  const query = useGetRoomInvestigation(roomId);

  if (query.isPending) {
    return (
      <section className="rounded-card border border-line bg-paper p-5" aria-busy="true" aria-label="Loading the investigation">
        <Skeleton className="h-5 w-40" />
        <Skeleton className="mt-4 h-20 w-full rounded-card" />
        <Skeleton className="mt-4 h-28 w-full rounded-card" />
      </section>
    );
  }
  if (query.isError) {
    return (
      <section className="rounded-card border border-line bg-paper p-5">
        <h3 className="text-[15px] font-semibold text-ink">Investigation</h3>
        <p className="mt-2 text-[12.5px] leading-relaxed text-ink-3">{query.error.message || "The investigation couldn't be loaded."}</p>
        <Button type="button" variant="outline" size="sm" className="mt-3" onClick={() => query.refetch()}>
          Retry
        </Button>
      </section>
    );
  }

  const data = query.data.data;
  const span = formatSpan(data.startedAtUtc, data.endedAtUtc);
  // Who asked: the roster's name, else the label the investigation's own steps carry for that agent (e.g. "Flolyt").
  const labelByKey = new Map(data.steps.filter((step) => step.agentKey && step.agentLabel).map((step) => [step.agentKey as string, step.agentLabel as string]));
  const used = Math.max(0, Math.min(data.turnsUsed, data.turnBudget));
  const percent = data.turnBudget > 0 ? (used / data.turnBudget) * 100 : 0;

  return (
    <section className="overflow-hidden rounded-card border border-line bg-paper">
      <header className="flex items-center justify-between gap-3 border-b border-line px-5 py-4">
        <h3 className="text-[15px] font-semibold text-ink">Investigation</h3>
        <Chip tone={STATUS_TONE[data.status] ?? "neutral"}>{humanize(data.status)}</Chip>
      </header>

      <div className="space-y-4 px-5 py-4">
        {data.now && <p className="text-[12.5px] font-medium text-ink">{data.now}</p>}
        {data.summary && <p className="text-[12.5px] leading-relaxed text-ink-2">{data.summary}</p>}
        {data.stoppedBecause && <p className="text-[12.5px] text-amber">Stopped: {data.stoppedBecause}</p>}

        <div>
          <div className="flex items-baseline justify-between text-[12.5px]">
            <span className="text-ink-2">Turns</span>
            <span className="font-mono font-semibold text-ink">
              {data.turnsUsed} <span className="font-normal text-ink-3">/ {data.turnBudget}</span>
            </span>
          </div>
          <div className="mt-1.5 h-1.5 overflow-hidden rounded-full bg-paper-2" role="progressbar" aria-valuemin={0} aria-valuemax={data.turnBudget} aria-valuenow={used}>
            <div className="h-full rounded-full bg-ultra" style={{ width: `${percent}%` }} />
          </div>
          {span && <p className="mt-2 text-[11.5px] text-ink-3">{span}</p>}
        </div>
      </div>

      {data.steps.length > 0 && (
        <ol className="divide-y divide-line border-t border-line">
          {data.steps.map((step) => {
            const asker = step.askedByAgentKey ? (nameForAgent(step.askedByAgentKey) ?? labelByKey.get(step.askedByAgentKey) ?? "an agent") : null;
            return (
              <li key={`${step.runId}-${step.kind}`} className="flex gap-3 px-5 py-3.5">
                <span className={cn("mt-1.5 size-2 shrink-0 rounded-full", step.outcome === "failed" ? "bg-rose" : step.endedAtUtc ? "bg-ink-4" : "bg-ink-4/40")} />
                <div className="min-w-0 flex-1">
                  <p className="text-[12.5px] text-ink">
                    <span className="font-semibold">{KIND_LABEL[step.kind] ?? humanize(step.kind)}</span>
                    {step.agentLabel && <span> · {step.agentLabel}</span>}
                  </p>
                  {step.question && (
                    <p className="mt-0.5 line-clamp-3 text-[11.5px] leading-snug text-ink-3">
                      {asker ? `${asker} asked: ` : ""}
                      {step.question}
                    </p>
                  )}
                  {step.outcome && <p className="mt-0.5 text-[11.5px] text-ink-3">Outcome: {humanize(step.outcome)}</p>}
                  {step.tool && <p className="mt-0.5 font-mono text-[11px] text-ink-3">{step.tool}</p>}
                  {!step.endedAtUtc && !step.outcome && <p className="mt-0.5 text-[11px] text-ink-4 italic">No end time recorded</p>}
                </div>
              </li>
            );
          })}
        </ol>
      )}
    </section>
  );
}
