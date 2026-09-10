import axios from "axios";
import { axiosInstance } from "@/services/index.service";
import { API_ENDPOINTS } from "@/config/apiConfig";
import { getServerErrorMessage } from "@/services/get-server-error";

export interface DailyCreditUsageDto {
  date: string;
  creditsUsed: number;
  freeCreditsUsed: number;
  paidCreditsUsed: number;
  operationCounts: Record<string, number>;
}

export interface CreditUsageDto {
  id: string;
  totalCreditsUsed: number;
  totalCreditsPurchased: number;
  totalAmountSpent: number;
  usageByOperationType: Record<string, number>;
  dailyUsage: DailyCreditUsageDto[];
  lastActivity: string;
}

export interface GetCreditUsageResponse {
  data: CreditUsageDto;
  messages: string[];
  succeeded: boolean;
}

const {
  AICREDITS: { GET_USAGE },
} = API_ENDPOINTS;

export const getCreditUsage = async (): Promise<GetCreditUsageResponse> => {
  try {
    const response = await axiosInstance.get<GetCreditUsageResponse>(GET_USAGE);

    return response.data;
  } catch (error: unknown) {
    if (axios.isAxiosError(error)) {
      const serverMessage = error.response ? getServerErrorMessage(error.response.data) : null;
      throw new Error(serverMessage || "Failed to fetch credit usage");
    }
    throw new Error(
      "No response from server. Please check your internet connection and try again."
    );
  }
};
