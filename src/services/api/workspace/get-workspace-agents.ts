import axios from "axios";
import { axiosInstance } from "@/services/index.service";
import { API_ENDPOINTS } from "@/config/apiConfig";
import { getServerErrorMessage } from "@/services/get-server-error";

export type WorkspaceAgentState = "not_ready" | "reading" | "ready" | string;

export interface WorkspaceAgentDto {
  key: string;
  initials: string;
  name: string;
  description: string;
  state: WorkspaceAgentState;
  reads: string[];
  needs: string | null;
  wouldUnlock: string | null;
  moreDaysNeeded: number | null;
  persona: string;
}

export interface WorkspaceAgentsDto {
  totalCount: number;
  readyCount: number;
  readingCount: number;
  notReadyCount: number;
  agents: WorkspaceAgentDto[];
}

export interface GetWorkspaceAgentsResponse {
  data: WorkspaceAgentsDto;
  messages: string[];
  succeeded: boolean;
}

const {
  WORKSPACE: { GET_WORKSPACE_AGENTS },
} = API_ENDPOINTS;

export const getWorkspaceAgents = async (): Promise<GetWorkspaceAgentsResponse> => {
  try {
    const response = await axiosInstance.get<GetWorkspaceAgentsResponse>(GET_WORKSPACE_AGENTS);

    return response.data;
  } catch (error: unknown) {
    if (axios.isAxiosError(error)) {
      const serverMessage = error.response ? getServerErrorMessage(error.response.data) : null;
      throw new Error(serverMessage || "Failed to fetch workspace agents");
    }
    throw new Error(
      "No response from server. Please check your internet connection and try again."
    );
  }
};
