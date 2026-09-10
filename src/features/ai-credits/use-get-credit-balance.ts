import { useQuery } from "@tanstack/react-query";
import {
  getCreditBalance,
  type GetCreditBalanceResponse,
} from "@/services/api/ai-credits/get-credit-balance";

export const useGetCreditBalance = () =>
  useQuery<GetCreditBalanceResponse, Error>({
    queryKey: ["credit-balance"],
    queryFn: getCreditBalance,
  });
