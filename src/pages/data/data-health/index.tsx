import { DATA_HEALTH_STATE } from "@/pages/data/data-health/data";
import { NothingToCheckState } from "@/pages/data/data-health/states/nothing-to-check";
import { FirstFailureState } from "@/pages/data/data-health/states/first-failure";
import { RightNowState } from "@/pages/data/data-health/states/right-now";

/**
 * DH01/02/03 — all share /data-health, branching on DATA_HEALTH_STATE.
 * DH01/DH02 are wired but unreachable with the default "full" state, same
 * "not wired, no demo state currently triggers it" situation as every prior
 * rebuild's empty/first states.
 */
const DataHealth = () => {
  if (DATA_HEALTH_STATE === "empty") return <NothingToCheckState />;
  if (DATA_HEALTH_STATE === "first") return <FirstFailureState />;
  return <RightNowState />;
};

export default DataHealth;
