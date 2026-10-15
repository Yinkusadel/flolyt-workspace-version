import axios from "axios";
import { axiosInstance } from "@/services/index.service";
import { API_ENDPOINTS } from "@/config/apiConfig";
import { getServerErrorMessage } from "@/services/get-server-error";

export interface UpdateRevenueModelPayload {
  revenueModel: string;
  stepUpChallengeId: string | null;
}

export interface UpdateRevenueModelResponse {
  data: string;
  messages: string[];
  succeeded: boolean;
}

const {
  WORKSPACE: { UPDATE_REVENUE_MODEL },
} = API_ENDPOINTS;

// Step-up gated — stepUpChallengeId must come from a completed step-up challenge.
// See docs/endpoints/workspace.md notes on this endpoint before wiring a UI to it.
export const updateRevenueModel = async (
  payload: UpdateRevenueModelPayload
): Promise<UpdateRevenueModelResponse> => {
  try {
    const response = await axiosInstance.put<UpdateRevenueModelResponse>(
      UPDATE_REVENUE_MODEL,
      payload,
      { headers: { "Content-Type": "application/json" } }
    );

    return response.data;
  } catch (error: unknown) {
    if (axios.isAxiosError(error)) {
      const serverMessage = error.response ? getServerErrorMessage(error.response.data) : null;
      throw new Error(serverMessage || "Failed to update revenue model");
    }
    throw new Error(
      "No response from server. Please check your internet connection and try again."
    );
  }
};
