import { NothingBuiltState } from "@/pages/agents/agent-builder/states/nothing-built";
import { FirstBuiltState } from "@/pages/agents/agent-builder/states/first-built";
import { BuiltHereState } from "@/pages/agents/agent-builder/states/built-here";
import { AGENT_BUILDER_STATE } from "@/pages/agents/agent-builder/data";

/**
 * AB01/02/03 — all share /agent-builder, branching on AGENT_BUILDER_STATE.
 * "nothing" and "first" are wired but unreachable with the default "full"
 * state, same convention as every prior rebuild's empty/edge states.
 */
const AgentBuilder = () => {
  if (AGENT_BUILDER_STATE === "nothing") return <NothingBuiltState />;
  if (AGENT_BUILDER_STATE === "first") return <FirstBuiltState />;
  return <BuiltHereState />;
};

export default AgentBuilder;
