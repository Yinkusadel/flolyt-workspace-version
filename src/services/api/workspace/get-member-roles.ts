import axios from "axios";
import { axiosInstance } from "@/services/index.service";
import { API_ENDPOINTS } from "@/config/apiConfig";
import { getServerErrorMessage } from "@/services/get-server-error";
import type { MemberRolesDto } from "./get-my-roles";

export interface GetMemberRolesResponse {
  data: MemberRolesDto;
  messages: string[];
  succeeded: boolean;
}

const {
  WORKSPACE: { GET_MEMBER_ROLES },
} = API_ENDPOINTS;

export const getMemberRoles = async (userId: string): Promise<GetMemberRolesResponse> => {
  try {
    const response = await axiosInstance.get<GetMemberRolesResponse>(
      GET_MEMBER_ROLES.replace("{userId}", userId)
    );

    return response.data;
  } catch (error: unknown) {
    if (axios.isAxiosError(error)) {
      const serverMessage = error.response ? getServerErrorMessage(error.response.data) : null;
      throw new Error(serverMessage || "Failed to fetch member roles");
    }
    throw new Error(
      "No response from server. Please check your internet connection and try again."
    );
  }
};
