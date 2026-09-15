import { useQuery } from "@tanstack/react-query";
import {
  getWalletChannelUsageSummary,
  type GetWalletChannelUsageSummaryParams,
  type WalletChannelUsageSummaryResponse,
} from "@/services/api/wallet/get-wallet-channel-usage-summary";

export const useGetWalletChannelUsageSummary = (params: GetWalletChannelUsageSummaryParams) =>
  useQuery<WalletChannelUsageSummaryResponse, Error>({
    queryKey: ["wallet-channel-usage", params],
    queryFn: () => getWalletChannelUsageSummary(params),
  });
