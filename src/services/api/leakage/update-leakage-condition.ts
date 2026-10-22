import axios from "axios";
import { axiosInstance } from "@/services/index.service";
import { API_ENDPOINTS } from "@/config/apiConfig";
import { getServerErrorMessage } from "@/services/get-server-error";
import type { LeakageConditionDto } from "@/services/api/leakage/get-leakage-conditions";

// `Unknown` is what inference says and is refused by the API — only `Applies`/`NotApplicable`
// are valid to send. Kept as a union of the two rather than reusing
// LeakageConditionApplicability so a caller can't accidentally send the refused value.
export type LeakageConditionDecision = "Applies" | "NotApplicable";

export interface UpdateLeakageConditionPayload {
  key: string;
  applicability: LeakageConditionDecision;
  because: string;
}

export interface UpdateLeakageConditionResponse {
  data: LeakageConditionDto;
  messages: string[];
  succeeded: boolean;
}

const {
  LEAKAGE: { UPDATE_LEAKAGE_CONDITION },
} = API_ENDPOINTS;

export const updateLeakageCondition = async ({
  key,
  applicability,
  because,
}: UpdateLeakageConditionPayload): Promise<UpdateLeakageConditionResponse> => {
  try {
    const response = await axiosInstance.put<UpdateLeakageConditionResponse>(
      UPDATE_LEAKAGE_CONDITION.replace("{key}", key),
      { applicability, because }
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
