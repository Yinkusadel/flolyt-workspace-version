import { useState } from "react";
import { useSearchParams } from "react-router-dom";

import { AnOverdueReForecastModal } from "@/pages/revenue/forecast/modals/an-overdue-re-forecast-modal";
import { ByMarketState } from "@/pages/revenue/forecast/states/by-market";
import { ByStageState } from "@/pages/revenue/forecast/states/by-stage";
import { NextNinetyDaysState } from "@/pages/revenue/forecast/states/next-90-days";
import { NothingToForecastFromState } from "@/pages/revenue/forecast/states/nothing-to-forecast-from";
import { TheFirstForecastState } from "@/pages/revenue/forecast/states/the-first-forecast";
import { FORECAST_STATE } from "@/pages/revenue/forecast/data";

/**
 * FC01/FC02/FC03/FC05 (disk) — all share /forecast. "By market" and "By
 * stage" branch on the `?by=` query param (same query-param-tab shape
 * Benchmarks used for its own "Market vs market"/"Stage vs stage" pair),
 * independent of FORECAST_STATE — the empty/first-forecast edge states only
 * apply to the section's own landing tab ("Next 90 days").
 */
const Forecast = () => {
  const [searchParams] = useSearchParams();
  const by = searchParams.get("by");
  const [overdueOpen, setOverdueOpen] = useState(false);

  if (by === "stage") return <ByStageState />;
  if (by === "market") return <ByMarketState />;

  if (FORECAST_STATE === "empty") return <NothingToForecastFromState />;
  if (FORECAST_STATE === "first") return <TheFirstForecastState />;

  return (
    <>
      <NextNinetyDaysState onOpenOverdue={() => setOverdueOpen(true)} />
      <AnOverdueReForecastModal open={overdueOpen} onOpenChange={setOverdueOpen} />
    </>
  );
};

export default Forecast;
