import { useSearchParams } from "react-router-dom";

import { HEALTH_STATE } from "@/pages/customers/customer-health/data";
import { AllSignalsState } from "@/pages/customers/customer-health/states/all-signals";
import { ByCohortState } from "@/pages/customers/customer-health/states/by-cohort";
import { FirstSignalState } from "@/pages/customers/customer-health/states/first-signal";
import { NothingToReadYetState } from "@/pages/customers/customer-health/states/nothing-to-read-yet";

/**
 * HL01/02/03/05 — all share /customer-health. `by=cohort` is checked first
 * (HL05, the "By cohort" tab), then HEALTH_STATE branches the Signals tab
 * between nothing-yet/first-signal/full. HL01/HL02 are wired but
 * unreachable with the default "full" state, same "not wired, no demo
 * state currently triggers it" situation as every prior rebuild's
 * empty/edge states.
 */
const CustomerHealth = () => {
  const [searchParams] = useSearchParams();
  const by = searchParams.get("by");

  if (by === "cohort") return <ByCohortState />;

  if (HEALTH_STATE === "nothing") return <NothingToReadYetState />;
  if (HEALTH_STATE === "first") return <FirstSignalState />;
  return <AllSignalsState />;
};

export default CustomerHealth;
