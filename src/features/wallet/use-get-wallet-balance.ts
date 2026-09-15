import { useQuery } from "@tanstack/react-query";
import {
  getWalletBalance,
  type GetWalletBalanceResponse,
} from "@/services/api/wallet/get-wallet-balance";

export const useGetWalletBalance = () =>
  useQuery<GetWalletBalanceResponse, Error>({
    queryKey: ["wallet-balance"],
    queryFn: getWalletBalance,
  });
