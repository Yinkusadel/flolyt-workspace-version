import * as React from "react";

import { Button } from "@/components/ui/button";
import { AI_TEAMMATES, type TeammateAgent } from "@/pages/ai-teammates/data";
import { PauseAgentModal } from "@/pages/ai-teammates/pause-agent-modal";
import { AgentDot } from "@/pages/rooms/actor";

/**
 * Screen 66 (AI teammates directory) in flolyt-kit-122 isn't built yet —
 * this is a minimal stub that exists to host the Pause-an-agent modal
 * (screen 121) so it has a home outside of a room. See
 * flolyt-kit-122/121-pause-an-agent.svg and docs/build-tracker.md.
 */
const AiTeammates = () => {
  // Radix's Dialog (via @radix-ui/react-presence) needs to mount already
  // closed and transition `open` afterward — mounting it fresh with
  // open=true (e.g. gating the whole component behind `pausing &&`) races
  // Presence's ref timing under preact/compat and throws. So the modal
  // stays mounted at all times; only `pauseOpen` toggles.
  const [selectedAgent, setSelectedAgent] = React.useState<TeammateAgent>(AI_TEAMMATES[0]);
  const [pauseOpen, setPauseOpen] = React.useState(false);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-[17px] font-semibold text-ink">AI teammates</h1>
        <p className="mt-1 text-[11.5px] text-ink-3">
          Every agent working across your rooms, what it watches and what pausing it does and does not stop
        </p>
      </div>

      <div className="divide-y divide-line overflow-hidden rounded-card border border-line bg-paper">
        {AI_TEAMMATES.map((agent) => (
          <div key={agent.initials} className="flex items-center gap-3 px-4 py-3.5">
            <AgentDot agent={agent} />
            <div className="min-w-0 flex-1">
              <p className="text-[12.5px] font-semibold text-ink">{agent.name}</p>
              <p className="mt-0.5 truncate text-[11px] text-ink-3">{agent.role}</p>
            </div>
            <span className="hidden shrink-0 font-mono text-[10px] text-ink-4 sm:block">
              {agent.openRooms} open · {agent.evidenceRooms} evidence
            </span>
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => {
                setSelectedAgent(agent);
                setPauseOpen(true);
              }}
            >
              Pause
            </Button>
          </div>
        ))}
      </div>

      <PauseAgentModal
        agent={selectedAgent}
        context={{
          openRooms: selectedAgent.openRooms,
          evidenceRooms: selectedAgent.evidenceRooms,
          dismissals: selectedAgent.dismissals,
        }}
        open={pauseOpen}
        onOpenChange={setPauseOpen}
      />
    </div>
  );
};

export default AiTeammates;
