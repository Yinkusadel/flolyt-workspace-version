import axios from "axios";
import { axiosInstance } from "@/services/index.service";
import { API_ENDPOINTS } from "@/config/apiConfig";
import { getServerErrorMessage } from "@/services/get-server-error";

export interface UpdateWorkspaceProfilePayload {
  name: string;
  city?: string | null;
  state?: string | null;
  country?: string | null;
  timeZoneId?: string | null;
  brandTone?: string | null;
  website?: string | null;
  industry?: string | null;
  businessModel?: string | null;
  monetizationModel?: string | null;
  revenueDriver?: string | null;
  missionStatement?: string | null;
  primaryProduct?: string | null;
  primaryUserActions?: string[];
  targetAudience?: string | null;
  geographicFocus?: string | null;
  companySize?: string | null;
  currency?: string | null;
}

export interface UpdateWorkspaceProfileResponse {
  data: boolean;
  messages: string[];
  succeeded: boolean;
}

const {
  WORKSPACE: { UPDATE_WORKSPACE_PROFILE },
} = API_ENDPOINTS;

export const updateWorkspaceProfile = async (
  payload: UpdateWorkspaceProfilePayload
): Promise<UpdateWorkspaceProfileResponse> => {
  try {
    const response = await axiosInstance.put<UpdateWorkspaceProfileResponse>(
      UPDATE_WORKSPACE_PROFILE,
      payload,
      { headers: { "Content-Type": "application/json" } }
    );

    return response.data;
  } catch (error: unknown) {
    if (axios.isAxiosError(error)) {
      const serverMessage = error.response ? getServerErrorMessage(error.response.data) : null;
      throw new Error(serverMessage || "Failed to update workspace profile");
    }
    throw new Error(
      "No response from server. Please check your internet connection and try again."
    );
  }
};
