import axios from "axios";
import { axiosInstance } from "@/services/index.service";
import { API_ENDPOINTS } from "@/config/apiConfig";
import { getServerErrorMessage } from "@/services/get-server-error";
import type { AgentRun } from "@/features/agent-runs/agent-run-types";

export interface GetAgentRunResponse {
  data: AgentRun;
  messages: string[];
  succeeded: boolean;
}

const {
  AGENT_RUNS: { GET_BY_ID },
} = API_ENDPOINTS;

export const getAgentRun = async (runId: string): Promise<GetAgentRunResponse> => {
  try {
    const response = await axiosInstance.get<GetAgentRunResponse>(
      GET_BY_ID.replace("{id}", runId),
      { headers: { "X-Flolyt-Agent-Contract": "v3" } }
    );

    return response.data;
  } catch (error: unknown) {
    if (axios.isAxiosError(error)) {
      const serverMessage = error.response ? getServerErrorMessage(error.response.data) : null;
      throw new Error(serverMessage || "Failed to fetch the run");
    }
    throw new Error(
      "No response from server. Please check your internet connection and try again."
    );
  }
};
