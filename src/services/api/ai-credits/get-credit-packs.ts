import axios from "axios";
import { axiosInstance } from "@/services/index.service";
import { API_ENDPOINTS } from "@/config/apiConfig";
import { getServerErrorMessage } from "@/services/get-server-error";

export interface TenantPriceDto {
  currency: string;
  amount: number;
  costPerCredit: number;
}

export interface CreditPackDto {
  name: string;
  displayName: string;
  credits: number;
  price: TenantPriceDto | null;
  allPrices: TenantPriceDto[];
}

export interface GetCreditPacksResponse {
  data: CreditPackDto[];
  messages: string[];
  succeeded: boolean;
}

const {
  AICREDITS: { GET_PACKS },
} = API_ENDPOINTS;

export const getCreditPacks = async (): Promise<GetCreditPacksResponse> => {
  try {
    const response = await axiosInstance.get<GetCreditPacksResponse>(GET_PACKS);

    return response.data;
  } catch (error: unknown) {
    if (axios.isAxiosError(error)) {
      const serverMessage = error.response ? getServerErrorMessage(error.response.data) : null;
      throw new Error(serverMessage || "Failed to fetch credit packs");
    }
    throw new Error(
      "No response from server. Please check your internet connection and try again."
    );
  }
};
