import { useQuery } from "@tanstack/react-query";
import { getExpandBasket, type GetExpandBasketResponse } from "@/services/api/lifecycle-old/get-expand-basket";

export const EXPAND_BASKET_QUERY_KEY = ["lifecycle-expand-basket"];

export const useGetExpandBasket = () =>
  useQuery<GetExpandBasketResponse, Error>({
    queryKey: EXPAND_BASKET_QUERY_KEY,
    queryFn: getExpandBasket,
  });
