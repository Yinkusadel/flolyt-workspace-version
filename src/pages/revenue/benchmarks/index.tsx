import { useSearchParams } from "react-router-dom";

import { MarketAgainstMarketState } from "@/pages/revenue/benchmarks/states/market-against-market";
import { NothingToCompareYetState } from "@/pages/revenue/benchmarks/states/nothing-to-compare-yet";
import { OurOwnPastState } from "@/pages/revenue/benchmarks/states/our-own-past";
import { StageAgainstStageState } from "@/pages/revenue/benchmarks/states/stage-against-stage";
import { TheFirstComparisonState } from "@/pages/revenue/benchmarks/states/the-first-comparison";
import { BENCHMARK_STATE } from "@/pages/revenue/benchmarks/data";

/**
 * BM01/BM02/BM03/BM04/BM05 (disk) — all share /benchmarks. "Market vs market"
 * and "Stage vs stage" branch on the `?by=` query param (same
 * query-param-tab shape as the digest rebuild), independent of
 * BENCHMARK_STATE — the empty/first-comparison edge states only apply to the
 * section's own landing tab ("Our own past"), same as every prior section's
 * empty/edge states being scoped to the index, not its sibling tabs.
 */
const Benchmarks = () => {
  const [searchParams] = useSearchParams();
  const by = searchParams.get("by");

  if (by === "market") return <MarketAgainstMarketState />;
  if (by === "stage") return <StageAgainstStageState />;

  if (BENCHMARK_STATE === "empty") return <NothingToCompareYetState />;
  if (BENCHMARK_STATE === "first") return <TheFirstComparisonState />;
  return <OurOwnPastState />;
};

export default Benchmarks;
