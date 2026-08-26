import axios from "axios";
import { axiosInstance } from "@/services/index.service";
import { API_ENDPOINTS } from "@/config/apiConfig";
import { getServerErrorMessage } from "@/services/get-server-error";

export interface FunctionalRoleDto {
  value: string;
  description: string;
}

export interface WorkspaceMemberDto {
  ref: string;
  kind: "Human" | "Agent" | string;
  id: string;
  key: string | null;
  displayName: string;
  email: string | null;
  avatarUrl: string | null;
  accentColor: string | null;
  domain: string | null;
  functionalRoles: FunctionalRoleDto[];
  spendCeiling: number | null;
  canAdminister: boolean | null;
  accessLevel: string;
  writeModes: Record<string, string>;
  isActive: boolean;
}

export interface GetWorkspaceMembersResponse {
  data: WorkspaceMemberDto[];
  messages: string[];
  succeeded: boolean;
}

const {
  WORKSPACE: { GET_WORKSPACE_MEMBERS },
} = API_ENDPOINTS;

export const getWorkspaceMembers = async (): Promise<GetWorkspaceMembersResponse> => {
  try {
    const response = await axiosInstance.get<GetWorkspaceMembersResponse>(GET_WORKSPACE_MEMBERS);

    return response.data;
  } catch (error: unknown) {
    if (axios.isAxiosError(error)) {
      const serverMessage = error.response ? getServerErrorMessage(error.response.data) : null;
      throw new Error(serverMessage || "Failed to fetch workspace members");
    }
    throw new Error(
      "No response from server. Please check your internet connection and try again."
    );
  }
};
