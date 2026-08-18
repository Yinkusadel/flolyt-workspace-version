import { Link } from "react-router-dom";

import { Button } from "@/components/ui/button";
import type { RoomDetail } from "@/pages/rooms/room/types";

/** R31 — a restricted room's access-gate page. */
export function RestrictedRoom({ room }: { room: RoomDetail }) {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-[17px] font-semibold text-ink">{room.title}</h1>
        <p className="mt-1 text-[11.5px] text-ink-3">{room.subtitle}</p>
      </div>

      <div className="rounded-card border border-amber-border bg-paper p-8 text-center">
        <div className="mx-auto h-1 w-10 rounded-full bg-amber" />
        <h2 className="mt-4 text-[16px] font-semibold text-ink">This room exists. You cannot see inside it.</h2>
        <p className="mx-auto mt-2 max-w-lg text-[11.5px] leading-relaxed text-ink-3">
          It is a Finance room, restricted when it was created. Restricted rooms are listed rather than hidden — a
          room you cannot find is indistinguishable from one that does not exist, and that is worse.
        </p>
        <div className="mt-5 flex flex-wrap items-center justify-center gap-3">
          <Button>Ask {room.restrictedBy?.name.split(" ")[0]} for access</Button>
          <Button asChild variant="outline">
            <Link to="/rooms">Back to rooms</Link>
          </Button>
        </div>
        <p className="mt-4 text-[10px] text-ink-4">
          Requests are answered in a median of 40 minutes · 31 of 34 were granted this quarter
        </p>
      </div>

      <div>
        <p className="font-mono text-[9.5px] font-medium tracking-[1.05px] text-ink-4 uppercase">
          What you can see about it, and why
        </p>
        <div className="mt-2 divide-y divide-line rounded-card border border-line bg-paper">
          {[
            { label: "It exists", value: "so a link pasted into Slack does not look broken" },
            { label: "Its name", value: `"${room.title}" · restricted rooms still carry a real name` },
            { label: "Who restricted it", value: `${room.restrictedBy?.name} · Finance · at creation` },
            { label: "Why", value: room.restrictedReason ?? "" },
            { label: "How many people are inside", value: "6" },
            { label: "What you cannot see", value: "the thread, the evidence, the decision, the cohort, the plays" },
            { label: "Whether your request is visible to them", value: "yes · with your name and the reason you give" },
          ].map((row) => (
            <div key={row.label} className="flex flex-wrap items-center justify-between gap-3 px-4 py-3 text-[12px]">
              <span className="text-ink-2">{row.label}</span>
              <span className="text-right font-mono text-ink-3">{row.value}</span>
            </div>
          ))}
        </div>
      </div>

      <div className="rounded-card border border-amber-border bg-amber-bg p-4">
        <div>
          <p className="text-[12px] font-semibold text-ink">The four permitted reasons, and no others</p>
          <p className="mt-1 text-[10.5px] leading-relaxed text-ink-2">
            Pricing before announcement, an individual's employment, an active legal matter, and an acquisition.
            Restriction is not available as a convenience — a room anyone can hide for any reason is how a shared
            workspace quietly becomes several private ones.
          </p>
        </div>
      </div>
    </div>
  );
}
