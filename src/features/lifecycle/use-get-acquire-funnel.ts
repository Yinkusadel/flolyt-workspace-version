import { useQuery } from "@tanstack/react-query";
import { getAcquireFunnel, type GetAcquireFunnelResponse } from "@/services/api/lifecycle/get-acquire-funnel";

export const ACQUIRE_FUNNEL_QUERY_KEY = ["lifecycle-acquire-funnel"];

export const useGetAcquireFunnel = () =>
  useQuery<GetAcquireFunnelResponse, Error>({
    queryKey: ACQUIRE_FUNNEL_QUERY_KEY,
    queryFn: getAcquireFunnel,
  });
