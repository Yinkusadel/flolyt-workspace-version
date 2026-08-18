import { cn } from "@/lib/utils";
import { Chip } from "@/pages/lifecycle/stage/chip";
import { StageSubpageHeader } from "@/pages/lifecycle/stage/stage-subpage-header";
import { ActorAvatar } from "@/pages/rooms/actor";
import { useRoomContext } from "@/pages/rooms/room/room-layout";
import { TONE_TEXT_CLASS } from "@/pages/rooms/tone";
import type { Tone } from "@/pages/rooms/types";

const HEAD_CLASS = "px-4 py-2.5 font-mono text-[8.5px] font-medium tracking-[0.8px] text-ink-4 uppercase";

const RUN_STATE_LEGEND: { label: string; tone: Tone; body: string }[] = [
  { label: "Idle", tone: "neutral", body: "Nothing queued. The agent is watching thresholds but not reading." },
  { label: "Queued", tone: "amber", body: "Waiting on another run or a source. Shows what it is waiting for, not just that it is waiting." },
  { label: "Running", tone: "ultra", body: "Reading and writing. Every tool call appears in the thread as it happens, greyed and unobtrusive." },
  { label: "Stopping", tone: "amber", body: "You cancelled it. It finishes the current tool call rather than abandoning a half-read table." },
  { label: "Cancelled", tone: "neutral", body: "Stopped by a person. Partial work is kept and marked partial — nothing is thrown away." },
  { label: "Failed", tone: "rose", body: "Stopped by an error. Names the cause rather than showing a generic failure." },
  { label: "Done", tone: "teal", body: "Finished. Whatever it produced is in the thread, the doc or the evidence tab, attributed and dated." },
];

/** R27 — Room · runs and states (`/rooms/:id/runs`). */
export const RunsRoute = () => {
  const { room } = useRoomContext();
  const runs = room.runs ?? [];

  return (
    <div className="space-y-6">
      <StageSubpageHeader
        crumbs={[{ label: "Rooms", to: "/rooms" }, { label: room.title, to: `/rooms/${room.id}` }, { label: "Runs" }]}
        title="Runs"
        subtitle={`${runs.length} runs · one running, one queued, one cancelled, one failed for a nameable reason`}
      />

      <div className="overflow-x-auto rounded-card border border-line bg-paper">
        <table className="w-full min-w-[820px] text-left text-[12px]">
          <thead>
            <tr className="border-b border-line bg-paper-2">
              <th className={HEAD_CLASS}>Run</th>
              <th className={HEAD_CLASS}>Agent</th>
              <th className={HEAD_CLASS}>Started</th>
              <th className={HEAD_CLASS}>Turns</th>
              <th className={HEAD_CLASS}>Rows read</th>
              <th className={HEAD_CLASS}>State</th>
              <th className={cn(HEAD_CLASS, "text-right")}>Result</th>
            </tr>
          </thead>
          <tbody>
            {runs.map((run) => (
              <tr key={run.id} className="border-b border-line last:border-0">
                <td className="px-4 py-3 font-mono text-ink-3">{run.id}</td>
                <td className="px-4 py-3">
                  <div className="flex items-center gap-1.5">
                    <ActorAvatar actor={{ kind: "agent", agent: run.agent }} size="sm" />
                    <span className="text-ink-2">{run.agent.name}</span>
                  </div>
                </td>
                <td className="px-4 py-3 font-mono text-ink-4">{run.started}</td>
                <td className="px-4 py-3 font-mono text-ink">{run.turns}</td>
                <td className={cn("px-4 py-3 font-mono", run.rowsReadTone ? TONE_TEXT_CLASS[run.rowsReadTone] : "text-ink")}>
                  {run.rowsRead}
                </td>
                <td className="px-4 py-3">
                  <Chip tone={run.state.tone}>{run.state.label}</Chip>
                </td>
                <td className={cn("px-4 py-3 text-right", run.resultTone === "ink" ? "text-ink-4" : TONE_TEXT_CLASS[run.resultTone])}>
                  {run.result}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div>
        <p className="font-mono text-[9.5px] font-medium tracking-[1.05px] text-ink-4 uppercase">
          Every state a run can be in
        </p>
        <div className="mt-2 divide-y divide-line rounded-card border border-line bg-paper">
          {RUN_STATE_LEGEND.map((row) => (
            <div key={row.label} className="flex flex-wrap items-start gap-3 px-4 py-3 text-[12px]">
              <span className="w-24 shrink-0">
                <Chip tone={row.tone}>{row.label}</Chip>
              </span>
              <span className="text-ink-3">{row.body}</span>
            </div>
          ))}
        </div>
      </div>

      <div className="rounded-card border border-amber-border bg-amber-bg p-4">
        <div>
          <p className="text-[12px] font-semibold text-ink">A failed run is not hidden and it is not a red banner either</p>
          <p className="mt-1 text-[10.5px] leading-relaxed text-ink-2">
            A real, nameable, fixable reason sits in the list at the same weight as everything else. The room keeps
            working; one agent is simply blind.
          </p>
        </div>
      </div>
    </div>
  );
};
