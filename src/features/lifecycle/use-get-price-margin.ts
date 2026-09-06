import { useQuery } from "@tanstack/react-query";
import { getPriceMargin, type GetPriceMarginResponse } from "@/services/api/lifecycle/get-price-margin";

export const PRICE_MARGIN_QUERY_KEY = ["lifecycle-price-margin"];

export const useGetPriceMargin = () =>
  useQuery<GetPriceMarginResponse, Error>({
    queryKey: PRICE_MARGIN_QUERY_KEY,
    queryFn: getPriceMargin,
  });
