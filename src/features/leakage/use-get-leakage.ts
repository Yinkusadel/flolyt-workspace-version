import { useQuery } from "@tanstack/react-query";
import { getLeakage, type GetLeakageParams, type GetLeakageResponse } from "@/services/api/leakage/get-leakage";

export const LEAKAGE_QUERY_KEY = (params?: GetLeakageParams) => ["leakage", params];

export const useGetLeakage = (params?: GetLeakageParams) =>
  useQuery<GetLeakageResponse, Error>({
    queryKey: LEAKAGE_QUERY_KEY(params),
    queryFn: () => getLeakage(params),
  });
