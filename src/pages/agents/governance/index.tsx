import { NothingToGovernState } from "@/pages/agents/governance/states/nothing-to-govern";
import { FirstEntryState } from "@/pages/agents/governance/states/first-entry";
import { TheLogState } from "@/pages/agents/governance/states/the-log";
import { GOVERNANCE_STATE } from "@/pages/agents/governance/data";

/**
 * GV01/02/03 — all share /governance, branching on GOVERNANCE_STATE.
 * "nothing" and "first" are wired but unreachable with the default "full"
 * state, same convention as every prior rebuild's empty/edge states.
 */
const Governance = () => {
  if (GOVERNANCE_STATE === "nothing") return <NothingToGovernState />;
  if (GOVERNANCE_STATE === "first") return <FirstEntryState />;
  return <TheLogState />;
};

export default Governance;
