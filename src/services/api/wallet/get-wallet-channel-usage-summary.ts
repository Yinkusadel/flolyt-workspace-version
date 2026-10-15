import axios from "axios";
import { axiosInstance } from "@/services/index.service";
import { API_ENDPOINTS } from "@/config/apiConfig";
import { getServerErrorMessage } from "@/services/get-server-error";

export interface WalletChannelUsageDto {
  channel: string;
  messageCount: number;
  totalCost: number;
}

export interface WalletChannelUsageSummaryResponse {
  data: WalletChannelUsageDto[];
  messages: string[];
  succeeded: boolean;
}

export type WalletUsageTimeRange = "Day" | "Week" | "Month" | "Year" | "Custom";

export interface GetWalletChannelUsageSummaryParams {
  timeRange: WalletUsageTimeRange;
  startDate?: string;
  endDate?: string;
}

const {
  WALLET: { GET_WALLET_CHANNEL_USAGE_SUMMARY },
} = API_ENDPOINTS;

export const getWalletChannelUsageSummary = async (
  params: GetWalletChannelUsageSummaryParams
): Promise<WalletChannelUsageSummaryResponse> => {
  try {
    const response = await axiosInstance.get<WalletChannelUsageSummaryResponse>(
      GET_WALLET_CHANNEL_USAGE_SUMMARY,
      { params }
    );

    return response.data;
  } catch (error: unknown) {
    if (axios.isAxiosError(error)) {
      const serverMessage = error.response ? getServerErrorMessage(error.response.data) : null;
      throw new Error(serverMessage || "Failed to fetch channel usage summary");
    }
    throw new Error(
      "No response from server. Please check your internet connection and try again."
    );
  }
};
