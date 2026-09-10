import { useQuery } from "@tanstack/react-query";
import {
  getWalletTransactionById,
  type GetWalletTransactionByIdResponse,
} from "@/services/api/wallet/get-wallet-transaction-by-id";

export const useGetWalletTransactionById = (id: string | undefined) =>
  useQuery<GetWalletTransactionByIdResponse, Error>({
    queryKey: ["wallet-transaction", id],
    queryFn: () => getWalletTransactionById(id as string),
    enabled: !!id,
  });
