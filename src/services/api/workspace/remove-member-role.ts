import axios from "axios";
import { axiosInstance } from "@/services/index.service";
import { API_ENDPOINTS } from "@/config/apiConfig";
import { getServerErrorMessage } from "@/services/get-server-error";

export interface RemoveMemberRolePayload {
  userId: string;
  functionalRole: string;
}

export interface RemoveMemberRoleResponse {
  data: boolean;
  messages: string[];
  succeeded: boolean;
}

const {
  WORKSPACE: { REMOVE_MEMBER_ROLE },
} = API_ENDPOINTS;

// Admin-only. Same path as assign-member-roles.ts but takes a single functionalRole
// (not an array) — easy to mix up when calling this.
export const removeMemberRole = async (
  payload: RemoveMemberRolePayload
): Promise<RemoveMemberRoleResponse> => {
  try {
    const response = await axiosInstance.delete<RemoveMemberRoleResponse>(REMOVE_MEMBER_ROLE, {
      headers: { "Content-Type": "application/json" },
      data: payload,
    });

    return response.data;
  } catch (error: unknown) {
    if (axios.isAxiosError(error)) {
      const serverMessage = error.response ? getServerErrorMessage(error.response.data) : null;
      throw new Error(serverMessage || "Failed to remove role");
    }
    throw new Error(
      "No response from server. Please check your internet connection and try again."
    );
  }
};
