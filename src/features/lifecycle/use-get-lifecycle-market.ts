import { useQuery } from "@tanstack/react-query";
import { getLifecycleMarket, type GetLifecycleMarketResponse } from "@/services/api/lifecycle/get-lifecycle-market";

export const LIFECYCLE_MARKET_QUERY_KEY = (country: string) => ["lifecycle-market", country];

export const useGetLifecycleMarket = (country: string) =>
  useQuery<GetLifecycleMarketResponse, Error>({
    queryKey: LIFECYCLE_MARKET_QUERY_KEY(country),
    queryFn: () => getLifecycleMarket(country),
    enabled: !!country,
  });
