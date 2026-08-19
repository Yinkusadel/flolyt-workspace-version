import { Link } from "react-router-dom";

import { Button } from "@/components/ui/button";
import { Chip } from "@/pages/everyday/lifecycle/stage/chip";
import { ActorAvatar } from "@/pages/everyday/rooms/actor";
import type { RoomDetail } from "@/pages/everyday/rooms/room/types";

/** The rich header for the 3-pane workspace routes (decision/evidence/log/steering) — R15/R16/R18/R28. */
export function WorkspaceHeader({ room, subtitle }: { room: RoomDetail; subtitle?: string }) {
  return (
    <div className="flex flex-col gap-3 border-b border-line pb-4 sm:flex-row sm:items-center sm:justify-between">
      <div className="min-w-0">
        <h1 className="text-[16px] font-semibold text-ink">{room.title}</h1>
        <p className="mt-0.5 text-[11px] text-ink-3">{subtitle ?? room.subtitle}</p>
      </div>
      <div className="flex flex-wrap items-center gap-2.5">
        <Chip tone="ultra">{room.agentsChipCount} agents</Chip>
        <div className="flex -space-x-1.5">
          {room.humans.map((person) => (
            <ActorAvatar key={person.initials} actor={{ kind: "human", person }} size="sm" />
          ))}
        </div>
        <Chip tone="rose">{room.atRisk}</Chip>
        <Button asChild size="sm" className="shrink-0">
          <Link to={`/rooms/${room.id}/close`}>Close room</Link>
        </Button>
      </div>
    </div>
  );
}
