import { useQuery } from "@tanstack/react-query";
import { getLeakageCalculation, type GetLeakageCalculationResponse } from "@/services/api/leakage/get-leakage-calculation";

export const LEAKAGE_CALCULATION_QUERY_KEY = ["leakage-calculation"];

export const useGetLeakageCalculation = (enabled = true) =>
  useQuery<GetLeakageCalculationResponse, Error>({
    queryKey: LEAKAGE_CALCULATION_QUERY_KEY,
    queryFn: () => getLeakageCalculation(),
    enabled,
  });
