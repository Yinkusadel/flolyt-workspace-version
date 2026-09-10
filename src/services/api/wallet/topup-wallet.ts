import axios from "axios";
import { axiosInstance } from "@/services/index.service";
import { API_ENDPOINTS } from "@/config/apiConfig";
import { getServerErrorMessage } from "@/services/get-server-error";

export interface TopupWalletPayload {
  amount: number;
  currency?: string | null;
  description?: string | null;
  callbackUrl?: string | null;
}

// Unlike every other endpoint in this app, this one is NOT wrapped in {data, messages, succeeded}
// — it responds with its own {status, responseMessage, ...} shape. Confirmed against the working
// reference implementation in flolyt-dashboard, same backend family.
export interface TopupWalletResponse {
  status: string;
  responseMessage: string;
  transactionId: string;
  paymentUrl: string;
}

const {
  WALLET: { TOPUP_WALLET },
} = API_ENDPOINTS;

export const topupWallet = async (payload: TopupWalletPayload): Promise<TopupWalletResponse> => {
  try {
    const response = await axiosInstance.post<TopupWalletResponse>(TOPUP_WALLET, payload);

    return response.data;
  } catch (error: unknown) {
    if (axios.isAxiosError(error)) {
      const serverMessage = error.response ? getServerErrorMessage(error.response.data) : null;
      throw new Error(serverMessage || "Failed to initiate top-up");
    }
    throw new Error(
      "No response from server. Please check your internet connection and try again."
    );
  }
};
