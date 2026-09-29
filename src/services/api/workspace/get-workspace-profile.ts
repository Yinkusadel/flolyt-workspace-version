import axios from "axios";
import { axiosInstance } from "@/services/index.service";
import { API_ENDPOINTS } from "@/config/apiConfig";
import { getServerErrorMessage } from "@/services/get-server-error";

export interface WorkspaceProfileDto {
  companyId: string;
  name: string;
  website: string | null;
  industry: string;
  businessModel: string;
  monetizationModel: string;
  targetAudience: string;
  geographicFocus: string;
  companySize: string;
  brandTone: string;
  primaryProduct: string | null;
  missionStatement: string | null;
  primaryUserActions: string[];
  revenueDriver: string;
  currency: string | null;
}

export interface GetWorkspaceProfileResponse {
  data: WorkspaceProfileDto;
  messages: string[];
  succeeded: boolean;
}

const {
  WORKSPACE: { GET_WORKSPACE_PROFILE },
} = API_ENDPOINTS;

export const getWorkspaceProfile = async (): Promise<GetWorkspaceProfileResponse> => {
  try {
    const response = await axiosInstance.get<GetWorkspaceProfileResponse>(GET_WORKSPACE_PROFILE);

    return response.data;
  } catch (error: unknown) {
    if (axios.isAxiosError(error)) {
      const serverMessage = error.response ? getServerErrorMessage(error.response.data) : null;
      throw new Error(serverMessage || "Failed to fetch workspace profile");
    }
    throw new Error(
      "No response from server. Please check your internet connection and try again."
    );
  }
};
