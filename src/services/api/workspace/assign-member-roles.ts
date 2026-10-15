import axios from "axios";
import { axiosInstance } from "@/services/index.service";
import { API_ENDPOINTS } from "@/config/apiConfig";
import { getServerErrorMessage } from "@/services/get-server-error";

export interface AssignMemberRolesPayload {
  userId: string;
  functionalRoles: string[];
}

export interface AssignMemberRolesResponse {
  data: string;
  messages: string[];
  succeeded: boolean;
}

const {
  WORKSPACE: { ASSIGN_MEMBER_ROLES },
} = API_ENDPOINTS;

// Admin-only.
export const assignMemberRoles = async (
  payload: AssignMemberRolesPayload
): Promise<AssignMemberRolesResponse> => {
  try {
    const response = await axiosInstance.put<AssignMemberRolesResponse>(
      ASSIGN_MEMBER_ROLES,
      payload,
      { headers: { "Content-Type": "application/json" } }
    );

    return response.data;
  } catch (error: unknown) {
    if (axios.isAxiosError(error)) {
      const serverMessage = error.response ? getServerErrorMessage(error.response.data) : null;
      throw new Error(serverMessage || "Failed to assign roles");
    }
    throw new Error(
      "No response from server. Please check your internet connection and try again."
    );
  }
};
