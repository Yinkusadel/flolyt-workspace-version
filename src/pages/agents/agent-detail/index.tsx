import { BeforeReadingState } from "@/pages/agents/agent-detail/states/before-reading";
import { OverviewState } from "@/pages/agents/agent-detail/states/overview";
import { AGENT_DETAIL_STATE } from "@/pages/agents/agent-detail/data";

/**
 * AN01/02 — both share /agent-detail, branching on AGENT_DETAIL_STATE.
 * "nothing" is wired but unreachable with the default "full" state, same
 * convention as every prior rebuild's empty state. Only two states exist in
 * this section's own source (no "first" edge state, unlike other sections).
 */
const AgentDetail = () => {
  if (AGENT_DETAIL_STATE === "nothing") return <BeforeReadingState />;
  return <OverviewState />;
};

export default AgentDetail;
