import { useQuery } from "@tanstack/react-query";
import { getLeakageCoverage, type GetLeakageCoverageResponse } from "@/services/api/leakage/get-leakage-coverage";

export const LEAKAGE_COVERAGE_QUERY_KEY = ["leakage-coverage"];

export const useGetLeakageCoverage = (enabled = true) =>
  useQuery<GetLeakageCoverageResponse, Error>({
    queryKey: LEAKAGE_COVERAGE_QUERY_KEY,
    queryFn: () => getLeakageCoverage(),
    enabled,
  });
