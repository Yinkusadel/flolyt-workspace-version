import { FirstHoldoutClosesState } from "@/pages/revenue/attribution/states/first-holdout-closes";
import { NothingAttributedYetState } from "@/pages/revenue/attribution/states/nothing-attributed-yet";
import { TheBoardState } from "@/pages/revenue/attribution/states/the-board";
import { ATTRIBUTION_STATE } from "@/pages/revenue/attribution/data";

/**
 * AT01/02/03 — all share /attribution, branching on ATTRIBUTION_STATE.
 * "empty" and "first" are wired but unreachable with the default "full"
 * state, same "not wired, no demo state currently triggers it" situation as
 * every prior rebuild's empty/edge states.
 */
const Attribution = () => {
  if (ATTRIBUTION_STATE === "empty") return <NothingAttributedYetState />;
  if (ATTRIBUTION_STATE === "first") return <FirstHoldoutClosesState />;
  return <TheBoardState />;
};

export default Attribution;
