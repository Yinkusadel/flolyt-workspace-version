import { useSearchParams } from "react-router-dom";

import { FUNNEL_STATE } from "@/pages/revenue/funnel/data";
import { ByCohortState } from "@/pages/revenue/funnel/states/by-cohort";
import { ByMarketState } from "@/pages/revenue/funnel/states/by-market";
import { DegradedState } from "@/pages/revenue/funnel/states/degraded";
import { FirstStepState } from "@/pages/revenue/funnel/states/first-step-instrumented";
import { NotInstrumentedYetState } from "@/pages/revenue/funnel/states/not-instrumented-yet";
import { TheFunnelState } from "@/pages/revenue/funnel/states/the-funnel";

/**
 * FN01/02/03/06/07/13 — all share /funnel, branching on query params (`by`)
 * first, then on FUNNEL_STATE. FN01/FN02/FN13 (not-instrumented/first-step/
 * degraded) are wired but unreachable with the default "full" state, same
 * "not wired, no demo state currently triggers it" situation as every prior
 * rebuild's empty/edge states.
 */
const Funnel = () => {
  const [searchParams] = useSearchParams();
  const by = searchParams.get("by");

  if (by === "market") return <ByMarketState />;
  if (by === "cohort") return <ByCohortState />;

  if (FUNNEL_STATE === "not-instrumented") return <NotInstrumentedYetState />;
  if (FUNNEL_STATE === "first-step") return <FirstStepState />;
  if (FUNNEL_STATE === "degraded") return <DegradedState />;
  return <TheFunnelState />;
};

export default Funnel;
