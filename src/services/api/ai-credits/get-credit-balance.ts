import axios from "axios";
import { axiosInstance } from "@/services/index.service";
import { API_ENDPOINTS } from "@/config/apiConfig";
import { getServerErrorMessage } from "@/services/get-server-error";

export interface CreditBalanceDto {
  accountId: string;
  companyId: string;
  paidCredits: number;
  freeCredits: number;
  dailyFreeCreditsUsed: number;
  dailyFreeLimit: number;
  monthlyFreeLimit: number;
  totalAvailable: number;
  lastMonthlyReset: string | null;
}

export interface GetCreditBalanceResponse {
  data: CreditBalanceDto;
  messages: string[];
  succeeded: boolean;
}

const {
  AICREDITS: { GET_BALANCE },
} = API_ENDPOINTS;

export const getCreditBalance = async (): Promise<GetCreditBalanceResponse> => {
  try {
    const response = await axiosInstance.get<GetCreditBalanceResponse>(GET_BALANCE);

    return response.data;
  } catch (error: unknown) {
    if (axios.isAxiosError(error)) {
      const serverMessage = error.response ? getServerErrorMessage(error.response.data) : null;
      throw new Error(serverMessage || "Failed to fetch credit balance");
    }
    throw new Error(
      "No response from server. Please check your internet connection and try again."
    );
  }
};
