import axios from "axios";
import { axiosInstance } from "@/services/index.service";
import { API_ENDPOINTS } from "@/config/apiConfig";
import { getServerErrorMessage } from "@/services/get-server-error";

export interface CreateStageConditionPayload {
  stageKey: string;
  label: string;
  metricKey: string;
  comparison: "AtOrBelow" | "AtOrAbove";
  threshold: number;
  sustainReadings: number;
  agentKey?: string | null;
  /** null uses the stage's own routing chain. Routing to a team or a log is never offered. */
  routesToUserId?: string | null;
  segment?: string | null;
}

export interface CreateStageConditionResponse {
  data: string;
  messages: string[];
  succeeded: boolean;
}

const {
  LIFECYCLE: { CREATE_STAGE_CONDITION },
} = API_ENDPOINTS;

// Owner-or-admin only server-side. Watches from the moment it's saved.
export const createStageCondition = async ({
  stageKey,
  ...payload
}: CreateStageConditionPayload): Promise<CreateStageConditionResponse> => {
  try {
    const response = await axiosInstance.post<CreateStageConditionResponse>(
      CREATE_STAGE_CONDITION.replace("{stageKey}", stageKey),
      payload,
      { headers: { "Content-Type": "application/json" } }
    );

    return response.data;
  } catch (error: unknown) {
    if (axios.isAxiosError(error)) {
      const serverMessage = error.response ? getServerErrorMessage(error.response.data) : null;
      throw new Error(serverMessage || "Failed to create the condition");
    }
    throw new Error(
      "No response from server. Please check your internet connection and try again."
    );
  }
};
