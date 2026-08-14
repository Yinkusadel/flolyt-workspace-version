import * as React from "react";
import { Link, NavLink } from "react-router-dom";

import { cn } from "@/lib/utils";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { PauseAgentModal } from "@/pages/ai-teammates/pause-agent-modal";
import { ActorAvatar, AgentDot } from "@/pages/rooms/actor";
import type { AgentRef, ChipTone, HeaderChip, PersonRef, RoomDetail } from "@/pages/rooms/types";

const CHIP_TONE_CLASS: Record<ChipTone, string> = {
  warn: "border-amber-border bg-amber-bg text-amber",
  risk: "border-rose-border bg-rose-bg text-rose",
  neutral: "border-line bg-paper-2 text-ink-3",
  ok: "border-teal-border bg-teal-bg text-teal",
};

function Chip({ chip }: { chip: HeaderChip }) {
  return (
    <span
      className={cn(
        "inline-flex shrink-0 items-center rounded-chip border px-2 py-0.5 text-[10.5px] font-semibold whitespace-nowrap",
        CHIP_TONE_CLASS[chip.tone]
      )}
    >
      {chip.label}
    </span>
  );
}

function AgentsPopover({ agents, roomTitle, roomAmount }: { agents: AgentRef[]; roomTitle: string; roomAmount?: string }) {
  const [open, setOpen] = React.useState(false);
  // Radix's Dialog (via @radix-ui/react-presence) needs to mount already
  // closed and transition `open` afterward — mounting it fresh already-open
  // races Presence's ref timing under preact/compat and throws. So the
  // modal stays mounted at all times; only `pauseOpen` toggles.
  const [pauseAgent, setPauseAgent] = React.useState<AgentRef>(agents[0]);
  const [pauseOpen, setPauseOpen] = React.useState(false);

  const openPauseFor = (agent: AgentRef) => {
    setOpen(false);
    setPauseAgent(agent);
    setPauseOpen(true);
  };

  return (
    <>
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <button
            type="button"
            className="inline-flex shrink-0 items-center rounded-chip border border-dashed border-ultra-border px-2 py-0.5 font-mono text-[9.5px] font-semibold tracking-[0.6px] text-ultra uppercase hover:bg-ultra-bg"
          >
            {agents.length} {agents.length === 1 ? "agent" : "agents"}
          </button>
        </PopoverTrigger>
        <PopoverContent>
          <p className="border-b border-line px-3.5 py-2.5 text-[11px] font-semibold text-ink-2">
            Agents in this room
          </p>
          <div className="divide-y divide-line">
            {agents.map((agent) => (
              <div key={agent.initials} className="flex items-center gap-2.5 px-3.5 py-2.5">
                <AgentDot agent={agent} size="sm" />
                <span className="min-w-0 flex-1 truncate text-[11.5px] font-medium text-ink-2">{agent.name}</span>
                <button
                  type="button"
                  onClick={() => openPauseFor(agent)}
                  className="shrink-0 text-[11px] font-semibold text-ink-4 hover:text-rose"
                >
                  Pause
                </button>
              </div>
            ))}
          </div>
        </PopoverContent>
      </Popover>

      <PauseAgentModal
        agent={pauseAgent}
        context={
          roomAmount
            ? { openRooms: 1, evidenceRooms: 12, dismissals: 3, highlightRoom: { title: roomTitle, amount: roomAmount } }
            : undefined
        }
        open={pauseOpen}
        onOpenChange={setPauseOpen}
      />
    </>
  );
}

const TAB_CLASS = ({ isActive }: { isActive: boolean }) =>
  cn(
    "flex items-center gap-1.5 border-b-2 px-1 py-2.5 text-[12.5px] whitespace-nowrap",
    isActive ? "border-ink font-semibold text-ink" : "border-transparent font-normal text-ink-3 hover:text-ink-2"
  );

export function RoomHeader({ room }: { room: RoomDetail }) {
  const humans: PersonRef[] = room.humans;

  return (
    <div className="border-b border-line bg-paper">
      <div className="flex flex-wrap items-center gap-x-2.5 gap-y-2 px-4 py-3">
        <Link to="/rooms" className="text-[12px] text-ink-4 hover:text-ink-3">
          Rooms /
        </Link>
        <h1 className="text-[15px] font-semibold text-ink">{room.title}</h1>
        {room.chips.map((chip) => (
          <Chip key={chip.label} chip={chip} />
        ))}
        <div className="ml-auto flex shrink-0 items-center gap-2.5">
          <AgentsPopover
            agents={room.agents}
            roomTitle={room.title}
            roomAmount={room.decisionDoc?.impact.find((s) => s.tone === "rose")?.value}
          />
          <div className="flex -space-x-1.5">
            {humans.map((person) => (
              <ActorAvatar key={person.initials} actor={{ kind: "human", person }} size="sm" />
            ))}
          </div>
        </div>
      </div>

      <nav className="flex items-center gap-6 overflow-x-auto px-4">
        <NavLink to={`/rooms/${room.id}`} end className={TAB_CLASS}>
          Decision
        </NavLink>
        <NavLink to={`/rooms/${room.id}/evidence`} className={TAB_CLASS}>
          Evidence
          <span className="font-mono text-[10px] text-ink-4">{room.counts.evidence}</span>
        </NavLink>
        <NavLink to={`/rooms/${room.id}/plays`} className={TAB_CLASS}>
          Plays
          <span className="font-mono text-[10px] text-ink-4">{room.counts.plays}</span>
        </NavLink>
        <NavLink to={`/rooms/${room.id}/log`} className={TAB_CLASS}>
          Log
          <span className="font-mono text-[10px] text-ink-4">{room.counts.log}</span>
        </NavLink>
      </nav>
    </div>
  );
}
