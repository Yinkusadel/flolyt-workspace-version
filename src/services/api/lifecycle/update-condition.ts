import axios from "axios";
import { axiosInstance } from "@/services/index.service";
import { API_ENDPOINTS } from "@/config/apiConfig";
import { getServerErrorMessage } from "@/services/get-server-error";

export interface UpdateConditionPayload {
  conditionId: string;
  routesToUserId: string | null;
  sustainReadings: number;
  threshold: number;
}

export interface UpdateConditionResponse {
  data: string;
  messages: string[];
  succeeded: boolean;
}

const {
  LIFECYCLE: { UPDATE_CONDITION },
} = API_ENDPOINTS;

// Owner-or-admin only, a person only. The breach count is reset on every edit — what it counted
// against the old threshold says nothing about the new one. Refused on a still-proposed
// condition — accept it via decide instead.
export const updateCondition = async ({
  conditionId,
  ...payload
}: UpdateConditionPayload): Promise<UpdateConditionResponse> => {
  try {
    const response = await axiosInstance.put<UpdateConditionResponse>(
      UPDATE_CONDITION.replace("{conditionId}", conditionId),
      payload,
      { headers: { "Content-Type": "application/json" } }
    );

    return response.data;
  } catch (error: unknown) {
    if (axios.isAxiosError(error)) {
      const serverMessage = error.response ? getServerErrorMessage(error.response.data) : null;
      throw new Error(serverMessage || "Failed to update the condition");
    }
    throw new Error(
      "No response from server. Please check your internet connection and try again."
    );
  }
};
