import axios from "axios";
import { axiosInstance } from "@/services/index.service";
import { API_ENDPOINTS } from "@/config/apiConfig";
import { getServerErrorMessage } from "@/services/get-server-error";

export interface WalletTransactionDetailDto {
  id: string;
  walletId: string;
  transactionDate: string;
  category: string;
  transactionType: string;
  description: string;
  amount: string;
  reference: string | null;
}

export interface GetWalletTransactionByIdResponse {
  data: WalletTransactionDetailDto;
  messages: string[];
  succeeded: boolean;
}

const {
  WALLET: { GET_WALLET_TRANSACTION_BY_ID },
} = API_ENDPOINTS;

export const getWalletTransactionById = async (
  id: string
): Promise<GetWalletTransactionByIdResponse> => {
  try {
    const response = await axiosInstance.get<GetWalletTransactionByIdResponse>(
      GET_WALLET_TRANSACTION_BY_ID.replace("{id}", id)
    );

    return response.data;
  } catch (error: unknown) {
    if (axios.isAxiosError(error)) {
      if (error.response?.status === 404) {
        throw new Error("Wallet transaction not found.");
      }
      const serverMessage = error.response ? getServerErrorMessage(error.response.data) : null;
      throw new Error(serverMessage || "Failed to fetch wallet transaction details");
    }
    throw new Error(
      "No response from server. Please check your internet connection and try again."
    );
  }
};
