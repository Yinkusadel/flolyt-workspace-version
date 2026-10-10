import { useQuery } from "@tanstack/react-query";
import {
  getThreatOperatorMetrics,
  type GetThreatOperatorMetricsParams,
  type GetThreatOperatorMetricsResponse,
} from "@/services/api/rooms/get-threat-operator-metrics";

export const GET_THREAT_OPERATOR_METRICS_QUERY_KEY = (params?: GetThreatOperatorMetricsParams) => ["threat-operator-metrics", params];

export const useGetThreatOperatorMetrics = (params?: GetThreatOperatorMetricsParams) =>
  useQuery<GetThreatOperatorMetricsResponse, Error>({
    queryKey: GET_THREAT_OPERATOR_METRICS_QUERY_KEY(params),
    queryFn: () => getThreatOperatorMetrics(params),
  });
