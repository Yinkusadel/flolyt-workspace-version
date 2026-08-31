import axios from "axios";
import { axiosInstance } from "@/services/index.service";
import { API_ENDPOINTS } from "@/config/apiConfig";
import { getServerErrorMessage } from "@/services/get-server-error";

export interface UpdateStageOwnerPayload {
  stageKey: string;
  ownerUserId: string;
}

export interface UpdateStageOwnerResponse {
  data: null;
  messages: string[];
  succeeded: boolean;
}

const {
  LIFECYCLE: { UPDATE_STAGE_OWNER },
} = API_ENDPOINTS;

// Refused server-side for "churn" — no single-person accountability for a stage that
// aggregates every other stage's losses.
export const updateStageOwner = async ({
  stageKey,
  ownerUserId,
}: UpdateStageOwnerPayload): Promise<UpdateStageOwnerResponse> => {
  try {
    const response = await axiosInstance.put<UpdateStageOwnerResponse>(
      UPDATE_STAGE_OWNER.replace("{stageKey}", stageKey),
      { ownerUserId },
      { headers: { "Content-Type": "application/json" } }
    );

    return response.data;
  } catch (error: unknown) {
    if (axios.isAxiosError(error)) {
      const serverMessage = error.response ? getServerErrorMessage(error.response.data) : null;
      throw new Error(serverMessage || "Failed to assign the stage owner");
    }
    throw new Error(
      "No response from server. Please check your internet connection and try again."
    );
  }
};
