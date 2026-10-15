import { useQuery } from "@tanstack/react-query";
import {
  getLeakageCutoverReadiness,
  type GetLeakageCutoverReadinessResponse,
} from "@/services/api/leakage/get-leakage-cutover-readiness";

export const LEAKAGE_CUTOVER_READINESS_QUERY_KEY = ["leakage-cutover-readiness"];

export const useGetLeakageCutoverReadiness = (enabled = true) =>
  useQuery<GetLeakageCutoverReadinessResponse, Error>({
    queryKey: LEAKAGE_CUTOVER_READINESS_QUERY_KEY,
    queryFn: () => getLeakageCutoverReadiness(),
    enabled,
  });
