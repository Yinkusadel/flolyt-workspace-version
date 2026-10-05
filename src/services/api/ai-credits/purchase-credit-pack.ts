import axios from "axios";
import { axiosInstance } from "@/services/index.service";
import { API_ENDPOINTS } from "@/config/apiConfig";
import { getServerErrorMessage } from "@/services/get-server-error";

export interface PurchaseCreditPackPayload {
  packName: string;
}

export interface PurchaseCreditPackResultDto {
  packName: string;
  creditsAdded: number;
  amountCharged: number;
  newCreditBalance: number;
}

export interface PurchaseCreditPackResponse {
  data: PurchaseCreditPackResultDto;
  messages: string[];
  succeeded: boolean;
}

const {
  AICREDITS: { PURCHASE_PACK },
} = API_ENDPOINTS;

export const purchaseCreditPack = async (
  payload: PurchaseCreditPackPayload
): Promise<PurchaseCreditPackResponse> => {
  try {
    const response = await axiosInstance.post<PurchaseCreditPackResponse>(PURCHASE_PACK, payload);

    return response.data;
  } catch (error: unknown) {
    if (axios.isAxiosError(error)) {
      const serverMessage = error.response ? getServerErrorMessage(error.response.data) : null;
      throw new Error(serverMessage || "Failed to purchase credit pack");
    }
    throw new Error(
      "No response from server. Please check your internet connection and try again."
    );
  }
};
