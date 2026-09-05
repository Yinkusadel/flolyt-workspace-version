import { useQuery } from "@tanstack/react-query";
import { getWatchableMetrics, type GetWatchableMetricsResponse } from "@/services/api/lifecycle/get-watchable-metrics";

export const WATCHABLE_METRICS_QUERY_KEY = ["lifecycle-watchable-metrics"];

export const useGetWatchableMetrics = () =>
  useQuery<GetWatchableMetricsResponse, Error>({
    queryKey: WATCHABLE_METRICS_QUERY_KEY,
    queryFn: getWatchableMetrics,
  });
