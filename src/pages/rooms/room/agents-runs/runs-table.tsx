import { cn } from "@/lib/utils";
import { formatDay } from "@/pages/rooms/convening/format";
import { StateChip } from "@/pages/rooms/room/agents-runs/roster";
import type { RoomRunDto } from "@/services/api/rooms/get-room-runs";

const HEAD = "px-4 py-2.5 font-mono text-[9px] font-medium tracking-[0.8px] text-ink-4 uppercase";

/** "10:02" for a run started today (UTC), "9 Oct 16:10" otherwise. */
const formatStarted = (iso: string) => {
  const date = new Date(iso);
  const time = date.toISOString().slice(11, 16);
  return date.toISOString().slice(0, 10) === new Date().toISOString().slice(0, 10) ? time : `${formatDay(iso)} ${time}`;
};

/**
 * The Room's runs, newest first as the backend sends them (Room · Agents & runs.png, Runs). A failed run is a row like any other:
 * never lifted out, never re-sorted, its cause named in the Result column. Not shown: an "Approve or reject" link on a run that
 * waits on a person (no route is documented for it) and a "Connect source" link on a failed one (no field carries it).
 * "Rows read" is always unavailable (`rowsReadAvailable` is false: nothing counts them), never a zero.
 */
export function RunsTable({
  runs,
  rowsReadAvailable,
  nameForUser,
  limited,
}: {
  runs: RoomRunDto[];
  rowsReadAvailable: boolean;
  /** A Room person's name for a user id, or null. */
  nameForUser: (userId: string) => string | null;
  limited: boolean;
}) {
  return (
    <section className="overflow-hidden rounded-card border border-line bg-paper">
      <header className="flex flex-wrap items-baseline justify-between gap-2 border-b border-line px-5 py-4">
        <h3 className="text-[15px] font-semibold text-ink">Runs</h3>
        <p className="text-[11.5px] text-ink-3">Newest first · failures stay in line</p>
      </header>
      {runs.length === 0 ? (
        <p className="px-5 py-6 text-[12.5px] text-ink-3">No agent has run on this Room yet.</p>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full min-w-[720px] border-collapse text-left">
            <thead className="bg-paper-2/60">
              <tr>
                <th className={HEAD}>Agent</th>
                <th className={HEAD}>State</th>
                <th className={HEAD}>Started</th>
                <th className={cn(HEAD, "text-right")}>Turns</th>
                <th className={HEAD}>Result</th>
                <th className={HEAD}>Rows read</th>
              </tr>
            </thead>
            <tbody>
              {runs.map((run) => {
                const failed = run.state === "failed";
                const cancelledBy = run.cancelledByUserId ? nameForUser(run.cancelledByUserId) : null;
                return (
                  <tr key={run.runId} className={cn("border-t border-line align-top text-[12.5px]", failed && "bg-rose-bg/40")}>
                    <td className="px-4 py-3 text-ink">{run.agentName ?? run.agentKey ?? "An agent"}</td>
                    <td className="px-4 py-3">
                      <StateChip state={run.state} />
                      {run.state === "awaiting-approval" && <p className="mt-1.5 max-w-[10rem] text-[11px] leading-snug text-ink-3">Waiting on a person, not a machine</p>}
                    </td>
                    <td className="px-4 py-3 font-mono text-[12px] text-ink">{formatStarted(run.startedAtUtc)}</td>
                    <td className="px-4 py-3 text-right font-mono text-ink">{run.turns}</td>
                    <td className="px-4 py-3 text-ink">
                      {failed && run.failedBecause ? (
                        <span>
                          <span className="font-semibold text-rose">{run.failedBecause}</span>
                        </span>
                      ) : run.state === "cancelled" ? (
                        <span>
                          {cancelledBy ? `By ${cancelledBy}` : "Cancelled"}
                          {run.cancelReason ? `: “${run.cancelReason}”` : ""}
                        </span>
                      ) : run.result ? (
                        run.result.charAt(0).toUpperCase() + run.result.slice(1)
                      ) : run.state === "running" ? (
                        <span className="text-ink-3 italic">In progress</span>
                      ) : (
                        <span className="text-ink-4">—</span>
                      )}
                    </td>
                    <td className="px-4 py-3 text-[12px] text-ink-3 italic">{rowsReadAvailable ? "—" : "Unavailable"}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
      <footer className="border-t border-line px-5 py-3 text-[11.5px] text-ink-3">
        {!rowsReadAvailable && "Nothing counts the rows an agent reads, so this column says unavailable rather than showing zero."}
        {limited && " Showing the latest runs only."}
      </footer>
    </section>
  );
}
