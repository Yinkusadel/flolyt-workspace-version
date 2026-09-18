import axios from "axios";
import { axiosInstance } from "@/services/index.service";
import { API_ENDPOINTS } from "@/config/apiConfig";
import { getServerErrorMessage } from "@/services/get-server-error";

export interface RevokeTeamInvitationResponse {
  data: boolean;
  messages: string[];
  succeeded: boolean;
}

const {
  TEAMS: { REVOKE_TEAM_INVITATION },
} = API_ENDPOINTS;

export const revokeTeamInvitation = async (
  invitationId: string
): Promise<RevokeTeamInvitationResponse> => {
  try {
    const response = await axiosInstance.delete<RevokeTeamInvitationResponse>(
      REVOKE_TEAM_INVITATION.replace("{invitationId}", invitationId)
    );

    return response.data;
  } catch (error: unknown) {
    if (axios.isAxiosError(error)) {
      const serverMessage = error.response ? getServerErrorMessage(error.response.data) : null;
      throw new Error(serverMessage || "Failed to revoke invitation");
    }
    throw new Error(
      "No response from server. Please check your internet connection and try again."
    );
  }
};
