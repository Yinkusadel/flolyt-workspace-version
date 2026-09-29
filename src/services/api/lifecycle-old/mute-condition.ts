import axios from "axios";
import { axiosInstance } from "@/services/index.service";
import { API_ENDPOINTS } from "@/config/apiConfig";
import { getServerErrorMessage } from "@/services/get-server-error";

export interface MuteConditionPayload {
  conditionId: string;
  muted: boolean;
}

export interface MuteConditionResponse {
  data: string;
  messages: string[];
  succeeded: boolean;
}

const {
  LIFECYCLE: { MUTE_CONDITION },
} = API_ENDPOINTS;

// Muting keeps everything already found and resets the breach run — the tool a person reaches
// for instead of deleting a rule that turned out to be noise.
export const muteCondition = async ({
  conditionId,
  muted,
}: MuteConditionPayload): Promise<MuteConditionResponse> => {
  try {
    const response = await axiosInstance.post<MuteConditionResponse>(
      MUTE_CONDITION.replace("{conditionId}", conditionId),
      { muted },
      { headers: { "Content-Type": "application/json" } }
    );

    return response.data;
  } catch (error: unknown) {
    if (axios.isAxiosError(error)) {
      const serverMessage = error.response ? getServerErrorMessage(error.response.data) : null;
      throw new Error(serverMessage || "Failed to update the condition's mute state");
    }
    throw new Error(
      "No response from server. Please check your internet connection and try again."
    );
  }
};
