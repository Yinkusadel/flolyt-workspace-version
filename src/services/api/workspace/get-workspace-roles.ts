import axios from "axios";
import { axiosInstance } from "@/services/index.service";
import { API_ENDPOINTS } from "@/config/apiConfig";
import { getServerErrorMessage } from "@/services/get-server-error";
import type { FunctionalRoleDto } from "./get-workspace-members";

export interface GetWorkspaceRolesResponse {
  data: FunctionalRoleDto[];
  messages: string[];
  succeeded: boolean;
}

const {
  WORKSPACE: { GET_WORKSPACE_ROLES },
} = API_ENDPOINTS;

export const getWorkspaceRoles = async (): Promise<GetWorkspaceRolesResponse> => {
  try {
    const response = await axiosInstance.get<GetWorkspaceRolesResponse>(GET_WORKSPACE_ROLES);

    return response.data;
  } catch (error: unknown) {
    if (axios.isAxiosError(error)) {
      const serverMessage = error.response ? getServerErrorMessage(error.response.data) : null;
      throw new Error(serverMessage || "Failed to fetch workspace roles");
    }
    throw new Error(
      "No response from server. Please check your internet connection and try again."
    );
  }
};
