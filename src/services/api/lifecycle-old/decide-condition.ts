import axios from "axios";
import { axiosInstance } from "@/services/index.service";
import { API_ENDPOINTS } from "@/config/apiConfig";
import { getServerErrorMessage } from "@/services/get-server-error";

export interface DecideConditionPayload {
  conditionId: string;
  accept: boolean;
  routesToUserId?: string | null;
  sustainReadings?: number | null;
  threshold?: number | null;
}

export interface DecideConditionResponse {
  data: string;
  messages: string[];
  succeeded: boolean;
}

const {
  LIFECYCLE: { DECIDE_CONDITION },
} = API_ENDPOINTS;

// Agents may propose thresholds but never set them — a proposed condition isn't evaluated at
// all until a person accepts it. A declined proposal is kept, not deleted, so it isn't
// re-proposed forever.
export const decideCondition = async ({
  conditionId,
  ...payload
}: DecideConditionPayload): Promise<DecideConditionResponse> => {
  try {
    const response = await axiosInstance.post<DecideConditionResponse>(
      DECIDE_CONDITION.replace("{conditionId}", conditionId),
      payload,
      { headers: { "Content-Type": "application/json" } }
    );

    return response.data;
  } catch (error: unknown) {
    if (axios.isAxiosError(error)) {
      const serverMessage = error.response ? getServerErrorMessage(error.response.data) : null;
      throw new Error(serverMessage || "Failed to decide the condition");
    }
    throw new Error(
      "No response from server. Please check your internet connection and try again."
    );
  }
};
