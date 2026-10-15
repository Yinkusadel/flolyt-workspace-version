import axios from "axios";
import { axiosInstance } from "@/services/index.service";
import { API_ENDPOINTS } from "@/config/apiConfig";
import { getServerErrorMessage } from "@/services/get-server-error";

export interface SteerAgentRunParams {
  runId: string;
  text: string;
}

export interface SteerAgentRunResponse {
  data: null;
  messages: string[];
  succeeded: boolean;
}

const {
  AGENT_RUNS: { STEER },
} = API_ENDPOINTS;

// Adds a note for the next turn boundary — doesn't interrupt the current turn.
// The handoff doc doesn't state the request body shape for this route explicitly; `text` is
// inferred from `AgentRun.steering[].text`. Confirm against Scalar before wiring a UI to this.
export const steerAgentRun = async ({
  runId,
  text,
}: SteerAgentRunParams): Promise<SteerAgentRunResponse> => {
  try {
    const response = await axiosInstance.post<SteerAgentRunResponse>(
      STEER.replace("{id}", runId),
      { text },
      { headers: { "X-Flolyt-Agent-Contract": "v3" } }
    );

    return response.data;
  } catch (error: unknown) {
    if (axios.isAxiosError(error)) {
      const serverMessage = error.response ? getServerErrorMessage(error.response.data) : null;
      throw new Error(serverMessage || "Failed to send the steering note");
    }
    throw new Error(
      "No response from server. Please check your internet connection and try again."
    );
  }
};
