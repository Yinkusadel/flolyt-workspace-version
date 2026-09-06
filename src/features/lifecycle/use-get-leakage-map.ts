import { useQuery } from "@tanstack/react-query";
import { getLeakageMap, type GetLeakageMapResponse } from "@/services/api/lifecycle/get-leakage-map";

export const LEAKAGE_MAP_QUERY_KEY = ["lifecycle-leakage-map"];

export const useGetLeakageMap = () =>
  useQuery<GetLeakageMapResponse, Error>({
    queryKey: LEAKAGE_MAP_QUERY_KEY,
    queryFn: getLeakageMap,
  });
