import { IDENTITY_STATE } from "@/pages/data/identity/data";
import { NoIdentityRuleState } from "@/pages/data/identity/states/no-rule-yet";
import { FirstRuleState } from "@/pages/data/identity/states/first-rule";
import { WhoIsACustomerState } from "@/pages/data/identity/states/who-is-a-customer";

/**
 * ID01/02/03 — all share /identity, branching on IDENTITY_STATE. ID01/ID02
 * are wired but unreachable with the default "full" state, same "not
 * wired, no demo state currently triggers it" situation as every prior
 * rebuild's empty/first states.
 */
const Identity = () => {
  if (IDENTITY_STATE === "empty") return <NoIdentityRuleState />;
  if (IDENTITY_STATE === "first") return <FirstRuleState />;
  return <WhoIsACustomerState />;
};

export default Identity;
