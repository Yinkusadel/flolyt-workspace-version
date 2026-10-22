import axios from "axios";
import { axiosInstance } from "@/services/index.service";
import { API_ENDPOINTS } from "@/config/apiConfig";
import { getServerErrorMessage } from "@/services/get-server-error";
import type { UserRole } from "@/validators/teams";

export interface ResendTeamInvitationPayload {
  email: string;
  roles: UserRole[];
  functionalRoles: string[] | null;
  stepUpChallengeId: string | null;
}

export interface ResendTeamInvitationResponse {
  data: boolean;
  messages: string[];
  succeeded: boolean;
}

const {
  TEAMS: { RESEND_TEAM_INVITATION },
} = API_ENDPOINTS;

export const resendTeamInvitation = async (
  teamId: string,
  payload: ResendTeamInvitationPayload
): Promise<ResendTeamInvitationResponse> => {
  try {
    const response = await axiosInstance.post<ResendTeamInvitationResponse>(
      RESEND_TEAM_INVITATION.replace("{teamId}", teamId),
      payload,
      { headers: { "Content-Type": "application/json" } }
    );

    return response.data;
  } catch (error: unknown) {
    if (axios.isAxiosError(error)) {
      const serverMessage = error.response ? getServerErrorMessage(error.response.data) : null;
      throw new Error(serverMessage || "Failed to resend invitation");
    }
    throw new Error(
      "No response from server. Please check your internet connection and try again."
    );
  }
};
