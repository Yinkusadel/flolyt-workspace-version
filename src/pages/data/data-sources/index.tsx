import { DATA_SOURCES_STATE } from "@/pages/data/data-sources/data";
import { NothingConnectedState } from "@/pages/data/data-sources/states/nothing-connected";
import { FirstSourceState } from "@/pages/data/data-sources/states/first-source";
import { AllConnectedState } from "@/pages/data/data-sources/states/all-connected";

/**
 * DS01/02/03 — all share /data-sources, branching on DATA_SOURCES_STATE.
 * DS01/DS02 are wired but unreachable with the default "full" state, same
 * "not wired, no demo state currently triggers it" situation as every prior
 * rebuild's empty/first states.
 */
const DataSources = () => {
  if (DATA_SOURCES_STATE === "empty") return <NothingConnectedState />;
  if (DATA_SOURCES_STATE === "first") return <FirstSourceState />;
  return <AllConnectedState />;
};

export default DataSources;
