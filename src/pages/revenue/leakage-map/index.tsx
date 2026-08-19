import { useSearchParams } from "react-router-dom";

import { LEAKAGE_MAP_STATE } from "@/pages/revenue/leakage-map/data";
import { ByClaimState } from "@/pages/revenue/leakage-map/states/by-claim";
import { ByMarketState } from "@/pages/revenue/leakage-map/states/by-market";
import { FirstLeakState } from "@/pages/revenue/leakage-map/states/first-leak";
import { MyStageState } from "@/pages/revenue/leakage-map/states/my-stage";
import { NothingMeasuredState } from "@/pages/revenue/leakage-map/states/nothing-measured";
import { SavedViewsState } from "@/pages/revenue/leakage-map/states/saved-views";
import { SearchState } from "@/pages/revenue/leakage-map/states/search";
import { TheMapState } from "@/pages/revenue/leakage-map/states/the-map";

/**
 * LK01/02/03/05/06/07/08/11 — all share /leakage-map, branching on query
 * params first (`by`, `view`, `q`, `as`), then on LEAKAGE_MAP_STATE. LK01/
 * LK02 are wired but unreachable with the default "full" state, same
 * "not wired, no demo state currently triggers it" situation as every prior
 * rebuild's empty/edge states.
 */
const LeakageMap = () => {
  const [searchParams] = useSearchParams();
  const by = searchParams.get("by");
  const view = searchParams.get("view");
  const q = searchParams.get("q");
  const as = searchParams.get("as");

  if (by === "market") return <ByMarketState />;
  if (by === "claim") return <ByClaimState />;
  if (as === "owner") return <MyStageState />;
  if (view !== null) return <SavedViewsState />;
  if (q !== null) return <SearchState query={q} />;

  if (LEAKAGE_MAP_STATE === "empty") return <NothingMeasuredState />;
  if (LEAKAGE_MAP_STATE === "first-finding") return <FirstLeakState />;
  return <TheMapState />;
};

export default LeakageMap;
