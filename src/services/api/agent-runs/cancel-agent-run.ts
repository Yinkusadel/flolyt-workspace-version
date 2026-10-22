import axios from "axios";
import { axiosInstance } from "@/services/index.service";
import { API_ENDPOINTS } from "@/config/apiConfig";
import { getServerErrorMessage } from "@/services/get-server-error";

export interface CancelAgentRunResponse {
  data: null;
  messages: string[];
  succeeded: boolean;
}

const {
  AGENT_RUNS: { CANCEL },
} = API_ENDPOINTS;

// Requests cancellation only. `AgentRun.cancelRequested` flips true on success; the actual
// transition to `status: "cancelled"` arrives later over the run's own stream/poll, not from
// this response.
export const cancelAgentRun = async (runId: string): Promise<CancelAgentRunResponse> => {
  try {
    const response = await axiosInstance.post<CancelAgentRunResponse>(
      CANCEL.replace("{id}", runId),
      null,
      { headers: { "X-Flolyt-Agent-Contract": "v3" } }
    );

    return response.data;
  } catch (error: unknown) {
    if (axios.isAxiosError(error)) {
      const serverMessage = error.response ? getServerErrorMessage(error.response.data) : null;
      throw new Error(serverMessage || "Failed to cancel the run");
    }
    throw new Error(
      "No response from server. Please check your internet connection and try again."
    );
  }
};
