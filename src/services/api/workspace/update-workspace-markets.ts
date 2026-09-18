import axios from "axios";
import { axiosInstance } from "@/services/index.service";
import { API_ENDPOINTS } from "@/config/apiConfig";
import { getServerErrorMessage } from "@/services/get-server-error";

export interface DeclaredMarket {
  countryCode: string;
  currencyCode?: string | null;
}

export interface UpdateWorkspaceMarketsPayload {
  markets: DeclaredMarket[] | null;
  primaryMarketCountry: string;
  reportingCurrency: string | null;
  stepUpChallengeId: string | null;
}

export interface UpdateWorkspaceMarketsResponse {
  data: number;
  messages: string[];
  succeeded: boolean;
}

const {
  WORKSPACE: { UPDATE_WORKSPACE_MARKETS },
} = API_ENDPOINTS;

// Step-up gated — stepUpChallengeId must come from a completed step-up challenge.
// See docs/endpoints/workspace.md notes on this endpoint before wiring a UI to it.
export const updateWorkspaceMarkets = async (
  payload: UpdateWorkspaceMarketsPayload
): Promise<UpdateWorkspaceMarketsResponse> => {
  try {
    const response = await axiosInstance.put<UpdateWorkspaceMarketsResponse>(
      UPDATE_WORKSPACE_MARKETS,
      payload,
      { headers: { "Content-Type": "application/json" } }
    );

    return response.data;
  } catch (error: unknown) {
    if (axios.isAxiosError(error)) {
      const serverMessage = error.response ? getServerErrorMessage(error.response.data) : null;
      throw new Error(serverMessage || "Failed to update workspace markets");
    }
    throw new Error(
      "No response from server. Please check your internet connection and try again."
    );
  }
};
