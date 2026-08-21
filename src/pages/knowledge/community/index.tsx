import { COMMUNITY_STATE } from "@/pages/knowledge/community/data";
import { NotConnectedState } from "@/pages/knowledge/community/states/not-connected";
import { FirstShareState } from "@/pages/knowledge/community/states/first-share";
import { MethodsState } from "@/pages/knowledge/community/states/methods";

/**
 * CM01/02/03 — all share /community, branching on COMMUNITY_STATE
 * (not-connected/first/full). CM01/CM02 are wired but unreachable with the
 * default "full" state, same "not wired, no demo state currently triggers
 * it" situation as every prior rebuild's empty/edge states.
 */
const Community = () => {
  if (COMMUNITY_STATE === "not-connected") return <NotConnectedState />;
  if (COMMUNITY_STATE === "first") return <FirstShareState />;
  return <MethodsState />;
};

export default Community;
