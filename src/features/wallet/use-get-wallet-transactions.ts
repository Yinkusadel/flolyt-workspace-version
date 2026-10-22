import { useQuery } from "@tanstack/react-query";
import {
  getWalletTransactions,
  type GetWalletTransactionsParams,
  type GetWalletTransactionsResponse,
} from "@/services/api/wallet/get-wallet-transactions";

export const useGetWalletTransactions = (params?: GetWalletTransactionsParams) =>
  useQuery<GetWalletTransactionsResponse, Error>({
    queryKey: ["wallet-transactions", params],
    queryFn: () => getWalletTransactions(params),
  });
