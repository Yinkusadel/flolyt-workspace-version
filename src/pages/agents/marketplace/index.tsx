import { NothingInstalledState } from "@/pages/agents/marketplace/states/nothing-installed";
import { FirstInstallState } from "@/pages/agents/marketplace/states/first-install";
import { AvailableState } from "@/pages/agents/marketplace/states/available";
import { MARKETPLACE_STATE } from "@/pages/agents/marketplace/data";

/**
 * MK01/02/03 — all share /marketplace, branching on MARKETPLACE_STATE.
 * "nothing" and "first" are wired but unreachable with the default "full"
 * state, same "not wired, no demo state currently triggers it" situation as
 * every prior rebuild's empty/edge states.
 */
const Marketplace = () => {
  if (MARKETPLACE_STATE === "nothing") return <NothingInstalledState />;
  if (MARKETPLACE_STATE === "first") return <FirstInstallState />;
  return <AvailableState />;
};

export default Marketplace;
