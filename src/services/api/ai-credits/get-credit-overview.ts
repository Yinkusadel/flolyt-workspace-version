import axios from "axios";
import { axiosInstance } from "@/services/index.service";
import { API_ENDPOINTS } from "@/config/apiConfig";
import { getServerErrorMessage } from "@/services/get-server-error";

export interface TopCreditConsumerDto {
  companyId: string;
  totalCreditsUsed: number;
  totalCreditsPurchased: number;
  totalSpent: number;
  lastActivity: string;
}

export interface CreditOverviewDto {
  id: string;
  totalCreditsSold: number;
  totalCreditsConsumed: number;
  totalRevenueFromPacks: number;
  packPurchaseDistribution: Record<string, number>;
  globalUsageByOperationType: Record<string, number>;
  topConsumers: TopCreditConsumerDto[];
  lastUpdated: string;
}

export interface GetCreditOverviewResponse {
  data: CreditOverviewDto;
  messages: string[];
  succeeded: boolean;
}

const {
  AICREDITS: { GET_OVERVIEW },
} = API_ENDPOINTS;

// Platform-wide overview (totals sold/consumed, top consumers) — likely a platform-admin surface,
// not a per-workspace one. Kept here since it's part of the same endpoint family.
export const getCreditOverview = async (): Promise<GetCreditOverviewResponse> => {
  try {
    const response = await axiosInstance.get<GetCreditOverviewResponse>(GET_OVERVIEW);

    return response.data;
  } catch (error: unknown) {
    if (axios.isAxiosError(error)) {
      const serverMessage = error.response ? getServerErrorMessage(error.response.data) : null;
      throw new Error(serverMessage || "Failed to fetch credit overview");
    }
    throw new Error(
      "No response from server. Please check your internet connection and try again."
    );
  }
};
