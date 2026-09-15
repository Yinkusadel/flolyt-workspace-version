import axios from "axios";
import { axiosInstance } from "@/services/index.service";
import { API_ENDPOINTS } from "@/config/apiConfig";
import { getServerErrorMessage } from "@/services/get-server-error";

export interface ProposedMarketDto {
  countryCode: string;
  currencyCode: string;
  source: "workspace_country" | "website_analysis" | "declared";
  isCertain: boolean;
}

export interface ProposedMarketsDto {
  proposals: ProposedMarketDto[];
  primaryMarketCountry: string;
  reportingCurrency: string;
  declared: boolean;
  analysisAvailable: boolean;
  geographicFocus: string | null;
}

export interface GetProposedMarketsResponse {
  data: ProposedMarketsDto;
  messages: string[];
  succeeded: boolean;
}

const {
  WORKSPACE: { GET_PROPOSED_MARKETS },
} = API_ENDPOINTS;

export const getProposedMarkets = async (): Promise<GetProposedMarketsResponse> => {
  try {
    const response = await axiosInstance.get<GetProposedMarketsResponse>(GET_PROPOSED_MARKETS);

    return response.data;
  } catch (error: unknown) {
    if (axios.isAxiosError(error)) {
      const serverMessage = error.response ? getServerErrorMessage(error.response.data) : null;
      throw new Error(serverMessage || "Failed to fetch proposed markets");
    }
    throw new Error(
      "No response from server. Please check your internet connection and try again."
    );
  }
};
