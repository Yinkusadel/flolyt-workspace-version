import * as React from "react";
import { Link } from "react-router-dom";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Chip } from "@/pages/lifecycle/stage/chip";
import { StageSubpageHeader } from "@/pages/lifecycle/stage/stage-subpage-header";
import { ActorAvatar } from "@/pages/rooms/actor";
import { useRoomContext } from "@/pages/rooms/room/room-layout";
import { RejectPlayModal } from "@/pages/rooms/room/modals/reject-play-modal";
import type { PlayBoardRow } from "@/pages/rooms/room/types";
import { TONE_TEXT_CLASS } from "@/pages/rooms/tone";
import type { Tone } from "@/pages/rooms/types";

const HEAD_CLASS = "px-4 py-2.5 font-mono text-[8.5px] font-medium tracking-[0.8px] text-ink-4 uppercase";

const STATE_LEGEND: { label: string; tone: Tone; body: string }[] = [
  { label: "Pending", tone: "amber", body: "Waiting on one named person. Shows the audience, the effect, and what it costs to wait." },
  { label: "Editing", tone: "ultra", body: "Fields are live. Invalid values are caught before approval rather than at send." },
  { label: "Approved", tone: "teal", body: "Executed under the approver's identity. The tool signature and the re-auth are both in the log." },
  { label: "Approved with edits", tone: "teal", body: "What changed is stored next to what was proposed, so the original suggestion is not overwritten." },
  { label: "Rejected", tone: "rose", body: "Nothing was created. The reason is kept and cited the next time something similar is proposed." },
  { label: "Deferred", tone: "neutral", body: "Held with a named dissent attached, whether or not it turns out to be right." },
];

function toneOrMuted(tone: Tone | "ink" | undefined) {
  if (!tone || tone === "ink") return "text-ink-4";
  return TONE_TEXT_CLASS[tone];
}

/** R19 — Room · plays board (`/rooms/:id/plays`). */
export const PlaysBoardRoute = () => {
  const { room } = useRoomContext();
  const plays = room.playsBoard ?? [];
  const [rejectTarget, setRejectTarget] = React.useState<PlayBoardRow | null>(null);

  return (
    <div className="space-y-6">
      <StageSubpageHeader
        crumbs={[{ label: "Rooms", to: "/rooms" }, { label: room.title, to: `/rooms/${room.id}` }, { label: "Plays" }]}
        title="Plays"
        subtitle={`${plays.length} plays in this room · every state is recorded with a name`}
        action={<Button>Propose a play</Button>}
      />

      <div className="overflow-x-auto rounded-card border border-line bg-paper">
        <table className="w-full min-w-[900px] text-left text-[12.5px]">
          <thead>
            <tr className="border-b border-line bg-paper-2">
              <th className={HEAD_CLASS}>Play</th>
              <th className={HEAD_CLASS}>Reach</th>
              <th className={HEAD_CLASS}>Proposed by</th>
              <th className={HEAD_CLASS}>State</th>
              <th className={HEAD_CLASS}>Who decides</th>
              <th className={cn(HEAD_CLASS, "text-right")}>Waiting</th>
              <th className={cn(HEAD_CLASS, "text-right")}>Effect if approved</th>
            </tr>
          </thead>
          <tbody>
            {plays.map((play) => (
              <tr key={play.id} className="border-b border-line last:border-0 hover:bg-paper-2">
                <td className="px-4 py-3.5">
                  <Link to={`/rooms/${room.id}/plays/${play.id}`} className="font-semibold text-ultra hover:underline">
                    {play.title}
                  </Link>
                </td>
                <td className={cn("px-4 py-3.5 font-mono", toneOrMuted(play.reachTone))}>{play.reach}</td>
                <td className="px-4 py-3.5">
                  <ActorAvatar actor={play.proposedBy} size="sm" />
                </td>
                <td className="px-4 py-3.5">
                  <div className="flex items-center gap-2">
                    <Chip tone={play.stateTone}>{play.stateLabel}</Chip>
                    {play.stateLabel === "needs approval" && (
                      <button
                        type="button"
                        onClick={() => setRejectTarget(play)}
                        className="text-[10.5px] font-semibold text-ink-4 hover:text-rose"
                      >
                        Reject
                      </button>
                    )}
                  </div>
                </td>
                <td className="px-4 py-3.5">
                  <div className="flex items-center gap-1.5">
                    <ActorAvatar actor={{ kind: "human", person: play.whoDecides }} size="sm" />
                    <span className="text-ink-2">{play.whoDecides.name.split(" ")[0]}</span>
                  </div>
                </td>
                <td className={cn("px-4 py-3.5 text-right font-mono", toneOrMuted(play.waitingTone))}>{play.waiting}</td>
                <td className={cn("px-4 py-3.5 text-right font-mono", toneOrMuted(play.effectTone))}>{play.effect}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div>
        <p className="font-mono text-[9.5px] font-medium tracking-[1.05px] text-ink-4 uppercase">
          Every state a proposal can be in
        </p>
        <div className="mt-2 divide-y divide-line rounded-card border border-line bg-paper">
          {STATE_LEGEND.map((row) => (
            <div key={row.label} className="flex flex-wrap items-start gap-3 px-4 py-3 text-[12px]">
              <span className="w-40 shrink-0">
                <Chip tone={row.tone}>{row.label}</Chip>
              </span>
              <span className="text-ink-3">{row.body}</span>
            </div>
          ))}
        </div>
      </div>

      <div className="rounded-card border border-amber-border bg-amber-bg p-4">
        <div>
          <p className="text-[12px] font-semibold text-ink">A proposal is not a task</p>
          <p className="mt-1 text-[10.5px] leading-relaxed text-ink-2">
            It is a specific thing that will happen to specific customers, priced, dated and waiting on one named
            person. That is why there is no bulk approve anywhere in Flolyt, and why every state above records who
            and when rather than just what.
          </p>
        </div>
      </div>

      <RejectPlayModal
        playTitle={rejectTarget?.title ?? ""}
        playMeta={rejectTarget ? `Proposed by ${rejectTarget.proposedBy.kind === "agent" ? rejectTarget.proposedBy.agent.name : rejectTarget.proposedBy.person.name} · would reach ${rejectTarget.reach} people` : ""}
        open={rejectTarget !== null}
        onOpenChange={(open) => !open && setRejectTarget(null)}
      />
    </div>
  );
};
