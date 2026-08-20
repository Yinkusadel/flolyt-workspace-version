import { NoScenariosYetState } from "@/pages/revenue/scenario/states/no-scenarios-yet";
import { SavedScenariosState } from "@/pages/revenue/scenario/states/saved-scenarios";
import { TheFirstScenarioState } from "@/pages/revenue/scenario/states/the-first-scenario";
import { SCENARIO_STATE } from "@/pages/revenue/scenario/data";

/**
 * SC01/02/03 — all share /scenario, branching on SCENARIO_STATE. "empty" and
 * "first" are wired but unreachable with the default "full" state, same
 * "not wired, no demo state currently triggers it" situation as every prior
 * rebuild's empty/edge states.
 */
const Scenario = () => {
  if (SCENARIO_STATE === "empty") return <NoScenariosYetState />;
  if (SCENARIO_STATE === "first") return <TheFirstScenarioState />;
  return <SavedScenariosState />;
};

export default Scenario;
