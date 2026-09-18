import axios from "axios";
import { axiosInstance } from "@/services/index.service";
import { API_ENDPOINTS } from "@/config/apiConfig";
import { getServerErrorMessage } from "@/services/get-server-error";

export interface SupportedCurrenciesDto {
  currencies: string[];
  defaultFallback: string;
}

// Confirmed against a real call 2026-08-26: unlike every other endpoint in this
// app, this one returns the DTO directly at the top level — no {data, messages,
// succeeded} envelope. Don't "fix" this to match the envelope pattern.
export type GetSupportedCurrenciesResponse = SupportedCurrenciesDto;

const {
  CURRENCY: { GET_SUPPORTED },
} = API_ENDPOINTS;

export const getSupportedCurrencies = async (): Promise<GetSupportedCurrenciesResponse> => {
  try {
    const response = await axiosInstance.get<GetSupportedCurrenciesResponse>(GET_SUPPORTED);

    return response.data;
  } catch (error: unknown) {
    if (axios.isAxiosError(error)) {
      const serverMessage = error.response ? getServerErrorMessage(error.response.data) : null;
      throw new Error(serverMessage || "Failed to fetch supported currencies");
    }
    throw new Error(
      "No response from server. Please check your internet connection and try again."
    );
  }
};
