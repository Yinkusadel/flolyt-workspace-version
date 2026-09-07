import { useQuery } from "@tanstack/react-query";
import {
  getAcquireUnitEconomics,
  type GetAcquireUnitEconomicsResponse,
} from "@/services/api/lifecycle/get-acquire-unit-economics";

export const ACQUIRE_UNIT_ECONOMICS_QUERY_KEY = ["lifecycle-acquire-unit-economics"];

export const useGetAcquireUnitEconomics = () =>
  useQuery<GetAcquireUnitEconomicsResponse, Error>({
    queryKey: ACQUIRE_UNIT_ECONOMICS_QUERY_KEY,
    queryFn: getAcquireUnitEconomics,
  });
