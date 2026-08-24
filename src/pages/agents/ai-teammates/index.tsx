import { NobodyReadingState } from "@/pages/agents/ai-teammates/states/nobody-reading";
import { FirstAgentState } from "@/pages/agents/ai-teammates/states/first-agent";
import { TheRosterState } from "@/pages/agents/ai-teammates/states/the-roster";
import { TEAMMATES_STATE } from "@/pages/agents/ai-teammates/data";

/**
 * TM01/02/03 — all share /ai-teammates, branching on TEAMMATES_STATE.
 * "nothing" and "first" are wired but unreachable with the default "full"
 * state, same "not wired, no demo state currently triggers it" situation as
 * every prior rebuild's empty/edge states.
 */
const AiTeammates = () => {
  if (TEAMMATES_STATE === "nothing") return <NobodyReadingState />;
  if (TEAMMATES_STATE === "first") return <FirstAgentState />;
  return <TheRosterState />;
};

export default AiTeammates;
