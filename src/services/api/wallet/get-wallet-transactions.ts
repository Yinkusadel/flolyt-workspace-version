import axios from "axios";
import { axiosInstance } from "@/services/index.service";
import { API_ENDPOINTS } from "@/config/apiConfig";
import { getServerErrorMessage } from "@/services/get-server-error";

export interface WalletTransactionDto {
  id: string;
  transactionDate: string;
  category: string;
  transactionType: string;
  description: string;
  amount: string;
}

export interface GetWalletTransactionsParams {
  filter?: string;
  page?: number;
  pageSize?: number;
}

export interface GetWalletTransactionsResponse {
  data: WalletTransactionDto[];
  currentPage: number;
  totalPages: number;
  totalCount: number;
  pageSize: number;
  hasPreviousPage: boolean;
  hasNextPage: boolean;
  messages: string[] | null;
  succeeded: boolean;
}

const {
  WALLET: { GET_WALLET_TRANSACTIONS },
} = API_ENDPOINTS;

export const getWalletTransactions = async (
  params?: GetWalletTransactionsParams
): Promise<GetWalletTransactionsResponse> => {
  try {
    const response = await axiosInstance.get<GetWalletTransactionsResponse>(
      GET_WALLET_TRANSACTIONS,
      {
        params: {
          filter: params?.filter,
          page: params?.page ?? 1,
          pageSize: params?.pageSize ?? 10,
        },
      }
    );

    return response.data;
  } catch (error: unknown) {
    if (axios.isAxiosError(error)) {
      if (error.response?.status === 404) {
        throw new Error("Wallet transactions not found.");
      }
      const serverMessage = error.response ? getServerErrorMessage(error.response.data) : null;
      throw new Error(serverMessage || "Failed to fetch wallet transactions");
    }
    throw new Error(
      "No response from server. Please check your internet connection and try again."
    );
  }
};
