import axios from "axios";
import { axiosInstance } from "@/services/index.service";
import { API_ENDPOINTS } from "@/config/apiConfig";
import { getServerErrorMessage } from "@/services/get-server-error";
import type { WorkspaceProfileDto } from "./get-workspace-profile";

export interface AnalyzeWorkspaceResponse {
  data: WorkspaceProfileDto;
  messages: string[];
  succeeded: boolean;
}

const {
  WORKSPACE: { ANALYZE_WORKSPACE },
} = API_ENDPOINTS;

export const analyzeWorkspace = async (): Promise<AnalyzeWorkspaceResponse> => {
  try {
    const response = await axiosInstance.patch<AnalyzeWorkspaceResponse>(ANALYZE_WORKSPACE);

    return response.data;
  } catch (error: unknown) {
    if (axios.isAxiosError(error)) {
      const serverMessage = error.response ? getServerErrorMessage(error.response.data) : null;
      throw new Error(serverMessage || "Failed to analyze workspace website");
    }
    throw new Error(
      "No response from server. Please check your internet connection and try again."
    );
  }
};
