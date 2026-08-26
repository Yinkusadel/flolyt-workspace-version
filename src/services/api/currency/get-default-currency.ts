import axios from "axios";
import { axiosInstance } from "@/services/index.service";
import { API_ENDPOINTS } from "@/config/apiConfig";
import { getServerErrorMessage } from "@/services/get-server-error";

export interface DefaultCurrencyDto {
  countryCode: string;
  currency: string;
  isFallback: boolean;
}

// GET /supported (the sibling currency endpoint) was confirmed 2026-08-26 to
// return its DTO unwrapped, not the standard {data, messages, succeeded}
// envelope — matches how currency.md documented this endpoint's response too.
// Applying the same shape here; still worth a real call to confirm outright.
export type GetDefaultCurrencyResponse = DefaultCurrencyDto;

const {
  CURRENCY: { GET_DEFAULT },
} = API_ENDPOINTS;

// countryCode is assumed to be a query param — apiConfig's URL has no {placeholder}
// segment and the response echoes countryCode back, same shape as slug-available
// echoing slug. Not confirmed against a real call yet — see currency.md.
export const getDefaultCurrency = async (countryCode: string): Promise<GetDefaultCurrencyResponse> => {
  try {
    const response = await axiosInstance.get<GetDefaultCurrencyResponse>(GET_DEFAULT, {
      params: { countryCode },
    });

    return response.data;
  } catch (error: unknown) {
    if (axios.isAxiosError(error)) {
      const serverMessage = error.response ? getServerErrorMessage(error.response.data) : null;
      throw new Error(serverMessage || "Failed to fetch the default currency");
    }
    throw new Error(
      "No response from server. Please check your internet connection and try again."
    );
  }
};
