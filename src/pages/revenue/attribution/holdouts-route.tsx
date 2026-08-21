import { ContaminatedHoldoutState } from "@/pages/revenue/attribution/states/contaminated-holdout";
import { TheHoldoutsState } from "@/pages/revenue/attribution/states/the-holdouts";
import { HOLDOUT_STATE } from "@/pages/revenue/attribution/data";

/**
 * AT05/AT14 — both share /attribution/holdouts, branching on HOLDOUT_STATE.
 * "contaminated" is wired but unreachable with the default "clean" state,
 * same "not wired, no demo state currently triggers it" situation as every
 * prior rebuild's edge states.
 */
const HoldoutsRoute = () => {
  if (HOLDOUT_STATE === "contaminated") return <ContaminatedHoldoutState />;
  return <TheHoldoutsState />;
};

export default HoldoutsRoute;
