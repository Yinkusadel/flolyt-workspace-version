import { useQuery } from "@tanstack/react-query";
import { getPricePlans, type GetPricePlansResponse } from "@/services/api/lifecycle/get-price-plans";

export const PRICE_PLANS_QUERY_KEY = ["lifecycle-price-plans"];

export const useGetPricePlans = () =>
  useQuery<GetPricePlansResponse, Error>({
    queryKey: PRICE_PLANS_QUERY_KEY,
    queryFn: getPricePlans,
  });
