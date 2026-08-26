import axios from "axios";
import { axiosInstance } from "@/services/index.service";
import { API_ENDPOINTS } from "@/config/apiConfig";
import { getServerErrorMessage } from "@/services/get-server-error";

export interface UpdateWorkspaceIdentityPayload {
  name: string;
  slug: string;
  timeZoneId: string;
}

export interface WorkspaceIdentityDto {
  workspaceId: string;
  name: string;
  slug: string | null;
  timeZoneId: string;
}

export interface UpdateWorkspaceIdentityResponse {
  data: WorkspaceIdentityDto;
  messages: string[];
  succeeded: boolean;
}

const {
  WORKSPACE: { UPDATE_WORKSPACE_IDENTITY },
} = API_ENDPOINTS;

export const updateWorkspaceIdentity = async (
  payload: UpdateWorkspaceIdentityPayload
): Promise<UpdateWorkspaceIdentityResponse> => {
  try {
    const response = await axiosInstance.put<UpdateWorkspaceIdentityResponse>(
      UPDATE_WORKSPACE_IDENTITY,
      payload,
      { headers: { "Content-Type": "application/json" } }
    );

    return response.data;
  } catch (error: unknown) {
    if (axios.isAxiosError(error)) {
      const serverMessage = error.response ? getServerErrorMessage(error.response.data) : null;
      throw new Error(serverMessage || "Failed to update workspace identity");
    }
    throw new Error(
      "No response from server. Please check your internet connection and try again."
    );
  }
};
