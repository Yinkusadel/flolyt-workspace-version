import { useQuery } from "@tanstack/react-query";
import {
  getCreditPacks,
  type GetCreditPacksResponse,
} from "@/services/api/ai-credits/get-credit-packs";

export const useGetCreditPacks = () =>
  useQuery<GetCreditPacksResponse, Error>({
    queryKey: ["credit-packs"],
    queryFn: getCreditPacks,
  });
