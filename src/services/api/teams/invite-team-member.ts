import axios from "axios";
import { axiosInstance } from "@/services/index.service";
import { API_ENDPOINTS } from "@/config/apiConfig";
import { getServerErrorMessage } from "@/services/get-server-error";
import type { UserRole } from "@/validators/teams";

export interface InviteTeamMemberPayload {
  email: string;
  roles: UserRole[];
  functionalRoles: string[] | null;
  stepUpChallengeId: string | null;
}

// No `data` field on this response — only messages/succeeded, unlike every
// other team endpoint.
export interface InviteTeamMemberResponse {
  messages: string[];
  succeeded: boolean;
}

const {
  TEAMS: { INVITE_TEAM_MEMBER },
} = API_ENDPOINTS;

export const inviteTeamMember = async (
  teamId: string,
  payload: InviteTeamMemberPayload
): Promise<InviteTeamMemberResponse> => {
  try {
    const response = await axiosInstance.post<InviteTeamMemberResponse>(
      INVITE_TEAM_MEMBER.replace("{teamId}", teamId),
      payload,
      { headers: { "Content-Type": "application/json" } }
    );

    return response.data;
  } catch (error: unknown) {
    if (axios.isAxiosError(error)) {
      const serverMessage = error.response ? getServerErrorMessage(error.response.data) : null;
      throw new Error(serverMessage || "Failed to invite team member");
    }
    throw new Error(
      "No response from server. Please check your internet connection and try again."
    );
  }
};
