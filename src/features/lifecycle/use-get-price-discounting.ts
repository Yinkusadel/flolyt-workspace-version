import { useQuery } from "@tanstack/react-query";
import {
  getPriceDiscounting,
  type GetPriceDiscountingResponse,
} from "@/services/api/lifecycle/get-price-discounting";

export const PRICE_DISCOUNTING_QUERY_KEY = ["lifecycle-price-discounting"];

export const useGetPriceDiscounting = () =>
  useQuery<GetPriceDiscountingResponse, Error>({
    queryKey: PRICE_DISCOUNTING_QUERY_KEY,
    queryFn: getPriceDiscounting,
  });
