import axios from "axios";
import { axiosInstance } from "@/services/index.service";
import { API_ENDPOINTS } from "@/config/apiConfig";
import { getServerErrorMessage } from "@/services/get-server-error";

export interface WalletBalanceDto {
  id: string;
  companyId: string;
  balance: number;
  currency: string;
  dateCreated: string;
  isActive: boolean;
  lastDeposit: string | null;
  lastExpense: string | null;
}

export interface GetWalletBalanceResponse {
  data: WalletBalanceDto;
  messages: string[];
  succeeded: boolean;
}

const {
  WALLET: { GET_WALLET_BALANCE },
} = API_ENDPOINTS;

export const getWalletBalance = async (): Promise<GetWalletBalanceResponse> => {
  try {
    const response = await axiosInstance.get<GetWalletBalanceResponse>(GET_WALLET_BALANCE);

    return response.data;
  } catch (error: unknown) {
    if (axios.isAxiosError(error)) {
      const serverMessage = error.response ? getServerErrorMessage(error.response.data) : null;
      throw new Error(serverMessage || "Failed to fetch wallet balance");
    }
    throw new Error(
      "No response from server. Please check your internet connection and try again."
    );
  }
};
