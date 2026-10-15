import { EXPERIMENTS_STATE } from "@/oldpages/customers/experiments/data";
import { NothingToMeasureState } from "@/oldpages/customers/experiments/states/nothing-to-measure";
import { FirstResultState } from "@/oldpages/customers/experiments/states/first-result";
import { RunningNowState } from "@/oldpages/customers/experiments/states/running-now";

/**
 * XP01/02/03 — all share /experiments, branching on EXPERIMENTS_STATE
 * (nothing/first/full). XP01/XP02 are wired but unreachable with the
 * default "full" state, same "not wired, no demo state currently
 * triggers it" situation as every prior rebuild's empty/edge states.
 */
const Experiments = () => {
  if (EXPERIMENTS_STATE === "nothing") return <NothingToMeasureState />;
  if (EXPERIMENTS_STATE === "first") return <FirstResultState />;
  return <RunningNowState />;
};

export default Experiments;
